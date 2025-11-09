// src/services/answerService.js

import api from './api.js';

// ============================================
// SERVICIO DE RESPUESTAS
// ============================================
// Maneja el guardado y consulta de respuestas
// ============================================

const answerService = {
  /**
   * Guardar una respuesta
   * 
   * POST /api/answers
   * 
   * @param {Object} answerData - { user_id, question_id, selected_answer }
   * @returns {Promise<Object>} Respuesta guardada con feedback
   */
  async saveAnswer(answerData) {
    try {
      console.log('💾 Guardando respuesta:', answerData);
      
      const response = await api.post('/answers', answerData);
      
      console.log('✅ Respuesta guardada:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error guardando respuesta:', error);
      throw error;
    }
  },

  /**
   * Obtener respuestas de un usuario
   * 
   * GET /api/answers/user/:userId
   * 
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} Lista de respuestas del usuario
   */
  async getUserAnswers(userId) {
    try {
      const response = await api.get(`/answers/user/${userId}`);
      console.log('📋 Respuestas del usuario:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error obteniendo respuestas:', error);
      throw error;
    }
  },

  /**
   * Obtener respuestas de una pregunta
   * 
   * GET /api/answers/question/:questionId
   * 
   * @param {number} questionId - ID de la pregunta
   * @returns {Promise<Array>} Lista de respuestas a esa pregunta
   */
  async getQuestionAnswers(questionId) {
    try {
      const response = await api.get(`/answers/question/${questionId}`);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error obteniendo respuestas de pregunta:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de un usuario
   * 
   * GET /api/stats/user/:userId
   * 
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Estadísticas del usuario
   */
  async getUserStats(userId) {
    try {
      const response = await api.get(`/stats/user/${userId}`);
      console.log('📊 Estadísticas del usuario:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }
  }
};

export default answerService;