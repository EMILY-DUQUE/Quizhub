<template>
  <nav class="navbar">
    <div class="navbar-content">
      <!-- Logo -->
      <router-link to="/dashboard" class="logo">
        Quiz<span>Hub</span>
      </router-link>

      <!-- Menú de navegación -->
      <div class="nav-menu">
        <router-link to="/dashboard" class="nav-link">
           Inicio
        </router-link>
        <router-link to="/categories" class="nav-link">
          Categorías
        </router-link>
        <router-link to="/ranking" class="nav-link">
           Ranking
        </router-link>
        <router-link to="/profile" class="nav-link">
           Perfil
        </router-link>
      </div>

      <!-- Usuario y logout -->
      <div class="user-section">
        <div class="user-info">
          <span class="username">{{ user?.username }}</span>
          <span class="user-points">{{ user?.points || 0 }} pts</span>
        </div>
        <button @click="handleLogout" class="btn-logout">
           Salir
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';

// ============================================
// ROUTER Y ESTADO
// ============================================
const router = useRouter();
const user = ref(null);

// ============================================
// LIFECYCLE
// ============================================
onMounted(() => {
  user.value = JSON.parse(localStorage.getItem('user'));
});

// ============================================
// MÉTODOS
// ============================================
const handleLogout = async () => {
  try {
    await authService.logout();
    router.push({ name: 'Home' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.navbar-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

/* Logo */
.logo {
  font-size: 1.8rem;
  font-weight: 800;
  color: #667eea;
  text-decoration: none;
  transition: all 0.3s;
}

.logo:hover {
  transform: scale(1.05);
}

.logo span {
  color: #FFD700;
}

/* Menú de navegación */
.nav-menu {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  text-decoration: none;
  transition: all 0.3s;
}

.nav-link:hover {
  background: #f5f5f5;
  color: #667eea;
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Usuario */
.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.username {
  font-weight: 700;
  color: #333;
  font-size: 0.95rem;
}

.user-points {
  font-size: 0.85rem;
  color: #FFD700;
  font-weight: 700;
}

.btn-logout {
  padding: 0.75rem 1.5rem;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: #ee5a6f;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-menu {
    width: 100%;
    justify-content: space-around;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }

  .user-section {
    flex-direction: column;
    width: 100%;
  }
}
</style>