const db = require('../database');

module.exports = class Product {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM products');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [
      id,
    ]);
    return rows[0] || null;
  }
};