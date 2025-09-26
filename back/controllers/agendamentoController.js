import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

// =========================================================
// FUNÇÃO AUXILIAR: Garantir que o ID do JWT seja um número inteiro
// =========================================================
const getUserId = (req) => {
    return parseInt(req.usuarioId);
};

// =========================================================
// 1. CRIAR AGENDAMENTO
// =========================================================
export const createAppointment = asyncHandler(async (req, res) => {
    
    // 1. TRATAMENTO DO ID DO USUÁRIO
    const clienteId = getUserId(req);

    if (isNaN(clienteId) || clienteId <= 0) {
        res.status(401);
        throw new Error("Acesso negado. ID do usuário inválido ou ausente.");
    }
    
    // 2. DESESTRUTURAÇÃO DOS DADOS DO FORMULÁRIO ENVIADOS PELO FRONTEND
    const { 
        nomePet, 
        data, 
        hora, 
        servicos, 
        nomeDono,          // 🛑 Capturado do req.body (do seu frontend)
        telefoneContato,   // 🛑 Capturado do req.body (do seu frontend)
        observacoes,       // 🛑 Capturado do req.body (do seu frontend)
    } = req.body;

    // 3. VALIDAÇÃO ESSENCIAL (Campos mínimos)
    if (!nomePet || !data || !hora || !servicos || servicos.length === 0) {
        res.status(400);
        throw new Error("Dados de agendamento incompletos (Pet, Data, Hora ou Serviços são obrigatórios).");
    }
    
    // 4. TRATAMENTO DE DATA/HORA
    // Cria um objeto Date para o campo data_hora do Prisma
    const dataHoraAgendamento = new Date(`${data}T${hora}:00`);
    
    // --- Lógica para o SERVIÇO ---
    const servicoPrincipal = servicos[0];
    const nomeDoServico = servicoPrincipal?.nomeServico;
    
    if (!nomeDoServico) {
        res.status(400);
        throw new Error("Nenhum serviço válido foi selecionado.");
    }

    // 5. BUSCAR OU CRIAR O SERVIÇO
    let servico = await prisma.servico.findFirst({
        where: { nome: nomeDoServico }
    });

    if (!servico) {
        // Se o serviço não existe, cria um com valores padrão
        servico = await prisma.servico.create({
            data: {
                nome: nomeDoServico,
                descricao: "Serviço agendado online.", 
                preco: 0, 
                duracao: 60, 
            }
        });
    }
    
    // 6. CRIAÇÃO DO AGENDAMENTO NO BANCO DE DADOS
    const appointment = await prisma.agendamento.create({
        data: {
            cliente_id: clienteId, 
            servico_id: servico.id,
            nome_pet: nomePet,
            data_hora: dataHoraAgendamento,
            observacoes: observacoes, // Salva as observações
            // nome_dono: nomeDono, // Mapeie se estes campos existirem no seu modelo Agendamento
            // telefone: telefoneContato, // Mapeie se estes campos existirem no seu modelo Agendamento
        }
    });
    
    res.status(201).json(appointment);
});

// =========================================================
// 2. LISTAR AGENDAMENTOS (AGORA MOSTRA TODOS PARA TESTE!)
// =========================================================
export const getAllAppointments = asyncHandler(async (req, res) => {
    // const clienteId = getUserId(req); // Linha original comentada
    
    // 🛑 CORREÇÃO APLICADA AQUI: O filtro está vazio {}
    // Isso fará o Prisma retornar TODOS os agendamentos, ignorando o usuário logado.
    const filter = {}; 

    const appointments = await prisma.agendamento.findMany({
        where: filter, // Aplica o filtro (agora vazio)
        include: {
            cliente: { select: { id: true, nome: true, email: true } },
            servico: true 
        }
    });
    res.status(200).json(appointments);
});

// =========================================================
// 3. BUSCAR AGENDAMENTO POR ID
// =========================================================
export const getAppointmentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = getUserId(req); // Para verificar a propriedade

    const appointment = await prisma.agendamento.findUnique({
        where: { id: parseInt(id) },
        include: { cliente: true, servico: true }
    });

    if (!appointment) {
        res.status(404);
        throw new Error("Agendamento não encontrado.");
    }
    
    // Regra de Autorização
    if (appointment.cliente_id !== clienteId) {
        res.status(403);
        throw new Error("Acesso negado. Você não tem permissão para visualizar este agendamento.");
    }

    res.status(200).json(appointment);
});

// =========================================================
// 4. ATUALIZAR AGENDAMENTO
// =========================================================
export const updateAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { data_hora, status } = req.body;
    
    const updatedAppointment = await prisma.agendamento.update({
        where: { id: parseInt(id) },
        data: {
            data_hora: data_hora ? new Date(data_hora) : undefined,
            status
        }
    });
    res.status(200).json(updatedAppointment);
});

// =========================================================
// 5. DELETAR AGENDAMENTO
// =========================================================
export const deleteAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clienteId = getUserId(req); // Para verificar a propriedade
    
    await prisma.agendamento.delete({
        where: { id: parseInt(id), cliente_id: clienteId } // Deleta APENAS se o agendamento pertencer ao cliente
    });
    
    res.status(204).send(); 
});