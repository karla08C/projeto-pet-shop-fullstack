import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// Helper para converter strings para tipos corretos
const parseBody = (body) => {
    const parsed = { ...body };
    if (parsed.preco) parsed.preco = parseFloat(parsed.preco);
    if (parsed.estoque) parsed.estoque = parseInt(parsed.estoque, 10);
    if (parsed.vendedor_id) parsed.vendedor_id = parseInt(parsed.vendedor_id, 10);
    if (parsed.ativo !== undefined) parsed.ativo = parsed.ativo === 'true'; 
    return parsed;
};

// =========================================================
// FUNÇÃO AUXILIAR: Remove o arquivo do sistema de arquivos
// =========================================================
const removeOldImage = async (imagePath) => {
    if (!imagePath) return;

    // Constrói o caminho absoluto no servidor
    // O substring(8) remove o prefixo "/uploads/" para construir o caminho no disco
    const relativePath = imagePath.startsWith('/uploads/') ? imagePath.substring(8) : imagePath;
    
    // Constrói o caminho absoluto: /back/uploads/imagens/arquivo.jpg
    const absolutePath = path.join(process.cwd(), relativePath); 

    try {
        await fs.unlink(absolutePath);
        console.log(`Imagem antiga removida: ${absolutePath}`);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error(`Erro ao tentar remover arquivo: ${absolutePath}`, error);
        }
    }
};

// =========================================================
// 1. LISTAR TODOS OS PRODUTOS
// =========================================================
export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await prisma.produto.findMany({
        include: {
            vendedor: { 
                select: { nome: true }
            }
        }
    });
    res.json(products);
});

// =========================================================
// 2. BUSCAR UM PRODUTO PELO ID
// =========================================================
export const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.produto.findUnique({ where: { id: Number(id) } });
    
    if (!product) {
        res.status(404);
        throw new Error("Produto não encontrado.");
    }
    
    res.json(product);
});

// =========================================================
// 3. CRIAR NOVO PRODUTO COM UPLOAD DE IMAGEM
// =========================================================
export const createProduct = asyncHandler(async (req, res) => {
    const { nome, descricao, preco, estoque, vendedor_id, categoria } = parseBody(req.body);
    
    // Caminho público que o frontend usará
    const imagem_url = req.file ? `/uploads/imagens/${req.file.filename}` : null;
    
    if (!nome || !preco || !vendedor_id) {
        if (req.file) { await removeOldImage(imagem_url); }
        res.status(400);
        throw new Error("Nome, preço e ID do vendedor são obrigatórios.");
    }
    
    const product = await prisma.produto.create({
        data: { 
            nome, 
            descricao, 
            preco, 
            estoque, 
            vendedor_id, 
            categoria, 
            imagem_url
        }
    });
    res.status(201).json(product);
});

// =========================================================
// 4. ATUALIZAR PRODUTO EXISTENTE (COM CORREÇÃO DE CAMINHO)
// =========================================================
export const updateProduct = asyncHandler(async (req, res) => {
    
    // Removendo debugs temporários, pois já cumpriram seu papel
    // console.log("DADOS RECEBIDOS:", req.body);
    // console.log("ARQUIVO RECEBIDO PELO MULTER (req.file):", req.file); 

    const { id } = req.params;
    const { nome, descricao, preco, estoque, ativo, categoria } = parseBody(req.body);
    
    const updateData = {};
    if (nome !== undefined) updateData.nome = nome;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (preco !== undefined) updateData.preco = preco;
    if (estoque !== undefined) updateData.estoque = estoque;
    if (ativo !== undefined) updateData.ativo = ativo;
    if (categoria !== undefined) updateData.categoria = categoria;
    
    const produtoAntigo = await prisma.produto.findUnique({ where: { id: Number(id) } });
    if (!produtoAntigo) {
        res.status(404);
        throw new Error("Produto a ser atualizado não encontrado.");
    }

    if (req.file) { // Se um novo arquivo de imagem foi enviado
        // 🛑 CORREÇÃO CRÍTICA AQUI: Cria o caminho URL com barras normais (/)
        const novoCaminho = `/uploads/imagens/${req.file.filename}`;
        updateData.imagem_url = novoCaminho;
        
        // GESTÃO DE DISCO: Remove a imagem antiga
        if (produtoAntigo.imagem_url) {
            await removeOldImage(produtoAntigo.imagem_url);
        }
    }
    
    // ATUALIZA O BD
    const product = await prisma.produto.update({
        where: { id: Number(id) },
        data: updateData
    });
    
    res.json(product);
});

// =========================================================
// 5. DELETAR PRODUTO
// =========================================================
export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const produto = await prisma.produto.findUnique({ where: { id: Number(id) } });

    if (produto) {
        // GESTÃO DE DISCO: Remove a imagem associada antes de deletar o registro
        if (produto.imagem_url) {
            await removeOldImage(produto.imagem_url);
        }
    }

    await prisma.produto.delete({ where: { id: Number(id) } });
    res.status(204).send();
});