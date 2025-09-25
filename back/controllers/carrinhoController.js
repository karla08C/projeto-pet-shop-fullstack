// controllers/carrinhoController.js

import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler'; // ⬅️ LINHA ESSENCIAL ADICIONADA

const prisma = new PrismaClient();

// Funções utilitárias
const getUserId = (req) => {
    // Garante que o ID do JWT é um Int
    return parseInt(req.usuarioId);
};

// =========================================================
// 1. ADICIONAR AO CARRINHO (CORREÇÃO FINAL DE TIPAGEM E BUSCA)
// =========================================================
export const adicionarAoCarrinho = asyncHandler(async (req, res) => {
    // Converte IDs e quantidade que vêm no req.body
    const produtoId = parseInt(req.body.produtoId);
    const quantidade = parseInt(req.body.quantidade); 
    
    const usuarioId = getUserId(req); 
    
    // Validação robusta de todos os IDs
    if (isNaN(usuarioId) || isNaN(produtoId) || isNaN(quantidade) || quantidade <= 0) {
        res.status(400);
        throw new Error('Dados de produto ou usuário inválidos.');
    }
    
    // 1. Buscar o produto para validar se ele existe
    const produto = await prisma.produto.findUnique({
        where: { id: produtoId },
    });

    if (!produto) {
        res.status(404); 
        throw new Error('Produto não encontrado no catálogo.');
    }
    
    // 2. Buscar ou Criar o Carrinho (Usando cliente_id, findFirst)
let carrinho = await prisma.carrinho.findFirst({
    where: { cliente_id: usuarioId },
});

if (!carrinho) {
    // 💡 CORREÇÃO: CRIAÇÃO DO CARRINHO (Linha 53)
    // Tenta criar APENAS SE o usuário existir na tabela 'Usuario'
    try {
        carrinho = await prisma.carrinho.create({
            data: { cliente_id: usuarioId },
        });
    } catch (createError) {
        // Se a criação falhar (ex: usuário com este ID não existe), 
        // retorne 400 (Bad Request) para o frontend.
        console.error("ERRO AO CRIAR CARRINHO (ID Inválido):", createError.message);
        res.status(400);
        throw new Error('Não foi possível criar o carrinho. Usuário logado inválido.');
    }
}

    // 3. Buscar/Atualizar Item do Carrinho
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

// =========================================================
// 2. VER CARRINHO
// =========================================================
export const verCarrinho = asyncHandler(async (req, res) => {
    const usuarioId = getUserId(req); 

    // ✅ CORRETO: findFirst e cliente_id
    const carrinho = await prisma.carrinho.findFirst({
      where: { cliente_id: usuarioId },
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

// =========================================================
// 3. FINALIZAR COMPRA
// =========================================================
export const finalizarCompra = asyncHandler(async (req, res) => {
    const usuarioId = getUserId(req); 

    // ✅ CORRETO: findFirst e cliente_id
    const carrinho = await prisma.carrinho.findFirst({
      where: { cliente_id: usuarioId },
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
          cliente_id: usuarioId, 
          vendedor_id: 1, 
          total: valorTotal,
          // Inclua o restante dos campos obrigatórios aqui (ex: data_venda, status)
          data_venda: new Date(),
          status: 'concluida'
        },
      });

      await tx.itemVenda.createMany({
        data: carrinho.itens.map((item) => ({
          vendaId: novaVenda.id,
          produto_id: item.produtoId, 
          quantidade: item.quantidade,
          preco_unitario: item.produto.preco,
          subtotal: item.produto.preco * item.quantidade,
        })),
      });

      await tx.itemCarrinho.deleteMany({
        where: { carrinhoId: carrinho.id },
      });

      return novaVenda;
    });

    res.status(201).json({ 
        message: 'Compra finalizada com sucesso!', 
        vendaId: venda.id 
    });
});

// =========================================================
// 4. REMOVER DO CARRINHO (Lógica Padrão)
// =========================================================
export const removerDoCarrinho = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const usuarioId = getUserId(req);

    // ✅ CORRETO: findFirst e cliente_id
    const carrinho = await prisma.carrinho.findFirst({ where: { cliente_id: usuarioId } });

    if (!carrinho) {
        res.status(404);
        throw new Error('Carrinho não encontrado.');
    }

    // 2. Deleta o item do carrinho
    await prisma.itemCarrinho.delete({
        where: {
            id: parseInt(itemId),
            carrinhoId: carrinho.id, 
        },
    });

    res.status(200).json({ message: 'Item removido do carrinho.' });
});