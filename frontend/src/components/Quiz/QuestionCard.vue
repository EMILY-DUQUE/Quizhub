<template>
  <div class="question-card">
    <!-- Header de la pregunta -->
    <div class="question-header">
      <span class="question-number">Pregunta {{ questionNumber }}</span>
      <span class="category-badge">{{ categoryName }}</span>
    </div>

    <!-- Texto de la pregunta -->
    <h2 class="question-text">{{ question.title }}</h2>

    <!-- Slot para las opciones (AnswerOptions component) -->
    <slot name="answers"></slot>

    <!-- Slot para botones de acción -->
    <slot name="actions"></slot>
  </div>
</template>

<script setup>
// ============================================
// PROPS
// ============================================
defineProps({
  question: {
    type: Object,
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  categoryName: {
    type: String,
    default: 'Quiz'
  }
});
</script>

<style scoped>
.question-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.question-number {
  font-size: 0.95rem;
  font-weight: 600;
  color: #667eea;
  background: #f0f2ff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.category-badge {
  font-size: 0.9rem;
  font-weight: 600;
  color: #764ba2;
  background: #f5f0ff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.question-text {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 2rem;
  line-height: 1.4;
  font-weight: 700;
}

@media (max-width: 768px) {
  .question-card {
    padding: 1.5rem;
  }

  .question-text {
    font-size: 1.4rem;
  }
}
</style>