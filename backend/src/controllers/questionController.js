// src/controllers/questionController.js
const QuestionModel = require('../models/questionModel');
const CategoryModel = require('../models/categoryModel');

const QuestionController = {
  // POST /api/questions - Crear una pregunta
  create: async (req, res) => {
    try {
      const { category_id, title, type, correct_answer, points, created_by } = req.body;

      // Validaciones
      if (!category_id || !title || !type || !correct_answer) {
        return res.status(400).json({
          success: false,
          message: 'Los campos category_id, title, type y correct_answer son obligatorios'
        });
      }

      // Validar tipo de pregunta
      const validTypes = ['multiple_choice', 'true_false', 'short_answer'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `El tipo debe ser: ${validTypes.join(', ')}`
        });
      }

      // Verificar que la categoría existe
      const category = await CategoryModel.getById(category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'La categoría no existe'
        });
      }

      // Crear pregunta
      const newQuestion = await QuestionModel.create(
        category_id,
        title,
        type,
        correct_answer,
        points || 10,
        created_by || null
      );

      // Si es multiple_choice, crear opciones
      if (type === 'multiple_choice' && req.body.options && req.body.options.length > 0) {
        const options = await QuestionModel.createOptions(newQuestion.id, req.body.options);
        newQuestion.options = options;
      }

      res.status(201).json({
        success: true,
        message: ' Pregunta creada correctamente',
        data: { question: newQuestion }
      });

    } catch (error) {
      console.error(' Error en create:', error);
      res.status(500).json({
        success: false,
        message: 'Error creando pregunta',
        error: error.message
      });
    }
  },

  // GET /api/questions - Obtener todas (admin)
  getAll: async (req, res) => {
    try {
      const questions = await QuestionModel.getAll();

      res.json({
        success: true,
        data: {
          questions,
          count: questions.length
        }
      });

    } catch (error) {
      console.error('Error en getAll:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando preguntas',
        error: error.message
      });
    }
  },

  // GET /api/categories/:categoryId/questions - Preguntas de una categoría (jugador)
  getByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;

      // Verificar que la categoría existe
      const category = await CategoryModel.getById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
      }

      const questions = await QuestionModel.getByCategory(categoryId);

      res.json({
        success: true,
        data: {
          category,
          questions,
          count: questions.length
        }
      });

    } catch (error) {
      console.error('Error en getByCategory:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando preguntas',
        error: error.message
      });
    }
  },

  // GET /api/questions/:id - Ver una pregunta
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const question = await QuestionModel.getById(id);
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Pregunta no encontrada'
        });
      }

      // Si es multiple_choice, obtener opciones
      if (question.type === 'multiple_choice') {
        const options = await QuestionModel.getOptions(id);
        question.options = options;
      }

      res.json({
        success: true,
        data: { question }
      });

    } catch (error) {
      console.error(' Error en getById:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando pregunta',
        error: error.message
      });
    }
  },

  // PUT /api/questions/:id - Actualizar pregunta
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, type, correct_answer, points } = req.body;

      // Validaciones
      if (!title || !type || !correct_answer) {
        return res.status(400).json({
          success: false,
          message: 'Los campos title, type y correct_answer son obligatorios'
        });
      }

      // Verificar que existe
      const question = await QuestionModel.getById(id);
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Pregunta no encontrada'
        });
      }

      // Actualizar
      const updatedQuestion = await QuestionModel.update(
        id,
        title,
        type,
        correct_answer,
        points || 10
      );

      res.json({
        success: true,
        message: ' Pregunta actualizada correctamente',
        data: { question: updatedQuestion }
      });

    } catch (error) {
      console.error(' Error en update:', error);
      res.status(500).json({
        success: false,
        message: 'Error actualizando pregunta',
        error: error.message
      });
    }
  },

  // DELETE /api/questions/:id - Eliminar pregunta
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      // Verificar que existe
      const question = await QuestionModel.getById(id);
      if (!question) {
        return res.status(404).json({
          success: false,
          message: 'Pregunta no encontrada'
        });
      }

      // Eliminar
      await QuestionModel.delete(id);

      res.json({
        success: true,
        message: ' Pregunta eliminada correctamente',
        data: { id }
      });

    } catch (error) {
      console.error(' Error en delete:', error);
      res.status(500).json({
        success: false,
        message: 'Error eliminando pregunta',
        error: error.message
      });
    }
  },

  // POST /api/questions/import - Importar preguntas desde JSON
  import: async (req, res) => {
    try {
      const { questions } = req.body;

      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Debes enviar un array de preguntas'
        });
      }

      // Validar que todas las categorías existan
      const categoryIds = [...new Set(questions.map(q => q.category_id))];
      for (const categoryId of categoryIds) {
        const category = await CategoryModel.getById(categoryId);
        if (!category) {
          return res.status(404).json({
            success: false,
            message: `La categoría con id ${categoryId} no existe`
          });
        }
      }

      // Crear todas las preguntas
      const createdQuestions = await QuestionModel.createMany(questions);

      res.status(201).json({
        success: true,
        message: ` ${createdQuestions.length} preguntas importadas correctamente`,
        data: {
          questions: createdQuestions,
          count: createdQuestions.length
        }
      });

    } catch (error) {
      console.error(' Error en import:', error);
      res.status(500).json({
        success: false,
        message: 'Error importando preguntas',
        error: error.message
      });
    }
  }
};

module.exports = QuestionController;