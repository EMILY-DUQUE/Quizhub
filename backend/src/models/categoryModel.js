// src/models/categoryModel.js
const pool = require('../config/db');

const CategoryModel = {
  // Obtener todas las categorías
  getAll: async () => {
    const query = `
      SELECT id, name, description, created_at, updated_at
      FROM categories
      ORDER BY id ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Obtener categoría por ID
  getById: async (id) => {
    const query = `
      SELECT id, name, description, created_at, updated_at
      FROM categories
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Obtener categoría por nombre (para evitar duplicados)
  getByName: async (name) => {
    const query = `
      SELECT id, name, description, created_at, updated_at
      FROM categories
      WHERE LOWER(name) = LOWER($1)
    `;
    const result = await pool.query(query, [name]);
    return result.rows[0];
  },

  // Crear una nueva categoría
  create: async (name, description = null) => {
    const query = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING id, name, description, created_at, updated_at
    `;
    const result = await pool.query(query, [name, description]);
    return result.rows[0];
  },

  // Actualizar una categoría existente
  update: async (id, name, description = null) => {
    const query = `
      UPDATE categories
      SET name = $1,
          description = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, name, description, created_at, updated_at
    `;
    const result = await pool.query(query, [name, description, id]);
    return result.rows[0];
  },

  // Eliminar una categoría
  delete: async (id) => {
    const query = `
      DELETE FROM categories
      WHERE id = $1
      RETURNING id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = CategoryModel;
