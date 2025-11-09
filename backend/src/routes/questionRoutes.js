// src/routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/questionController');
const QuestionModel = require('../models/questionModel');

// POST /api/questions/import - Importar preguntas en lote (DEBE IR PRIMERO)
router.post('/questions/import', QuestionController.import);

// POST /api/questions - Crear pregunta
router.post('/questions', QuestionController.create);

// GET /api/questions - Listar todas (admin)
router.get('/questions', QuestionController.getAll);

// GET /api/categories/:categoryId/questions - Preguntas de una categoría
router.get('/categories/:categoryId/questions', QuestionController.getByCategory);

// GET /api/questions/:id/options - Obtener opciones
router.get('/questions/:id/options', async (req, res) => {
  try {
    const { id } = req.params;
    const options = await QuestionModel.getOptions(id);
    
    res.json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('Error obteniendo opciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo opciones',
      error: error.message
    });
  }
});
// GET /api/questions/:id - Ver una pregunta
router.get('/questions/:id', QuestionController.getById);

// PUT /api/questions/:id - Actualizar pregunta
router.put('/questions/:id', QuestionController.update);

// DELETE /api/questions/:id - Eliminar pregunta
router.delete('/questions/:id', QuestionController.delete);

// GET /api/questions/:id/options - Obtener opciones de una pregunta
router.get('/questions/:id/options', async (req, res) => {
  try {
    const { id } = req.params;
    const options = await QuestionModel.getOptions(id);
    res.json(options); // o res.json({ data: options })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;