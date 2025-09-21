import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Helper para converter strings para tipos corretos se necessário
const parseBody = (body) => {
    const parsed = { ...body };
    if (parsed.preco) parsed.preco = parseFloat(parsed.preco);
    if (parsed.estoque) parsed.estoque = parseInt(parsed.estoque, 10);
    if (parsed.vendedor_id) parsed.vendedor_id = parseInt(parsed.vendedor_id, 10);
    return parsed;
};

// Lista todos os produtos
export const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.produto.findMany({
            include: {
                vendedor: { 
                    select: { nome: true }
                }
            }
        });
        res.json(products);
    } catch (error) {
        console.error("Erro ao buscar todos os produtos:", error);
        res.status(500).json({ error: "Não foi possível buscar os produtos." });
    }
};

// Busca um produto pelo ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.produto.findUnique({ where: { id: Number(id) } });
        if (!product) return res.status(404).json({ error: "Produto não encontrado." });
        res.json(product);
    } catch (error) {
        console.error("Erro ao buscar produto por ID:", error);
        res.status(500).json({ error: "Não foi possível buscar o produto." });
    }
};

// Cria um novo produto com upload de imagem
export const createProduct = async (req, res) => {
    try {
        const { nome, descricao, preco, estoque, vendedor_id, categoria } = parseBody(req.body);
        
        // Pega o caminho da imagem do objeto 'req.file' do Multer
        const imagem_url = req.file ? `/uploads/${req.file.filename}` : null;
        
        if (!nome || !preco || !vendedor_id) {
            return res.status(400).json({ error: "Nome, preço e ID do vendedor são obrigatórios."});
        }
        
        const product = await prisma.produto.create({
            data: { 
                nome, 
                descricao, 
                preco, 
                estoque, 
                vendedor_id, 
                categoria, 
                imagem_url // Salva o caminho da imagem no banco de dados
            }
        });
        res.status(201).json(product);
    } catch (error) {
        console.error("Erro ao criar produto:", error);
        res.status(500).json({ error: "Não foi possível criar o produto." });
    }
};

// Atualiza um produto existente com ou sem upload de imagem
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, preco, estoque, ativo } = parseBody(req.body);
        
        const updateData = {};
        if (nome !== undefined) updateData.nome = nome;
        if (descricao !== undefined) updateData.descricao = descricao;
        if (preco !== undefined) updateData.preco = preco;
        if (estoque !== undefined) updateData.estoque = estoque;
        if (ativo !== undefined) updateData.ativo = ativo;

        if (req.file) { // Se um novo arquivo de imagem foi enviado
            updateData.imagem_url = `/uploads/${req.file.filename}`;
            // (Opcional) Remova a imagem antiga do servidor para economizar espaço
        }
        
        const product = await prisma.produto.update({
            where: { id: Number(id) },
            data: updateData
        });
        res.json(product);
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).json({ error: "Não foi possível atualizar o produto." });
    }
};

// Deleta um produto
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // (Opcional) Remova a imagem associada antes de deletar o produto
        
        await prisma.produto.delete({ where: { id: Number(id) } });
        res.status(204).send(); 
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        res.status(500).json({ error: "Não foi possível deletar o produto." });
    }
};