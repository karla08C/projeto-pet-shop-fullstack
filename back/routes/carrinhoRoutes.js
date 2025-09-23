
import express from 'express';
import {
  adicionarAoCarrinho,
  verCarrinho,
  removerDoCarrinho,
  finalizarCompra,
} from '../controllers/carrinhoController.js';


import { verificarToken } from '../middleware/auth.js';

const router = express.Router();


router.use(verificarToken);

router.get('/', verCarrinho);
router.post('/adicionar', adicionarAoCarrinho);
router.delete('/remover/:itemId', removerDoCarrinho);
router.post('/finalizar', finalizarCompra);

export default router;