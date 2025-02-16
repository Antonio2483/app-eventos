const eventos = [
    { id: 1, nome: 'Evento React', data: '2025-03-10' },
    { id: 2, nome: 'Evento Node.js', data: '2025-03-15' }
];

// Função para listar eventos
const getEventos = (req, res) => {
    res.json(eventos);
};

// Função para criar um novo evento
const createEvento = (req, res) => {
    const { nome, data } = req.body;
    const novoEvento = { id: eventos.length + 1, nome, data };
    eventos.push(novoEvento);
    res.status(201).json(novoEvento);
};

module.exports = { getEventos, createEvento };
