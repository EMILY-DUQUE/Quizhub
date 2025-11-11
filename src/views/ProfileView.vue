<template>
  <div class="profile-page">
    <Navbar />

    <div class="profile-container">
      <!-- Loading -->
      <LoadingSpinner v-if="loading" message="Cargando perfil..." />

      <div v-else class="profile-content">
        <!-- Header del perfil -->
        <div class="profile-header">
          <div class="avatar-large">{{ user?.username?.charAt(0).toUpperCase() }}</div>
          <div class="user-details">
            <h1>{{ user?.username }}</h1>
            <p class="email">{{ user?.email }}</p>
            <div class="user-badges">
              <span class="badge">🏆 Nivel {{ userLevel }}</span>
              <span class="badge">📅 Miembro desde {{ joinDate }}</span>
            </div>
          </div>
        </div>

        <!-- Estadísticas Generales -->
        <div class="stats-section">
          <h2>📊 Estadísticas Generales</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-value">{{ stats.correct_answers || 0 }}</div>
              <div class="stat-label">Respuestas Correctas</div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">📝</div>
              <div class="stat-value">{{ stats.total_answers || 0 }}</div>
              <div class="stat-label">Total Respuestas</div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">🎯</div>
              <div class="stat-value">{{ stats.accuracy_percentage || 0 }}%</div>
              <div class="stat-label">Precisión</div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">🏆</div>
              <div class="stat-value">{{ stats.total_points || 0 }}</div>
              <div class="stat-label">Puntos Totales</div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">📚</div>
              <div class="stat-value">{{ sessions.length }}</div>
              <div class="stat-label">Quiz Completados</div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">📍</div>
              <div class="stat-value">#{{ userPosition || '-' }}</div>
              <div class="stat-label">Posición Global</div>
            </div>
          </div>
        </div>

        <!-- Gráfico de precisión -->
        <div class="accuracy-section">
          <h3>Precisión General</h3>
          <div class="accuracy-visual">
            <div class="progress-circle">
              <svg viewBox="0 0 100 100">
                <circle class="progress-bg" cx="50" cy="50" r="45"></circle>
                <circle 
                  class="progress-bar" 
                  cx="50" 
                  cy="50" 
                  r="45"
                  :style="{ strokeDashoffset: circleOffset }"
                ></circle>
              </svg>
              <div class="progress-text">
                <span class="percentage">{{ stats.accuracy_percentage || 0 }}%</span>
                <span class="label">Precisión</span>
              </div>
            </div>
            <div class="accuracy-details">
              <div class="detail-item">
                <span class="icon">✅</span>
                <span class="text">{{ stats.correct_answers || 0 }} Correctas</span>
              </div>
              <div class="detail-item">
                <span class="icon">❌</span>
                <span class="text">{{ incorrectAnswers }} Incorrectas</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Historial de Sesiones -->
        <div class="history-section">
          <h2>📜 Historial de Quiz</h2>
          
          <div v-if="sessions.length > 0" class="sessions-list">
            <div 
              v-for="session in sessions" 
              :key="session.id"
              class="session-card"
            >
              <div class="session-header">
                <div class="session-category">
                  📚 {{ getCategoryName(session.category_id) }}
                </div>
                <div class="session-status" :class="session.status">
                  {{ getStatusText(session.status) }}
                </div>
              </div>

              <div class="session-stats">
                <div class="stat">
                  <span class="label">Preguntas:</span>
                  <span class="value">{{ session.total_questions }}</span>
                </div>
                <div class="stat">
                  <span class="label">Correctas:</span>
                  <span class="value correct">{{ session.correct_answers }}</span>
                </div>
                <div class="stat">
                  <span class="label">Puntos:</span>
                  <span class="value points">{{ session.total_points }}</span>
                </div>
                <div class="stat">
                  <span class="label">Precisión:</span>
                  <span class="value">{{ getAccuracy(session) }}%</span>
                </div>
              </div>

              <div class="session-footer">
                <span class="date">{{ formatDate(session.created_at) }}</span>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon">📭</div>
            <p>Aún no has completado ningún quiz</p>
            <button class="btn-start" @click="goToCategories">
              Comenzar Ahora →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/Layout/Navbar.vue';
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue';
import answerService from '@/services/answerService';
import sessionService from '@/services/sessionService';
import rankingService from '@/services/rankingService';
import categoryService from '@/services/categoryService';

// ============================================
// ROUTER Y USUARIO
// ============================================
const router = useRouter();
const user = JSON.parse(localStorage.getItem('user'));

