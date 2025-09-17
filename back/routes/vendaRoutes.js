import { Router } from 'express';
import {
  criarVenda,
  listarVendas,
  obterVendaPorId
} from '../controllers/vendaController.js';

const router = Router();

router.route('/')
  .post(criarVenda)      
  .get(listarVendas);      

router.route('/:id')
  .get(obterVendaPorId);  

export default router;