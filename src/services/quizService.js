// src/services/quizService.js
import api from './api';

// ============================================
// SERVICIO DE QUIZZES / PREGUNTAS
// ============================================
// Se conecta con el backend para manejar preguntas
// según la categoría seleccionada
// ============================================

const quizService = {
  // ============================================
  // OBTENER PREGUNTAS DE UNA CATEGORÍA
  // ============================================
  // Ruta backend esperada: /api/categories/:categoryId/questions
  // ============================================
  async getQuestionsByCategory(categoryId) {
    try {
      console.log('📡 Solicitando preguntas de la categoría:', categoryId);

      const response = await api.get(`/categories/${categoryId}/questions`);
      console.log('📦 Respuesta cruda del backend:', response.data);

      let questions = [];

      // ---- Formato 1: array directo ----
      // Ejemplo: [ { id, title, ... }, { id, title, ... } ]
      if (Array.isArray(response.data)) {
        questions = response.data;
        console.log('✅ Formato detectado: [ { ...pregunta } ]');
      }

      // ---- Formato 2: objeto con "data" ----
      // Ejemplo: { success: true, data: [ { ...pregunta } ] }
      else if (Array.isArray(response.data?.data)) {
        questions = response.data.data;
        console.log('✅ Formato detectado: { data: [ ... ] }');
      }

      // ---- Formato 3: objeto con "data.questions" ----
      // Ejemplo: { success: true, data: { questions: [ { ... } ] } }
      else if (Array.isArray(response.data?.data?.questions)) {
        questions = response.data.data.questions;
        console.log('✅ Formato detectado: { data: { questions: [...] } }');
      }

      // ---- Formato 4: objeto con "questions" directo ----
      // Ejemplo: { questions: [ { ... } ] }
      else if (Array.isArray(response.data?.questions)) {
        questions = response.data.questions;
        console.log('✅ Formato detectado: { questions: [...] }');
      }

      // ---- Ninguno de los anteriores ----
      else {
        console.warn('⚠️ Formato desconocido. No se encontraron preguntas válidas.');
        console.log('🧩 Estructura recibida:', response.data);
      }

      return questions;

    } catch (error) {
      console.error('❌ Error al obtener preguntas:', error);
      throw error.response?.data?.message || 'Error al obtener preguntas';
    }
  }
};

export default quizService;
