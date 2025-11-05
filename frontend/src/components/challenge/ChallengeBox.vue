<template>
  <div class="challenge-box">
    <h2>🔥 Desafío Activo</h2>
    <p>Jugador 1: {{ player1 }}</p>
    <p>Jugador 2: {{ player2 }}</p>
    <p>Estado: {{ status }}</p>
  </div>
</template>

<script setup>
defineProps({
  player1: String,
  player2: String,
  status: String
});
</script>

<style>
.challenge-box {
  border: 2px solid red;
  padding: 20px;
  background: #ffeaea;
}
</style>
