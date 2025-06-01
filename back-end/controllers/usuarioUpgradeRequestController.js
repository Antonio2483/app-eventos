const UsuarioUpgradeRequest = require('../models/usuarioUpgradeRequestModel');

const criarRequisicao = async (req, res) => {
  try {
    const { idUsuario, empresaData } = req.body;

    const newRequest = new UsuarioUpgradeRequest({
      idUsuario,
      empresaData
    });

    await newRequest.save();

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getTodasRequisicoes = async (req, res) => {
  try {
    const requests = await UsuarioUpgradeRequest.find().populate('idUsuario').populate('revisadoPor');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRequisicaoPorId = async (req, res) => {
  try {
    const request = await UsuarioUpgradeRequest.findById(req.params.id).populate('idUsuario').populate('revisadoPor');
    
    if (!request) {
      return res.status(404).json({ message: 'Requisição não encontrada' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status, revisadoPor } = req.body;

    const allowedStatuses = ['pendente', 'aprovado', 'rejeitado'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }

    const updatedRequest = await UsuarioUpgradeRequest.findByIdAndUpdate(
      req.params.id,
      { status, revisadoPor },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Requisição não encontrada' });
    }

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar uma requisição
const deleteRequisicao = async (req, res) => {
  try {
    const deletedRequest = await UsuarioUpgradeRequest.findByIdAndDelete(req.params.id);

    if (!deletedRequest) {
      return res.status(404).json({ message: 'Requisição não encontrada' });
    }

    res.json({ message: 'Requisição deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    criarRequisicao,
    getTodasRequisicoes,
    getRequisicaoPorId,
    updateStatus,
    deleteRequisicao
};