// src/services/authService.js
import api from './api.js';
import storageService from './storageService.js';

// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================

const authService = {
  /**
   * Registrar un nuevo usuario
   */
  async register(userData) {
    try {
      console.log('📝 Registrando usuario:', userData.username);
      const response = await api.post('/auth/register', userData);

      console.log('✅ Registro exitoso:', response.data);

      const token = response.data?.data?.token || response.data?.token;
      const user = response.data?.data?.user || response.data?.user;

      if (token) {
        storageService.setToken(token);
      }
      if (user) {
        storageService.setUser(user);
      }

      return { token, user };
    } catch (error) {
      console.error('❌ Error en registro:', error);
      throw error;
    }
  },

  /**
   * Iniciar sesión
   */
  async login(credentials) {
    try {
      console.log('🔐 Iniciando sesión:', credentials.email || credentials.username);
      const response = await api.post('/auth/login', credentials);

      console.log('✅ Login exitoso. Respuesta completa:', response.data);

      const token = response.data?.data?.token;
      const user = response.data?.data?.user;

      if (!token) {
        console.warn('⚠️ No se recibió token del backend');
        return null;
      }

      if (!user) {
        console.warn('⚠️ No se recibieron datos del usuario');
        return null;
      }

      // Guardar en localStorage
      storageService.setToken(token);
      storageService.setUser(user);

      console.log('💾 Token y usuario guardados correctamente');
      return { token, user };
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      console.log('👋 Cerrando sesión...');
      storageService.clear();
      console.log('✅ Sesión cerrada');
    } catch (error) {
      console.error('❌ Error en logout:', error);
      storageService.clear();
    }
  },

  getCurrentUser() {
    return storageService.getUser();
  },

  isAuthenticated() {
    return storageService.isAuthenticated();
  },
};

export default authService;
