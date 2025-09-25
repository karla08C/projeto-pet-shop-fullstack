// controllers/usuarioController.js

import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Checagem de segurança
if (!JWT_SECRET) {
    console.error("ERRO FATAL: JWT_SECRET não está configurada no .env!");
    // Não interromper aqui se o server.js já fez o dotenv.config()
}

// =========================================================
// GERAÇÃO DE TOKEN (Garante que o ID seja um Int antes de ir para o JWT)
// =========================================================
export const loginUsuario = asyncHandler(async (req, res) => {
    const { email, senha } = req.body;
    
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (usuario && (await bcrypt.compare(senha, usuario.senha))) {
        
        // 💡 CORREÇÃO: Garante que o ID no payload do JWT é um INTEIRO
        const userIdInt = parseInt(usuario.id);

        const token = jwt.sign(
            { id: userIdInt, tipo: usuario.tipo }, // ID é passado como INTEIRO
            JWT_SECRET, 
            { expiresIn: "8h" }
        );

        res.json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo,
            token, // Envia o token para o frontend
        });
    } else {
        res.status(401);
        throw new Error('Email ou senha inválidos');
    }
});


// =========================================================
// VERIFICAR PERFIL (Checa se o token é válido)
// =========================================================
export const getUsuarioPerfil = asyncHandler(async (req, res) => {
    // req.usuarioId é injetado pelo middleware (como string)
    
    // 💡 CORREÇÃO CRÍTICA: Converte o ID para INTEIRO antes de usar no Prisma
    const usuarioId = parseInt(req.usuarioId); 

    // Verifica se a conversão falhou (se req.usuarioId for undefined ou inválido)
    if (isNaN(usuarioId)) {
        res.status(401);
        throw new Error('ID de usuário inválido no token');
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId }, // Prisma agora busca com INTEIRO
    });
 
    if (usuario) {
      // Retorna os dados do usuário
      res.json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      });
    } else {
      // Se o token for válido mas o usuário não existir (usuário deletado),
      // o frontend recebe 404 e desloga.
      res.status(404);
      throw new Error('Usuário não encontrado');
    }
});


// =========================================================
// RESTANTE DAS FUNÇÕES (APLICA A CONVERSÃO DE ID ONDE NECESSÁRIO)
// =========================================================

export const registrarUsuario = asyncHandler(async (req, res) => {
    // ... (sua lógica de registro) ...
});

export const listarUsuarios = asyncHandler(async (req, res) => {
    // ... (sua lógica de listagem) ...
});

export const deletarUsuario = asyncHandler(async (req, res) => {
    // ... (sua lógica de deletar) ...
});