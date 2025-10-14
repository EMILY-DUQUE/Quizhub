// src/models/categoryModel.js
const pool = require('../config/db');

const CategoryModel = {
  // Obtener todas las categorías
  getAll: async () => {
    const query = 'SELECT * FROM categories ORDER BY name ASC';
    const result = await pool.query(query);
    return result.rows;
  },

  // Obtener categoría por ID
  getById: async (id) => {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Obtener categoría por nombre
  getByName: async (name) => {
    const query = 'SELECT * FROM categories WHERE name = $1';
    const result = await pool.query(query, [name]);
    return result.rows[0];
  },

  // Crear nueva categoría
  create: async (name, description, icon, color) => {
    const query = `
      INSERT INTO categories (name, description,  color)
      VALUES ($1, $2, $3  )
      RETURNING *
    `;
    const result = await pool.query(query, [name, description, color]);
    return result.rows[0];
  },

  // Actualizar categoría
  update: async (id, name, description, icon, color) => {
    const query = `
      UPDATE categories
      SET name = $2, description =  $4, color = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id, name, description, icon, color]);
    return result.rows[0];
  },

  // Eliminar categoría
  delete: async (id) => {
    const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = CategoryModel;