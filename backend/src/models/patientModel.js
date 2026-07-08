const db = require('../config/db');

const PatientModel = {
  async create({ userId, nutritionistId, birthDate, phone, heightCm, initialWeight, goal }) {
    const [result] = await db.query(
      `INSERT INTO patients (user_id, nutritionist_id, birth_date, phone, height_cm, initial_weight, goal)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, nutritionistId || null, birthDate || null, phone || null, heightCm || null, initialWeight || null, goal || null]
    );
    return result.insertId;
  },
  async findByUserId(userId) {
    const [rows] = await db.query('SELECT * FROM patients WHERE user_id = ?', [userId]);
    return rows[0];
  },
  async findById(id) {
    const [rows] = await db.query(
      `SELECT p.*, u.name, u.email FROM patients p JOIN users u ON u.id = p.user_id WHERE p.id = ?`, [id]
    );
    return rows[0];
  },
  async listByNutritionist(nutritionistId) {
    const [rows] = await db.query(
      `SELECT p.*, u.name, u.email FROM patients p JOIN users u ON u.id = p.user_id
       WHERE p.nutritionist_id = ? ORDER BY u.name`, [nutritionistId]
    );
    return rows;
  },
  async listAll() {
    const [rows] = await db.query(
      `SELECT p.*, u.name, u.email FROM patients p JOIN users u ON u.id = p.user_id ORDER BY u.name`
    );
    return rows;
  },
  async listUnclaimed() {
    const [rows] = await db.query(
      `SELECT p.*, u.name, u.email FROM patients p JOIN users u ON u.id = p.user_id
       WHERE p.nutritionist_id IS NULL ORDER BY u.name`
    );
    return rows;
  },
  async update(id, fields) {
    const allowed = ['nutritionist_id', 'birth_date', 'phone', 'height_cm', 'initial_weight', 'goal'];
    const sets = []; const values = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) { sets.push(`${key} = ?`); values.push(fields[key]); }
    }
    if (sets.length === 0) return;
    values.push(id);
    await db.query(`UPDATE patients SET ${sets.join(', ')} WHERE id = ?`, values);
  }
};

module.exports = PatientModel;