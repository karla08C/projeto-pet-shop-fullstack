import { Router } from 'express';
import {
  criarContato,
  listarContatos,
  atualizarStatusLido,
  deletarContato,
} from '../controllers/contatoController.js';

const router = Router();


router.post('/', criarContato);


router.get('/', listarContatos);


router.put('/:id/lido', atualizarStatusLido);


router.delete('/:id', deletarContato);

export default router;