// src/services/authService.js

import api from './api';
import storageService from './storageService';

// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================
// Maneja todas las operaciones de auth:
// login, register, logout, verificación
// ============================================

const authService = {
  
  // ============================================
  // REGISTRO DE USUARIO
  // ============================================
  // POST /api/auth/register
  // Crea una nueva cuenta de usuario
  // ============================================
  async register(userData) {
    try {
      // userData debe tener: { username, email, password }
      const response = await api.post('/auth/register', userData);
      
      // Si el backend devuelve token y user, guardarlos
      if (response.data.token) {
        storageService.setToken(response.data.token);
        storageService.setUser(response.data.user);
      }
      
      return response.data;
    } catch (error) {
      // Lanzar el error para manejarlo en el componente
      throw error.response?.data?.message || 'Error al registrarse';
    }
  },

  // ============================================
  // INICIO DE SESIÓN
  // ============================================
  // POST /api/auth/login
  // Autentica al usuario y obtiene token JWT
  // ============================================
  async login(credentials) {
    try {
      // credentials debe tener: { email, password }
      const response = await api.post('/auth/login', credentials);
      
      // Guardar token y datos del usuario
      if (response.data.token) {
        storageService.setToken(response.data.token);
        storageService.setUser(response.data.user);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al iniciar sesión';
    }
  },

  // ============================================
  // CERRAR SESIÓN
  // ============================================
  // Limpia el localStorage y opcionalmente
  // notifica al backend
  // ============================================
  logout() {
    storageService.clear();
    // Si tu backend tiene un endpoint de logout:
    // await api.post('/auth/logout');
  },

  // ============================================
  // OBTENER USUARIO ACTUAL
  // ============================================
  // Retorna los datos del usuario logueado
  // desde localStorage
  // ============================================
  getCurrentUser() {
    return storageService.getUser();
  },

  // ============================================
  // VERIFICAR AUTENTICACIÓN
  // ============================================
  // Verifica si el usuario está autenticado
  // ============================================
  isAuthenticated() {
    return storageService.isAuthenticated();
  },

  // ============================================
  // OBTENER PERFIL ACTUALIZADO
  // ============================================
  // GET /api/user/profile
  // Obtiene datos frescos del usuario desde el backend
  // ============================================
  async getProfile() {
    try {
      const response = await api.get('/user/profile');
      // Actualizar datos en localStorage
      storageService.setUser(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al obtener perfil';
    }
  }
};

export default authService;