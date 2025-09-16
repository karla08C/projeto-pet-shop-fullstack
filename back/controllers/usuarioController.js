import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash }
    });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao registrar usuário" });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) return res.status(400).json({ erro: "Usuário não encontrado" });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(400).json({ erro: "Senha inválida" });

    const token = jwt.sign({ id: usuario.id }, "segredo", { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao fazer login" });
  }
};