// ============================================
// ESTADO REACTIVO
// ============================================
const loading = ref(true);
const stats = ref({});
const sessions = ref([]);
const userPosition = ref(null);
const categories = ref([]);

// ============================================
// COMPUTED PROPERTIES
// ============================================
const incorrectAnswers = computed(() => {
  return (stats.value.total_answers || 0) - (stats.value.correct_answers || 0);
});

const userLevel = computed(() => {
  const points = stats.value.total_points || 0;
  if (points >= 1000) return 'Experto';
  if (points >= 500) return 'Avanzado';
  if (points >= 100) return 'Intermedio';
  return 'Principiante';
});

const joinDate = computed(() => {
  if (!user?.created_at) return 'Recientemente';
  const date = new Date(user.created_at);
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
});

// Offset para el círculo de progreso
const circleOffset = computed(() => {
  const percentage = stats.value.accuracy_percentage || 0;
  const circumference = 2 * Math.PI * 45; // radio = 45
  return circumference - (percentage / 100) * circumference;
});

// ============================================
// LIFECYCLE
// ============================================
onMounted(async () => {
  await loadProfileData();
});

// ============================================
// MÉTODOS
// ============================================

/**
 * Cargar todos los datos del perfil
 */
const loadProfileData = async () => {
  loading.value = true;

  try {
    // 1. Cargar estadísticas del usuario
    const statsData = await answerService.getUserStats(user.id);
    stats.value = statsData.stats;

    // 2. Cargar historial de sesiones
    const sessionsData = await sessionService.getCompletedSessions(user.id);
    sessions.value = sessionsData.sessions || [];

    // 3. Cargar posición en el ranking
    userPosition.value = await rankingService.getUserPosition(user.id);

    // 4. Cargar categorías para mostrar nombres
    const categoriesData = await categoryService.getAll();
    categories.value = categoriesData;

    console.log('✅ Perfil cargado:', { stats: stats.value, sessions: sessions.value });

  } catch (error) {
    console.error('❌ Error cargando perfil:', error);
  } finally {
    loading.value = false;
  }
};

/**
 * Obtener nombre de la categoría por ID
 */
const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId);
  return category?.name || 'Categoría desconocida';
};

/**
 * Obtener texto del estado de la sesión
 */
const getStatusText = (status) => {
  const statusMap = {
    'completed': '✅ Completado',
    'in_progress': '⏳ En progreso',
    'abandoned': '🚪 Abandonado'
  };
  return statusMap[status] || status;
};

/**
 * Calcular precisión de una sesión
 */
const getAccuracy = (session) => {
  if (!session.total_questions) return 0;
  return Math.round((session.correct_answers / session.total_questions) * 100);
};

/**
 * Formatear fecha
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Ir a categorías
 */
const goToCategories = () => {
  router.push({ name: 'Categories' });
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 2rem;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-content {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header del perfil */
.profile-header {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
}

.avatar-large {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 800;
  flex-shrink: 0;
}

.user-details h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.email {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.user-badges {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.badge {
  background: #f0f2ff;
  color: #667eea;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
}

/* Estadísticas */
.stats-section {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
}

.stats-section h2 {
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-weight: 600;
  font-size: 0.95rem;
}

/* Sección de precisión */
.accuracy-section {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
}

.accuracy-section h3 {
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.accuracy-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
}

.progress-circle {
  position: relative;
  width: 200px;
  height: 200px;
}

.progress-circle svg {
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: #e0e0e0;
  stroke-width: 10;
}

.progress-bar {
  fill: none;
  stroke: url(#gradient);
  stroke-width: 10;
  stroke-linecap: round;
  stroke-dasharray: 283;
  transition: stroke-dashoffset 1s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-text .percentage {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: #667eea;
}

.progress-text .label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.accuracy-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
}

.detail-item .icon {
  font-size: 2rem;
}

.detail-item .text {
  font-weight: 600;
  color: #333;
}

/* Historial */
.history-section {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.history-section h2 {
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.sessions-list {
  display: grid;
  gap: 1.5rem;
}

.session-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.session-card:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.session-category {
  font-weight: 700;
  color: #333;
  font-size: 1.1rem;
}

.session-status {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

.session-status.completed {
  background: #d4edda;
  color: #155724;
}

.session-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat .label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
}

.stat .value {
  font-size: 1.3rem;
  font-weight: 800;
  color: #333;
}

.stat .value.correct {
  color: #28a745;
}

.stat .value.points {
  color: #FFD700;
}

.session-footer {
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
}

.date {
  color: #999;
  font-size: 0.9rem;
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.btn-start {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-start:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
  }

  .user-details h1 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .accuracy-visual {
    flex-direction: column;
  }

  .session-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>