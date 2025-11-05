<template>
  <div>
    <h1>👤 Perfil</h1>
    <div v-if="auth.user">
      <p><b>Nombre:</b> {{ auth.user.name }}</p>
      <p><b>Email:</b> {{ auth.user.email }}</p>
      <button @click="auth.logout()">Cerrar sesión</button>
    </div>
    <div v-else>
      <p>No has iniciado sesión</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
</script>
