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
        const { coordenadas, status } = req.body; // Esperado: [longitude, latitude]

        const usuarioId = req.usuario.id;

        const inscricoes = await Inscricao.find({
            usuario: usuarioId,
            status: status
        }).populate({
            path: 'evento',
            populate: {
                path: 'criadoPor'
            }
        });

        if(coordenadas != 'none'){

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
        }else{
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

module.exports = { criarInscricao, getInscricoesPorUsuario, getInscricoesPorEvento, cancelarInscricao, getInscricoesPorUsuarioFiltro }