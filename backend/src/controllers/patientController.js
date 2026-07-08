const PatientModel = require('../models/patientModel');

module.exports = {
  async list(req, res) {
    try {
      if (req.user.role !== 'nutricionista') {
        return res.status(403).json({ error: 'Apenas nutricionistas podem listar pacientes.' });
      }
      const patients = await PatientModel.listByNutritionist(req.user.id);
      return res.json(patients);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao listar pacientes.' });
    }
  },

  async listUnclaimed(req, res) {
    try {
      if (req.user.role !== 'nutricionista') {
        return res.status(403).json({ error: 'Apenas nutricionistas podem ver pacientes sem vinculo.' });
      }
      const patients = await PatientModel.listUnclaimed();
      return res.json(patients);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao listar pacientes sem vinculo.' });
    }
  },

  async getOne(req, res) {
    try {
      const patient = await PatientModel.findById(req.params.id);
      if (!patient) return res.status(404).json({ error: 'Paciente nao encontrado.' });
      if (req.user.role === 'paciente' && patient.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Acesso negado.' });
      }
      return res.json(patient);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar paciente.' });
    }
  },

  async update(req, res) {
    try {
      const patient = await PatientModel.findById(req.params.id);
      if (!patient) return res.status(404).json({ error: 'Paciente nao encontrado.' });

      await PatientModel.update(req.params.id, {
        nutritionist_id: req.body.nutritionistId,
        birth_date: req.body.birthDate,
        phone: req.body.phone,
        height_cm: req.body.heightCm,
        initial_weight: req.body.initialWeight,
        goal: req.body.goal
      });

      const updated = await PatientModel.findById(req.params.id);
      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao atualizar paciente.' });
    }
  },

  async claimPatient(req, res) {
    try {
      const patient = await PatientModel.findById(req.params.id);
      if (!patient) return res.status(404).json({ error: 'Paciente nao encontrado.' });
      await PatientModel.update(req.params.id, { nutritionist_id: req.user.id });
      const updated = await PatientModel.findById(req.params.id);
      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao vincular paciente.' });
    }
  }
};