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

      // ✅ Tu backend devuelve este formato:
      // { success: true, data: { categories: [...] } }
      const categories = response.data.data.categories;

      return categories;
    } catch (error) {
      console.error('❌ Error al obtener categorías:', error);
      throw error.response?.data?.message || 'Error al obtener categorías';
    }
  },

  // ============================================
  // OBTENER CATEGORÍA POR ID
  // ============================================
  async getCategoryById(categoryId) {
    try {
      const response = await api.get(`/categories/${categoryId}`);

      // ✅ Se asume que el backend devuelve:
      // { success: true, data: { id, name, ... } }
      return response.data.data;
    } catch (error) {
      console.error('❌ Error al obtener categoría:', error);
      throw error.response?.data?.message || 'Error al obtener categoría';
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
