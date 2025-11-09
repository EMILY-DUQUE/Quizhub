// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import authService from '@/services/authService';

// ============================================
// IMPORTAR VISTAS
// ============================================
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import DashboardView from '@/views/DashboardView.vue';
  import CategoriesView from '@/views/CategoriesView.vue';
import QuizView from '@/views/QuizView.vue';
import ResultsView from '@/views/ResultsView.vue';
import RankingView from '@/views/RankingView.vue';
import ProfileView from '@/views/ProfileView.vue';

// ============================================
// DEFINICIÓN DE RUTAS
// ============================================
const routes = [
  // ============================================
  // RUTAS PÚBLICAS
  // ============================================
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresAuth: false }
  },

  // ============================================
  // RUTAS PRIVADAS (requieren autenticación)
  // ============================================
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('../views/CategoriesView.vue'),
    meta: { requiresAuth: true }
  },
  {
  path: '/quiz/:categoryId',
  name: 'quiz',
  component: () => import('../views/QuizView.vue'),
  meta: { requiresAuth: true },
  props: true
},

  {
    path: '/results/:attemptId',
    name: 'results',
    component: ResultsView,
    meta: { requiresAuth: true },
    props: true // Permite pasar attemptId como prop
  },
  {
    path: '/ranking',
    name: 'ranking',
    component: RankingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },

  // ============================================
  // RUTA 404 - NO ENCONTRADA
  // ============================================
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

// ============================================
// CREAR INSTANCIA DEL ROUTER
// ============================================
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Scroll al top en cada cambio de ruta
    return { top: 0 };
  }
});

// ============================================
// NAVIGATION GUARD GLOBAL
// ============================================
// Se ejecuta ANTES de cada navegación
// Protege las rutas privadas
// ============================================
router.beforeEach((to, from, next) => {
  // Verificar si la ruta requiere autenticación
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // Verificar si el usuario está autenticado
  const isAuthenticated = authService.isAuthenticated();

  // ============================================
  // LÓGICA DE PROTECCIÓN
  // ============================================
  
  // Si la ruta requiere auth y NO está autenticado
  if (requiresAuth && !isAuthenticated) {
    // Redirigir al login
    next('/login');
  }
  // Si está autenticado e intenta ir a login/register
  else if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    // Redirigir al dashboard
    next('/dashboard');
  }
  // En cualquier otro caso, permitir navegación
  else {
    next();
  }
});

export default router;