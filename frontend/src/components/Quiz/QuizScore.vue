<template>
  <div class="score-display">
    <!-- Correctas -->
    <div class="score-item correct">
      <span class="score-icon">✅</span>
      <span class="score-value">{{ correctAnswers }}</span>
      <span class="score-label">Correctas</span>
    </div>

    <!-- Incorrectas -->
    <div class="score-item incorrect">
      <span class="score-icon">❌</span>
      <span class="score-value">{{ incorrectAnswers }}</span>
      <span class="score-label">Incorrectas</span>
    </div>

    <!-- Puntos -->
    <div class="score-item points">
      <span class="score-icon">🏆</span>
      <span class="score-value">{{ totalPoints }}</span>
      <span class="score-label">Puntos</span>
    </div>
  </div>
</template>

<script setup>
// ============================================
// PROPS
// ============================================
defineProps({
  correctAnswers: {
    type: Number,
    default: 0
  },
  incorrectAnswers: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  }
});
</script>

<style scoped>
.score-display {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.score-item {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.score-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.score-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.score-value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.score-item.correct .score-value {
  color: #28a745;
}

.score-item.incorrect .score-value {
  color: #dc3545;
}

.score-item.points .score-value {
  color: #667eea;
}

.score-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
}

@media (max-width: 768px) {
  .score-display {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .score-item {
    padding: 1rem;
  }

  .score-icon {
    font-size: 2rem;
  }

  .score-value {
    font-size: 1.5rem;
  }
}
</style>