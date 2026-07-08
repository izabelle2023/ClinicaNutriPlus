const EvolutionModel = require('../models/evolutionModel');
const PatientModel = require('../models/patientModel');

module.exports = {
  async create(req, res) {
    try {
      if (req.user.role !== 'nutricionista') {
        return res.status(403).json({ error: 'Apenas nutricionistas podem registrar evolucao.' });
      }
      const { patientId, recordDate, weight, bodyFat, waistCm, notes } = req.body;
      if (!patientId || !recordDate) return res.status(400).json({ error: 'Informe patientId e recordDate.' });

      const id = await EvolutionModel.create({ patientId, recordDate, weight, bodyFat, waistCm, notes });
      const list = await EvolutionModel.listByPatient(patientId);
      const created = list.find((e) => e.id === id);
      return res.status(201).json(created);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao registrar evolucao.' });
    }
  },

  async listByPatient(req, res) {
    try {
      const patientId = req.params.patientId;
      if (req.user.role === 'paciente') {
        const patient = await PatientModel.findByUserId(req.user.id);
        if (!patient || String(patient.id) !== String(patientId)) {
          return res.status(403).json({ error: 'Acesso negado.' });
        }
      }
      const records = await EvolutionModel.listByPatient(patientId);
      return res.json(records);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao listar evolucao.' });
    }
  },

  async remove(req, res) {
    try {
      await EvolutionModel.remove(req.params.id);
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao remover registro.' });
    }
  }
};
