<template>
  <div class="ranking-page">
    <Navbar />

    <div class="ranking-container">
      <!-- Header -->
      <div class="header-section">
        <h1>🏆 Tabla de Clasificación</h1>
        <p>Los mejores jugadores de QuizHub</p>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <button 
          class="filter-btn" 
          :class="{ active: activeFilter === 'global' }"
          @click="changeFilter('global')"
        >
          🌍 Global
        </button>
        <button 
          class="filter-btn" 
          :class="{ active: activeFilter === 'category' }"
          @click="changeFilter('category')"
        >
          📚 Por Categoría
        </button>
        <button 
          class="filter-btn" 
          :class="{ active: activeFilter === 'active' }"
          @click="changeFilter('active')"
        >
          🔥 Más Activos
        </button>
      </div>

      <!-- Selector de categoría (solo si filtro es 'category') -->
      <div v-if="activeFilter === 'category'" class="category-selector">
        <label>Selecciona una categoría:</label>
        <select v-model="selectedCategory" @change="loadRanking">
          <option value="">-- Todas las categorías --</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Loading -->
      <LoadingSpinner v-if="loading" message="Cargando ranking..." />

      <!-- Ranking -->
      <div v-else class="ranking-content">
        <!-- Top 3 Podio -->
        <div v-if="ranking.length >= 3 && activeFilter === 'global'" class="podium">
          <!-- 2do lugar -->
          <div class="podium-item second">
            <div class="medal">🥈</div>
            <div class="avatar">{{ ranking[1]?.username?.charAt(0).toUpperCase() }}</div>
            <div class="username">{{ ranking[1]?.username }}</div>
            <div class="points">{{ ranking[1]?.total_points }} pts</div>
            <div class="position">#2</div>
          </div>

          <!-- 1er lugar -->
          <div class="podium-item first">
            <div class="crown">👑</div>
            <div class="medal">🥇</div>
            <div class="avatar">{{ ranking[0]?.username?.charAt(0).toUpperCase() }}</div>
            <div class="username">{{ ranking[0]?.username }}</div>
            <div class="points">{{ ranking[0]?.total_points }} pts</div>
            <div class="position">#1</div>
          </div>

          <!-- 3er lugar -->
          <div class="podium-item third">
            <div class="medal">🥉</div>
            <div class="avatar">{{ ranking[2]?.username?.charAt(0).toUpperCase() }}</div>
            <div class="username">{{ ranking[2]?.username }}</div>
            <div class="points">{{ ranking[2]?.total_points }} pts</div>
            <div class="position">#3</div>
          </div>
        </div>

        <!-- Tabla de ranking -->
        <div class="ranking-table">
          <div class="table-header">
            <div class="col-position">Pos</div>
            <div class="col-user">Usuario</div>
            <div class="col-stats">Estadísticas</div>
            <div class="col-points">Puntos</div>
          </div>

          <div 
            v-for="(user, index) in ranking" 
            :key="user.id"
            class="table-row"
            :class="{ 
              highlight: user.id === currentUserId,
              top3: index < 3 && activeFilter === 'global'
            }"
          >
            <!-- Posición -->
            <div class="col-position">
              <span class="position-badge" :class="getPositionClass(index + 1)">
                {{ index + 1 }}
              </span>
            </div>

            <!-- Usuario -->
            <div class="col-user">
              <div class="user-avatar">{{ user.username?.charAt(0).toUpperCase() }}</div>
              <div class="user-info">
                <div class="username">
                  {{ user.username }}
                  <span v-if="user.id === currentUserId" class="you-badge">Tú</span>
                </div>
                <div class="user-meta">
                  {{ user.total_answers || 0 }} respuestas
                </div>
              </div>
            </div>

            <!-- Estadísticas -->
            <div class="col-stats">
              <div class="stat-item">
                <span class="stat-icon">✅</span>
                <span>{{ user.correct_answers || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-icon">📊</span>
                <span>{{ user.accuracy_percentage || 0 }}%</span>
              </div>
            </div>

            <!-- Puntos -->
            <div class="col-points">
              <span class="points-value">{{ user.total_points || 0 }}</span>
              <span class="points-label">pts</span>
            </div>
          </div>

          <!-- Estado vacío -->
          <div v-if="ranking.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <p>No hay datos disponibles</p>
          </div>
        </div>

        <!-- Tu posición -->
        <div v-if="userPosition && activeFilter === 'global'" class="user-position-card">
          <div class="card-content">
            <div class="position-info">
              <span class="label">Tu posición:</span>
              <span class="position">#{{ userPosition }}</span>
            </div>
            <button class="btn-view-profile" @click="goToProfile">
              Ver mi perfil →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/Layout/Navbar.vue';
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue';
import rankingService from '@/services/rankingService';
import categoryService from '@/services/categoryService';

// ============================================
// ROUTER Y USUARIO
// ============================================
const router = useRouter();
const user = JSON.parse(localStorage.getItem('user'));
const currentUserId = user?.id;

// ============================================
// ESTADO REACTIVO
// ============================================
const loading = ref(true);
const activeFilter = ref('global'); // global | category | active
const ranking = ref([]);
const userPosition = ref(null);
const categories = ref([]);
const selectedCategory = ref('');

// ============================================
// LIFECYCLE
// ============================================
onMounted(async () => {
  await loadCategories();
  await loadRanking();
});

// ============================================
// MÉTODOS
// ============================================

/**
 * Cargar categorías para el filtro
 */
const loadCategories = async () => {
  try {
    const data = await categoryService.getAll();
    categories.value = data;
  } catch (error) {
    console.error('Error cargando categorías:', error);
  }
};

/**
 * Cargar ranking según el filtro activo
 */
const loadRanking = async () => {
  loading.value = true;
  
  try {
    if (activeFilter.value === 'global') {
      // Ranking global
      ranking.value = await rankingService.getGlobalRanking(50);
      
      // Obtener posición del usuario
      if (currentUserId) {
        userPosition.value = await rankingService.getUserPosition(currentUserId);
      }
      
    } else if (activeFilter.value === 'category') {
      // Ranking por categoría
      if (selectedCategory.value) {
        const data = await rankingService.getRankingByCategory(selectedCategory.value, 50);
        ranking.value = data.ranking;
      } else {
        ranking.value = [];
      }
      
    } else if (activeFilter.value === 'active') {
      // Usuarios más activos
      ranking.value = await rankingService.getActiveUsers(7, 50);
    }
    
    console.log('📊 Ranking cargado:', ranking.value);
    
  } catch (error) {
    console.error('❌ Error cargando ranking:', error);
  } finally {
    loading.value = false;
  }
};

/**
 * Cambiar filtro de ranking
 */
const changeFilter = (filter) => {
  activeFilter.value = filter;
  selectedCategory.value = '';
  loadRanking();
};

/**
 * Obtener clase CSS según la posición
 */
const getPositionClass = (position) => {
  if (position === 1) return 'gold';
  if (position === 2) return 'silver';
  if (position === 3) return 'bronze';
  return '';
};

/**
 * Ir al perfil del usuario
 */
const goToProfile = () => {
  router.push({ name: 'Profile' });
};
</script>

<style scoped>
.ranking-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 2rem;
}

.ranking-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header */
.header-section {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.header-section h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-weight: 800;
}

.header-section p {
  font-size: 1.2rem;
  opacity: 0.95;
}

/* Filtros */
.filters-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.filter-btn {
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.filter-btn.active {
  background: white;
  color: #667eea;
  border-color: white;
}

/* Selector de categoría */
.category-selector {
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-selector label {
  font-weight: 700;
  color: #333;
}

.category-selector select {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
}

/* Podio (Top 3) */
.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 2rem;
  margin-bottom: 3rem;
}

.podium-item {
  background: white;
  border-radius: 20px;
  padding: 2rem 1.5rem;
  text-align: center;
  position: relative;
  transition: all 0.3s;
  min-width: 180px;
}

.podium-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.podium-item.first {
  order: 2;
  transform: scale(1.1);
  box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
}

.podium-item.second {
  order: 1;
}

.podium-item.third {
  order: 3;
}

.crown {
  font-size: 2.5rem;
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
}

.medal {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  margin: 0 auto 1rem;
}

.podium-item .username {
  font-weight: 800;
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.podium-item .points {
  color: #FFD700;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.podium-item .position {
  font-size: 0.9rem;
  color: #666;
  font-weight: 700;
}

/* Tabla de ranking */
.ranking-content {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.ranking-table {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
}

.table-header {
  display: grid;
  grid-template-columns: 80px 1fr 200px 120px;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  font-weight: 700;
  color: #666;
  margin-bottom: 1rem;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 1fr 200px 120px;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  align-items: center;
  transition: all 0.3s;
}

.table-row:hover {
  background: #f8f9fa;
  transform: translateX(5px);
}

.table-row.highlight {
  background: #e8ecff;
  border: 2px solid #667eea;
}

.table-row.top3 {
  background: linear-gradient(135deg, #fff9e6 0%, #fff 100%);
}

/* Columnas */
.col-position {
  display: flex;
  align-items: center;
  justify-content: center;
}

.position-badge {
  width: 45px;
  height: 45px;
  background: #e0e0e0;
  color: #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
}

.position-badge.gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: white;
}

.position-badge.silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%);
  color: white;
}

.position-badge.bronze {
  background: linear-gradient(135deg, #CD7F32 0%, #B8733C 100%);
  color: white;
}

.col-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 800;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
}

.username {
  font-weight: 700;
  color: #333;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.you-badge {
  background: #667eea;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.user-meta {
  color: #999;
  font-size: 0.9rem;
}

.col-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #666;
}

.stat-icon {
  font-size: 1.2rem;
}

.col-points {
  text-align: right;
}

.points-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #FFD700;
}

.points-label {
  font-size: 0.9rem;
  color: #999;
  margin-left: 0.25rem;
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

/* Tarjeta de posición del usuario */
.user-position-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.position-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.position-info .label {
  font-weight: 700;
  color: #666;
  font-size: 1.1rem;
}

.position-info .position {
  font-size: 2rem;
  font-weight: 800;
  color: #667eea;
}

.btn-view-profile {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-view-profile:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .ranking-container {
    padding: 1rem;
  }

  .header-section h1 {
    font-size: 2rem;
  }

  .filters-section {
    flex-direction: column;
  }

  .podium {
    flex-direction: column;
    align-items: center;
  }

  .podium-item {
    width: 100%;
    max-width: 300px;
  }

  .podium-item.first {
    order: 1;
    transform: scale(1);
  }

  .table-header,
  .table-row {
    grid-template-columns: 60px 1fr 100px;
    gap: 0.5rem;
  }

  .col-stats {
    display: none;
  }

  .card-content {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>