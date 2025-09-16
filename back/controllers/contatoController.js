import prisma from "../prisma/client.js";

export const listarContatos = async (req, res) => {
  try {
    const contatos = await prisma.contato.findMany();
    res.json(contatos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar contatos" });
  }
};

export const criarContato = async (req, res) => {
  try {
    const { nome, email, telefone, mensagem } = req.body;
    const contato = await prisma.contato.create({
      data: { nome, email, telefone, mensagem }
    });
    res.json(contato);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar contato" });
  }
};
