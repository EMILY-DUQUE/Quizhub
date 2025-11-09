// src/services/api.js

import axios from 'axios';

// ============================================
// CONFIGURACIÓN BASE DE AXIOS
// ============================================
// Esta es la instancia principal que usaremos
// para todas las peticiones al backend
// ============================================

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL base de tu backend
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// ============================================
// INTERCEPTOR DE PETICIONES (REQUEST)
// ============================================
// Se ejecuta ANTES de cada petición
// Aquí agregamos el token JWT automáticamente
// ============================================

api.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    // Si existe token, agregarlo al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// INTERCEPTOR DE RESPUESTAS (RESPONSE)
// ============================================
// Se ejecuta DESPUÉS de cada respuesta
// Maneja errores globalmente (ej: token expirado)
// ============================================

api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente retornarla
    return response;
  },
  (error) => {
    // Si el token expiró (401), redirigir al login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;