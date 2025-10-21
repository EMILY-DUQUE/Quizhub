const pool = require('../config/db');

const SessionModel = {
  // Crear nueva sesión
  create: async (userId, categoryId, totalQuestions) => {
    const query = `
      INSERT INTO quiz_attempts (user_id, category_id, total_questions)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, category_id, started_at, total_questions, correct_answers, total_points, status, current_question_index
    `;
    const result = await pool.query(query, [userId, categoryId, totalQuestions]);
    return result.rows[0];
  },

  // Obtener sesión por ID
  getById: async (id) => {
    const query = `
      SELECT id, user_id, category_id, started_at, completed_at, total_questions, correct_answers, total_points, status, current_question_index
      FROM quiz_attempts
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Obtener todas las sesiones de un usuario
  getByUserId: async (userId) => {
    const query = `
      SELECT 
        qa.id, 
        qa.user_id, 
        qa.category_id, 
        qa.started_at, 
        qa.completed_at, 
        qa.total_questions, 
        qa.correct_answers, 
        qa.total_points, 
        qa.status,
        c.name AS category_name
      FROM quiz_attempts qa
      JOIN categories c ON qa.category_id = c.id
      WHERE qa.user_id = $1
      ORDER BY qa.started_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // Obtener sesiones completadas de un usuario
  getCompletedByUserId: async (userId) => {
    const query = `
      SELECT 
        qa.id, 
        qa.user_id, 
        qa.category_id, 
        qa.started_at, 
        qa.completed_at, 
        qa.total_questions, 
        qa.correct_answers, 
        qa.total_points, 
        qa.status,
        c.name AS category_name
      FROM quiz_attempts qa
      JOIN categories c ON qa.category_id = c.id
      WHERE qa.user_id = $1 AND qa.status = 'completed'
      ORDER BY qa.started_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // Actualizar progreso de sesión
  updateProgress: async (id, correctAnswers, totalPoints, currentQuestionIndex) => {
    const query = `
      UPDATE quiz_attempts
      SET correct_answers = $1, total_points = $2, current_question_index = $3
      WHERE id = $4
      RETURNING id, user_id, category_id, started_at, completed_at, total_questions, correct_answers, total_points, status, current_question_index
    `;
    const result = await pool.query(query, [correctAnswers, totalPoints, currentQuestionIndex, id]);
    return result.rows[0];
  },

  // Completar sesión
  complete: async (id) => {
    const query = `
      UPDATE quiz_attempts
      SET status = 'completed', completed_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, user_id, category_id, started_at, completed_at, total_questions, correct_answers, total_points, status
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Abandonar sesión
  abandon: async (id) => {
    const query = `
      UPDATE quiz_attempts
      SET status = 'abandoned', completed_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, user_id, category_id, started_at, completed_at, status
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Obtener sesión activa de usuario
  getActiveSession: async (userId) => {
    const query = `
      SELECT id, user_id, category_id, started_at, total_questions, correct_answers, total_points, status, current_question_index
      FROM quiz_attempts
      WHERE user_id = $1 AND status = 'in_progress'
      LIMIT 1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
};

module.exports = SessionModel;