import { Router } from 'express';
import multer from 'multer'; // Importe o multer
import path from 'path'; // Para lidar com caminhos de arquivo
import { fileURLToPath } from 'url'; // Para resolver caminhos em módulos ES

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/produtoController.js';

const router = Router();

// Configuração do Multer para salvar os arquivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // A pasta 'uploads' precisa existir na raiz do seu back-end
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Renomeia o arquivo para evitar conflitos e mantém a extensão original
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname.replace(ext, '')}${ext}`);
  }
});
const upload = multer({ storage: storage });

// As rotas de criação e edição agora usam o middleware de upload
router.route('/')
  .get(getAllProducts)    
  .post(upload.single('imagem'), createProduct); // Adiciona o middleware

router.route('/:id')
  .get(getProductById)    
  .put(upload.single('imagem'), updateProduct)    // Adiciona o middleware
  .delete(deleteProduct); 

export default router;