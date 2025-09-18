import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


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
    res.status(500).json({ error: "Error fetching products" });
  }
};


export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.produto.findUnique({ where: { id: Number(id) } });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error fetching product" });
  }
};


export const createProduct = async (req, res) => {
  try {
    
    const { nome, descricao, preco, estoque, vendedor_id, categoria, imagem_url } = req.body;
    
    
    if (!nome || !preco || !vendedor_id) {
        return res.status(400).json({ error: "Nome, preço e ID do vendedor são obrigatórios."});
    }

    const product = await prisma.produto.create({
      data: { nome, descricao, preco, estoque, vendedor_id, categoria, imagem_url }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error creating product" });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { nome, descricao, preco, estoque, ativo } = req.body;
    const product = await prisma.produto.update({
      where: { id: Number(id) },
      data: { nome, descricao, preco, estoque, ativo }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error updating product" });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.produto.delete({ where: { id: Number(id) } });
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
};