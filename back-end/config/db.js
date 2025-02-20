const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Atlas conectado!");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB Atlas:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
