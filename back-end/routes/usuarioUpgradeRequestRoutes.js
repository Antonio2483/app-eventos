const express = require('express');
const router = express.Router();
const { 
    criarRequisicao,
    getTodasRequisicoes,
    getRequisicaoPorId,
    updateStatus,
    deleteRequisicao
} = require('../controllers/usuarioUpgradeRequestController');

router.post('criarRequisicao/', criarRequisicao);
router.get('getTodasRequisicoes/', getTodasRequisicoes);
router.get('getRequisicaoPorId/:id', getRequisicaoPorId);
router.put('updateStatus/:id', updateStatus);
router.delete('deleteRequisicao/:id', deleteRequisicao);

module.exports = router;
