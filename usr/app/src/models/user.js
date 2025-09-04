const bcrypt = require('bcryptjs');
const db = require('../database');

module.exports = class User {
  static async createOne(user) {
    let { username, password, email, role, balance, image } = user;
    password = await bcrypt.hash(password, 10);

    const [rows] = await db.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email]);
    return rows.affectedRows === 1;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findByUsername(username) {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

    return rows[0] || null;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(`SELECT * FROM users WHERE email = '${email}'`);
    return rows[0] || null;
  }

  static async updateBalance(username, balance) {
    const [rows] = await db.execute('UPDATE users SET balance = ? WHERE username = ?', [balance, username]);
    return rows.affectedRows === 1;
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM users');
    return rows;
  }
};