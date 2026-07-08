const AppointmentModel = require('../models/appointmentModel');
const PatientModel = require('../models/patientModel');

module.exports = {
  async create(req, res) {
    try {
      const { patientId, dateTime, notes } = req.body;
      if (!patientId || !dateTime) return res.status(400).json({ error: 'Informe patientId e dateTime.' });
      if (req.user.role !== 'nutricionista') {
        return res.status(403).json({ error: 'Apenas nutricionistas podem agendar consultas.' });
      }
      const id = await AppointmentModel.create({ patientId, nutritionistId: req.user.id, dateTime, notes });
      const appointment = await AppointmentModel.findById(id);
      return res.status(201).json(appointment);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao criar consulta.' });
    }
  },

  async list(req, res) {
    try {
      let appointments;
      if (req.user.role === 'nutricionista') {
        appointments = await AppointmentModel.listByNutritionist(req.user.id);
      } else {
        const patient = await PatientModel.findByUserId(req.user.id);
        if (!patient) return res.json([]);
        appointments = await AppointmentModel.listByPatient(patient.id);
      }
      return res.json(appointments);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao listar consultas.' });
    }
  },

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!['agendada', 'concluida', 'cancelada'].includes(status)) {
        return res.status(400).json({ error: 'Status invalido.' });
      }
      await AppointmentModel.updateStatus(req.params.id, status);
      const updated = await AppointmentModel.findById(req.params.id);
      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao atualizar consulta.' });
    }
  },

  async remove(req, res) {
    try {
      await AppointmentModel.remove(req.params.id);
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao remover consulta.' });
    }
  }
};
