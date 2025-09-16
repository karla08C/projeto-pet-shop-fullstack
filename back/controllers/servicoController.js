import prisma from "../prisma/client.js";

export const getAllServices = async (req, res) => {
  try {
    const services = await prisma.servico.findMany();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error fetching services" });
  }
};

export const createService = async (req, res) => {
  try {
    const { nome, descricao, preco } = req.body;
    const service = await prisma.servico.create({
      data: { nome, descricao, preco }
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: "Error creating service" });
  }
};
