<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSTLViewerStore } from '@/stores/stlViewerStore'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const store = useSTLViewerStore()

const emit = defineEmits<{
  drop: [event: DragEvent]
  dragover: [event: DragEvent]
}>()

const hasFile = computed(() => !!store.fileName)

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  emit('drop', event)
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  emit('dragover', event)
}

defineExpose({
  canvasRef,
})
</script>

<template>
  <div class="canvas-container" @drop="handleDrop" @dragover="handleDragOver">
    <canvas ref="canvasRef" class="stl-canvas"></canvas>
    <div v-if="!hasFile" class="drop-hint">
      Arraste um arquivo .stl aqui ou clique no botão acima
    </div>
  </div>
</template>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 700px;
  margin: 0 auto 2rem auto;
  border: 2px dashed #42b983;
  border-radius: 12px;
  overflow: visible;
  touch-action: none;
}

.stl-canvas {
  width: 100%;
  height: 100%;
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
