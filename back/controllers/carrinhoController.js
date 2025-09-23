import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

export const adicionarAoCarrinho = asyncHandler(async (req, res) => {
  const { produtoId, quantidade } = req.body;
  const usuarioId = req.user.id; 


  let carrinho = await prisma.carrinho.findUnique({
    where: { usuarioId },
  });

  if (!carrinho) {
    carrinho = await prisma.carrinho.create({
      data: { usuarioId },
    });
  }

 
  const itemExistente = await prisma.itemCarrinho.findFirst({
    where: {
      carrinhoId: carrinho.id,
      produtoId: produtoId,
    },
  });

  if (itemExistente) {
    
    await prisma.itemCarrinho.update({
      where: { id: itemExistente.id },
      data: { quantidade: itemExistente.quantidade + quantidade },
    });
  } else {
    
    await prisma.itemCarrinho.create({
      data: {
        carrinhoId: carrinho.id,
        produtoId: produtoId,
        quantidade: quantidade,
      },
    });
  }

  res.status(201).json({ message: 'Produto adicionado ao carrinho' });
});



export const verCarrinho = asyncHandler(async (req, res) => {
  const usuarioId = req.user.id;

  const carrinho = await prisma.carrinho.findUnique({
    where: { usuarioId },
    include: {
      itens: {
        include: {
          produto: true, 
        },
      },
    },
  });

  if (!carrinho) {
    return res.json({ itens: [], total: 0 }); 
  }

  res.status(200).json(carrinho);
});


export const finalizarCompra = asyncHandler(async (req, res) => {
  const usuarioId = req.user.id;

  
  const carrinho = await prisma.carrinho.findUnique({
    where: { usuarioId },
    include: { itens: { include: { produto: true } } },
  });

  if (!carrinho || carrinho.itens.length === 0) {
    res.status(400);
    throw new Error('Seu carrinho está vazio');
  }

 
  const valorTotal = carrinho.itens.reduce(
    (acc, item) => acc + item.produto.preco * item.quantidade,
    0
  );

  
  const venda = await prisma.$transaction(async (tx) => {
    const novaVenda = await tx.venda.create({
      data: {
        usuarioId,
        valorTotal,
      },
    });

    
    await tx.itemVenda.createMany({
      data: carrinho.itens.map((item) => ({
        vendaId: novaVenda.id,
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        preco: item.produto.preco,
      })),
    });

    
    await tx.itemCarrinho.deleteMany({
      where: { carrinhoId: carrinho.id },
    });

    return novaVenda;
  });

  res.status(201).json({ message: 'Compra finalizada com sucesso!', venda });
});



export const removerDoCarrinho = asyncHandler(async (req, res) => {
    
    res.send("Remover do carrinho");
});