import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const createService = async (req, res) => {
  try {
    
    const { nome, descricao, preco, duracao } = req.body;
    
    if (!nome || !preco || !duracao) {
      return res.status(400).json({ error: "Nome, preço e duração (em minutos) são obrigatórios." });
    }

    const service = await prisma.servico.create({
      data: { 
        nome, 
        descricao, 
        preco, 
        duracao 
      }
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: "Error creating service" });
  }
};


export const getAllServices = async (req, res) => {
  try {
    const services = await prisma.servico.findMany();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error fetching services" });
  }
};


export const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await prisma.servico.findUnique({ where: { id: Number(id) }});
        if (!service) {
            return res.status(404).json({ error: "Service not found" });
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: "Error fetching service" });
    }
};


export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, preco, duracao } = req.body;
        const service = await prisma.servico.update({
            where: { id: Number(id) },
            data: { nome, descricao, preco, duracao }
        });
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: "Error updating service" });
    }
};


export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.servico.delete({ where: { id: Number(id) }});
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Error deleting service" });
    }
};