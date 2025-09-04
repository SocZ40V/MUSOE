const db = require('../database');
module.exports = class Order {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM orders ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM orders WHERE hash_id = ?', [id]);
    return rows[0];
  }

  static async findByUserId(id) {
    const [rows] = await db.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [id]);
    return rows;
  }

  static async findDetailById(id) {
    const [rows] = await db.execute(
      `SELECT orders.id, orders.note, products.price, orders.created_at,
       products.id as product_id, products.name as product_name, products.image as product_image, 
       users.username as user_name, users.email as user_email, users.image as user_image 
      FROM orders
      JOIN products ON orders.product_id = products.id
      JOIN users ON orders.user_id = users.id
      WHERE orders.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async createOne(userId, productId, note) {
    const [rows] = await db.execute('INSERT INTO orders (user_id, product_id, note) VALUES (?, ?, ?)', [
      userId,
      productId,
      note,
    ]);
    return rows.affectedRows === 1;
  }
};