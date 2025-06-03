const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const {
    getTodosEventosPublicos,
    criarEvento,
    getEventosPorFiltro,
    getEventosUser,
    getEventoId,
    atualizarEvento
} = require('../controllers/eventosController');

router.get('/obterTodosEventosPublicos', verificarToken, getTodosEventosPublicos);

router.get('/obterEventosUser', verificarToken, getEventosUser)

router.post('/criarEvento', verificarToken, criarEvento);

router.post('/obterEventosFiltro', verificarToken, getEventosPorFiltro);

router.get('/obterEvento/:id',verificarToken, getEventoId);

router.put('/atualizar',verificarToken, atualizarEvento);

module.exports = router;
