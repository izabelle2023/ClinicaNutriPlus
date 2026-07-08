const db = require('../config/db');

const UserModel = {
  async create({ name, email, passwordHash, role }) {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, role]
    );
    return result.insertId;
  },
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]
    );
    return rows[0];
  },
  async listByRole(role) {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE role = ? ORDER BY name', [role]
    );
    return rows;
  }
};

module.exports = UserModel;
