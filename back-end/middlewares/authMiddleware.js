const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');
require('dotenv').config();

const verificarToken = async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Acesso negado, token não encontrado" });
    }

    try {
        token = token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = await Usuario.findById(decoded.id).select("-senha");
        next();
    } catch (error) {
        res.status(401).json({ error: "Token inválido ou expirado" });
    }
};

module.exports = verificarToken;
