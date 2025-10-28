const express = require('express');
const router = express.Router();
const RankingController = require('../controllers/rankingController');

// GET /api/ranking - Ranking global
router.get('/ranking', RankingController.getGlobalRanking);

// GET /api/ranking/category/:categoryId - Ranking por categoría
router.get('/ranking/category/:categoryId', RankingController.getRankingByCategory);

// GET /api/ranking/user/:userId - Posición de usuario
router.get('/ranking/user/:userId', RankingController.getUserPosition);

// GET /api/stats/global - Estadísticas generales
router.get('/stats/global', RankingController.getGeneralStats);

// GET /api/ranking/active - Usuarios activos
router.get('/ranking/active', RankingController.getActiveUsers);

module.exports = router;