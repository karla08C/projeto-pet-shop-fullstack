import express from "express";
import cors from "cors";
import path from 'path'; 
import { fileURLToPath } from 'url';



import usuarioRoutes from './routes/usuarioRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';
import servicoRoutes from './routes/servicoRoutes.js';
import vendaRoutes from './routes/vendaRoutes.js';
import agendamentoRoutes from "./routes/agendamentoRoutes.js"
import contatoRoutes from './routes/contatoRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas
app.use("/usuarios", usuarioRoutes); 
app.use("/produtos", produtoRoutes)
app.use("/vendas", vendaRoutes);
app.use("/servicos", servicoRoutes);
app.use('/agendamentos', agendamentoRoutes);
app.use("/contatos", contatoRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get("/", (req, res) => {
  res.send("Backend do PetShop rodando!");
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

