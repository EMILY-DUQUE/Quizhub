// src/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');

//  Rutas de categorías
router.get('/categories', CategoryController.getAll);           // Obtener todas
router.post('/categories', CategoryController.create);          // Crear una

// Importar primero (antes de :id)
router.post('/categories/import', CategoryController.import);   // Importar categorías

router.get('/categories/:id', CategoryController.getById);      // Obtener una
router.put('/categories/:id', CategoryController.update);       // Actualizar
router.delete('/categories/:id', CategoryController.delete);    // Eliminar

module.exports = router;
