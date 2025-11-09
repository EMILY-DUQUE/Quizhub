<template>
  <div class="register-page">
    <div class="register-container">
      <!-- Logo -->
      <router-link to="/" class="logo">Quiz<span>Hub</span></router-link>

      <!-- Título -->
      <h1>Crear Cuenta</h1>
      <p class="subtitle">Únete a la comunidad 🚀</p>

      <!-- Formulario -->
      <form @submit.prevent="handleRegister" class="form">
        <!-- Username -->
        <div class="form-group">
          <label for="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            v-model="formData.username"
            placeholder="tu_usuario"
            required
            minlength="3"
          />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            placeholder="tu@email.com"
            required
          />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            placeholder="••••••••"
            required
            minlength="6"
          />
        </div>

        <!-- Botón submit -->
        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="!loading">Registrarse</span>
          <span v-else>Creando cuenta...</span>
        </button>

        <!-- Error message -->
        <div v-if="errorMessage" class="error-message">
          ❌ {{ errorMessage }}
        </div>

        <!-- Success message -->
        <div v-if="successMessage" class="success-message">
          ✅ {{ successMessage }}
        </div>
      </form>

      <!-- Login link -->
      <p class="login-link">
        ¿Ya tienes cuenta?
        <router-link to="/login">Inicia sesión aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';

// ============================================
// COMPOSABLES Y REFS
// ============================================
const router = useRouter();

const formData = ref({
  username: '',
  email: '',
  password: ''
});

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// ============================================
// FUNCIÓN DE REGISTRO
// ============================================
// Se ejecuta cuando el usuario envía el formulario
// ============================================
const handleRegister = async () => {
  // Limpiar mensajes previos
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // ============================================
    // LLAMADA AL SERVICIO DE REGISTRO
    // ============================================
    // Envía username, email y password al backend
    // Si es exitoso, guarda token y user en localStorage
    // ============================================
    const response = await authService.register(formData.value);
    
    // Mostrar mensaje de éxito
    successMessage.value = '¡Cuenta creada exitosamente!';
    
    // ============================================
    // REDIRECCIÓN AL DASHBOARD
    // ============================================
    // Redirigimos automáticamente después del registro
    // ============================================
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
    
  } catch (error) {
    // ============================================
    // MANEJO DE ERRORES
    // ============================================
    // Mostramos mensajes específicos según el error
    // ============================================
    if (typeof error === 'string') {
      errorMessage.value = error;
    } else if (error.includes('email')) {
      errorMessage.value = 'Este correo ya está registrado';
    } else if (error.includes('username')) {
      errorMessage.value = 'Este nombre de usuario ya existe';
    } else {
      errorMessage.value = 'Error al crear la cuenta';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.register-container {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.6s ease;
}

.logo {
  font-size: 2.5rem;
  font-weight: 800;
  color: #667eea;
  text-decoration: none;
  display: block;
  text-align: center;
  margin-bottom: 2rem;
}

.logo span {
  color: #FFD700;
}

h1 {
  font-size: 2rem;
  color: #333;
  text-align: center;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

input {
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 500;
}

.success-message {
  background: #efe;
  color: #2d7d2d;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 500;
}

.login-link {
  text-align: center;
  color: #666;
  margin-top: 2rem;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 2rem;
  }

  h1 {
    font-size: 1.75rem;
  }
}
</style>