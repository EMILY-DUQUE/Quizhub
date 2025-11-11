// backend/src/controllers/sessionController.js
const SessionModel = require('../models/sessionModel');
const UserModel = require('../models/userModel');
const CategoryModel = require('../models/categoryModel');
const QuestionModel = require('../models/questionModel');
const RankingModel = require('../models/rankingModel'); // ✅ NUEVO

const SessionController = {
  // POST /api/sessions/start
  start: async (req, res) => {
    try {
      const { user_id, category_id } = req.body;

      if (!user_id || !category_id) {
        return res.status(400).json({
          success: false,
          message: 'Los campos user_id y category_id son obligatorios'
        });
      }

      const user = await UserModel.getById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      const category = await CategoryModel.getById(category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
      }

      const questions = await QuestionModel.getByCategory(category_id);
      if (questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No hay preguntas disponibles en esta categoría'
        });
      }

      const session = await SessionModel.create(user_id, category_id, questions.length);

      res.status(201).json({
        success: true,
        message: '✅ Sesión iniciada',
        data: {
          session,
          category: { id: category.id, name: category.name },
          questions_count: questions.length
        }
      });

    } catch (error) {
      console.error('❌ Error en start:', error);
      res.status(500).json({
        success: false,
        message: 'Error iniciando sesión',
        error: error.message
      });
    }
  },

  // GET /api/sessions/:id
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const session = await SessionModel.getById(id);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Sesión no encontrada'
        });
      }

      const category = await CategoryModel.getById(session.category_id);

      const percentage = session.total_questions > 0 
        ? Math.round((session.current_question_index / session.total_questions) * 100)
        : 0;

      res.json({
        success: true,
        data: {
          session,
          category: { id: category.id, name: category.name },
          progress: {
            current_question: session.current_question_index,
            total_questions: session.total_questions,
            percentage: percentage
          }
        }
      });

    } catch (error) {
      console.error('❌ Error en getById:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando sesión',
        error: error.message
      });
    }
  },

  // POST /api/sessions/:id/answer
  answerQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const { question_id, selected_answer, is_correct, points_earned } = req.body;

      if (!question_id || selected_answer === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Los campos question_id y selected_answer son obligatorios'
        });
      }

      const session = await SessionModel.getById(id);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Sesión no encontrada'
        });
      }

      if (session.status !== 'in_progress') {
        return res.status(400).json({
          success: false,
          message: 'La sesión no está en progreso'
        });
      }

      const newCorrectAnswers = session.correct_answers + (is_correct ? 1 : 0);
      const newTotalPoints = session.total_points + (points_earned || 0);
      const newQuestionIndex = session.current_question_index + 1;

      const updatedSession = await SessionModel.updateProgress(
        id,
        newCorrectAnswers,
        newTotalPoints,
        newQuestionIndex
      );

      res.json({
        success: true,
        message: '✅ Respuesta registrada',
        data: {
          session: updatedSession,
          feedback: {
            is_correct: is_correct,
            points_earned: points_earned || 0
          }
        }
      });

    } catch (error) {
      console.error('❌ Error en answerQuestion:', error);
      res.status(500).json({
        success: false,
        message: 'Error registrando respuesta',
        error: error.message
      });
    }
  },

  // ✅ POST /api/sessions/:id/complete - ACTUALIZADO
  complete: async (req, res) => {
    try {
      const { id } = req.params;

      const session = await SessionModel.getById(id);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Sesión no encontrada'
        });
      }

      if (session.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'La sesión ya está completada'
        });
      }

      // 1. Completar sesión
      const completedSession = await SessionModel.complete(id);

      // 2. Calcular estadísticas
      const accuracy = session.total_questions > 0
        ? Math.round((session.correct_answers / session.total_questions) * 100)
        : 0;

      // ✅ 3. Obtener estadísticas actualizadas del usuario
      const userStats = await RankingModel.getUserStats(session.user_id);

      // ✅ 4. Obtener nueva posición en el ranking
      const userPosition = await RankingModel.getUserGlobalPosition(session.user_id);

      console.log('✅ Sesión completada');
      console.log('📊 Estadísticas:', userStats);
      console.log('🏆 Posición:', userPosition);

      res.json({
        success: true,
        message: '✅ Sesión completada',
        data: {
          session: completedSession,
          results: {
            total_questions: session.total_questions,
            correct_answers: session.correct_answers,
            total_points: session.total_points,
            accuracy: accuracy
          },
          user_stats: userStats, // ✅ Estadísticas actualizadas
          ranking_position: userPosition // ✅ Posición actualizada
        }
      });

    } catch (error) {
      console.error('❌ Error en complete:', error);
      res.status(500).json({
        success: false,
        message: 'Error completando sesión',
        error: error.message
      });
    }
  },

  // POST /api/sessions/:id/abandon
  abandon: async (req, res) => {
    try {
      const { id } = req.params;

      const session = await SessionModel.getById(id);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Sesión no encontrada'
        });
      }

      if (session.status !== 'in_progress') {
        return res.status(400).json({
          success: false,
          message: 'La sesión no está en progreso'
        });
      }

      const abandonedSession = await SessionModel.abandon(id);

      res.json({
        success: true,
        message: '🚪 Sesión abandonada',
        data: { session: abandonedSession }
      });

    } catch (error) {
      console.error('❌ Error en abandon:', error);
      res.status(500).json({
        success: false,
        message: 'Error abandonando sesión',
        error: error.message
      });
    }
  },

  // GET /api/sessions/user/:userId
  getByUserId: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await UserModel.getById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      const sessions = await SessionModel.getByUserId(userId);

      res.json({
        success: true,
        data: {
          user: { id: user.id, username: user.username },
          sessions,
          count: sessions.length
        }
      });

    } catch (error) {
      console.error('❌ Error en getByUserId:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando sesiones',
        error: error.message
      });
    }
  },

  // GET /api/sessions/user/:userId/completed
  getCompletedByUserId: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await UserModel.getById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      const sessions = await SessionModel.getCompletedByUserId(userId);

      res.json({
        success: true,
        data: {
          user: { id: user.id, username: user.username },
          sessions,
          count: sessions.length
        }
      });

    } catch (error) {
      console.error('❌ Error en getCompletedByUserId:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando sesiones',
        error: error.message
      });
    }
  }
};

module.exports = SessionController;