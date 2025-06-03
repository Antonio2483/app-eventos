const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const {
    buscarNotificacoesPorUser,
    marcarVariasComoLidas
} = require('../controllers/notificacaoController');

router.get('/getNotificacoesUser', verificarToken, buscarNotificacoesPorUser);

router.patch('/marcarComoLidas', verificarToken, marcarVariasComoLidas);

module.exports = router;
