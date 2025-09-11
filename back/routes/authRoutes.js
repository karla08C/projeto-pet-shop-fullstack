import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();
const SECRET = "segredo123"; 

// Registro de usuário
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Usuário já existe" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Senha inválida" });

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, {
    expiresIn: "1d",
  });

  res.json({ token });
});

export default router;
