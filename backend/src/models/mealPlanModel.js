const db = require('../config/db');

const MealPlanModel = {
  async create({ patientId, nutritionistId, title, description, caloriesTarget }) {
    const [result] = await db.query(
      `INSERT INTO meal_plans (patient_id, nutritionist_id, title, description, calories_target)
       VALUES (?, ?, ?, ?, ?)`,
      [patientId, nutritionistId, title, description, caloriesTarget || null]
    );
    return result.insertId;
  },
  async listByPatient(patientId) {
    const [rows] = await db.query(
      'SELECT * FROM meal_plans WHERE patient_id = ? ORDER BY created_at DESC', [patientId]
    );
    return rows;
  },
  async findById(id) {
    const [rows] = await db.query('SELECT * FROM meal_plans WHERE id = ?', [id]);
    return rows[0];
  },
  async update(id, fields) {
    const allowed = ['title', 'description', 'calories_target', 'active'];
    const sets = []; const values = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) { sets.push(`${key} = ?`); values.push(fields[key]); }
    }
    if (sets.length === 0) return;
    values.push(id);
    await db.query(`UPDATE meal_plans SET ${sets.join(', ')} WHERE id = ?`, values);
  },
  async remove(id) {
    await db.query('DELETE FROM meal_plans WHERE id = ?', [id]);
  }
};

module.exports = MealPlanModel;
