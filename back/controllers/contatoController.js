import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const criarContato = async (req, res) => {
  try {
    const { nome, email, telefone, mensagem } = req.body;

    
    if (!nome || !email || !mensagem) {
      return res.status(400).json({ erro: "Nome, e-mail e mensagem são obrigatórios." });
    }

    const contato = await prisma.contato.create({
      data: { nome, email, telefone, mensagem },
    });
    
    res.status(201).json(contato);
  } catch (error) {
    
    res.status(500).json({ erro: "Erro ao criar contato" });
  }
};


export const listarContatos = async (req, res) => {
  try {
    const contatos = await prisma.contato.findMany({
      
      orderBy: {
        data_envio: 'desc',
      },
    });
    res.json(contatos);
  } catch (error) {
    
    res.status(500).json({ erro: "Erro ao listar contatos" });
  }
};


export const atualizarStatusLido = async (req, res) => {
  try {
    const { id } = req.params;
    const { lido } = req.body; 

    if (typeof lido !== 'boolean') {
      return res.status(400).json({ erro: "O valor para 'lido' deve ser true ou false." });
    }

    const contato = await prisma.contato.update({
      where: { id: parseInt(id) },
      data: { lido },
    });
    res.status(200).json(contato);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar o status do contato." });
  }
};


export const deletarContato = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.contato.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ erro: "Erro ao deletar o contato." });
  }
};