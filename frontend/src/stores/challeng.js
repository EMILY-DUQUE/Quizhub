import { defineStore } from "pinia";
import API from "../services/api";

export const useChallengeStore = defineStore("challenge", {
  state: () => ({
    activeChallenge: null,
  }),
  actions: {
    async startChallenge(opponentId) {
      const res = await API.post("/challenge/start", { opponentId });
      this.activeChallenge = res.data;
    },
    async getChallenge(id) {
      const res = await API.get(`/challenge/${id}`);
      this.activeChallenge = res.data;
    },
  },
});
