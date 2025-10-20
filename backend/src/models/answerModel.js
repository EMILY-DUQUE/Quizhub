const pool = require('../config/db');

const AnswerModel = {
  // Guardar respuesta de usuario
  create: async (userId, questionId, selectedAnswer, isCorrect, pointsEarned) => {
    const query = `
      INSERT INTO user_answers (user_id, question_id, selected_answer, is_correct, points_earned)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, question_id, selected_answer, is_correct, points_earned, answered_at
    `;
    const result = await pool.query(query, [userId, questionId, selectedAnswer, isCorrect, pointsEarned]);
    return result.rows[0];
  },

  // Obtener todas las respuestas de un usuario
  getByUserId: async (userId) => {
    const query = `
      SELECT 
        ua.id, 
        ua.user_id, 
        ua.question_id, 
        ua.selected_answer, 
        ua.is_correct, 
        ua.points_earned, 
        ua.answered_at,
        q.title AS question_title,
        c.name AS category_name
      FROM user_answers ua
      JOIN questions q ON ua.question_id = q.id
      JOIN categories c ON q.category_id = c.id
      WHERE ua.user_id = $1
      ORDER BY ua.answered_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // Obtener respuestas de una pregunta (admin - para ver qué respondieron todos)
  getByQuestionId: async (questionId) => {
    const query = `
      SELECT 
        ua.id, 
        ua.user_id, 
        ua.question_id, 
        ua.selected_answer, 
        ua.is_correct, 
        ua.points_earned, 
        ua.answered_at,
        u.username
      FROM user_answers ua
      JOIN users u ON ua.user_id = u.id
      WHERE ua.question_id = $1
      ORDER BY ua.answered_at DESC
    `;
    const result = await pool.query(query, [questionId]);
    return result.rows;
  },

  // Obtener una respuesta específica
  getById: async (id) => {
    const query = `
      SELECT 
        id, 
        user_id, 
        question_id, 
        selected_answer, 
        is_correct, 
        points_earned, 
        answered_at
      FROM user_answers
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Obtener estadísticas de un usuario
  getUserStats: async (userId) => {
    const query = `
      SELECT 
        COUNT(*) AS total_answers,
        SUM(CASE WHEN is_correct = true THEN 1 ELSE 0 END) AS correct_answers,
        SUM(points_earned) AS total_points,
        ROUND(100.0 * SUM(CASE WHEN is_correct = true THEN 1 ELSE 0 END) / COUNT(*), 2) AS accuracy_percentage
      FROM user_answers
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
};

module.exports = AnswerModel;