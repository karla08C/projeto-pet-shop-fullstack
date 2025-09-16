import prisma from "../prisma/client.js";

export const listarVendas = async (req, res) => {
  try {
    const vendas = await prisma.venda.findMany({
      include: { usuario: true, produto: true }
    });
    res.json(vendas);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar vendas" });
  }
};

export const criarVenda = async (req, res) => {
  try {
    const { usuario_id, produto_id, quantidade } = req.body;
    const produto = await prisma.produto.findUnique({ where: { id: produto_id } });

    if (!produto || produto.estoque < quantidade) {
      return res.status(400).json({ erro: "Estoque insuficiente" });
    }

    const total = produto.preco * quantidade;

    const venda = await prisma.venda.create({
      data: { usuario_id, produto_id, quantidade, total }
    });

    await prisma.produto.update({
      where: { id: produto_id },
      data: { estoque: produto.estoque - quantidade }
    });

    res.json(venda);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar venda" });
  }
};
