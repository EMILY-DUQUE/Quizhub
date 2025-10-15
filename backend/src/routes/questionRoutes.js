// src/routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/questionController');

// POST /api/questions/import - Importar preguntas en lote (DEBE IR PRIMERO)
router.post('/questions/import', QuestionController.import);

// POST /api/questions - Crear pregunta
router.post('/questions', QuestionController.create);

// GET /api/questions - Listar todas (admin)
router.get('/questions', QuestionController.getAll);

// GET /api/categories/:categoryId/questions - Preguntas de una categoría
router.get('/categories/:categoryId/questions', QuestionController.getByCategory);

// GET /api/questions/:id - Ver una pregunta
router.get('/questions/:id', QuestionController.getById);

// PUT /api/questions/:id - Actualizar pregunta
router.put('/questions/:id', QuestionController.update);

// DELETE /api/questions/:id - Eliminar pregunta
router.delete('/questions/:id', QuestionController.delete);

module.exports = router;