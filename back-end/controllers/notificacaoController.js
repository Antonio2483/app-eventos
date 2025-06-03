const Notificacao = require('../models/notificacaoModel');

const buscarNotificacoesPorUser = async (req, res) => {
  try {

    const usuarioId = req.usuario.id;  // vindo do seu middleware de autenticação


    const notificacoes = await Notificacao.find({ usuarioId }).sort({ createdAt: -1 });

    res.status(200).json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ message: 'Erro ao buscar notificações.' });
  }
};

const marcarVariasComoLidas = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;  // segurança: só atualiza as do próprio user
    const { ids } = req.body;  // espera: { ids: ['id1', 'id2', ...] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'É necessário fornecer uma lista de IDs.' });
    }

    const resultado = await Notificacao.updateMany(
      { _id: { $in: ids }, usuarioId },
      { $set: { lido: true } }
    );

    res.status(200).json({ message: 'Notificações atualizadas.', modifiedCount: resultado.modifiedCount });
  } catch (error) {
    console.error('Erro ao marcar notificações como lidas:', error);
    res.status(500).json({ message: 'Erro ao atualizar notificações.' });
  }
};

module.exports = {
  buscarNotificacoesPorUser,
  marcarVariasComoLidas
};
