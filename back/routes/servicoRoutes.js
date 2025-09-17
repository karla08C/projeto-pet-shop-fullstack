import { Router } from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from '../controllers/servicoController.js';

const router = Router();

router.route('/')
  .post(createService)     
  .get(getAllServices);     

router.route('/:id')
  .get(getServiceById)      
  .put(updateService)       
  .delete(deleteService);   

export default router;