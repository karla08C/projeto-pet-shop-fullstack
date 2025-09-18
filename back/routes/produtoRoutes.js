import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/produtoController.js';

const router = Router();


router.route('/')
  .get(getAllProducts)    
  .post(createProduct);   

router.route('/:id')
  .get(getProductById)    
  .put(updateProduct)    
  .delete(deleteProduct); 

export default router;