import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Quiz from "../views/Quiz.vue";
import Leaderboard from "../views/Leaderboard.vue";
import Profile from "../views/Profile.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/quiz", component: Quiz },
  { path: "/leaderboard", component: Leaderboard },
  { path: "/profile", component: Profile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
