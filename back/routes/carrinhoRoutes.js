// routes/carrinhoRoutes.js

import express from 'express';
import {
  adicionarAoCarrinho,
  verCarrinho,
  removerDoCarrinho,
  finalizarCompra,
} from '../controllers/carrinhoController.js';

import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// 💡 CORREÇÃO: Aplique 'verificarToken' diretamente nas rotas que precisam de autenticação.

// GET /carrinho (Ver carrinho)
router.get('/', verificarToken, verCarrinho);

// POST /carrinho/adicionar
router.post('/adicionar', verificarToken,adicionarAoCarrinho);

// DELETE /carrinho/remover/:itemId
router.delete('/remover/:itemId', verificarToken, removerDoCarrinho);

// POST /carrinho/finalizar
router.post('/finalizar', verificarToken, finalizarCompra);

export default router;