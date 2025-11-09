<template>
  <div class="quiz-page">
    <Navbar />

    <div class="quiz-container">
      <!-- ===== ESTADO: CARGANDO ===== -->
      <LoadingSpinner v-if="loading" message="Cargando preguntas..." />

      <!-- ===== ESTADO: QUIZ ACTIVO ===== -->
      <div v-else-if="!finished" class="quiz-content">
        <!-- Progreso -->
        <QuizProgress
          :currentQuestion="currentQuestionIndex + 1"
          :totalQuestions="questions.length"
          :timeRemaining="timeRemaining"
        />

        <!-- Pregunta y opciones -->
        <QuestionCard
          v-if="currentQuestion"
          :question="currentQuestion"
          :questionNumber="currentQuestionIndex + 1"
          :categoryName="categoryName"
        >
          <!-- Slot: Opciones de respuesta -->
          <template #answers>
            <AnswerOptions
              :options="currentQuestion.options"
              :selectedAnswer="selectedAnswer"
              :showResult="showResult"
              @select="selectAnswer"
            />
          </template>

          <!-- Slot: Botones de acción -->
          <template #actions>
            <div class="action-buttons">
              <!-- Botón: Confirmar respuesta -->
              <button
                v-if="!showResult"
                class="btn-submit"
                :disabled="!selectedAnswer"
                @click="submitAnswer"
              >
                Confirmar Respuesta
              </button>

              <!-- Botón: Siguiente pregunta -->
              <button v-else class="btn-next" @click="nextQuestion">
                {{ isLastQuestion ? 'Finalizar Quiz' : 'Siguiente Pregunta →' }}
              </button>
            </div>
          </template>
        </QuestionCard>

        <!-- Marcador de puntos -->
        <QuizScore
          :correctAnswers="correctAnswers"
          :incorrectAnswers="incorrectAnswers"
          :totalPoints="totalPoints"
        />
      </div>

      <!-- ===== ESTADO: QUIZ TERMINADO ===== -->
      <QuizResults
        v-else
        :totalQuestions="questions.length"
        :correctAnswers="correctAnswers"
        :incorrectAnswers="incorrectAnswers"
        :totalPoints="totalPoints"
        :categoryName="categoryName"
        @retry="retryQuiz"
        @goBack="goBackToCategories"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Componentes
import Navbar from '@/components/Layout/Navbar.vue';
import LoadingSpinner from '@/components/Common/LoadingSpinner.vue';
import QuizProgress from '@/components/Quiz/QuizProgress.vue';
import QuestionCard from '@/components/Quiz/QuestionCard.vue';
import AnswerOptions from '@/components/Quiz/AnswerOptions.vue';
import QuizScore from '@/components/Quiz/QuizScore.vue';
import QuizResults from '@/components/Quiz/QuizResults.vue';

// Servicios
import api from '@/services/api';
import categoryService from '@/services/categoryService';
import sessionService from '@/services/sessionService';
import answerService from '@/services/answerService';

// ============================================
// ROUTER Y DATOS DEL USUARIO
// ============================================
const router = useRouter();
const route = useRoute();
const categoryId = route.params.categoryId;
const user = JSON.parse(localStorage.getItem('user'));

// ============================================
// ESTADO REACTIVO
// ============================================
const loading = ref(true);
const categoryName = ref('');
const questions = ref([]);
const currentQuestionIndex = ref(0);
const selectedAnswer = ref(null);
const showResult = ref(false);
const correctAnswers = ref(0);
const incorrectAnswers = ref(0);
const totalPoints = ref(0);
const finished = ref(false);
const timeRemaining = ref(30);
const sessionId = ref(null); // ID de la sesión actual

let timer = null;

// ============================================
// COMPUTED PROPERTIES
// ============================================
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1);

// ============================================
// LIFECYCLE: MONTAR COMPONENTE
// ============================================
// En QuizView.vue, reemplaza la sección onMounted así:

