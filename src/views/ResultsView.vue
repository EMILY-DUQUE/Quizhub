<template>
  <div class="results-container">
    <div class="results-card">
      <!-- Ícono según el resultado -->
      <div class="result-icon">{{ resultEmoji }}</div>

      <!-- Título -->
      <h1 class="result-title">{{ resultTitle }}</h1>
      
      <!-- Mensaje personalizado -->
      <p class="result-message">{{ resultMessage }}</p>

      <!-- Estadísticas detalladas -->
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-value">{{ totalQuestions }}</div>
          <div class="stat-label">Total Preguntas</div>
        </div>

        <div class="stat-box correct">
          <div class="stat-value">{{ correctAnswers }}</div>
          <div class="stat-label">Correctas</div>
        </div>

        <div class="stat-box incorrect">
          <div class="stat-value">{{ incorrectAnswers }}</div>
          <div class="stat-label">Incorrectas</div>
        </div>

        <div class="stat-box points">
          <div class="stat-value">{{ totalPoints }}</div>
          <div class="stat-label">Puntos Totales</div>
        </div>
      </div>

      <!-- Porcentaje de aciertos -->
      <div class="accuracy-section">
        <div class="accuracy-label">Precisión</div>
        <div class="accuracy-bar">
          <div class="accuracy-fill" :style="{ width: `${accuracy}%` }"></div>
        </div>
        <div class="accuracy-value">{{ accuracy }}%</div>
      </div>

      <!-- Categoría -->
      <div class="category-badge-large">
        📚 {{ categoryName }}
      </div>

      <!-- Botones de acción -->
      <div class="action-buttons">
        <button class="btn-secondary" @click="$emit('goBack')">
          ← Volver a Categorías
        </button>
        <button class="btn-primary" @click="$emit('retry')">
          🔄 Intentar de Nuevo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// ============================================
// PROPS
// ============================================
const props = defineProps({
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  incorrectAnswers: {
    type: Number,
    required: true
  },
  totalPoints: {
    type: Number,
    required: true
  },
  categoryName: {
    type: String,
    default: 'Quiz'
  }
});

// ============================================
// EMITS
// ============================================
defineEmits(['retry', 'goBack']);

// ============================================
// COMPUTED PROPERTIES
// ============================================
const accuracy = computed(() => {
  if (props.totalQuestions === 0) return 0;
  return Math.round((props.correctAnswers / props.totalQuestions) * 100);
});

const resultEmoji = computed(() => {
  if (accuracy.value >= 90) return '🏆';
  if (accuracy.value >= 70) return '🎉';
  if (accuracy.value >= 50) return '👍';
  return '💪';
});

const resultTitle = computed(() => {
  if (accuracy.value >= 90) return '¡Excelente!';
  if (accuracy.value >= 70) return '¡Muy Bien!';
  if (accuracy.value >= 50) return '¡Buen Trabajo!';
  return '¡Sigue Intentando!';
});

const resultMessage = computed(() => {
  if (accuracy.value >= 90) return 'Eres un experto en este tema 🌟';
  if (accuracy.value >= 70) return 'Vas por buen camino, sigue así ✨';
  if (accuracy.value >= 50) return 'No está mal, pero puedes mejorar 💫';
  return 'La práctica hace al maestro 🎯';
});
</script>

<style scoped>
.results-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 2rem;
}

.results-card {
  background: white;
  border-radius: 25px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: slideUp 0.6s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ícono de resultado */
.result-icon {
  font-size: 6rem;
  margin-bottom: 1rem;
  animation: bounce 0.8s ease;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Título */
.result-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 800;
}

/* Mensaje */
.result-message {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

/* Grid de estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-box {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
  border: 3px solid #e0e0e0;
  transition: all 0.3s;
}

.stat-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.stat-box.correct {
  background: #d4edda;
  border-color: #28a745;
}

.stat-box.incorrect {
  background: #f8d7da;
  border-color: #dc3545;
}

.stat-box.points {
  background: #e8ecff;
  border-color: #667eea;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #333;
  margin-bottom: 0.25rem;
}

.stat-box.correct .stat-value {
  color: #28a745;
}

.stat-box.incorrect .stat-value {
  color: #dc3545;
}

.stat-box.points .stat-value {
  color: #667eea;
}

.stat-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
}

/* Sección de precisión */
.accuracy-section {
  margin-bottom: 2rem;
}

.accuracy-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.75rem;
}

.accuracy-bar {
  width: 100%;
  height: 30px;
  background: #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.accuracy-fill {
  height: 100%;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border-radius: 15px;
  transition: width 1s ease;
}

.accuracy-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #28a745;
}

/* Badge de categoría */
.category-badge-large {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  display: inline-block;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 1.25rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-primary:hover,
.btn-secondary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .results-card {
    padding: 2rem;
  }

  .result-icon {
    font-size: 4rem;
  }

  .result-title {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>