const express = require('express');
const router = express.Router();
const AnswerController = require('../controllers/answerController');

// POST /api/answers - Guardar respuesta
router.post('/answers', AnswerController.create);

// GET /api/answers/user/:userId - Respuestas de un usuario
router.get('/answers/user/:userId', AnswerController.getByUserId);

// GET /api/answers/question/:questionId - Respuestas de una pregunta
router.get('/answers/question/:questionId', AnswerController.getByQuestionId);

// GET /api/stats/user/:userId - Estadísticas de usuario
router.get('/stats/user/:userId', AnswerController.getUserStats);

module.exports = router;