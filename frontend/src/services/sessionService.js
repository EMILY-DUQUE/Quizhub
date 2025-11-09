// src/services/sessionService.js

import api from './api';
import storageService from './storageService';

// ============================================
// SERVICIO DE SESIONES
// ============================================
// Maneja todas las operaciones de sesiones de quiz
// Basado en los endpoints de tu backend
// ============================================

const sessionService = {
  
  // ============================================
  // INICIAR SESIÓN DE QUIZ
  // ============================================
  // POST /api/sessions/start
  // Body: { user_id, category_id }
  // ============================================
  async startSession(categoryId) {
    try {
      const user = storageService.getUser();
      
      if (!user || !user.id) {
        throw new Error('Usuario no autenticado');
      }

      console.log('🎮 Iniciando sesión de quiz...', { 
        user_id: user.id, 
        category_id: categoryId 
      });

      const response = await api.post('/sessions/start', {
        user_id: user.id,
        category_id: categoryId
      });

      console.log('✅ Respuesta del backend:', response.data);

      const sessionData = response.data?.data || response.data;

      return {
        sessionId: sessionData.session?.id,
        session: sessionData.session,
        category: sessionData.category,
        questionsCount: sessionData.questions_count
      };
    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error);
      throw error.response?.data?.message || 'Error al iniciar sesión';
    }
  },

  // ============================================
  // OBTENER SESIÓN POR ID
  // ============================================
  // GET /api/sessions/:id
  // ============================================
  async getSessionById(sessionId) {
    try {
      console.log(`📖 Obteniendo sesión ${sessionId}...`);
      
      const response = await api.get(`/sessions/${sessionId}`);
      
      console.log('✅ Sesión obtenida:', response.data);
      
      return response.data?.data || response.data;
    } catch (error) {
      console.error('❌ Error al obtener sesión:', error);
      throw error.response?.data?.message || 'Error al obtener sesión';
    }
  },

  // ============================================
  // RESPONDER PREGUNTA
  // ============================================
  // POST /api/sessions/:id/answer
  // Body: { question_id, selected_answer, is_correct, points_earned }
  // ============================================
  async answerQuestion(sessionId, questionId, selectedAnswer, isCorrect, pointsEarned) {
    try {
      console.log('✍️ Enviando respuesta...', {
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

      return response.data?.data || response.data;
    } catch (error) {
      console.error('❌ Error al enviar respuesta:', error);
      throw error.response?.data?.message || 'Error al enviar respuesta';
    }
  },

  // ============================================
  // COMPLETAR SESIÓN
  // ============================================
  // POST /api/sessions/:id/complete
  // ============================================
  async completeSession(sessionId) {
    try {
      console.log(`🏁 Completando sesión ${sessionId}...`);

      const response = await api.post(`/sessions/${sessionId}/complete`);

      console.log('✅ Sesión completada:', response.data);

      return response.data?.data || response.data;
    } catch (error) {
      console.error('❌ Error al completar sesión:', error);
      throw error.response?.data?.message || 'Error al completar sesión';
    }
  },

  // ============================================
  // ABANDONAR SESIÓN
  // ============================================
  // POST /api/sessions/:id/abandon
  // ============================================
  async abandonSession(sessionId) {
    try {
      console.log(`🚪 Abandonando sesión ${sessionId}...`);

      const response = await api.post(`/sessions/${sessionId}/abandon`);

      console.log('✅ Sesión abandonada:', response.data);

      return response.data?.data || response.data;
    } catch (error) {
      console.error('❌ Error al abandonar sesión:', error);
      throw error.response?.data?.message || 'Error al abandonar sesión';
    }
  },

  // ============================================
  // OBTENER HISTORIAL DE SESIONES
  // ============================================
  // GET /api/sessions/user/:userId
  // ============================================
  async getUserSessions(userId) {
    try {
      console.log(`📚 Obteniendo historial de usuario ${userId}...`);

      const response = await api.get(`/sessions/user/${userId}`);

      console.log('✅ Historial obtenido:', response.data);

      const data = response.data?.data || response.data;
      return data.sessions || [];
    } catch (error) {
      console.error('❌ Error al obtener historial:', error);
      throw error.response?.data?.message || 'Error al obtener historial';
    }
  },

  // ============================================
  // OBTENER SESIONES COMPLETADAS
  // ============================================
  // GET /api/sessions/user/:userId/completed
  // ============================================
  async getCompletedSessions(userId) {
    try {
      console.log(`🎓 Obteniendo sesiones completadas de usuario ${userId}...`);

      const response = await api.get(`/sessions/user/${userId}/completed`);

      console.log('✅ Sesiones completadas obtenidas:', response.data);

      const data = response.data?.data || response.data;
      return data.sessions || [];
    } catch (error) {
      console.error('❌ Error al obtener sesiones completadas:', error);
      throw error.response?.data?.message || 'Error al obtener sesiones completadas';
    }
  }
};

export default sessionService;