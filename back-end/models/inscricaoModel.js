const mongoose = require('mongoose');

const inscricaoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: true
    },
    dataInscricao: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['confirmado', 'pendente', 'cancelado'],
        default: 'confirmado'
    },
    lembreteEnviado: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

inscricaoSchema.index(
    { usuario: 1, evento: 1 },
    {
        unique: true,
        partialFilterExpression: { status: { $in: ["confirmado", "pendente"] } }
    }
)

const Inscricao = mongoose.model('Inscricao', inscricaoSchema);

module.exports = Inscricao;
