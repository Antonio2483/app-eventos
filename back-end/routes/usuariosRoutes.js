const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const { 
    registrarUsuario,
    logarUsuario,
    obterDadosUsuario,
    atualizarUsuario,
    deletarUsuario
} = require('../controllers/usuarioController');

router.post('/registrar',registrarUsuario);

router.post('/login', logarUsuario);

router.get('/obterUsuario',verificarToken, obterDadosUsuario);

router.put('/atualizar', verificarToken, atualizarUsuario);

router.delete('/deletar', verificarToken, deletarUsuario);

module.exports = router;