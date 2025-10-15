// src/models/questionModel.js
const pool = require('../config/db');

const QuestionModel = {
  // Crear una pregunta
  create: async (categoryId, title, type, correctAnswer, points = 10, createdBy = null) => {
    const query = `
      INSERT INTO questions (category_id, title, type, correct_answer, points, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, category_id, title, type, correct_answer, points, created_by, created_at, updated_at
    `;
    const result = await pool.query(query, [categoryId, title, type, correctAnswer, points, createdBy]);
    return result.rows[0];
  },

  // Crear opciones para pregunta (multiple choice)
  createOptions: async (questionId, options) => {
    const query = `
      INSERT INTO question_options (question_id, option_text, is_correct, order_index)
      VALUES ($1, $2, $3, $4)
      RETURNING id, question_id, option_text, is_correct, order_index
    `;
    
    const optionResults = [];
    for (let i = 0; i < options.length; i++) {
      const result = await pool.query(query, [questionId, options[i], false, i + 1]);
      optionResults.push(result.rows[0]);
    }
    return optionResults;
  },

  // Obtener todas las preguntas (admin)
  getAll: async () => {
    const query = `
      SELECT id, category_id, title, type, correct_answer, points, created_by, created_at, updated_at
      FROM questions
      ORDER BY category_id, created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Obtener preguntas de una categoría (para jugador - sin respuesta correcta)
  getByCategory: async (categoryId) => {
    const query = `
      SELECT id, category_id, title, type, points
      FROM questions
      WHERE category_id = $1
      ORDER BY created_at ASC
    `;
    const result = await pool.query(query, [categoryId]);
    return result.rows;
  },

  // Obtener una pregunta específica (con respuesta - solo admin/después de jugar)
  getById: async (id) => {
    const query = `
      SELECT id, category_id, title, type, correct_answer, points, created_by, created_at, updated_at
      FROM questions
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Obtener opciones de una pregunta
  getOptions: async (questionId) => {
    const query = `
      SELECT id, question_id, option_text, is_correct, order_index
      FROM question_options
      WHERE question_id = $1
      ORDER BY order_index ASC
    `;
    const result = await pool.query(query, [questionId]);
    return result.rows;
  },

  // Actualizar pregunta
  update: async (id, title, type, correctAnswer, points) => {
    const query = `
      UPDATE questions
      SET title = $1, type = $2, correct_answer = $3, points = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, category_id, title, type, correct_answer, points, created_by, created_at, updated_at
    `;
    const result = await pool.query(query, [title, type, correctAnswer, points, id]);
    return result.rows[0];
  },

  // Eliminar pregunta
  delete: async (id) => {
    const query = `
      DELETE FROM questions
      WHERE id = $1
      RETURNING id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Crear múltiples preguntas (para importación en lote)
  createMany: async (questionsData) => {
    const createdQuestions = [];
    
    for (const question of questionsData) {
      try {
        // Crear la pregunta (usar QuestionModel en lugar de this)
        const newQuestion = await QuestionModel.create(
          question.category_id,
          question.title,
          question.type,
          question.correct_answer,
          question.points || 10,
          question.created_by || null
        );

        // Si es multiple_choice, crear las opciones
        if (question.type === 'multiple_choice' && question.options && question.options.length > 0) {
          const options = await QuestionModel.createOptions(newQuestion.id, question.options);
          newQuestion.options = options;
        }

        createdQuestions.push(newQuestion);
      } catch (error) {
        console.error(` Error creando pregunta: ${question.title}`, error);
        throw error;
      }
    }

    return createdQuestions;
  }
};

module.exports = QuestionModel;