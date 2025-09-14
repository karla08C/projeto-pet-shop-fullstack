import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();
const prisma = new PrismaClient();

// Criar produto (apenas vendedor)
router.post("/", auth, upload.single('productImage'), async (req, res) => {
  if (req.user.role !== "vendedor") {
    return res.status(403).json({ error: "Apenas vendedores podem cadastrar produtos" });
  }

  // CORRIGIDO: Nomes dos campos alinhados com o schema.prisma (nome, descricao, etc.)
  const { nome, descricao, preco, estoque } = req.body;
  const vendedorId = req.user.id; // ADICIONADO: Captura o ID do vendedor logado

  if (!req.file) {
    return res.status(400).json({ error: 'A imagem do produto é obrigatória.' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    const product = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        imagem_url: imageUrl, // CORRIGIDO: Campo 'imagem_url'
        vendedor_id: vendedorId, // ADICIONADO: Vincula o produto ao vendedor
      }
    });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Erro ao cadastrar produto" });
  }
});

// Listar todos os produtos (rota pública ou para usuários logados)
router.get("/", async (req, res) => {
  const products = await prisma.produto.findMany({
    where: { ativo: true } // Boa prática: mostrar apenas produtos ativos
  });
  res.json(products);
});

// Atualizar produto (apenas o dono do produto)
router.put("/:id", auth, upload.single('productImage'), async (req, res) => {
  if (req.user.role !== "vendedor") {
    return res.status(403).json({ error: "Apenas vendedores podem atualizar produtos" });
  }

  const { id } = req.params;
  const vendedorId = req.user.id;
  const { nome, descricao, preco, estoque, ativo } = req.body;

  try {
    // ADICIONADO: Verificação de segurança para garantir que o vendedor é o dono do produto
    const produtoExistente = await prisma.produto.findUnique({
      where: { id: parseInt(id) }
    });

    if (!produtoExistente) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    if (produtoExistente.vendedor_id !== vendedorId) {
      return res.status(403).json({ error: "Você não tem permissão para editar este produto." });
    }

    const dataToUpdate = {
      nome,
      descricao,
      preco: preco ? parseFloat(preco) : undefined,
      estoque: estoque ? parseInt(estoque) : undefined,
      ativo: ativo !== undefined ? Boolean(ativo) : undefined,
    };

    if (req.file) {
      dataToUpdate.imagem_url = `/uploads/${req.file.filename}`; // CORRIGIDO: Campo 'imagem_url'
    }

    const product = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: dataToUpdate
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar o produto" });
  }
});

// Remover produto (apenas o dono do produto)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "vendedor") {
    return res.status(403).json({ error: "Apenas vendedores podem excluir produtos" });
  }

  const { id } = req.params;
  const vendedorId = req.user.id;

  try {
    // ADICIONADO: Verificação de segurança
    const produtoExistente = await prisma.produto.findUnique({
      where: { id: parseInt(id) }
    });

    if (!produtoExistente) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    if (produtoExistente.vendedor_id !== vendedorId) {
      return res.status(403).json({ error: "Você não tem permissão para excluir este produto." });
    }

    await prisma.produto.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Produto removido com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover o produto" });
  }
});

// ATUALIZADO: Rota para adicionar estoque com verificação de segurança
router.patch("/:id/add-stock", auth, async (req, res) => {
  if (req.user.role !== "vendedor") {
    return res.status(403).json({ error: "Apenas vendedores podem atualizar o estoque." });
  }

  const { id } = req.params;
  const { amount } = req.body;
  const vendedorId = req.user.id;

  if (!amount || parseInt(amount) <= 0) {
    return res.status(400).json({ error: 'A quantidade deve ser um número positivo.' });
  }

  try {
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    // ADICIONADO: Verificação de segurança crucial
    if (produto.vendedor_id !== vendedorId) {
      return res.status(403).json({ error: "Você não tem permissão para alterar o estoque deste produto." });
    }

    const produtoAtualizado = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: {
        estoque: {
          increment: parseInt(amount),
        },
      },
    });
    res.json(produtoAtualizado);

  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao atualizar o estoque.' });
  }
});

export default router;