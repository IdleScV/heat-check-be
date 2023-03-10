const sql = require('sql-template-strings');
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const db = require('./db');

module.exports = {
  async create(email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const {rows} = await db.query(sql`
      INSERT INTO users (id, email, password)
        VALUES (${uuidv4()}, ${email}, ${hashedPassword})
        RETURNING id, email;
      `);

      const [user] = rows;
      return user;
    } catch (error) {
      if (error.constraint === 'users_email_key') {
        return null;
      }

      throw error;
    }
  },
  async findByEmail(email) {
    const {rows} = await db.query(sql`
    SELECT * FROM users WHERE email=${email} LIMIT 1;
    `);
    return rows[0];
  },
  async findById(id) {
    const {rows} = await db.query(sql`
    SELECT id, email FROM users WHERE id=${id} LIMIT 1;
    `);
    return rows[0];
  },
  async update(id, email, password) {
    const {rows} = await db.query(sql`
    UPDATE users SET email=${email}, password=${password} WHERE id=${id} RETURNING id, email;
    `);
    return rows[0];
  }
};
