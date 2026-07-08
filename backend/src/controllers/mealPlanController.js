const MealPlanModel = require('../models/mealPlanModel');
const PatientModel = require('../models/patientModel');

module.exports = {
  async create(req, res) {
    try {
      if (req.user.role !== 'nutricionista') {
        return res.status(403).json({ error: 'Apenas nutricionistas podem criar planos alimentares.' });
      }
      const { patientId, title, description, caloriesTarget } = req.body;
      if (!patientId || !title || !description) {
        return res.status(400).json({ error: 'Informe patientId, title e description.' });
      }
      const id = await MealPlanModel.create({ patientId, nutritionistId: req.user.id, title, description, caloriesTarget });
      const plan = await MealPlanModel.findById(id);
      return res.status(201).json(plan);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao criar plano alimentar.' });
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
      const plans = await MealPlanModel.listByPatient(patientId);
      return res.json(plans);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao listar planos alimentares.' });
    }
  },

  async update(req, res) {
    try {
      await MealPlanModel.update(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        calories_target: req.body.caloriesTarget,
        active: req.body.active
      });
      const updated = await MealPlanModel.findById(req.params.id);
      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao atualizar plano alimentar.' });
    }
  },

  async remove(req, res) {
    try {
      await MealPlanModel.remove(req.params.id);
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao remover plano alimentar.' });
    }
  }
};
