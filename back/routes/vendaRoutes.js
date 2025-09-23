import { Router } from 'express';
import {
  criarVenda,
  listarVendas,
  obterVendaPorId
} from '../controllers/vendaController.js';
import { verificarToken } from '../middleware/auth.js'; 

const router = Router();


router.route('/')
  .post(verificarToken, criarVenda)      
  .get(verificarToken, listarVendas);      


router.route('/:id')
  .get(verificarToken, obterVendaPorId);  

export default router;