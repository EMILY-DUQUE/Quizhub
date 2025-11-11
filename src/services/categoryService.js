// ============================================
// SERVICIO DE CATEGORÍAS
// ============================================
// Se encarga de obtener y manejar las categorías
// desde el backend a través de Axios (api.js).
// ============================================

import api from './api';

const categoryService = {
  // ============================================
  // OBTENER TODAS LAS CATEGORÍAS
  // ============================================
async getAllCategories() {
    try {
      const response = await api.get('/categories');
      console.log('📚 Categorías obtenidas:', response.data);
      return response.data.data?.categories || []; // 👈 Esto es clave
    } catch (error) {
      console.error('❌ Error obteniendo categorías:', error);
      return [];
    }
  },

  // ============================================
  // OBTENER CATEGORÍA POR ID
  // ============================================
  async getCategoryById(id) {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data.data?.category || null;
    } catch (error) {
      console.error('❌ Error obteniendo categoría:', error);
      return null;
    }
  },

  // ============================================
  // OBTENER ESTADÍSTICAS DE UNA CATEGORÍA
  // ============================================
  async getCategoryStats(categoryId) {
    try {
      const response = await api.get(`/categories/${categoryId}/stats`);

      // ✅ Se asume formato: { success: true, data: { ... } }
      return response.data.data;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      throw error.response?.data?.message || 'Error al obtener estadísticas';
    }
  }
};

export default categoryService;
