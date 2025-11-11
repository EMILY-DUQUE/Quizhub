// src/services/rankingService.js

import api from './api.js';

// ============================================
// SERVICIO DE RANKING
// ============================================
// Maneja consultas de rankings y estadísticas
// ============================================

const rankingService = {
  /**
   * Obtener ranking global
   * 
   * GET /api/ranking
   * 
   * @param {number} limit - Cantidad de usuarios a obtener (default: 10)
   * @returns {Promise<Array>} Top usuarios
   */
  async getGlobalRanking(limit = 10) {
    try {
      const response = await api.get(`/ranking?limit=${limit}`);
      console.log('🏆 Ranking global:', response.data);
      return response.data.data.ranking;
    } catch (error) {
      console.error('❌ Error obteniendo ranking:', error);
      throw error;
    }
  },

  /**
   * Obtener ranking por categoría
   * 
   * GET /api/ranking/category/:categoryId
   * 
   * @param {number} categoryId - ID de la categoría
   * @param {number} limit - Cantidad de usuarios
   * @returns {Promise<Object>} Ranking de la categoría
   */
  async getRankingByCategory(categoryId, limit = 10) {
    try {
      const response = await api.get(`/ranking/category/${categoryId}?limit=${limit}`);
      console.log('🏆 Ranking por categoría:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error obteniendo ranking por categoría:', error);
      throw error;
    }
  },

  /**
   * Obtener posición de un usuario en el ranking
   * 
   * GET /api/ranking/user/:userId
   * 
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Posición del usuario
   */
  async getUserPosition(userId) {
    try {
      const response = await api.get(`/ranking/user/${userId}`);
      console.log('📍 Posición del usuario:', response.data);
      return response.data.data.position;
    } catch (error) {
      console.error('❌ Error obteniendo posición:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas globales
   * 
   * GET /api/stats/global
   * 
   * @returns {Promise<Object>} Estadísticas generales del sistema
   */
  async getGlobalStats() {
    try {
      const response = await api.get('/stats/global');
      console.log('📊 Estadísticas globales:', response.data);
      return response.data.data.stats;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas globales:', error);
      throw error;
    }
  },
async getAll() {
    try {
      console.log('📚 Obteniendo todas las categorías...');
      
      const response = await api.get('/categories');
      
      console.log('✅ Respuesta del servidor:', response.data);
      
      // ✅ Extraer correctamente según la estructura de tu backend
      const categories = response.data.data?.categories || response.data.data || [];
      
      console.log('📋 Categorías obtenidas:', categories);
      
      return categories;
      
    } catch (error) {
      console.error('❌ Error obteniendo categorías:', error);
      throw error;
    }
  },

  /**
   * Obtener usuarios activos
   * 
   * GET /api/ranking/active
   * 
   * @param {number} days - Días hacia atrás (default: 7)
   * @param {number} limit - Cantidad de usuarios
   * @returns {Promise<Array>} Usuarios más activos
   */
  async getActiveUsers(days = 7, limit = 10) {
    try {
      const response = await api.get(`/ranking/active?days=${days}&limit=${limit}`);
      console.log('👥 Usuarios activos:', response.data);
      return response.data.data.active_users;
    } catch (error) {
      console.error('❌ Error obteniendo usuarios activos:', error);
      throw error;
    }
  }
};

export default rankingService;