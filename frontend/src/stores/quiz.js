import { defineStore } from "pinia";
import API from "../services/api";

export const useQuizStore = defineStore("quiz", {
  state: () => ({
    questions: [],
    score: 0,
  }),
  actions: {
    async loadQuestions() {
      const res = await API.get("/quiz");
      this.questions = res.data;
    },
    answerQuestion(isCorrect) {
      if (isCorrect) this.score += 10;
    },
    resetQuiz() {
      this.questions = [];
      this.score = 0;
    },
  },
});
