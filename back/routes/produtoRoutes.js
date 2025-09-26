// routes/produtoRoutes.js (Versão completa)
import { Router } from 'express';
import multer from 'multer'; // 🛑 Importe o Multer

// 🛑 Importe seu middleware de autenticação e permissão
import { verificarToken } from '../middleware/auth.js'; 
import { isVendedor } from '../middleware/auth.js'; 

import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/produtoController.js';

const router = Router();

// 🛑 CONFIGURAÇÃO DO MULTER
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Garante que o arquivo será salvo na pasta 'uploads/imagens'
        cb(null, 'uploads/imagens'); 
    },
    filename: (req, file, cb) => {
        // Define o nome do arquivo como: timestamp-nomeoriginal
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Rotas de LEITURA (Públicas ou com Token)
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Rotas de ESCRITA (Protegidas por Token e Permissão de Vendedor)
router.post(
    '/', 
    verificarToken, 
    isVendedor, 
    upload.single('imagem'), // 🛑 Multer: 'imagem' é o nome do campo no FormData do frontend
    createProduct 
);

router.put(
    '/:id', 
    verificarToken, 
    isVendedor, 
    upload.single('imagem'), // 🛑 Multer: 'imagem' é o nome do campo do novo arquivo
    updateProduct 
);

router.delete('/:id', verificarToken, isVendedor, deleteProduct);

export default router;