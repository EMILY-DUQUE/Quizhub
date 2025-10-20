const AnswerModel = require('../models/answerModel');
const QuestionModel = require('../models/questionModel');
const UserModel = require('../models/userModel');

const AnswerController = {
  // POST /api/answers - Guardar respuesta
  create: async (req, res) => {
    try {
      const { user_id, question_id, selected_answer } = req.body;

      // Validaciones
      if (!user_id || !question_id || !selected_answer) {
        return res.status(400).json({
          success: false,
          message: 'Los campos user_id, question_id y selected_answer son obligatorios'
        });
      }

      // Verificar que el usuario existe
      const user = await UserModel.getById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Verificar que la pregunta existe
      const question = await QuestionModel.getById(question_id);
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Pregunta no encontrada'
        });
      }

      // Verificar si la respuesta es correcta
      const isCorrect = question.correct_answer.toLowerCase() === selected_answer.toLowerCase();
      const pointsEarned = isCorrect ? question.points : 0;

      // Guardar respuesta
      const answer = await AnswerModel.create(user_id, question_id, selected_answer, isCorrect, pointsEarned);

      res.status(201).json({
        success: true,
        message: ' Respuesta guardada',
        data: {
          answer,
          feedback: {
            is_correct: isCorrect,
            points_earned: pointsEarned,
            correct_answer: question.correct_answer
          }
        }
      });

    } catch (error) {
      console.error(' Error en create:', error);
      res.status(500).json({
        success: false,
        message: 'Error guardando respuesta',
        error: error.message
      });
    }
  },

  // GET /api/answers/user/:userId - Respuestas de un usuario
  getByUserId: async (req, res) => {
    try {
      const { userId } = req.params;

      // Verificar que el usuario existe
      const user = await UserModel.getById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      const answers = await AnswerModel.getByUserId(userId);

      res.json({
        success: true,
        data: {
          user: { id: user.id, username: user.username },
          answers,
          count: answers.length
        }
      });

    } catch (error) {
      console.error(' Error en getByUserId:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando respuestas',
        error: error.message
      });
    }
  },

  // GET /api/answers/question/:questionId - Respuestas de una pregunta
  getByQuestionId: async (req, res) => {
    try {
      const { questionId } = req.params;

      // Verificar que la pregunta existe
      const question = await QuestionModel.getById(questionId);
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Pregunta no encontrada'
        });
      }

      const answers = await AnswerModel.getByQuestionId(questionId);

      res.json({
        success: true,
        data: {
          question: { id: question.id, title: question.title },
          answers,
          count: answers.length
        }
      });

    } catch (error) {
      console.error(' Error en getByQuestionId:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando respuestas',
        error: error.message
      });
    }
  },

  // GET /api/stats/user/:userId - Estadísticas de usuario
  getUserStats: async (req, res) => {
    try {
      const { userId } = req.params;

      // Verificar que el usuario existe
      const user = await UserModel.getById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      const stats = await AnswerModel.getUserStats(userId);

      res.json({
        success: true,
        data: {
          user: { id: user.id, username: user.username },
          stats: {
            total_answers: parseInt(stats.total_answers) || 0,
            correct_answers: parseInt(stats.correct_answers) || 0,
            total_points: parseInt(stats.total_points) || 0,
            accuracy_percentage: parseFloat(stats.accuracy_percentage) || 0
          }
        }
      });

    } catch (error) {
      console.error(' Error en getUserStats:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando estadísticas',
        error: error.message
      });
    }
  }
};

module.exports = AnswerController;