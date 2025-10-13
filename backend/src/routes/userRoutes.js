// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Rutas de autenticación
router.post('/auth/register', UserController.register);
router.post('/auth/login', UserController.login);

// Rutas de usuarios
router.get('/users', UserController.getAll);
router.get('/users/:id', UserController.getById);

module.exports = router;