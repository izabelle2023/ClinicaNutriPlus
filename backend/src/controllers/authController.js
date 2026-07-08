const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const PatientModel = require('../models/patientModel');

module.exports = {
  async register(req, res) {
    try {
      const { name, email, password, role, birthDate, phone, heightCm, initialWeight, goal, nutritionistId } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Campos obrigatorios: name, email, password, role.' });
      }
      if (!['nutricionista', 'paciente'].includes(role)) {
        return res.status(400).json({ error: 'Role invalido. Use "nutricionista" ou "paciente".' });
      }

      const existing = await UserModel.findByEmail(email);
      if (existing) return res.status(409).json({ error: 'Ja existe um usuario com este e-mail.' });

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = await UserModel.create({ name, email, passwordHash, role });

      if (role === 'paciente') {
        await PatientModel.create({
          userId, nutritionistId: nutritionistId || null, birthDate, phone, heightCm, initialWeight, goal
        });
      }

      const user = await UserModel.findById(userId);
      // Sem JWT: o frontend guarda o usuario retornado e passa o id
      // no header "x-user-id" nas proximas requisicoes.
      return res.status(201).json({ user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao registrar usuario.' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Informe email e senha.' });

      const user = await UserModel.findByEmail(email);
      if (!user) return res.status(401).json({ error: 'Credenciais invalidas.' });

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) return res.status(401).json({ error: 'Credenciais invalidas.' });

      delete user.password_hash;
      return res.json({ user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao efetuar login.' });
    }
  },

  async me(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'Usuario nao encontrado.' });
      let patient = null;
      if (user.role === 'paciente') patient = await PatientModel.findByUserId(user.id);
      return res.json({ user, patient });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar usuario.' });
    }
  },

  async listNutritionists(req, res) {
    try {
      const nutritionists = await UserModel.listByRole('nutricionista');
      return res.json(nutritionists);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao listar nutricionistas.' });
    }
  }
};
