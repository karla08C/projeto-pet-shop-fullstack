import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

// =========================================================
// 1. CRIAR NOVO SERVIÇO (APENAS ADMIN/VENDEDOR)
// =========================================================
export const createService = asyncHandler(async (req, res) => {
    // Nota: Aqui seria ideal verificar se o usuário logado (req.usuarioId) é um Admin ou Vendedor.
    
    const { nome, descricao, preco, duracao } = req.body;

    if (!nome || !preco || !duracao) {
        res.status(400);
        throw new Error('Nome, Preço e Duração são obrigatórios para o serviço.');
    }

    const precoDecimal = parseFloat(preco);
    
    const novoServico = await prisma.servico.create({
        data: {
            nome,
            descricao: descricao || 'Serviço não detalhado.',
            preco: precoDecimal,
            duracao: parseInt(duracao),
        },
    });

    res.status(201).json(novoServico);
});

// =========================================================
// 2. LISTAR TODOS OS SERVIÇOS (PÚBLICO)
// =========================================================
export const getAllServices = asyncHandler(async (req, res) => {
    // Esta rota pode ser pública para exibir os preços no frontend
    const servicos = await prisma.servico.findMany({
        orderBy: { nome: 'asc' },
    });
    res.status(200).json(servicos);
});

// =========================================================
// 3. OBTER SERVIÇO POR ID (PÚBLICO)
// =========================================================
export const getServiceById = asyncHandler(async (req, res) => {
    const serviceId = parseInt(req.params.id);

    if (isNaN(serviceId)) {
        res.status(400);
        throw new Error('ID de serviço inválido.');
    }

    const servico = await prisma.servico.findUnique({
        where: { id: serviceId },
    });

    if (!servico) {
        res.status(404);
        throw new Error('Serviço não encontrado.');
    }
    
    res.status(200).json(servico);
});

// =========================================================
// 4. ATUALIZAR SERVIÇO (APENAS ADMIN/VENDEDOR)
// =========================================================
export const updateService = asyncHandler(async (req, res) => {
    const serviceId = parseInt(req.params.id);
    const { nome, descricao, preco, duracao } = req.body;

    if (isNaN(serviceId)) {
        res.status(400);
        throw new Error('ID de serviço inválido.');
    }

    const precoDecimal = preco ? parseFloat(preco) : undefined;
    const duracaoInt = duracao ? parseInt(duracao) : undefined;

    const servicoAtualizado = await prisma.servico.update({
        where: { id: serviceId },
        data: {
            nome,
            descricao,
            preco: precoDecimal,
            duracao: duracaoInt,
        },
    });

    res.status(200).json(servicoAtualizado);
});

// =========================================================
// 5. DELETAR SERVIÇO (APENAS ADMIN/VENDEDOR)
// =========================================================
export const deleteService = asyncHandler(async (req, res) => {
    const serviceId = parseInt(req.params.id);

    if (isNaN(serviceId)) {
        res.status(400);
        throw new Error('ID de serviço inválido.');
    }

    await prisma.servico.delete({
        where: { id: serviceId },
    });

    res.status(200).json({ message: 'Serviço deletado com sucesso.' });
});