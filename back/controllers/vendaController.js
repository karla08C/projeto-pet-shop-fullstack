import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const criarVenda = async (req, res) => {
  
  const { cliente_id, vendedor_id, forma_pagamento, endereco_entrega, itens } = req.body;

  if (!cliente_id || !vendedor_id || !itens || itens.length === 0) {
    return res.status(400).json({ erro: "Dados insuficientes para criar a venda." });
  }

  try {
    
    const idsDosProdutos = itens.map(item => item.produto_id);
    const produtosNoBanco = await prisma.produto.findMany({
      where: {
        id: { in: idsDosProdutos },
      },
    });

    
    let valorTotalVenda = 0;
    for (const item of itens) {
      const produto = produtosNoBanco.find(p => p.id === item.produto_id);
      if (!produto) {
        throw new Error(`Produto com ID ${item.produto_id} não encontrado.`);
      }
      if (produto.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para o produto: ${produto.nome}.`);
      }
      
      valorTotalVenda += produto.preco * item.quantidade;
    }

    
    const vendaRealizada = await prisma.$transaction(async (tx) => {
      
      const venda = await tx.venda.create({
        data: {
          cliente_id,
          vendedor_id,
          total: valorTotalVenda,
          forma_pagamento,
          endereco_entrega,
          status: "concluida",
        },
      });

      
      const dadosItensVenda = itens.map(item => {
        const produto = produtosNoBanco.find(p => p.id === item.produto_id);
        return {
          venda_id: venda.id,
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          preco_unitario: produto.preco,
          subtotal: produto.preco * item.quantidade,
        };
      });

      
      await tx.itemVenda.createMany({
        data: dadosItensVenda,
      });

      
      for (const item of itens) {
        await tx.produto.update({
          where: { id: item.produto_id },
          data: {
            estoque: {
              decrement: item.quantidade,
            },
          },
        });
      }

      return venda;
    });

    res.status(201).json(vendaRealizada);

  } catch (error) {
    res.status(400).json({ erro: "Erro ao criar venda", detalhe: error.message });
  }
};



export const listarVendas = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar vendas", detalhe: error.message });
  }
};


export const obterVendaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const venda = await prisma.venda.findUnique({
            where: { id: parseInt(id) },
            include: {
                cliente: true,
                vendedor: true,
                itens: { include: { produto: true } }
            }
        });
        if (!venda) {
            return res.status(404).json({ erro: "Venda não encontrada." });
        }
        res.json(venda);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar a venda." });
    }
};