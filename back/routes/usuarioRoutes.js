import { Router } from 'express';
import {
  registrarUsuario,
  loginUsuario,
  listarUsuarios,
  deletarUsuario
} from '../controllers/usuarioController.js';

const router = Router();


router.post('/registrar', registrarUsuario);

router.post('/login', loginUsuario);



router.get('/', listarUsuarios);


router.delete('/:id', deletarUsuario);

export default router;