import { Router } from 'express';
import { verificarToken } from '../middleware/auth.js'; 
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
} from '../controllers/servicoController.js';

const router = Router();

// Rotas públicas (Leitura)
router.get('/', getAllServices);
router.get('/:id', getServiceById); 

// Rotas protegidas (Escrita - Requer autenticação)
router.post('/', verificarToken, createService);
router.put('/:id', verificarToken, updateService);
router.delete('/:id', verificarToken, deleteService);

// 🛑 LINHA FINAL CORRIGIDA
export default router;