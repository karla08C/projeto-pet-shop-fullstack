import express from "express";
import cors from "cors";
import path from 'path'; 
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import carrinhoRoutes from './routes/carrinhoRoutes.js'; 

import dotenv from 'dotenv';
dotenv.config();

import usuarioRoutes from './routes/usuarioRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';
import vendaRoutes from './routes/vendaRoutes.js';
import agendamentoRoutes from "./routes/agendamentoRoutes.js"

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

// Middlewares globais
app.use(express.json());

// Configure o CORS para permitir credenciais
const frontendOrigin = 'http://localhost:3000'; 
app.use(cors({
  origin: frontendOrigin,
  credentials: true 
}));

// Rotas
app.use("/usuarios", usuarioRoutes); 
app.use("/produtos", produtoRoutes);
app.use("/vendas", vendaRoutes);
app.use('/agendamentos', agendamentoRoutes);
app.use('/api/carrinho', carrinhoRoutes);

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
    process.exit(1); 
  }
});