// C:\Users\Janiele\Documents\projeto-pet-shop-fullstack\back\server.js

import express from "express";
import cors from "cors";
import path from 'path'; 
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

import usuarioRoutes from './routes/usuarioRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';
import vendaRoutes from './routes/vendaRoutes.js';
import agendamentoRoutes from "./routes/agendamentoRoutes.js"

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient(); // Crie uma nova instância do Prisma aqui

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas
app.use("/usuarios", usuarioRoutes); 
app.use("/produtos", produtoRoutes)
app.use("/vendas", vendaRoutes);
app.use('/agendamentos', agendamentoRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send("Backend do PetShop rodando!");
});

const PORT = 3001;

// Mude a lógica para iniciar o servidor
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  try {
    await prisma.$connect();
    console.log("✅ Conectado com sucesso ao banco de dados!");
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:", error);
    // Opcional: force o encerramento do servidor se a conexão falhar
    process.exit(1); 
  }
});