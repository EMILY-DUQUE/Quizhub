// backend/src/controllers/rankingController.js
const RankingModel = require('../models/rankingModel');
const CategoryModel = require('../models/categoryModel');
const UserModel = require('../models/userModel');

const RankingController = {
  /**
   * ✅ GET /api/ranking - Ranking global
   */
  getGlobalRanking: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;

      console.log('📊 Obteniendo ranking global, limit:', limit);

      const ranking = await RankingModel.getGlobalRanking(limit);

      console.log('✅ Ranking obtenido:', ranking.length, 'usuarios');

      // Agregar posición
      const rankingWithPosition = ranking.map((user, index) => ({
        ...user,
        position: index + 1,
        // ✅ Asegurar que los valores numéricos sean números
        total_answers: parseInt(user.total_answers) || 0,
        correct_answers: parseInt(user.correct_answers) || 0,
        total_points: parseInt(user.total_points) || 0,
        accuracy_percentage: parseFloat(user.accuracy_percentage) || 0,
        quizzes_completed: parseInt(user.quizzes_completed) || 0
      }));

      res.json({
        success: true,
        data: {
          ranking: rankingWithPosition,
          count: rankingWithPosition.length
        }
      });

    } catch (error) {
      console.error('❌ Error en getGlobalRanking:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando ranking',
        error: error.message
      });
    }
  },

  /**
   * ✅ GET /api/ranking/category/:categoryId - Ranking por categoría
   */
  getRankingByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const limit = parseInt(req.query.limit) || 50;

      // Verificar categoría
      const category = await CategoryModel.getById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
      }

      const ranking = await RankingModel.getRankingByCategory(categoryId, limit);

      // Agregar posición
      const rankingWithPosition = ranking.map((user, index) => ({
        ...user,
        position: index + 1,
        total_answers: parseInt(user.total_answers) || 0,
        correct_answers: parseInt(user.correct_answers) || 0,
        total_points: parseInt(user.total_points) || 0,
        accuracy_percentage: parseFloat(user.accuracy_percentage) || 0
      }));

      res.json({
        success: true,
        data: {
          category: { id: category.id, name: category.name },
          ranking: rankingWithPosition,
          count: rankingWithPosition.length
        }
      });

    } catch (error) {
      console.error('❌ Error en getRankingByCategory:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando ranking',
        error: error.message
      });
    }
  },

  /**
   * ✅ GET /api/ranking/user/:userId - Posición de usuario
   */
  getUserPosition: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await UserModel.getById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      const position = await RankingModel.getUserGlobalPosition(userId);

      res.json({
        success: true,
        data: { 
          position: position || null,
          user: {
            id: user.id,
            username: user.username
          }
        }
      });

    } catch (error) {
      console.error('❌ Error en getUserPosition:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando posición',
        error: error.message
      });
    }
  },

  /**
   * ✅ GET /api/stats/global - Estadísticas generales
   */
  getGeneralStats: async (req, res) => {
    try {
      const stats = await RankingModel.getGeneralStats();

      res.json({
        success: true,
        data: { stats }
      });

    } catch (error) {
      console.error('❌ Error en getGeneralStats:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando estadísticas',
        error: error.message
      });
    }
  },

  /**
   * ✅ GET /api/ranking/active - Usuarios activos
   */
  getActiveUsers: async (req, res) => {
    try {
      const daysBack = parseInt(req.query.days) || 7;
      const limit = parseInt(req.query.limit) || 50;

      const activeUsers = await RankingModel.getActiveUsers(daysBack, limit);

      // Agregar posición
      const usersWithPosition = activeUsers.map((user, index) => ({
        ...user,
        position: index + 1,
        quizzes_completed: parseInt(user.quizzes_completed) || 0,
        total_answers: parseInt(user.total_answers) || 0,
        total_points: parseInt(user.total_points) || 0
      }));

      res.json({
        success: true,
        data: {
          period_days: daysBack,
          active_users: usersWithPosition,
          count: usersWithPosition.length
        }
      });

    } catch (error) {
      console.error('❌ Error en getActiveUsers:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando usuarios activos',
        error: error.message
      });
    }
  }
};

module.exports = RankingController;