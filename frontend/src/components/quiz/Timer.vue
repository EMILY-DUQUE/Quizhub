<template>
  <div class="timer">
    ⏱ {{ time }}s
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  start: { type: Number, default: 30 }
});

const time = ref(props.start);
let interval;

onMounted(() => {
  interval = setInterval(() => {
    if (time.value > 0) {
      time.value--;
    }
  }, 1000);
});

onUnmounted(() => clearInterval(interval));
</script>

<style>
.timer {
  font-size: 18px;
  font-weight: bold;
  margin: 10px;
}
</style>
