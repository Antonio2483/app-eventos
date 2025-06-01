const Inscricao = require("../models/inscricaoModel");
const Evento = require('../models/eventosModel');
const mongoose = require('mongoose');

const criarInscricao = async (req, res) => {

    try {

        const { eventoId, status } = req.body;
        const usuarioId = req.usuario.id;

        // Verifica se já existe
        const inscricaoExistente = await Inscricao.findOne({
            usuario: usuarioId,
            evento: eventoId,
            status: status
        });

        if (inscricaoExistente) {
            return res.status(400).json({ error: 'Usuário já inscrito neste evento.' });
        }

        const novaInscricao = new Inscricao({
            usuario: usuarioId,
            evento: eventoId,
            status
        });

        await novaInscricao.save();

        res.status(201).json({ message: "Inscrição criada com sucesso!" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar inscricao" });
    }
};

const getInscricoesPorUsuario = async (req, res) => {
    try {

        const inscricoes = await Inscricao.find({ usuario: req.usuario.id, }).populate('evento');

        res.status(200).json(inscricoes);

    } catch (error) {
        console.error('Erro ao buscar inscricoes:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar inscricoes' });
    }
};

const getInscricoesPorUsuarioFiltro = async (req, res) => {
    try {
        const { coordenadas, status } = req.body; // Esperado: [longitude, latitude] e status como string "ativo;inativo"
        const usuarioId = req.usuario.id;

        // Separa os status por ";" e remove espaços em branco
        const statusArray = status ? status.split(';').map(s => s.trim()) : [];

        const query = {
            usuario: usuarioId
        };

        if (statusArray.length > 0) {
            query.status = { $in: statusArray };
        }

        const inscricoes = await Inscricao.find(query).populate({
            path: 'evento',
            populate: {
                path: 'criadoPor'
            }
        });

        if (coordenadas != 'none') {

            if (!coordenadas || coordenadas.length !== 2) {
                return res.status(400).json({ mensagem: 'Coordenadas inválidas' });
            }

            const eventosComDistancia = inscricoes.map(inscricao => {
                const evento = inscricao.evento;

                // Fórmula de haversine
                const toRad = (x) => x * Math.PI / 180;
                const R = 6371000; // Raio da Terra em m
                const dLat = toRad(evento.localizacao.coordinates[1] - coordenadas[1]);
                const dLon = toRad(evento.localizacao.coordinates[0] - coordenadas[0]);
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(toRad(coordenadas[1])) * Math.cos(toRad(evento.localizacao.coordinates[1])) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distancia = R * c; // Distância em m

                return {
                    ...inscricao.toObject(),
                    distancia
                };
            });
            res.status(200).json(eventosComDistancia);
        } else {
            res.status(200).json(inscricoes);
        }


    } catch (error) {
        console.error('Erro ao buscar inscrições:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar inscrições' });
    }
};



const getInscricoesPorEvento = async (req, res) => {
    const eventoId = req.params.id;

    try {
        const participantes = await Inscricao.find({ evento: eventoId, status: 'confirmado' })
            .populate('usuario', 'email pessoaData.nome pessoaData.sobrenome');

        res.status(200).json(participantes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao buscar participantes do evento.' });
    }
};

const cancelarInscricao = async (req, res) => {
    const inscricaoId = req.params.id;

    try {
        const inscricao = await Inscricao.findById(inscricaoId);

        if (!inscricao) {
            return res.status(404).json({ erro: 'Inscrição não encontrada.' });
        }

        inscricao.status = 'cancelado';
        await inscricao.save();

        res.status(200).json({ mensagem: 'Inscrição cancelada com sucesso.', inscricao });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao cancelar a inscrição.' });
    }
};

const confirmarInscricao = async (req, res) => {
    const inscricaoId = req.params.id;

    try {
        const inscricao = await Inscricao.findById(inscricaoId);

        if (!inscricao) {
            return res.status(404).json({ erro: 'Inscrição não encontrada.' });
        }

        inscricao.status = 'confirmado';
        await inscricao.save();

        res.status(200).json({ mensagem: 'Inscrição confirmada com sucesso.', inscricao });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao confirmar a inscrição.' });
    }
};

const totalInscritos = async (req, res) => {
    try {
        const { eventoId, status } = req.query;

        if (!eventoId) {
            return res.status(400).json({ error: 'eventoId é obrigatório' });
        }

        const filtro = { evento: eventoId };
        if (status) {
            filtro.status = status;
        }

        const total = await Inscricao.countDocuments(filtro);

        return res.json({ total });
    } catch (err) {
        return res.status(500).json({ error: 'Erro ao contar inscritos', details: err });
    }
};

const mediaInscricoesPorEvento = async (req, res) => {
    try {
        const { empresaId } = req.query;

        if (!empresaId) {
            return res.status(400).json({ error: 'empresaId é obrigatório' });
        }

        const eventos = await Evento.find({ criadoPor: empresaId }, '_id');

        if (!eventos.length) {
            return res.json({ media: 0, totalEventos: 0 });
        }

        const eventoIds = eventos.map(e => e._id);

        const inscricoesPorEvento = await Inscricao.aggregate([
            { $match: { evento: { $in: eventoIds } } },
            { $group: { _id: "$evento", totalInscritos: { $sum: 1 } } }
        ]);

        const totalInscricoes = inscricoesPorEvento.reduce((sum, ev) => sum + ev.totalInscritos, 0);
        const media = totalInscricoes / eventos.length;

        return res.json({ media, totalEventos: eventos.length, totalInscricoes });
    } catch (err) {
        return res.status(500).json({ error: 'Erro ao calcular média de inscrições', details: err });
    }
};

const inscricoesGrafico = async (req, res) => {
    try {
        const { eventoId } = req.query;

        if (!eventoId || !mongoose.Types.ObjectId.isValid(eventoId)) {
            return res.status(400).json({ error: 'eventoId inválido ou não fornecido' });
        }

        const dados = await Inscricao.aggregate([
            { $match: { evento: new mongoose.Types.ObjectId(eventoId),status: 'confirmado' } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$dataInscricao" } },
                    total: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const labels = dados.map(d => d._id);
        const data = dados.map(d => d.total);

        return res.json({ labels, data });

    } catch (error) {
        console.error('Erro no inscricoesGrafico:', error);
        return res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
    }
};

module.exports = { criarInscricao, getInscricoesPorUsuario, getInscricoesPorEvento, cancelarInscricao, confirmarInscricao, getInscricoesPorUsuarioFiltro, totalInscritos, mediaInscricoesPorEvento, inscricoesGrafico }