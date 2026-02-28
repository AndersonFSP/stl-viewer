<script setup lang="ts">
import { ref } from 'vue'
import { useSTLViewer } from '@/composables/useSTLViewer'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const { isLoading, error, fileName, loadFile, clearModel } = useSTLViewer(canvasRef)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    loadFile(file)
  }
}

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

const triggerFileInput = () => {
  fileInputRef.value?.click()
}
</script>

<template>
  <div class="about">
    <div class="stl-viewer-container">
      <h1>Visualizador de STL</h1>

      <div class="controls">
        <input
          ref="fileInputRef"
          type="file"
          accept=".stl"
          @change="handleFileSelect"
          style="display: none"
        />

        <button @click="triggerFileInput" class="btn btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Carregando...' : 'Selecionar Arquivo STL' }}
        </button>

        <button v-if="fileName" @click="clearModel" class="btn btn-secondary">
          Limpar Modelo
        </button>
      </div>

      <div v-if="fileName" class="file-info">
        <span class="file-name">📄 {{ fileName }}</span>
      </div>

      <div v-if="error" class="error-message">
        ⚠️ {{ error }}
      </div>

      <div
        class="canvas-container"
        @drop="handleDrop"
        @dragover="handleDragOver"
      >
        <canvas ref="canvasRef" class="stl-canvas"></canvas>
        <div v-if="!fileName" class="drop-hint">
          Arraste um arquivo .stl aqui ou clique no botão acima
        </div>
      </div>

      <div class="instructions">
        <h3>Controles:</h3>
        <ul>
          <li><strong>Rotacionar:</strong> Botão esquerdo do mouse + arrastar</li>
          <li><strong>Zoom:</strong> Scroll do mouse</li>
          <li><strong>Pan:</strong> Botão direito do mouse + arrastar</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  min-height: 100vh;
  padding: 2rem;
  background: #0f0f0f;
}

.stl-viewer-container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #42b983;
  margin-bottom: 1.5rem;
  text-align: center;
}

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #42b983;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #38a073;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #e74c3c;
  color: white;
}

.btn-secondary:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.file-info {
  text-align: center;
  margin-bottom: 1rem;
}

.file-name {
  color: #42b983;
  font-size: 1.1rem;
  font-weight: 500;
}

.error-message {
  background: #e74c3c;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
}

.canvas-container {
  position: relative;
  width: 100%;
  height: 600px;
  border: 2px dashed #42b983;
  border-radius: 12px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.stl-canvas {
  width: 100%;
  height: 100%;
  display: block;
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
}

.instructions ul {
  list-style: none;
  padding: 0;
}

.instructions li {
  color: #ccc;
  padding: 0.5rem 0;
  font-size: 1rem;
}

.instructions strong {
  color: #42b983;
}

@media (max-width: 768px) {
  .about {
    padding: 1rem;
  }

  .canvas-container {
    height: 400px;
  }

  .drop-hint {
    font-size: 1rem;
    padding: 1rem;
  }
}
</style>

