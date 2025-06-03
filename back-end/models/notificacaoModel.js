const mongoose = require('mongoose');

const NotificacaoSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evento',
    required: true
  },
  mensagem: {
    type: String,
    required: true
  },
  lido: {
    type: Boolean,
    default: false
  },
  tipo: {
    type: String,
    enum: ['lembrete', 'atualizacao', 'cancelamento'],
    default: 'lembrete'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notificacao', NotificacaoSchema);
