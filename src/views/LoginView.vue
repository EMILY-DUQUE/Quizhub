<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Logo -->
      <router-link to="/" class="logo">Quiz<span>Hub</span></router-link>

      <!-- Título -->
      <h1>Iniciar Sesión</h1>
      <p class="subtitle">Bienvenido de nuevo 👋</p>

      <!-- Formulario -->
      <form @submit.prevent="handleLogin" class="form">
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
          />
        </div>

        <!-- Olvidé contraseña -->
        <div class="forgot-password">
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>

        <!-- Botón submit -->
        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="!loading">Iniciar Sesión</span>
          <span v-else>Cargando...</span>
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

      <!-- Registro -->
      <p class="register-link">
        ¿No tienes cuenta?
        <router-link to="/register">Regístrate aquí</router-link>
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
  email: '',
  password: ''
});

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// ============================================
// FUNCIÓN DE LOGIN
// ============================================
const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const result = await authService.login(formData.value);

    if (!result || !result.token) {
      throw new Error('No se pudo iniciar sesión. Token no recibido.');
    }

    successMessage.value = '¡Inicio de sesión exitoso!';

    // Espera un poco y redirige
    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Credenciales incorrectas';
  } finally {
    loading.value = false;
  }
};
</script>


<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
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

.forgot-password {
  text-align: right;
  margin-top: -0.5rem;
}

.forgot-password a {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password a:hover {
  text-decoration: underline;
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

.register-link {
  text-align: center;
  color: #666;
  margin-top: 2rem;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
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
  .login-container {
    padding: 2rem;
  }

  h1 {
    font-size: 1.75rem;
  }
}
</style>