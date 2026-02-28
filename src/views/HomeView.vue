<script setup lang="ts">
import { ref } from 'vue'
import { useThreeScene } from '@/composables/useThreeScene'

const canvasRef = ref<HTMLCanvasElement | null>(null)

useThreeScene(canvasRef)
</script>

<template>
  <main>
    <div class="three-container">
      <h1>Three.js - Teste do Cubo Colorido</h1>
      <canvas ref="canvasRef" class="three-canvas"></canvas>
    </div>
  </main>
</template>

<style scoped>
.three-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

h1 {
  margin-bottom: 1rem;
  color: #42b983;
}

.three-canvas {
  width: 800px;
  height: 600px;
  border: 2px solid #42b983;
  border-radius: 8px;
}

@media (max-width: 900px) {
  .three-canvas {
    width: 100%;
    height: 400px;
  }
}
</style>
