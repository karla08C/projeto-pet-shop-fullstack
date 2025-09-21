import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAppointment = async (req, res) => {
    try {
        // Recebe os dados do front-end
        const { nomeDono, telefoneContato, nomePet, data, hora, servicos, observacoes } = req.body;

        // Concatena a data e a hora para criar um objeto Date
        const data_hora = new Date(`${data}T${hora}:00`);
        
        // --- Lógica para o CLIENTE (agora chamado de USUARIO) ---
        // Busca um usuário existente pelo telefone ou cria um novo
        const usuarioExistente = await prisma.usuario.findFirst({
            where: { telefone: telefoneContato }
        });

        let usuario;
        if (usuarioExistente) {
            usuario = usuarioExistente;
        } else {
            // Cria um novo usuário com os dados do formulário
            usuario = await prisma.usuario.create({
                data: {
                    nome: nomeDono,
                    telefone: telefoneContato,
                    email: "email_nao_disponivel@exemplo.com", // Adicione lógica para obter email se disponível
                    senha: "senha_padrao_ou_hash",
                    tipo: "cliente",
                },
            });
        }

        // --- Lógica para o SERVICO ---
        // Pega apenas o primeiro serviço do array, pois o schema suporta apenas um
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
                    duracao: 30, // Duração padrão
                }
            });
        }
        
        // --- Cria o AGENDAMENTO ---
        const appointment = await prisma.agendamento.create({
            data: {
                cliente_id: usuario.id,
                servico_id: servico.id,
                nome_pet: nomePet,
                data_hora: data_hora,
                // O seu schema não tem um campo 'observacoes' no modelo Agendamento
                // Adicione-o se for necessário
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

export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await prisma.agendamento.findMany({
            include: {
                cliente: { select: { id: true, nome: true, email: true } },
                servico: true // Agora inclui diretamente o serviço, sem a tabela de união
            }
        });
        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Não foi possível buscar os agendamentos." });
    }
};

export const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await prisma.agendamento.findUnique({
            where: { id: parseInt(id) },
            include: { cliente: true, servico: true } // Inclui diretamente o serviço
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