<script setup lang="ts">
import { CanvasArea, Menu } from '@/components'
import { useTemplateRef, watchEffect } from 'vue'
import { useSTLViewerStore } from '@/stores/stlViewerStore'

const canvasArea = useTemplateRef('canvasArea')
const store = useSTLViewerStore()

const { loadFile, initViewer } = store

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file) {
    loadFile(file)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

watchEffect(() => {
  if (canvasArea.value?.canvasRef) {
    initViewer(canvasArea.value.canvasRef)
  }
})
</script>

<template>
  <Menu />
  <CanvasArea @drop="handleDrop" @dragover="handleDragOver" ref="canvasArea" />
  <!-- <div class="instructions">
      <h3>✨ Como Usar - SIMPLES:</h3>
      <div class="instruction-section highlight">
        <h4>🎯 Rotacionar o Objeto (PADRÃO):</h4>
        <ul>
          <li><strong>Clique e arraste</strong> em qualquer lugar para rotacionar o objeto</li>
          <li>O objeto vai girar seguindo o mouse</li>
          <li><strong>Scroll do mouse:</strong> Zoom in/out</li>
        </ul>
      </div>
      <div class="instruction-section">
        <h4>📷 Mover a Câmera:</h4>
        <ul>
          <li>
            <strong>Pressione a tecla <kbd>C</kbd></strong> ou clique no botão acima
          </li>
          <li>Agora você pode girar a câmera ao redor do objeto</li>
          <li>Pressione <kbd>C</kbd> novamente para voltar a rotacionar o objeto</li>
        </ul>
      </div>
      <div class="instruction-section">
        <h4>🔧 Outras Funções:</h4>
        <ul>
          <li><strong>Resetar:</strong> Volta o objeto para a posição inicial</li>
          <li><strong>Limpar:</strong> Remove o objeto da cena</li>
        </ul>
      </div>
    </div>
  </div>
</div> -->
</template>

<style scoped>
.about {
  min-height: 100vh;
  padding: 2rem;
  background: #0f0f0f;
  width: 500px;
}

.stl-viewer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.transform-controls {
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #42b983;
}

.mode-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 15px rgba(39, 174, 96, 0.6);
  }
  50% {
    box-shadow: 0 0 25px rgba(39, 174, 96, 0.9);
  }
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

.instructions {
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #42b983;
}

.instructions h3 {
  color: #42b983;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.instructions h4 {
  color: #42b983;
  margin: 1rem 0 0.5rem 0;
  font-size: 1.1rem;
}

.instruction-section {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #0f0f0f;
  border-radius: 6px;
}

.instruction-section.highlight {
  border: 2px solid #27ae60;
  background: linear-gradient(135deg, rgba(39, 174, 96, 0.1), rgba(39, 174, 96, 0.05));
}

.instruction-section:last-child {
  margin-bottom: 0;
}

.instructions ul {
  list-style: none;
  padding: 0;
  padding-left: 1rem;
}

.instructions li {
  color: #ccc;
  padding: 0.5rem 0;
  font-size: 1rem;
  line-height: 1.5;
}

.instructions strong {
  color: #42b983;
}

.instructions kbd {
  background: #2c3e50;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  color: #42b983;
  border: 1px solid #42b983;
  font-weight: bold;
}

@media (max-width: 768px) {
  .about {
    padding: 1rem;
  }

  .canvas-container {
    height: 500px;
  }

  .drop-hint {
    font-size: 1rem;
    padding: 1rem;
  }
}
</style>
