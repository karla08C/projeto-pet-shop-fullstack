import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Criar produto (apenas vendedor)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "vendedor") {
    return res.status(403).json({ error: "Apenas vendedores podem cadastrar produtos" });
  }

  const { title, description, price, stock, images } = req.body;

  try {
    const product = await prisma.product.create({
      data: { title, description, price, stock, images }
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Erro ao cadastrar produto" });
  }
});

// Listar todos os produtos
router.get("/", auth, async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// Atualizar produto (apenas vendedor)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "vendedor") {
    return res.status(403).json({ error: "Apenas vendedores podem atualizar produtos" });
  }

  const { id } = req.params;
  const { title, description, price, stock, images } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { title, description, price, stock, images }
    });
    res.json(product);
  } catch (err) {
    res.status(404).json({ error: "Produto não encontrado" });
  }
});

// Remover produto (apenas vendedor)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "vendedor") {
    return res.status(403).json({ error: "Apenas vendedores podem excluir produtos" });
  }

  const { id } = req.params;

  try {
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Produto removido com sucesso" });
  } catch (err) {
    res.status(404).json({ error: "Produto não encontrado" });
  }
});

export default router;

