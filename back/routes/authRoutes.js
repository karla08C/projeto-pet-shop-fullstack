import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

// Registro de usuário
router.post('/register', async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        tipo,
      },
    });
    // Remove a senha da resposta por segurança
    delete novoUsuario.senha;
    res.status(201).json({ message: 'Usuário criado com sucesso!', usuario: novoUsuario });
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ error: 'Este e-mail já está em uso.' });
    }
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
});

// Login
router.post("/login", async (req, res) => {
  // CORRIGIDO: Usando 'senha' para manter a consistência
  const { email, senha } = req.body;

  // MELHORIA: Validação de entrada
  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }
  
  try {
    // CORRIGIDO: O model é 'usuario', não 'user'
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    
    // CORRIGIDO: Comparando 'senha' do body com 'usuario.senha' do banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    
    if (!senhaValida) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    // MELHORIA: Usando variável de ambiente para o segredo do JWT
    const token = jwt.sign(
      // CORRIGIDO: O campo no banco é 'tipo', não 'role'
      { id: usuario.id, role: usuario.tipo }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

export default router;