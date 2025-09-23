import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();
// A variável JWT_SECRET deve ser configurada no arquivo .env para produção
const JWT_SECRET = process.env.JWT_SECRET || "segredo_padrao_para_desenvolvimento";

/**
 * Registra um novo usuário no banco de dados.
 * A senha é hasheada antes de ser salva.
 */
export const registrarUsuario = async (req, res) => {
    try {
        const { nome, email, senha, tipo, cpf_cnpj, telefone, endereco } = req.body;

        if (!nome || !email || !senha || !tipo) {
            return res.status(400).json({ erro: "Nome, email, senha e tipo são obrigatórios." });
        }
        
        // Criptografa a senha antes de salvar no banco de dados
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

        // Remove a senha do objeto de resposta por segurança
        const { senha: _, ...usuarioSemSenha } = usuario;
        res.status(201).json(usuarioSemSenha);

    } catch (error) {
        // Trata erros de unicidade (email ou cpf/cnpj já em uso)
        if (error.code === 'P2002') {
            if (error.meta?.target?.includes('email')) {
                return res.status(409).json({ erro: "Este e-mail já está em uso." });
            }
            if (error.meta?.target?.includes('cpf_cnpj')) {
                return res.status(409).json({ erro: "Este CPF/CNPJ já está em uso." });
            }
        }
        console.error("Erro ao registrar usuário:", error);
        res.status(500).json({ erro: "Erro interno do servidor ao registrar usuário." });
    }
};

/**
 * Autentica um usuário e retorna um token JWT.
 */
export const loginUsuario = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: "E-mail ou senha inválidos." });
        }

        const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, JWT_SECRET, { expiresIn: "8h" });
        res.json({ token });

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ erro: "Erro interno do servidor ao fazer login." });
    }
};


/**
 * Lista todos os usuários, sem incluir dados sensíveis como a senha.
 */
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
        console.error("Erro ao listar usuários:", error);
        res.status(500).json({ erro: "Erro interno do servidor ao listar usuários." });
    }
};


/**
 * Deleta um usuário pelo ID.
 */
export const deletarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.usuario.delete({ where: { id: parseInt(id) }});
        res.status(204).send(); // 204 No Content para deleção bem-sucedida
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        res.status(500).json({ erro: "Erro interno do servidor ao deletar usuário." });
    }
};

export const getUsuarioPerfil = asyncHandler(async (req, res) => {
    // req.usuarioId foi adicionado pelo middleware verificarToken
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuarioId },
    });
  
    if (usuario) {
      // Retorne os dados, mas NUNCA a senha
      res.json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      });
    } else {
      res.status(404);
      throw new Error('Usuário não encontrado');
    }
  });