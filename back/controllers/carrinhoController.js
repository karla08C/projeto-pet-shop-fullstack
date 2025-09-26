import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

// Função auxiliar para garantir que o ID do JWT seja um número inteiro
const getUserId = (req) => {
    return parseInt(req.usuarioId);
};

// =========================================================
// 1. ADICIONAR AO CARRINHO
// =========================================================
export const adicionarAoCarrinho = asyncHandler(async (req, res) => {
    const produtoId = parseInt(req.body.produtoId);
    const quantidade = parseInt(req.body.quantidade);
    
    const usuarioId = getUserId(req); 
    
    if (isNaN(usuarioId) || isNaN(produtoId) || isNaN(quantidade) || quantidade <= 0) {
        res.status(400);
        throw new Error('Dados de produto ou usuário inválidos.');
    }
    
    // 1. Busca e verifica o produto
    const produto = await prisma.produto.findUnique({
        where: { id: produtoId },
    });

    if (!produto) {
        res.status(404); 
        throw new Error('Produto não encontrado no catálogo.');
    }
    
    // 2. Busca ou Cria o Carrinho
    let carrinho = await prisma.carrinho.findFirst({
        where: { cliente_id: usuarioId },
    });

    if (!carrinho) {
        try {
            carrinho = await prisma.carrinho.create({
                data: { cliente_id: usuarioId },
            });
        } catch (createError) {
            console.error("ERRO AO CRIAR CARRINHO (ID Inválido):", createError.message);
            res.status(400);
            throw new Error('Não foi possível criar o carrinho. Usuário logado inválido.');
        }
    }

    // 3. Busca/Atualiza o Item do Carrinho usando a chave única composta
    const itemExistente = await prisma.itemCarrinho.findUnique({
        where: {
            carrinho_id_produto_id: {
                carrinho_id: carrinho.id,
                produto_id: produtoId,
            }
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
                carrinho_id: carrinho.id,
                produto_id: produtoId,
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
      // Retorna uma estrutura vazia em vez de 404 para o frontend
      return res.json({ itens: [], total: 0 }); 
    }

    res.status(200).json(carrinho);
});

// =========================================================
// 3. FINALIZAR COMPRA (TRANSAÇÃO)
// =========================================================
export const finalizarCompra = asyncHandler(async (req, res) => {
    const usuarioId = getUserId(req); 
    
    // Assumimos que o frontend pode enviar informações de pagamento/entrega
    const { formaPagamento, enderecoEntrega } = req.body; 

    const carrinho = await prisma.carrinho.findFirst({
      where: { cliente_id: usuarioId },
      include: { itens: { include: { produto: true } } },
    });

    if (!carrinho || carrinho.itens.length === 0) {
      res.status(400);
      throw new Error('Seu carrinho está vazio');
    }

    // Garante que o cálculo é feito com precisão (parseFloat)
    const valorTotal = carrinho.itens.reduce(
      (acc, item) => acc + parseFloat(item.produto.preco) * item.quantidade,
      0
    ).toFixed(2);
    
    // 🛑 ATENÇÃO: É NECESSÁRIO QUE O USUÁRIO COM ID 1 EXISTA NO SEU BANCO DE DADOS
    const VENDEDOR_PADRAO_ID = 1; 

    const venda = await prisma.$transaction(async (tx) => {
      // 1. Cria a Venda
      const novaVenda = await tx.venda.create({
        data: {
          cliente_id: usuarioId, 
          vendedor_id: VENDEDOR_PADRAO_ID, 
          total: parseFloat(valorTotal),
          data_venda: new Date(),
          status: 'concluida',
          // Campos obrigatórios do modelo Venda (verifique seu schema)
          forma_pagamento: formaPagamento || 'Cartão/Pix', 
          endereco_entrega: enderecoEntrega || 'Aguardando confirmação', 
        },
      });

      // 2. Cria os Itens da Venda
      await tx.itemVenda.createMany({
        data: carrinho.itens.map((item) => ({
          venda_id: novaVenda.id,
          produto_id: item.produto.id, // ID do produto
          quantidade: item.quantidade,
          preco_unitario: item.produto.preco,
          subtotal: item.produto.preco * item.quantidade,
        })),
      });

      // 3. Limpa o Carrinho
      await tx.itemCarrinho.deleteMany({
        where: { carrinho_id: carrinho.id },
      });

      return novaVenda;
    });

    res.status(201).json({ 
        message: 'Compra finalizada com sucesso!', 
        vendaId: venda.id 
    });
});

// =========================================================
// 4. REMOVER DO CARRINHO
// =========================================================
export const removerDoCarrinho = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const usuarioId = getUserId(req);

    const carrinho = await prisma.carrinho.findFirst({ where: { cliente_id: usuarioId } });

    if (!carrinho) {
        res.status(404);
        throw new Error('Carrinho não encontrado.');
    }

    await prisma.itemCarrinho.delete({
        where: {
            id: parseInt(itemId),
            carrinho_id: carrinho.id, 
        },
    });

    res.status(200).json({ message: 'Item removido do carrinho.' });
});