<template>
  <div>
    <h1>Quiz en progreso</h1>
    <div v-if="questions.length === 0">
      <p>Cargando preguntas...</p>
    </div>
    <div v-else>
      <div v-for="q in questions" :key="q.id">
        <h3>{{ q.question }}</h3>
        <button
          v-for="opt in q.options"
          :key="opt"
          @click="answer(opt === q.correct)"
        >
          {{ opt }}
        </button>
      </div>
      <p>Puntaje: {{ score }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useQuizStore } from "../stores/quiz";

const quiz = useQuizStore();
const { questions, score } = quiz;

onMounted(() => {
  quiz.loadQuestions();
});

const answer = (isCorrect) => {
  quiz.answerQuestion(isCorrect);
};
</script>
