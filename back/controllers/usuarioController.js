import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "segredo_padrao_para_desenvolvimento";


export const registrarUsuario = async (req, res) => {
  try {
    
    const { nome, email, senha, tipo, cpf_cnpj, telefone, endereco } = req.body;

    if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({ erro: "Nome, email, senha e tipo são obrigatórios." });
    }
    
    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: { 
        nome, 
        email, 
        senha: senhaHash,
        tipo,
        cpf_cnpj,
        telefone,
        endereco
      }
    });

    
    const { senha: _, ...usuarioSemSenha } = usuario;
    res.status(201).json(usuarioSemSenha);

  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(409).json({ erro: "Este e-mail já está em uso." }); // 409 Conflict
    }
    res.status(500).json({ erro: "Erro ao registrar usuário" });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha inválida" }); // 401 Unauthorized
    }

    const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, JWT_SECRET, { expiresIn: "8h" });
    res.json({ token });

  } catch (error) {
    res.status(500).json({ erro: "Erro ao fazer login" });
  }
};


export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            
            select: {
                id: true,
                nome: true,
                email: true,
                tipo: true,
                data_criacao: true
            }
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao listar usuários." });
    }
};


export const deletarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.usuario.delete({ where: { id: parseInt(id) }});
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ erro: "Erro ao deletar usuário." });
    }
};