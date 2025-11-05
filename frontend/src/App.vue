<template>
  <div>
    <Navbar />   <!-- 👈 agregado -->
    <router-view />
  </div>
</template>

<script setup>
import Navbar from "./components/common/Navbar.vue";
</script>
