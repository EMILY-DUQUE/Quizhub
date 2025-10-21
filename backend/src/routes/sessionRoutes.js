// routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const SessionController = require('../controllers/sessionController');

// 1. POST /api/sessions/start
// Propósito: Iniciar una nueva sesión de quiz
// Explicación: Crea una nueva sesión asociada a un usuario y categoría
router.post('/sessions/start', SessionController.start);

// 2. GET /api/sessions/:id
// Propósito: Obtener información detallada de una sesión específica
// Explicación: :id es un parámetro dinámico que representa el ID de la sesión
router.get('/sessions/:id', SessionController.getById);

// 3. POST /api/sessions/:id/answer
// Propósito: Registrar la respuesta de una pregunta en la sesión
// Explicación: Actualiza el progreso cuando el usuario responde una pregunta
router.post('/sessions/:id/answer', SessionController.answerQuestion);

// 4. POST /api/sessions/:id/complete
// Propósito: Marcar una sesión como completada
// Explicación: Cambia el estado de la sesión a "completed" y registra la hora de finalización
router.post('/sessions/:id/complete', SessionController.complete);

// 5. POST /api/sessions/:id/abandon
// Propósito: Marcar una sesión como abandonada
// Explicación: Cambia el estado a "abandoned" cuando el usuario no termina el quiz
router.post('/sessions/:id/abandon', SessionController.abandon);

// 6. GET /api/sessions/user/:userId
// Propósito: Obtener historial completo de sesiones de un usuario
// Explicación: Devuelve todas las sesiones (completadas, abandonadas, en progreso) de un usuario
router.get('/sessions/user/:userId', SessionController.getByUserId);

// 7. GET /api/sessions/user/:userId/completed
// Propósito: Obtener solo las sesiones completadas de un usuario
// Explicación: Filtra únicamente las sesiones con status "completed"
router.get('/sessions/user/:userId/completed', SessionController.getCompletedByUserId);

module.exports = router;