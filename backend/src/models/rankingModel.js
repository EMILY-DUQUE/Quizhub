// backend/src/models/rankingModel.js
const pool = require('../config/db');

const RankingModel = {
  /**
   * ✅ Ranking Global - Calcula desde quiz_attempts
   */
 getGlobalRanking: async (limit = 50) => {
    const query = `
      SELECT 
        u.id,
        u.username,
        COALESCE(SUM(ua.points_earned), 0) AS total_points,
        COALESCE(SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END), 0) AS correct_answers,
        COUNT(ua.*) AS total_answers
      FROM users u
      LEFT JOIN user_answers ua ON ua.user_id = u.id
      GROUP BY u.id, u.username
      ORDER BY total_points DESC
      LIMIT $1;
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  },

  /**
   * ✅ Ranking por Categoría
   */
  getRankingByCategory: async (categoryId, limit = 50) => {
    const query = `
      SELECT 
        u.id,
        u.username,
        COUNT(DISTINCT a.id) as total_answers,
        COUNT(DISTINCT CASE WHEN a.is_correct = TRUE THEN a.id END) as correct_answers,
        COALESCE(SUM(a.points_earned), 0) as total_points,
        CASE 
          WHEN COUNT(a.id) > 0 
          THEN ROUND((COUNT(CASE WHEN a.is_correct = TRUE THEN 1 END)::NUMERIC / COUNT(a.id)::NUMERIC) * 100, 2)
          ELSE 0 
        END as accuracy_percentage,
        COUNT(DISTINCT qa.id) FILTER (WHERE qa.status = 'completed') as quizzes_completed
      FROM users u
      INNER JOIN user_answers a ON u.id = a.user_id
      INNER JOIN questions q ON a.question_id = q.id
      LEFT JOIN quiz_attempts qa ON u.id = qa.user_id AND qa.category_id = $1
      WHERE q.category_id = $1
      GROUP BY u.id, u.username
      HAVING COUNT(a.id) > 0
      ORDER BY total_points DESC, accuracy_percentage DESC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [categoryId, limit]);
    return result.rows;
  },

  /**
   * ✅ Obtener posición global de un usuario
   */
  getUserGlobalPosition: async (userId) => {
    const query = `
      WITH ranked_users AS (
        SELECT 
          u.id,
          COALESCE(SUM(a.points_earned), 0) as total_points,
          CASE 
            WHEN COUNT(a.id) > 0 
            THEN ROUND((COUNT(CASE WHEN a.is_correct = TRUE THEN 1 END)::NUMERIC / COUNT(a.id)::NUMERIC) * 100, 2)
            ELSE 0 
          END as accuracy_percentage,
          COUNT(DISTINCT qa.id) FILTER (WHERE qa.status = 'completed') as quizzes_completed,
          ROW_NUMBER() OVER (
            ORDER BY 
              COALESCE(SUM(a.points_earned), 0) DESC,
              CASE 
                WHEN COUNT(a.id) > 0 
                THEN ROUND((COUNT(CASE WHEN a.is_correct = TRUE THEN 1 END)::NUMERIC / COUNT(a.id)::NUMERIC) * 100, 2)
                ELSE 0 
              END DESC,
              COUNT(DISTINCT qa.id) FILTER (WHERE qa.status = 'completed') DESC
          ) as position
        FROM users u
        LEFT JOIN user_answers a ON u.id = a.user_id
        LEFT JOIN quiz_attempts qa ON u.id = qa.user_id
        GROUP BY u.id
        HAVING COUNT(a.id) > 0
      )
      SELECT position, total_points, accuracy_percentage, quizzes_completed
      FROM ranked_users
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows[0]?.position || null;
  },

  /**
   * ✅ Estadísticas generales del sistema
   */
  getGeneralStats: async () => {
    const query = `
      SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT q.id) as total_questions,
        COUNT(DISTINCT c.id) as total_categories,
        COUNT(DISTINCT a.id) as total_answers,
        COUNT(DISTINCT qa.id) FILTER (WHERE qa.status = 'completed') as total_sessions_completed
      FROM users u
      CROSS JOIN questions q
      CROSS JOIN categories c
      LEFT JOIN user_answers a ON TRUE
      LEFT JOIN quiz_attempts qa ON TRUE
    `;
    
    const result = await pool.query(query);
    return result.rows[0];
  },

  /**
   * ✅ Usuarios más activos (últimos N días)
   */
  getActiveUsers: async (daysBack = 7, limit = 50) => {
    const query = `
      SELECT 
        u.id,
        u.username,
        COUNT(DISTINCT qa.id) FILTER (WHERE qa.status = 'completed') as quizzes_completed,
        COUNT(DISTINCT a.id) as total_answers,
        COALESCE(SUM(ua.points_earned), 0) as total_points,
        MAX(qa.completed_at) as last_activity
      FROM users u
      INNER JOIN quiz_attempts qa ON u.id = qa.user_id
      LEFT JOIN user_answers a ON u.id = a.user_id
      WHERE qa.completed_at >= NOW() - INTERVAL '${daysBack} days'
      GROUP BY u.id, u.username
      ORDER BY quizzes_completed DESC, total_points DESC
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    return result.rows;
  },

  /**
   * ✅ Obtener estadísticas completas de un usuario
   */
  getUserStats: async (userId) => {
    const query = `
      SELECT 
        u.id,
        u.username,
        COUNT(DISTINCT a.id) as total_answers,
        COUNT(DISTINCT CASE WHEN a.is_correct = TRUE THEN a.id END) as correct_answers,
        COALESCE(SUM(ua.points_earned), 0) as total_points,
        CASE 
          WHEN COUNT(a.id) > 0 
          THEN ROUND((COUNT(CASE WHEN a.is_correct = TRUE THEN 1 END)::NUMERIC / COUNT(a.id)::NUMERIC) * 100, 2)
          ELSE 0 
        END as accuracy_percentage,
        COUNT(DISTINCT qa.id) FILTER (WHERE qa.status = 'completed') as quizzes_completed,
        MAX(qa.completed_at) as last_quiz_date
      FROM users u
      LEFT JOIN user_answers a ON u.id = a.user_id
      LEFT JOIN quiz_attempts qa ON u.id = qa.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.username
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
};

module.exports = RankingModel;