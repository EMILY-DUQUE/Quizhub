const pool = require('../config/db');

const RankingModel = {
  // Obtener ranking global (top usuarios)
  getGlobalRanking: async (limit = 10) => {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.total_score,
        COUNT(DISTINCT qa.id) AS total_attempts,
        SUM(CASE WHEN qa.status = 'completed' THEN 1 ELSE 0 END) AS completed_attempts,
        SUM(qa.total_points) AS points_from_attempts,
        ROUND(100.0 * SUM(CASE WHEN qa.status = 'completed' THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT qa.id), 0), 2) AS completion_rate
      FROM users u
      LEFT JOIN quiz_attempts qa ON u.id = qa.user_id
      GROUP BY u.id, u.username, u.total_score
      ORDER BY u.total_score DESC, u.username ASC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  },

  // Obtener ranking por categoría
  getRankingByCategory: async (categoryId, limit = 10) => {
    const query = `
      SELECT 
        u.id,
        u.username,
        SUM(qa.total_points) AS points_in_category,
        COUNT(DISTINCT qa.id) AS attempts_in_category,
        SUM(CASE WHEN qa.status = 'completed' THEN 1 ELSE 0 END) AS completed_in_category,
        ROUND(100.0 * SUM(CASE WHEN qa.status = 'completed' THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT qa.id), 0), 2) AS accuracy
      FROM users u
      LEFT JOIN quiz_attempts qa ON u.id = qa.user_id AND qa.category_id = $1
      GROUP BY u.id, u.username
      HAVING SUM(qa.total_points) > 0 OR COUNT(DISTINCT qa.id) > 0
      ORDER BY points_in_category DESC, u.username ASC
      LIMIT $2
    `;
    const result = await pool.query(query, [categoryId, limit]);
    return result.rows;
  },

  // Obtener posición de un usuario en ranking global
  getUserGlobalPosition: async (userId) => {
    const query = `
      SELECT 
        position,
        username,
        total_score,
        total_attempts,
        completed_attempts
      FROM (
        SELECT 
          ROW_NUMBER() OVER (ORDER BY u.total_score DESC) AS position,
          u.id,
          u.username,
          u.total_score,
          COUNT(DISTINCT qa.id) AS total_attempts,
          SUM(CASE WHEN qa.status = 'completed' THEN 1 ELSE 0 END) AS completed_attempts
        FROM users u
        LEFT JOIN quiz_attempts qa ON u.id = qa.user_id
        GROUP BY u.id, u.username, u.total_score
      ) AS ranked
      WHERE id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  },

  // Obtener estadísticas generales
  getGeneralStats: async () => {
    const query = `
      SELECT 
        COUNT(DISTINCT u.id) AS total_users,
        COUNT(DISTINCT qa.id) AS total_attempts,
        SUM(CASE WHEN qa.status = 'completed' THEN 1 ELSE 0 END) AS completed_attempts,
        SUM(ua.points_earned) AS total_points_distributed,
        ROUND(AVG(u.total_score), 2) AS avg_user_score
      FROM users u
      LEFT JOIN quiz_attempts qa ON u.id = qa.user_id
      LEFT JOIN user_answers ua ON u.id = ua.user_id
    `;
    const result = await pool.query(query);
    return result.rows[0];
  },

  // Obtener usuarios con streak (jugadores activos)
  getActiveUsers: async (daysBack = 7, limit = 10) => {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.total_score,
        COUNT(DISTINCT qa.id) AS recent_attempts,
        MAX(qa.completed_at) AS last_played,
        SUM(CASE WHEN qa.status = 'completed' THEN qa.total_points ELSE 0 END) AS recent_points
      FROM users u
      LEFT JOIN quiz_attempts qa ON u.id = qa.user_id 
        AND qa.completed_at >= NOW() - INTERVAL '1 day' * $1
      WHERE qa.id IS NOT NULL
      GROUP BY u.id, u.username, u.total_score
      ORDER BY recent_points DESC, last_played DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [daysBack, limit]);
    return result.rows;
  }
};

module.exports = RankingModel;