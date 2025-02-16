const express = require('express');
const router = express.Router();
const { getEventos, createEvento } = require('../controllers/eventosController');

// Rota para listar eventos
router.get('/', getEventos);

// Rota para criar um novo evento
router.post('/', createEvento);

module.exports = router;
