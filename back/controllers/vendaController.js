import { PrismaClient } from '@prisma/client';
// 🛑 IMPORTANTE: Importar express-async-handler para consistência
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

// =========================================================
// 1. CRIAR VENDA (COM TRANSAÇÃO E TRATAMENTO DECIMAL)
// =========================================================
export const criarVenda = asyncHandler(async (req, res) => {
    
    // Assumimos que IDs e quantidade já são números ou strings que podem ser parseadas
    const { cliente_id, vendedor_id, forma_pagamento, endereco_entrega, itens } = req.body;
    
    // Garante que os IDs sejam tratados como números inteiros, se vierem como strings
    const clienteIdInt = parseInt(cliente_id);
    const vendedorIdInt = parseInt(vendedor_id);

    if (!clienteIdInt || !vendedorIdInt || !itens || itens.length === 0) {
        res.status(400);
        throw new Error("Dados insuficientes (Cliente, Vendedor ou Itens faltando).");
    }

    // Mapeamento e obtenção de produtos no banco de dados
    const idsDosProdutos = itens.map(item => item.produto_id);
    const produtosNoBanco = await prisma.produto.findMany({
        where: {
            id: { in: idsDosProdutos.map(id => parseInt(id)) },
        },
    });

    let valorTotalVenda = 0;
    const itemVendaData = [];

    // 1. Pré-processamento e validação de estoque/preço
    for (const item of itens) {
        const produtoId = parseInt(item.produto_id);
        const quantidade = parseInt(item.quantidade);
        
        const produto = produtosNoBanco.find(p => p.id === produtoId);
        
        if (!produto) {
            throw new Error(`Produto com ID ${produtoId} não encontrado.`);
        }

        // 🛑 CORREÇÃO CRÍTICA: Tratar o preço como string/Decimal
        const precoNumerico = parseFloat(produto.preco); 
        
        if (produto.estoque < quantidade) {
            throw new Error(`Estoque insuficiente para o produto: ${produto.nome}. Disponível: ${produto.estoque}`);
        }
        
        // 🛑 Garante que o cálculo é feito com números para evitar erros
        const subtotal = precoNumerico * quantidade;
        valorTotalVenda += subtotal;

        // Prepara os dados para o itemVenda.createMany
        itemVendaData.push({
            venda_id: 0, // Temporário, será preenchido após a criação da venda
            produto_id: produtoId,
            quantidade: quantidade,
            preco_unitario: produto.preco, // O Prisma lida com o tipo Decimal aqui
            subtotal: subtotal,
        });
    }

    // 2. Transação Atômica: Criação e Atualização
    const vendaRealizada = await prisma.$transaction(async (tx) => {
        
        // Cria a Venda
        const venda = await tx.venda.create({
            data: {
                cliente_id: clienteIdInt,
                vendedor_id: vendedorIdInt,
                // 🛑 Garante que o total é salvo como Decimal com o cálculo correto
                total: parseFloat(valorTotalVenda.toFixed(2)), 
                forma_pagamento: forma_pagamento || 'Não especificado',
                endereco_entrega: endereco_entrega || 'Não especificado',
                status: "concluida",
            },
        });

        // Adiciona o ID da Venda aos itens
        const dadosItensVenda = itemVendaData.map(item => ({
            ...item,
            venda_id: venda.id,
        }));

        // Cria todos os Itens da Venda
        await tx.itemVenda.createMany({
            data: dadosItensVenda,
        });

        // Decrementa o Estoque de todos os produtos
        for (const item of itens) {
            const produtoId = parseInt(item.produto_id);
            await tx.produto.update({
                where: { id: produtoId },
                data: {
                    estoque: {
                        decrement: parseInt(item.quantidade),
                    },
                },
            });
        }

        return venda;
    });

    res.status(201).json(vendaRealizada);

}); // Fim do asyncHandler


// =========================================================
// 2. LISTAR VENDAS
// =========================================================
export const listarVendas = asyncHandler(async (req, res) => {
    const vendas = await prisma.venda.findMany({
        include: {
            cliente: { select: { nome: true } },
            vendedor: { select: { nome: true } },
            itens: { 
                include: {
                    produto: { select: { nome: true } }
                }
            }
        }
    });
    res.json(vendas);
});


// =========================================================
// 3. OBTER VENDA POR ID
// =========================================================
export const obterVendaPorId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const vendaId = parseInt(id);

    if (isNaN(vendaId)) {
        res.status(400);
        throw new Error("ID da venda inválido.");
    }
    
    const venda = await prisma.venda.findUnique({
        where: { id: vendaId },
        include: {
            cliente: true,
            vendedor: true,
            itens: { include: { produto: true } }
        }
    });
    
    if (!venda) {
        res.status(404);
        throw new Error("Venda não encontrada.");
    }
    
    res.json(venda);
});