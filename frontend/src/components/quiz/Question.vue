<template>
  <div class="question-box">
    <h3>{{ question.text }}</h3>
    <div v-for="opt in question.options" :key="opt">
      <button @click="$emit('answer', opt)">
        {{ opt }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  question: Object
});
</script>

<style>
.question-box {
  border: 1px solid #ccc;
  padding: 15px;
  margin: 10px;
}
</style>
