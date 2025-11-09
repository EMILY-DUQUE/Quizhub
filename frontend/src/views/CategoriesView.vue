<template>
  <div class="categories-page">
    <Navbar />

    <div class="categories-container">
      <!-- Header -->
      <section class="header-section">
        <h1>Selecciona una Categoría</h1>
        <p>Elige el tema que quieres dominar</p>
      </section>

      <!-- Loading -->
      <LoadingSpinner v-if="loading" message="Cargando categorías..." />

      <!-- Categories Grid -->
      <section v-else class="categories-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-card"
          @click="startQuiz(category.id)"
        >
          <div class="category-icon">{{ category.icon }}</div>
          <h3 class="category-name">{{ category.name }}</h3>
          <p class="category-description">{{ category.description }}</p>
          <div class="category-stats">
            <span class="stat">
              {{ category.questionCount || 0 }} preguntas
            </span>
          </div>
          <button class="btn-start">Comenzar Quiz</button>
        </div>
      </section>

      <!-- Empty State -->
      <div v-if="!loading && categories.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No hay categorías disponibles</h3>
        <p>Pronto habrá nuevas categorías</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/Layout/Navbar.vue';
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue';
import categoryService from '@/services/categoryService';
import sessionService from '@/services/sessionService'; // ✅ Nuevo
import authService from '@/services/authService'; // ✅ Por si lo usas más adelante

// ============================================
// STATE
// ============================================
const router = useRouter();
const categories = ref([]);
const loading = ref(true);

// ============================================
// ICONOS POR CATEGORÍA
// ============================================
const categoryIcons = {
  'Programación': '💻',
  'Matemáticas': '🔢',
  'Historia': '📜',
  'Ciencias': '🔬',
  'Geografía': '🌍',
  'Literatura': '📚',
  'Arte': '🎨',
  'Deportes': '⚽',
  'Música': '🎵',
  'Cine': '🎬'
};

// ============================================
// CARGAR CATEGORÍAS
// ============================================
onMounted(async () => {
  try {
    const data = await categoryService.getAllCategories();

    categories.value = data.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description || 'Demuestra tus conocimientos en esta categoría',
      icon: categoryIcons[cat.name] || '📖',
      questionCount: cat.question_count || 0,
      userCount: cat.user_count || 0
    }));

  } catch (error) {
    console.error('Error al cargar categorías:', error);
  } finally {
    loading.value = false;
  }
});

// ============================================
// INICIAR QUIZ (con sesión activa)
// ============================================
const startQuiz = async (categoryId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      alert('Debes iniciar sesión para jugar');
      router.push('/login');
      return;
    }

    console.log('🎮 Iniciando quiz para categoría:', categoryId);
    console.log('👤 Usuario:', user.id);

    // ✅ CORRECCIÓN 1: Inicia sesión del quiz en backend
    const response = await sessionService.startSession(user.id, categoryId);

    // ✅ CORRECCIÓN 2: Acceder correctamente a la respuesta
    console.log('🎮 Sesión creada exitosamente:', response);

    // ✅ CORRECCIÓN 3: Redirigir usando categoryId (no sessionId)
    // El QuizView recibirá categoryId como parámetro en la ruta
    router.push(`/quiz/${categoryId}`);

  } catch (error) {
    console.error('❌ Error al iniciar el quiz:', error);
    console.error('Detalles:', error.response?.data || error.message);
    alert('No se pudo iniciar el quiz. Intenta de nuevo.');
  }
};
</script>

<style scoped>
.categories-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.categories-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header */
.header-section {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
  animation: fadeInUp 0.6s ease;
}

.header-section h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.header-section p {
  font-size: 1.3rem;
  opacity: 0.95;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  animation: fadeIn 0.8s ease;
}

.category-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.category-card:hover::before {
  transform: scaleX(1);
}

.category-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.category-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: bounce 2s infinite;
}

.category-name {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 700;
}

.category-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.category-stats {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.stat {
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
}

.btn-start {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-start:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Animations */
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

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .header-section h1 {
    font-size: 2rem;
  }

  .header-section p {
    font-size: 1.1rem;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
