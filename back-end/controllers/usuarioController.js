const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt =  require('jsonwebtoken');
require('dotenv').config();

// Função de token para validação
const gerarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' }); 
};

const registrarUsuario = async (req, res) =>{
    try{
        const {email, senha, tipo, pessoaData, empresaData} = req.body;

        console.log('Email', email);
        console.log('senha', senha);
        console.log('tipo', tipo);
        console.log('pessoaData', pessoaData);
        console.log('empresaData', empresaData);
        // Verificar o email

        const usuarioExistente = await Usuario.findOne({email});
        if(usuarioExistente){
            return res.status(400).json({error:"Email já cadastrado"});
        }

        // Cria o novo usuário

        const novoUsuario = new Usuario({
            email,
            senha,
            tipo,
            pessoaData: tipo === 'Pessoa' ? pessoaData : undefined,
            empresaData: tipo === 'Empresa' ? empresaData : undefined,
        });

        await novoUsuario.save();

        const token = gerarToken(novoUsuario._id);

        res.status(201).json({message:"Usuário criado com sucesso!",auth:token})

    } catch(error){
        console.error(error);
        res.status(500).json({ error: "Erro ao registrar usuário" });
    }
};

const logarUsuario = async (req, res) =>{
    try{
        const {email, senha} = req.body;

        // Obter usuário

        const usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(401).json({error:"Email ou senha incorretos"});
        }

        // Verifica a senha pelo banco

        const senhaValida = await Usuario.verificarSenha(senha);
        if(!senhaValida){
            return res.status(401).json({error:"Email ou senha incorretos"});
        }

        const token = gerarToken(novoUsuario._id);

        res.status(201).json({message:"Usuário logado com sucesso!",auth:token})
        
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Erro ao logar usuário" });
    }
};

const obterDadosUsuario = async (req, res) =>{
    try{
        const usuario = await Usuario.findById(req.usuario.id);
        
        res.status(201).json(usuario)

    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Erro ao obter usuário" });
    }
}

const atualizarUsuario = async (req, res) => {
    try{
        const {tipo, pessoaData, empresaData} = req.body;
        const usuario = await Usuario.findById(req.usuario.id);
        
        if(!usuario){
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        if(tipo) usuario.tipo = tipo;
        if (tipo === 'Pessoa' && pessoaData) usuario.pessoaData = pessoaData;
        if (tipo === 'Empresa' && empresaData) usuario.empresaData = empresaData;

        await usuario.save();

        res.json({ message: "Usuário atualizado com sucesso!", usuario });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
};

const deletarUsuario = async (req, res) => {
    try{
        const usuario = await Usuario.findById(req.usuario.id);
        
        if(!usuario){
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        await usuario.deleteOne();
        res.json({ message: "Usuário deletado com sucesso!" });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Erro ao apagar usuário" });
    }
}

module.exports = {
    registrarUsuario,
    logarUsuario,
    obterDadosUsuario,
    atualizarUsuario,
    deletarUsuario
};