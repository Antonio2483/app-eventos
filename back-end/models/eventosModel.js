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

    dataTermino: {
        type: Date,
        required: true,
    },

    mediaValor: {
        type: Number,
    },

    gratuito:{
        type: Boolean,
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
            rua: String,
            numero: String,
            bairro: String,
            cidade: String,
            estado: String,
            cep: String,
            pais: String
        }
    },

}, {
    timestamps: true,
});

eventoSchema.index({ 'localizacao': '2dsphere' });

const Evento = mongoose.model('Evento', eventoSchema);

module.exports = Evento;