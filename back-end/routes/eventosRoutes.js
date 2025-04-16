const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const {
    getTodosEventosPublicos,
    criarEvento,
    getEventosPorFiltro
} = require('../controllers/eventosController');

router.get('/obterTodosEventosPublicos', verificarToken, getTodosEventosPublicos);

router.post('/criarEvento', verificarToken, criarEvento);

router.post('/obterEventosFiltro', verificarToken, getEventosPorFiltro);

module.exports = router;
