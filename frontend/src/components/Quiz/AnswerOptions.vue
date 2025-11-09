<template>
  <div class="answer-options">
    <!-- Si no hay opciones, mostrar loading -->
    <div v-if="!options || options.length === 0" class="no-options">
      <p>⏳ Cargando opciones...</p>
    </div>

    <!-- Mostrar opciones -->
    <div v-else class="options-container">
      <button
        v-for="option in options"
        :key="option.id"
        class="option-button"
        :class="{
          selected: selectedAnswer === option.id,
          correct: showResult && option.is_correct,
          incorrect: showResult && selectedAnswer === option.id && !option.is_correct
        }"
        :disabled="showResult"
        @click="handleSelect(option.id)"
      >
        <span class="option-text">{{ option.option_text }}</span>
        
        <!-- Mostrar icono de resultado -->
        <span v-if="showResult" class="result-icon">
          <span v-if="option.is_correct">✅</span>
          <span v-else-if="selectedAnswer === option.id">❌</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// ============================================
// PROPS
// ============================================
const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  selectedAnswer: {
    type: [String, Number],
    default: null
  },
  showResult: {
    type: Boolean,
    default: false
  }
});

// ============================================
// EMITS
// ============================================
const emit = defineEmits(['select']);

// ============================================
// MÉTODOS
// ============================================
const handleSelect = (optionId) => {
  if (!props.showResult) {
    emit('select', optionId);
  }
};
</script>

<style scoped>
.answer-options {
  width: 100%;
  margin: 2rem 0;
}

.no-options {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-size: 1.1rem;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  text-align: left;
}

.option-button:hover:not(:disabled) {
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateX(5px);
}

.option-button.selected {
  border-color: #667eea;
  background: #e8ebff;
  font-weight: 600;
}

.option-button.correct {
  border-color: #28a745;
  background: #d4edda;
  color: #155724;
}

.option-button.incorrect {
  border-color: #dc3545;
  background: #f8d7da;
  color: #721c24;
}

.option-button:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.option-text {
  flex: 1;
}

.result-icon {
  font-size: 1.5rem;
  margin-left: 1rem;
  animation: popIn 0.3s ease;
}

@keyframes popIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .option-button {
    padding: 1.2rem;
    font-size: 1rem;
  }

  .options-container {
    gap: 0.8rem;
  }
}
</style>