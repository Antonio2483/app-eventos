const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const {
    getTodosEventosPublicos,
    criarEvento
} = require('../controllers/eventosController');

router.get('/obterTodosEventosPublicos', verificarToken, getTodosEventosPublicos);

router.post('/criarEvento', verificarToken, criarEvento);

module.exports = router;
