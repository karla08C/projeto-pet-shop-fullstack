import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();


router.post("/", auth, async (req, res) => {
  
  const { items, forma_pagamento, endereco_entrega } = req.body;
  const clienteId = req.user.id; 

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "O carrinho não pode estar vazio." });
  }

  try {
    const productIds = items.map(item => item.productId);

    
    const novaVenda = await prisma.$transaction(async (tx) => {
      
      const produtosNoCarrinho = await tx.produto.findMany({
        where: { id: { in: productIds } },
      });

      
      const primeiroVendedorId = produtosNoCarrinho[0]?.vendedor_id;
      if (!primeiroVendedorId || produtosNoCarrinho.some(p => p.vendedor_id !== primeiroVendedorId)) {
        throw new Error("Todos os produtos do carrinho devem pertencer ao mesmo vendedor.");
      }

      let totalVenda = 0;
      const itensParaCriar = [];

      
      for (const item of items) {
        const produto = produtosNoCarrinho.find(p => p.id === item.productId);

        if (!produto) {
          throw new Error(`Produto com ID ${item.productId} não encontrado.`);
        }
        if (produto.estoque < item.quantity) {
          throw new Error(`Estoque insuficiente para o produto: ${produto.nome}. Disponível: ${produto.estoque}`);
        }
        if (!produto.ativo) {
          throw new Error(`O produto ${produto.nome} não está mais disponível para venda.`);
        }

        const subtotal = produto.preco * item.quantity;
        totalVenda += subtotal;

        itensParaCriar.push({
          produto_id: item.productId,
          quantidade: item.quantity,
          preco_unitario: produto.preco,
          subtotal: subtotal,
        });
      }

      
      const venda = await tx.venda.create({
        data: {
          cliente_id: clienteId,
          vendedor_id: primeiroVendedorId,
          total: totalVenda,
          forma_pagamento: forma_pagamento,
          endereco_entrega: endereco_entrega,
          status: "processando", 
          itens: {
            create: itensParaCriar,
          },
        },
        include: {
          itens: true, 
        },
      });

      
      for (const item of items) {
        await tx.produto.update({
          where: { id: item.productId },
          data: {
            estoque: {
              decrement: item.quantity,
            },
          },
        });
      }

      return venda; 
    });

    res.status(201).json(novaVenda);

  } catch (error) {
    
    res.status(400).json({ error: error.message });
  }
});

export default router;