import { defineStore } from "pinia";
import API from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),
  actions: {
    async login(email, password) {
      const res = await API.post("/auth/login", { email, password });
      this.token = res.data.token;
      localStorage.setItem("token", this.token);
      this.user = res.data.user;
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
