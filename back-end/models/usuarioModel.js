const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Estrutura do usuário
const usuarioSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor, use um email válido']
    },
    senha: {
        type: String,
        required: true
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    },
    tipo: {
        type: String,
        enum:['Pessoa','Empresa'], 
        required: true,
        default: 'Pessoa'
    },

    // Campos específicos da pessoa

    pessoaData: {
        nomeCompleto: {
            type: String,
            required: true
        },
        dataNascimento: {
            type: Date,
            required: true
        },
        telefone:{
            type: String,
            required: true
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

    // Campos específicos da empresa(vazios por padrão)

    empresaData:{
        nomeFantasia: String,
        nomeEmpresa: String,
        emailResponsavel: String,
        celular: String,
        telefone: String,
        site: String,
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
                pais: String,
                complemento: String
            }
        },
    }
});

usuarioSchema.index({ 'empresaData.localizacao': '2dsphere' });

// Criptografa a senha antes de salvar no banco
usuarioSchema.pre('save', async function (next) {
    if (!this.isModified('senha')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

// Verifica a senha 
usuarioSchema.methods.verificarSenha = async function (senhaDigitada) {
    return await bcrypt.compare(senhaDigitada, this.senha);
};

const User = mongoose.model('Usuario', usuarioSchema);

module.exports = User;
