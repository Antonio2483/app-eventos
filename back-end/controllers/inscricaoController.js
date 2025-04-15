const Inscricao = require("../models/inscricaoModel");

const criarInscricao = async (req, res) => {

    try {

        const { eventoId } = req.body;
        const usuarioId = req.usuario.id;

        // Verifica se já existe
        const inscricaoExistente = await Inscricao.findOne({
            usuario: usuarioId,
            evento: eventoId,
            status: { $ne: 'cancelado' } 
        });

        if (inscricaoExistente) {
            return res.status(400).json({ error: 'Usuário já inscrito neste evento.' });
        }

        const novaInscricao = new Inscricao({
            usuario: usuarioId,
            evento: eventoId
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
        console.error('Erro ao buscar eventos públicos:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar eventos' });
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

module.exports = {criarInscricao, getInscricoesPorUsuario, getInscricoesPorEvento, cancelarInscricao}