require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Importando Rotas
const eventosRoutes = require("./routes/eventosRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");
// const calendarioRoutes = require("./routes/calendarioRoutes");

// Conectar com o BD na nuvem
connectDB();

// Usando rotas
app.use("/eventos", eventosRoutes);
app.use("/usuarios", usuariosRoutes);
// app.use("/calendario", calendarioRoutes);

app.get("/", (req, res) => {
    res.send("Servidor está rodando!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});