const Evento = require('../models/eventosModel');
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
        const { titulo, descricao, dataMarcada, localizacao } = req.body

        const novoEvento = new Evento({
            titulo,
            descricao,
            dataMarcada,
            criadoPor: req.usuario.id,
            localizacao
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

        const dataInicial = new Date(Date.UTC(
            data.getUTCFullYear(),
            data.getUTCMonth(),
            data.getUTCDate(),
            0, 0, 0
        ));

        const dataFinal = new Date(Date.UTC(
            data.getUTCFullYear(),
            data.getUTCMonth(),
            data.getUTCDate() + 1,
            0, 0, 0
        ));


        const dataFiltro = tipoData === 'exata'
            ? {
                $gte: dataInicial,
                $lt: dataFinal
            }
            : { $gte: new Date(dataInicial) };

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
                        dataMarcada: dataFiltro
                    }
                }
            },
            {
                $lookup: {
                    from: 'inscricaos', // nome da coleção no MongoDB
                    let: { eventoId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$evento', '$$eventoId'] },
                                        { $eq: ['$usuario', new mongoose.Types.ObjectId(usuarioId)] }
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
                    inscricaoUsuario: { $size: 0 } // só eventos SEM inscrição do usuário
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


module.exports = { getTodosEventosPublicos, criarEvento, getEventosPorFiltro };
