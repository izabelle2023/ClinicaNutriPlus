const db = require('../config/db');

const EvolutionModel = {
  async create({ patientId, recordDate, weight, bodyFat, waistCm, notes }) {
    const [result] = await db.query(
      `INSERT INTO evolutions (patient_id, record_date, weight, body_fat, waist_cm, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [patientId, recordDate, weight || null, bodyFat || null, waistCm || null, notes || null]
    );
    return result.insertId;
  },
  async listByPatient(patientId) {
    const [rows] = await db.query(
      'SELECT * FROM evolutions WHERE patient_id = ? ORDER BY record_date ASC', [patientId]
    );
    return rows;
  },
  async remove(id) {
    await db.query('DELETE FROM evolutions WHERE id = ?', [id]);
  }
};

module.exports = EvolutionModel;
