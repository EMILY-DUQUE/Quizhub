// frontend/src/services/sessionService.js

import api from './api.js';

const sessionService = {
  /**
   * ✅ Iniciar sesión de quiz
   * POST /api/sessions/start
   */
  async startSession(userId, categoryId) {
    try {
      console.log('🎮 Iniciando sesión:', { userId, categoryId });
      
      const response = await api.post('/sessions/start', {
        user_id: userId,
        category_id: categoryId
      });
      
      console.log('✅ Sesión iniciada:', response.data);
      
      // Retornar en formato esperado por QuizView
      return response.data.data;
      
    } catch (error) {
      console.error('❌ Error iniciando sesión:', error);
      throw error;
    }
  },

  /**
   * ✅ Registrar respuesta en la sesión
   * POST /api/sessions/:id/answer
   */
  async answerQuestion(sessionId, questionId, selectedAnswer, isCorrect, pointsEarned) {
    try {
      console.log('✍️ Registrando respuesta:', {
        sessionId,
        questionId,
        selectedAnswer,
        isCorrect,
        pointsEarned
      });
      
      const response = await api.post(`/sessions/${sessionId}/answer`, {
        question_id: questionId,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        points_earned: pointsEarned
      });
      
      console.log('✅ Respuesta registrada:', response.data);
      return response.data.data;
      
    } catch (error) {
      console.error('❌ Error registrando respuesta:', error);
      throw error;
    }
  },

  /**
   * ✅ Completar sesión (DEVUELVE ESTADÍSTICAS Y POSICIÓN)
   * POST /api/sessions/:id/complete
   */
  async completeSession(sessionId) {
    try {
      console.log('🏁 Completando sesión:', sessionId);
      
      const response = await api.post(`/sessions/${sessionId}/complete`);
      
      console.log('✅ Respuesta completa:', response.data);
      
      // ✅ Retornar TODO: session, results, user_stats, ranking_position
      return response.data.data;
      
    } catch (error) {
      console.error('❌ Error completando sesión:', error);
      throw error;
    }
  },

  /**
   * ✅ Abandonar sesión
   * POST /api/sessions/:id/abandon
   */
  async abandonSession(sessionId) {
    try {
      console.log('🚪 Abandonando sesión:', sessionId);
      
      const response = await api.post(`/sessions/${sessionId}/abandon`);
      
      console.log('✅ Sesión abandonada:', response.data);
      return response.data.data;
      
    } catch (error) {
      console.error('❌ Error abandonando sesión:', error);
      throw error;
    }
  },

  /**
   * ✅ Obtener sesión por ID
   * GET /api/sessions/:id
   */
  async getSessionById(sessionId) {
    try {
      console.log('📖 Obteniendo sesión:', sessionId);
      
      const response = await api.get(`/sessions/${sessionId}`);
      
      console.log('✅ Sesión obtenida:', response.data);
      return response.data.data;
      
    } catch (error) {
      console.error('❌ Error obteniendo sesión:', error);
      throw error;
    }
  },

  /**
   * ✅ Obtener historial de sesiones de un usuario
   * GET /api/sessions/user/:userId
   */
  async getUserSessions(userId) {
    try {
      console.log('📚 Obteniendo historial:', userId);
      
      const response = await api.get(`/sessions/user/${userId}`);
      
      console.log('✅ Historial obtenido:', response.data);
      return response.data.data;
      
    } catch (error) {
      console.error('❌ Error obteniendo historial:', error);
      throw error;
    }
  },

  /**
   * ✅ Obtener sesiones completadas de un usuario
   * GET /api/sessions/user/:userId/completed
   */
  async getCompletedSessions(userId) {
    try {
      console.log('🎓 Obteniendo sesiones completadas:', userId);
      
      const response = await api.get(`/sessions/user/${userId}/completed`);
      
      console.log('✅ Sesiones completadas:', response.data);
      return response.data.data;
      
    } catch (error) {
      console.error('❌ Error obteniendo sesiones completadas:', error);
      throw error;
    }
  }
};

export default sessionService;