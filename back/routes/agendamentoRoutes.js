// routes/agendamentoRoutes.js

import { Router } from 'express';
import { verificarToken } from '../middleware/auth.js'; // AJUSTE O CAMINHO SE NECESSÁRIO
import {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
} from '../controllers/agendamentoController.js';

const router = Router();

// ROTAS PROTEGIDAS:
// 💡 CORREÇÃO: Adicione 'verificarToken' antes do controller.

// A rota de criação de agendamento DEVE saber quem está agendando.
router.post('/', verificarToken, createAppointment); 

// As rotas de listagem, atualização e exclusão também precisam de autenticação,
// geralmente para garantir que o usuário só veja/edite seus próprios dados.
router.get('/', verificarToken, getAllAppointments); 

router.get('/:id', verificarToken, getAppointmentById);

router.put('/:id', verificarToken, updateAppointment);

router.delete('/:id', verificarToken, deleteAppointment);

export default router;