<script setup lang="ts"></script>
<template>
  <section class="container">
    <slot />
  </section>
</template>
<style scoped>
.container {
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #42b983;
}
</style>
