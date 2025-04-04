const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },

    descricao: {
        type: String,
        required: true,
    },

    dataMarcada: {
        type: Date,
        required: true,
    },

    privado: {
        type: Boolean,
        default: false,
    },

    criadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', 
        required: true,
    },

    dataCriacao: {
        type: Date,
        default: Date.now
    },

    localizacao: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
        endereco: {
            type: String,
        },
    },

}, {
    timestamps: true,
});

eventoSchema.index({ 'localizacao': '2dsphere' });

const Evento = mongoose.model('Evento', eventoSchema);

module.exports = Evento;