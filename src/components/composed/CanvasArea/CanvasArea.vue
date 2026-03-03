<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSTLViewerStore } from '@/stores/stlViewerStore'
import { storeToRefs } from 'pinia'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const store = useSTLViewerStore()
const { hasFileAttached } = storeToRefs(store)

const { initViewer, loadFile } = store

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (file) {
    loadFile(file)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

onMounted(() => {
  if (canvasRef.value) {
    initViewer(canvasRef.value)
  }
})
</script>

<template>
  <div class="canvas-container" @drop="handleDrop" @dragover="handleDragOver">
    <canvas ref="canvasRef" class="stl-canvas"></canvas>
    <div v-if="!hasFileAttached" class="drop-hint">
      Arraste um arquivo .stl aqui ou utilize o botão
    </div>
  </div>
</template>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 100vh;
  /* margin: auto 1rem; */
  padding: 1.5rem;
  /* border: 1px solid rgba(66, 185, 131, 0.3); */
  border-radius: 8px;
  overflow: hidden;
  touch-action: none;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.3),
    inset 0 0 40px rgba(66, 185, 131, 0.05);
}

.stl-canvas {
  flex: 1;
  width: 100%;
  display: block;
  cursor: grab;
  touch-action: none;
}

.stl-canvas:active {
  cursor: grabbing;
}

.drop-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 1.2rem;
  text-align: center;
  pointer-events: none;
  padding: 2rem;
}

@media (max-width: 768px) {
  .canvas-container {
    height: 500px;
  }

  .drop-hint {
    font-size: 1rem;
    padding: 1rem;
  }
}
</style>
