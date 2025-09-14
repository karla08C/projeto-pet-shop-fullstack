import express from "express";
import cors from "cors";
import path from 'path'; 
import { fileURLToPath } from 'url';



// Importando as rotas
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/sales", saleRoutes);


// Middleware para servir arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota de teste rápida
app.get("/", (req, res) => {
  res.send("Backend do PetShop rodando!");
});

// Inicializar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
