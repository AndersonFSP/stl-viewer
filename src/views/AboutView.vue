<script setup lang="ts">
import { ref } from 'vue'
import { useSTLViewer } from '@/composables/useSTLViewer'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const {
  isLoading,
  error,
  fileName,
  controlMode,
  loadFile,
  clearModel,
  toggleControlMode,
  resetTransform,
} = useSTLViewer(canvasRef)

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

const handleToggleMode = () => {
  toggleControlMode()
}

const handleResetTransform = () => {
  resetTransform()
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

        <button v-if="fileName" @click="clearModel" class="btn btn-secondary">Limpar Modelo</button>
      </div>

      <div v-if="fileName" class="transform-controls">
        <div class="control-group">
          <button
            @click="handleToggleMode"
            :class="[
              'btn',
              'btn-toggle',
              { 'mode-object': controlMode === 'object', 'mode-camera': controlMode === 'camera' },
            ]"
          >
            <span v-if="controlMode === 'object'"
              >🎯 Modo: Rotacionar Objeto (Pressione C para alternar)</span
            >
            <span v-else>📷 Modo: Mover Câmera (Pressione C para alternar)</span>
          </button>
          <button @click="handleResetTransform" class="btn btn-reset">↺ Resetar Posição</button>
        </div>
      </div>

      <div v-if="fileName" class="file-info">
        <span class="file-name">📄 {{ fileName }}</span>
      </div>

      <div v-if="error" class="error-message">⚠️ {{ error }}</div>

      <div class="canvas-container" @drop="handleDrop" @dragover="handleDragOver">
        <canvas ref="canvasRef" class="stl-canvas"></canvas>
        <div v-if="!fileName" class="drop-hint">
          Arraste um arquivo .stl aqui ou clique no botão acima
        </div>
      </div>

      <div class="instructions">
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

.transform-controls {
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #42b983;
}

.control-group {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-group label {
  color: #42b983;
  font-weight: 600;
  margin-right: 0.5rem;
}

.mode-buttons {
  display: flex;
  gap: 0.5rem;
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

.btn-toggle {
  background: #34495e;
  color: #ecf0f1;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  min-width: 350px;
}

.btn-toggle:hover {
  background: #42b983;
  transform: translateY(-2px);
}

.btn-toggle.mode-object {
  background: #27ae60;
  box-shadow: 0 0 15px rgba(39, 174, 96, 0.6);
  animation: pulse 2s infinite;
}

.btn-toggle.mode-camera {
  background: #3498db;
  box-shadow: 0 0 15px rgba(52, 152, 219, 0.6);
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

.btn-reset {
  background: #e67e22;
  color: white;
}

.btn-reset:hover {
  background: #d35400;
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
    height: 400px;
  }

  .drop-hint {
    font-size: 1rem;
    padding: 1rem;
  }
}
</style>
