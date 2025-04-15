const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const {
    criarInscricao, 
    getInscricoesPorUsuario, 
    getInscricoesPorEvento, 
    cancelarInscricao
} = require('../controllers/inscricaoController');

router.post('/criarInscricao',verificarToken, criarInscricao);

router.get('/GetInscricaoUser',verificarToken, getInscricoesPorUsuario)

router.get('/GetInscricaoEvento/:id',verificarToken, getInscricoesPorEvento)

router.patch('/cancelarInscricao/:id', verificarToken, cancelarInscricao);