const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const {
    criarInscricao, 
    getInscricoesPorUsuario, 
    getInscricoesPorEvento, 
    cancelarInscricao,
    getInscricoesPorUsuarioFiltro
} = require('../controllers/inscricaoController');

router.post('/criarInscricao',verificarToken, criarInscricao);

router.get('/GetInscricaoUser',verificarToken, getInscricoesPorUsuario)

router.get('/GetInscricaoEvento/:id',verificarToken, getInscricoesPorEvento)

router.post('/GetInscricaoUserFiltro',verificarToken, getInscricoesPorUsuarioFiltro)

router.patch('/cancelarInscricao/:id', verificarToken, cancelarInscricao);

module.exports = router;