<template>
  <div class="dashboard">
    <Navbar />

    <div class="dashboard-container">
      <!-- Welcome Section -->
      <section class="welcome-section">
        <h1 class="welcome-title">
          ¡Hola, <span>{{ user?.username }}</span>!  
        </h1>
        <p class="welcome-subtitle">¿Listo para demostrar tus conocimientos?</p>
      </section>

      <!-- Stats Cards -->
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalScore || 0 }}</span>
            <span class="stat-label">Puntos Totales</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.quizzesCompleted || 0 }}</span>
            <span class="stat-label">Quizzes Completados</span>
          </div>
        </div>

       

        
      </section>

      <!-- Quick Actions -->
      <section class="actions-section">
        <h2 class="section-title">Acciones Rápidas</h2>
        <div class="actions-grid">
          <router-link to="/categories" class="action-card">
            <div class="action-icon">🎯</div>
            <h3>Nuevo Quiz</h3>
            <p>Elige una categoría y demuestra tu conocimiento</p>
          </router-link>

          <router-link to="/ranking" class="action-card">
            <div class="action-icon">🏅</div>
            <h3>Ver Ranking</h3>
            <p>Compite con otras personas del mundo</p>
          </router-link>

          <router-link to="/profile" class="action-card">
            <div class="action-icon">📈</div>
            <h3>Mi Progreso</h3>
            <p>Revisa tus estadísticas detalladas</p>
          </router-link>
        </div>
      </section>

      <!-- Recent Activity -->
      <section class="activity-section" v-if="recentAttempts.length > 0">
        <h2 class="section-title">Actividad Reciente</h2>
        <div class="activity-list">
          <div 
            v-for="attempt in recentAttempts" 
            :key="attempt.id"
            class="activity-item"
          >
            <div class="activity-icon">📝</div>
            <div class="activity-info">
              <h4>{{ attempt.categoryName }}</h4>
              <p>{{ attempt.correctAnswers }}/{{ attempt.totalQuestions }} correctas • {{ attempt.points }} pts</p>
            </div>
            <div class="activity-date">
              {{ formatDate(attempt.completedAt) }}
            </div>
          </div>
        </div>
      </section>

      <!-- Loading State -->
      <LoadingSpinner v-if="loading" message="Cargando dashboard..." />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Layout/Navbar.vue';
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue';
import authService from '@/services/authService';
import rankingService from '@/services/rankingService';
import quizService from '@/services/quizService';

// ============================================
// STATE
// ============================================
const user = ref(null);
const stats = ref({
  totalScore: 0,
  quizzesCompleted: 0,
  accuracy: 0,
  streak: 0
});
const recentAttempts = ref([]);
const loading = ref(true);

// ============================================
// CARGAR DATOS AL MONTAR COMPONENTE
// ============================================
onMounted(async () => {
  try {
    // Obtener usuario actual
    user.value = authService.getCurrentUser();

    // Cargar estadísticas
    const statsData = await rankingService.getUserStats();
    stats.value = {
      totalScore: statsData.total_score || 0,
      quizzesCompleted: statsData.quizzes_completed || 0,
      accuracy: statsData.accuracy || 0,
      streak: statsData.current_streak || 0
    };

    // Cargar historial reciente (últimos 5)
    const history = await quizService.getQuizHistory();
    recentAttempts.value = history.slice(0, 5).map(attempt => ({
      id: attempt.id,
      categoryName: attempt.category_name,
      correctAnswers: attempt.correct_answers,
      totalQuestions: attempt.total_questions,
      points: attempt.total_points,
      completedAt: attempt.completed_at
    }));

  } catch (error) {
    console.error('Error al cargar dashboard:', error);
  } finally {
    loading.value = false;
  }
});

// ============================================
// FORMATEAR FECHA
// ============================================
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Hace unos minutos';
  if (hours < 24) return `Hace ${hours}h`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Welcome Section */
.welcome-section {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.welcome-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.welcome-title span {
  color: #667eea;
  font-weight: 800;
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: #666;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 3rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #667eea;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

/* Sections */
.actions-section,
.activity-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

/* Actions Grid */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.action-card:hover {
  transform: translateY(-5px);
  border-color: #667eea;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.action-card p {
  color: #666;
  font-size: 0.95rem;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.activity-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.activity-icon {
  font-size: 2rem;
}

.activity-info {
  flex: 1;
}

.activity-info h4 {
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.activity-info p {
  color: #666;
  font-size: 0.9rem;
}

.activity-date {
  color: #999;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 1.8rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>