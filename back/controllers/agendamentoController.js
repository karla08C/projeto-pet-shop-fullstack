import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const createAppointment = async (req, res) => {
  try {
    const { cliente_id, servico_id, nome_pet, data_hora } = req.body;
    const appointment = await prisma.agendamento.create({
      data: {
        cliente_id,
        servico_id,
        nome_pet,
        data_hora: new Date(data_hora)
      }
    });
    res.status(201).json(appointment);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: "Não foi possível criar o agendamento." });
  }
};


export const getAllAppointments = async (req, res) => {
  try {
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