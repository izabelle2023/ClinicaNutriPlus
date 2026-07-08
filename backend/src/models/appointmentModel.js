const db = require('../config/db');

const AppointmentModel = {
  async create({ patientId, nutritionistId, dateTime, notes }) {
    const [result] = await db.query(
      `INSERT INTO appointments (patient_id, nutritionist_id, date_time, notes) VALUES (?, ?, ?, ?)`,
      [patientId, nutritionistId, dateTime, notes || null]
    );
    return result.insertId;
  },
  async listByPatient(patientId) {
    const [rows] = await db.query(
      `SELECT a.*, u.name AS nutritionist_name FROM appointments a JOIN users u ON u.id = a.nutritionist_id
       WHERE a.patient_id = ? ORDER BY a.date_time DESC`, [patientId]
    );
    return rows;
  },
  async listByNutritionist(nutritionistId) {
    const [rows] = await db.query(
      `SELECT a.*, u.name AS patient_name FROM appointments a
       JOIN patients p ON p.id = a.patient_id JOIN users u ON u.id = p.user_id
       WHERE a.nutritionist_id = ? ORDER BY a.date_time DESC`, [nutritionistId]
    );
    return rows;
  },
  async updateStatus(id, status) {
    await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
  },
  async findById(id) {
    const [rows] = await db.query('SELECT * FROM appointments WHERE id = ?', [id]);
    return rows[0];
  },
  async remove(id) {
    await db.query('DELETE FROM appointments WHERE id = ?', [id]);
  }
};

module.exports = AppointmentModel;
