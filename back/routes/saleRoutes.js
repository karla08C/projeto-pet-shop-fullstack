import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Finalizar compra
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "cliente") {
    return res.status(403).json({ error: "Apenas clientes podem finalizar compras" });
  }

  const { products, vendorId } = req.body; 
  // products = [{id:1, quantity:2}, {id:2, quantity:1}]

  try {
    // Verificar estoque
    for (const p of products) {
      const product = await prisma.product.findUnique({ where: { id: p.id } });
      if (!product || product.stock < p.quantity) {
        return res.status(400).json({ error: `Estoque insuficiente para o produto ${p.id}` });
      }
    }

    // Criar venda
    const sale = await prisma.sale.create({
      data: {
        clientId: req.user.id,
        vendorId,
        status: "ativa"
      }
    });

    // Criar relação dos produtos
    for (const p of products) {
      await prisma.saleProduct.create({
        data: {
          saleId: sale.id,
          productId: p.id,
          quantity: p.quantity
        }
      });

      // Atualizar estoque
      await prisma.product.update({
        where: { id: p.id },
        data: { stock: { decrement: p.quantity } }
      });
    }

    res.json({ message: "Compra realizada com sucesso", sale });
  } catch (err) {
    res.status(500).json({ error: "Erro ao finalizar compra" });
  }
});

// Listar compras (cliente vê só dele, vendedor vê todas)
router.get("/", auth, async (req, res) => {
  try {
    let sales;
    if (req.user.role === "cliente") {
      sales = await prisma.sale.findMany({
        where: { clientId: req.user.id },
        include: { products: true }
      });
    } else if (req.user.role === "vendedor") {
      sales = await prisma.sale.findMany({
        where: { vendorId: req.user.id },
        include: { products: true }
      });
    }
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar vendas" });
  }
});

// Cancelar venda
router.put("/:id/cancel", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const sale = await prisma.sale.findUnique({ where: { id: parseInt(id) } });
    if (!sale) return res.status(404).json({ error: "Venda não encontrada" });

    if (req.user.role === "cliente" && sale.clientId !== req.user.id) {
      return res.status(403).json({ error: "Você só pode cancelar suas compras" });
    }

    if (req.user.role === "vendedor" && sale.vendorId !== req.user.id) {
      return res.status(403).json({ error: "Você só pode cancelar suas vendas" });
    }

    await prisma.sale.update({
      where: { id: parseInt(id) },
      data: { status: "cancelada" }
    });

    res.json({ message: "Venda cancelada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao cancelar venda" });
  }
});

export default router;

