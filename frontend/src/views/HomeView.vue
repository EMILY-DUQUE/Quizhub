<template>
  <div class="home">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="logo">Quiz<span>Hub</span></div>
      <div class="nav-buttons">
        <router-link to="/login" class="btn btn-outline">Iniciar Sesión</router-link>
        <router-link to="/register" class="btn btn-solid">Registrarse</router-link>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <h1 class="floating">Desafía tus Conocimientos</h1>
      <p>Compite con estudiantes de todo el mundo y demuestra lo que sabes</p>
      <div class="cta-buttons">
        <router-link to="/register" class="btn btn-large btn-solid">Comenzar Ahora</router-link>
        <button class="btn btn-large btn-outline" @click="scrollToFeatures">Conocer Más</button>
      </div>
    </section>

    <!-- Features -->
    <section class="features" id="features">
      <div class="feature-card" v-for="feature in features" :key="feature.id">
        <div class="feature-icon">{{ feature.icon }}</div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </section>

    <!-- Stats -->
    <section class="stats">
      <div class="stat-item" v-for="stat in stats" :key="stat.label">
        <span class="stat-number">{{ stat.value }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2025 QuizHub. Todos los derechos reservados.</p>
      <p>Desarrollado con amor por estudiantes universitarios</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const features = ref([
  {
    id: 1,
    icon: '🎯',
    title: 'Múltiples Categorías',
    description: 'Programación, Historia, Matemáticas, Ciencias y más. Elige tu favorita y demuestra tu dominio.'
  },
  {
    id: 2,
    icon: '🏆',
    title: 'Ranking Global',
    description: 'Compite con otros estudiantes y escala posiciones en el ranking global. ¿Llegarás al top 10?'
  },
  {
    id: 3,
    icon: '⚡',
    title: 'Resultados Instantáneos',
    description: 'Obtén feedback inmediato de tus respuestas y aprende de tus errores en tiempo real.'
  },
  {
    id: 4,
    icon: '📊',
    title: 'Estadísticas Detalladas',
    description: 'Visualiza tu progreso, porcentaje de aciertos y áreas de mejora con gráficos intuitivos.'
  },
  {
    id: 5,
    icon: '🎮',
    title: 'Desafíos 1v1',
    description: 'Reta a tus amigos a duelos de conocimiento y demuestra quién sabe más.'
  },
  {
    id: 6,
    icon: '🔥',
    title: 'Rachas y Logros',
    description: 'Mantén tu racha de respuestas correctas y desbloquea logros especiales.'
  }
]);

const stats = ref([
  { value: '500+', label: 'Preguntas Disponibles' },
  { value: '7', label: 'Categorías' },
  { value: '1000+', label: 'Usuarios Activos' }
]);

const scrollToFeatures = () => {
  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.navbar {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.logo {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.logo span {
  color: #FFD700;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-outline {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-outline:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.btn-solid {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-solid:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.hero {
  text-align: center;
  padding: 6rem 5% 4rem;
  color: white;
}

.hero h1 {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.8s ease;
}

.hero p {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0.95;
  animation: fadeInUp 1s ease;
}

.cta-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  animation: fadeInUp 1.2s ease;
}

.btn-large {
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 4rem 5%;
  max-width: 1400px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  color: #667eea;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.stats {
  display: flex;
  justify-content: space-around;
  padding: 3rem 5%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  margin: 4rem 5%;
  border-radius: 20px;
}

.stat-item {
  text-align: center;
  color: white;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  display: block;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

.footer {
  background: rgba(0, 0, 0, 0.3);
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 4rem;
}

.floating {
  animation: floating 3s ease-in-out infinite;
}

@keyframes floating {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }

  .hero p {
    font-size: 1.2rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .stats {
    flex-direction: column;
    gap: 2rem;
  }
}
</style>