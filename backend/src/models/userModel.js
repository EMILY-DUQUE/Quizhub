const pool = require('../db');

const UserModel = {
   //Obtener todos los usuarios
 
  getAll: async () => {
    const query = 'SELECT id, username, email, total_score, created_at FROM users ORDER BY total_score DESC';
    const result = await pool.query(query);
    return result.rows;
  },

  //Obtener usuario por ID

  getById: async (id) => {
    const query = 'SELECT id, username, email, total_score, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Obtener usuario por email
  getByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  //Obtener usuario por username
  getByUsername: async (username) => {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  },

   //Crear nuevo usuario
   
  create: async (username, email, hashedPassword) => {
    const query = `
      INSERT INTO users (username, email, password_hash) 
      VALUES ($1, $2, $3) 
      RETURNING id, username, email, total_score, created_at
    `;
    const result = await pool.query(query, [username, email, hashedPassword]);
    return result.rows[0];
  },

   //Actualizar score del usuario

  updateScore: async (userId, newScore) => {
    const query = 'UPDATE users SET total_score = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [newScore, userId]);
    return result.rows[0];
  }
};

module.exports = UserModel;