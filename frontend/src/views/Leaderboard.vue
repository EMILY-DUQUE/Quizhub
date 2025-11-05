<template>
  <div>
    <h1>🏆 Ranking</h1>
    <ul>
      <li v-for="user in leaderboard" :key="user.id">
        {{ user.name }} — {{ user.points }} pts
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import API from "../services/api";

const leaderboard = ref([]);

onMounted(async () => {
  const res = await API.get("/leaderboard");
  leaderboard.value = res.data;
});
</script>
