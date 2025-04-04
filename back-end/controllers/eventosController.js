const Evento = require('../models/eventosModel');


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


module.exports = { getTodosEventosPublicos, criarEvento };
