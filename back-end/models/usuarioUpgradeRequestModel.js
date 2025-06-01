const mongoose = require('mongoose');

const usuarioUpgradeRequestSchema = new mongoose.Schema({
  idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  status: { type: String, enum: ['pendente', 'aprovado', 'rejeitado'], default: 'pendente' },
  empresaData:{
        nomeFantasia: String,
        cnpj: {
            type:String,
            unique:true,
            sparse:true
        },
        localizacao: {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
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
    },
  revisadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('usuarioUpgradeRequest', usuarioUpgradeRequestSchema);