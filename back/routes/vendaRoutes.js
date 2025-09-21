import { Router } from 'express';
import {
  criarVenda,
  listarVendas,
  obterVendaPorId
} from '../controllers/vendaController.js';
import { verificarToken } from '../middleware/authMiddleware.js'; // Importa o middleware

const router = Router();

// Protege as rotas que lidam com a criação e listagem de vendas
router.route('/')
  .post(verificarToken, criarVenda)      
  .get(verificarToken, listarVendas);      

// Protege a rota que obtém uma venda específica por ID
router.route('/:id')
  .get(verificarToken, obterVendaPorId);  

export default router;