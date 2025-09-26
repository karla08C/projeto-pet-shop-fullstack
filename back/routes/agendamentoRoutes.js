import { Router } from 'express';
import { verificarToken } from '../middleware/auth.js';
import {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
} from '../controllers/agendamentoController.js';

const router = Router();

router.post('/', verificarToken, createAppointment);

router.get('/', verificarToken, getAllAppointments);

router.get('/:id', verificarToken, getAppointmentById);

router.put('/:id', verificarToken, updateAppointment);

router.delete('/:id', verificarToken, deleteAppointment);

export default router;