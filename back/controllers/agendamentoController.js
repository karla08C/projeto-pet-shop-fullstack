import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// =========================================================
// 1. CRIAR AGENDAMENTO (Protegida - Usa o ID do Usuário Logado)
// =========================================================
export const createAppointment = async (req, res) => {
    try {
        const clienteId =  parseInt(req.usuarioId); // <-- USA O ID INJETADO PELO MIDDLEWARE
        
        if (!clienteId) {
             return res.status(401).json({ error: "Acesso negado. Usuário não autenticado." });
        }
        
        const { nomePet, data, hora, servicos } = req.body;
        
        const data_hora = new Date(`${data}T${hora}:00`);

        // --- Lógica para o SERVIÇO ---
        const nomeDoPrimeiroServico = servicos[0]?.nomeServico;
        
        if (!nomeDoPrimeiroServico) {
             return res.status(400).json({ error: "Nenhum serviço foi selecionado." });
        }

        const servicoExistente = await prisma.servico.findFirst({
             where: { nome: nomeDoPrimeiroServico }
        });

        let servico;
        if (servicoExistente) {
             servico = servicoExistente;
        } else {
             // Cria um novo serviço se ele não existe
             servico = await prisma.servico.create({
                 data: {
                     nome: nomeDoPrimeiroServico,
                     descricao: "Descrição padrão", 
                     preco: 0, 
                     duracao: 30,
                 }
             });
        }
        
        // --- Cria o AGENDAMENTO ---
        const appointment = await prisma.agendamento.create({
            data: {
                cliente_id: clienteId, // Usa o ID do cliente logado
                servico_id: servico.id,
                nome_pet: nomePet,
                data_hora: data_hora,
            }
        });
        
        res.status(201).json(appointment);
    } catch (error) {
        console.error("Erro na criação do agendamento:", error); 
        res.status(500).json({ 
            error: "Não foi possível criar o agendamento.",
            details: error.message
        });
    }
};

// =========================================================
// 2. LISTAR AGENDAMENTOS
// =========================================================
export const getAllAppointments = async (req, res) => {
    try {
        // Se esta rota for só para o Admin, a lógica está OK.
        // Se for para o cliente, você deve filtrar por: where: { cliente_id:  parseInt(req.usuarioId) }
        const appointments = await prisma.agendamento.findMany({
            include: {
                cliente: { select: { id: true, nome: true, email: true } },
                servico: true 
            }
        });
        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Não foi possível buscar os agendamentos." });
    }
};

// =========================================================
// 3. BUSCAR AGENDAMENTO POR ID
// =========================================================
export const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await prisma.agendamento.findUnique({
            where: { id: parseInt(id) },
            include: { cliente: true, servico: true }
        });

        if (!appointment) {
            return res.status(404).json({ error: "Agendamento não encontrado." });
        }
        res.status(200).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Não foi possível buscar o agendamento." });
    }
};

// =========================================================
// 4. ATUALIZAR AGENDAMENTO
// =========================================================
export const updateAppointment = async (req, res) => {
    try {
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Não foi possível atualizar o agendamento." });
    }
};

// =========================================================
// 5. DELETAR AGENDAMENTO
// =========================================================
export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.agendamento.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send(); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Não foi possível deletar o agendamento." });
    }
};