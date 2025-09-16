import prisma from "../prisma/client.js";

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await prisma.agendamento.findMany({ include: { servico: true } });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching appointments" });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { nome_pet, nome_dono, telefone, data_hora, servico_id } = req.body;
    const appointment = await prisma.agendamento.create({
      data: { nome_pet, nome_dono, telefone, data_hora: new Date(data_hora), servico_id }
    });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Error creating appointment" });
  }
};
