<template>
  <div class="progress-section">
    <div class="progress-info">
      <span>Pregunta {{ current + 1 }} de {{ total }}</span>
      <span class="timer">⏱️ {{ timeRemaining }}s</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  current: Number,
  total: Number,
  timeRemaining: Number,
  progress: Number
});
</script>
