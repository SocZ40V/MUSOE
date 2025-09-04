const db = require('../database');

module.exports = class Ticket {
  static async createOne(user_id, subject, description) {
    const [rows] = await db.execute('INSERT INTO tickets (user_id, subject, description) VALUES (?, ?, ?)', [user_id, subject, description]);
    return rows.affectedRows === 1;
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM tickets ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM tickets WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findDetailById(id) {
    const [rows] = await db.execute(
      ` SELECT 
          tickets.*,
          users.username as user_name,
          users.email as user_email, 
          users.image as user_image
        FROM tickets 
        JOIN users ON tickets.user_id = users.id 
        WHERE tickets.id = ?`,
      [id]
    );
    return rows[0] || null;
  }
};