onMounted(async () => {
  console.log('Iniciando Quiz para categoría:', categoryId);

  if (!categoryId) {
    console.error(' No se recibió categoryId');
    router.push('/categories');
    return;
  }

  try {
    // 1. Iniciar sesión en el backend
    console.log('Iniciando sesión de quiz...');
    const sessionData = await sessionService.startSession(user.id, categoryId);
    sessionId.value = sessionData.session.id;
    console.log('Sesión iniciada:', sessionId.value);

    // 2. Obtener categoría
    const category = await categoryService.getCategoryById(categoryId);
    categoryName.value = category?.name || 'Quiz';
    console.log('Categoría:', categoryName.value);

    // 3. Obtener preguntas de la categoría (RUTA CORRECTA)
    console.log(' Obteniendo preguntas desde:', `/categories/${categoryId}/questions`);
    const response = await api.get(`/categories/${categoryId}/questions`);
    
    console.log(' Respuesta del servidor:', response.data);
    
    // Extraer las preguntas correctamente
    const questionsData = response.data.data.questions || [];
    
    console.log(' Preguntas obtenidas:', questionsData.length);

    if (questionsData.length === 0) {
      console.warn(' No hay preguntas en esta categoría');
      alert('No hay preguntas disponibles en esta categoría');
      router.push('/categories');
      return;
    }

    // 4. Obtener opciones para cada pregunta (multiple_choice)
    for (const q of questionsData) {
      if (q.type === 'multiple_choice') {
        try {
          const optsResponse = await api.get(`/questions/${q.id}/options`);
          // Asumiendo que la respuesta tiene estructura: { data: [...] } o similar
          q.options = optsResponse.data.data ||  [];
          console.log(`Opciones para pregunta ${q.id}:`, q.options.length);
        } catch (error) {
          console.error(` Error obteniendo opciones para pregunta ${q.id}:`, error);
          q.options = [];
        }
      } else if (q.type === 'true_false') {
        // Para true/false, crear opciones automáticamente
        q.options = [
          { id: 'true', option_text: 'Verdadero', is_correct: q.correct_answer === 'Verdadero' },
          { id: 'false', option_text: 'Falso', is_correct: q.correct_answer === 'Falso' }
        ];
      }
    }

    questions.value = questionsData;
    console.log(' Quiz cargado completamente:', questions.value.length, 'preguntas');

    // 5. Iniciar timer
    startTimer();

  } catch (err) {
    console.error(' Error cargando quiz:', err);
    console.error('Detalles del error:', err.response?.data || err.message);
    alert('Error cargando el quiz: ' + (err.response?.data?.message || err.message));
    router.push('/categories');
  } finally {
    loading.value = false;
  }
});
// ============================================
// MANEJO DEL TIMER
// ============================================
const startTimer = () => {
  timeRemaining.value = 30;
  timer = setInterval(() => {
    timeRemaining.value--;
    if (timeRemaining.value <= 0) {
      submitAnswer(); // Auto-submit cuando se acaba el tiempo
    }
  }, 1000);
};

const resetTimer = () => {
  clearInterval(timer);
  startTimer();
};

// ============================================
// MÉTODOS DEL QUIZ
// ============================================

/**
 * Seleccionar una respuesta
 */
const selectAnswer = (answerId) => {
  if (!showResult.value) {
    selectedAnswer.value = answerId;
    console.log(' Respuesta seleccionada:', answerId);
  }
};

/**
 * Enviar respuesta y validar
 */
const submitAnswer = async () => {
  clearInterval(timer);

  if (!selectedAnswer.value && timeRemaining.value > 0) {
    console.warn(' No se seleccionó ninguna respuesta');
    return;
  }

  const selectedOption = currentQuestion.value.options.find(
    opt => opt.id === selectedAnswer.value
  );
  
  const isCorrect = selectedOption?.is_correct || false;
  const pointsEarned = isCorrect ? (currentQuestion.value.points || 10) : 0;

  console.log(' Resultado:', { isCorrect, pointsEarned });

  // Actualizar contadores locales
  if (isCorrect) {
    correctAnswers.value++;
    totalPoints.value += pointsEarned;
  } else {
    incorrectAnswers.value++;
  }

  // Guardar respuesta en el backend
  try {
    // 1. Guardar en tabla answers
    await answerService.saveAnswer({
      user_id: user.id,
      question_id: currentQuestion.value.id,
      selected_answer: selectedOption?.option_text || 'Sin respuesta'
    });

    // 2. Actualizar progreso de la sesión
    await sessionService.answerQuestion(sessionId.value, {
      question_id: currentQuestion.value.id,
      selected_answer: selectedOption?.option_text || 'Sin respuesta',
      is_correct: isCorrect,
      points_earned: pointsEarned
    });

    console.log(' Respuesta guardada en backend');
  } catch (error) {
    console.error(' Error guardando respuesta:', error);
  }

  // Mostrar resultado
  showResult.value = true;
};

/**
 * Ir a la siguiente pregunta
 */
const nextQuestion = () => {
  if (isLastQuestion.value) {
    finishQuiz();
  } else {
    currentQuestionIndex.value++;
    selectedAnswer.value = null;
    showResult.value = false;
    resetTimer();
  }
};

/**
 * Finalizar quiz
 */
const finishQuiz = async () => {
  clearInterval(timer);

  try {
    // Completar sesión en el backend
    await sessionService.completeSession(sessionId.value);
    console.log('Sesión completada');
  } catch (error) {
    console.error(' Error completando sesión:', error);
  }

  finished.value = true;
};

/**
 * Reintentar quiz (misma categoría)
 */
const retryQuiz = () => {
  router.go(0); // Recargar la página
};

/**
 * Volver a categorías
 */
const goBackToCategories = () => {
  router.push('/categories');
};

// ============================================
// CLEANUP: LIMPIAR TIMER AL DESMONTAR
// ============================================
onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.quiz-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 2rem;
}

.quiz-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.quiz-content {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Botones de acción */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-submit,
.btn-next {
  flex: 1;
  padding: 1.25rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-next {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.btn-next:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.4);
}

@media (max-width: 768px) {
  .quiz-container {
    padding: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>