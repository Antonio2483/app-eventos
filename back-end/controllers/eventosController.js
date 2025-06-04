const Evento = require('../models/eventosModel');
const Usuario = require('../models/usuarioModel');
const mongoose = require('mongoose');


// Função para listar eventos
const getTodosEventosPublicos = async (req, res) => {
    try {
        const eventos = await Evento.find({ privado: false }).populate('criadoPor', 'tipo pessoaData.nome pessoaData.sobrenome empresaData.nomeFantasia email')

        res.status(200).json(eventos);

    } catch (error) {
        console.error('Erro ao buscar eventos públicos:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar eventos' });
    }
};

const criarEvento = async (req, res) => {
    try {
        const { titulo, descricao, dataMarcada, dataTermino, gratuito, mediaValor } = req.body

        const usuario = await Usuario.findById(req.usuario.id);

        const novoEvento = new Evento({
            titulo,
            descricao,
            dataMarcada,
            criadoPor: req.usuario.id,
            localizacao: usuario.empresaData.localizacao,
            dataTermino,
            gratuito,
            mediaValor
        });

        await novoEvento.save();

        res.status(201).json({ message: "Evento criado com sucesso!" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar evento" });
    }
};

const getEventosPorFiltro = async (req, res) => {
    try {
        const { dataMarcada, tipoData = 'apartir', area } = req.body;
        const usuarioId = req.usuario.id;

        if (!dataMarcada || !area || !area.coordenadas || !area.raio) {
            return res.status(400).json({ mensagem: 'Parâmetros inválidos. Envie dataMarcada, area.coordenadas e area.raio' });
        }

        const data = new Date(dataMarcada);

        // Ajuste: usa fuso local
        const dataInicial = new Date(data.getFullYear(), data.getMonth(), data.getDate(), 0, 0, 0);
        const dataFinal = new Date(data.getFullYear(), data.getMonth(), data.getDate() + 1, 0, 0, 0);

        // console.log("DATA ENVIADA",data)
        // console.log("DATA INICIAL",dataInicial)
        // console.log("DATA FINAL",dataFinal)

        let dataFiltro = {};

        if (tipoData === 'exata') {
            // Ajuste: pega eventos que começam hoje OU estão em andamento hoje
            dataFiltro = {
                $or: [
                    { 
                        dataMarcada: { $gte: dataInicial, $lt: dataFinal }
                    },
                    { 
                        dataMarcada: { $lt: dataInicial },
                        dataTermino: { $gte: dataInicial }
                    }
                ]
            };
        } else {
            // Mantém a busca "a partir de" a data
            dataFiltro = { dataMarcada: { $gte: dataInicial } };
        }

        const eventos = await Evento.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: area.coordenadas
                    },
                    distanceField: 'distancia',
                    spherical: true,
                    maxDistance: area.raio,
                    query: {
                        privado: false,
                        ...dataFiltro
                    }
                }
            },
            {
                $lookup: {
                    from: 'inscricaos',
                    let: { eventoId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$evento', '$$eventoId'] },
                                        { $eq: ['$usuario', new mongoose.Types.ObjectId(usuarioId)] },
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'inscricaoUsuario'
                }
            },
            {
                $match: {
                    $or: [
                        { inscricaoUsuario: { $size: 0 } },
                        {
                            inscricaoUsuario: {
                                $not: {
                                    $elemMatch: {
                                        status: { $in: ["confirmado", "pendente"] }
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'criadoPor',
                    foreignField: '_id',
                    as: 'criadoPor'
                }
            },
            { $unwind: '$criadoPor' },
            {
                $project: {
                    titulo: 1,
                    descricao: 1,
                    dataMarcada: 1,
                    localizacao: 1,
                    distancia: 1,
                    dataTermino: 1,
                    mediaValor: 1,
                    gratuito: 1,
                    criadoPor: {
                        tipo: 1,
                        'pessoaData.nome': 1,
                        'pessoaData.sobrenome': 1,
                        'empresaData.nomeFantasia': 1,
                        email: 1
                    }
                }
            },
            { $sort: { distancia: 1 } }
        ]);

        res.status(200).json(eventos);
    } catch (error) {
        console.error('Erro ao buscar eventos com filtros:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar eventos com filtros' });
    }
};

const getEventosUser = async (req, res) => {
    try {
        const eventos = await Evento.find({ criadoPor: req.usuario.id })

        res.status(200).json(eventos);

    } catch (error) {
        console.error('Erro ao buscar eventos públicos:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar eventos' });
    }
};

const getEventoId = async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.id);
        if (!evento) return res.status(404).json({ error: "Evento não encontrado" });

        res.json(evento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar evento" });
    }
};

const atualizarEvento = async (req, res) => {
    try {
        const { id, mediaValor} = req.body;
        const updateData = {};

        // Lista de campos que podem ser atualizados
        const camposPermitidos = [
            'titulo',
            'descricao',
            'dataMarcada',
            'dataTermino',
            'gratuito',
            'privado'
        ];

        // Preenche updateData apenas com campos não vazios
        camposPermitidos.forEach(campo => {
            if (req.body[campo] !== undefined && req.body[campo] !== null && req.body[campo] !== '') {
                updateData[campo] = req.body[campo];
            }
        });

        updateData['mediaValor'] = mediaValor;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ mensagem: 'Nenhum dado válido para atualizar.' });
        }

        const eventoAtualizado = await Evento.findByIdAndUpdate(id, updateData, { new: true });

        if (!eventoAtualizado) {
            return res.status(404).json({ mensagem: 'Evento não encontrado.' });
        }

        res.status(200).json(eventoAtualizado);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao atualizar evento.' });
    }
};

module.exports = { getTodosEventosPublicos, criarEvento, getEventosPorFiltro, getEventosUser, getEventoId, atualizarEvento };
