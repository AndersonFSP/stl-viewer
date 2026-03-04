<script setup lang="ts">
import { CanvasArea, Menu } from '@/components'
</script>

<template>
  <div class="stl-viewer-layout">
    <Menu />
    <CanvasArea />
  </div>
</template>

<style scoped>
.stl-viewer-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #0f0f0f;
  overflow: hidden;
}

.stl-viewer-layout :deep(.menu) {
  flex-shrink: 0;
}

.stl-viewer-layout :deep(.canvas-container) {
  flex: 1;
  min-width: 0;
}

@media (max-width: 1024px) {
  .stl-viewer-layout {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  .stl-viewer-layout :deep(.menu) {
    width: 100%;
    border-right: none;
    border-bottom: 2px solid #42b983;
  }

  .stl-viewer-layout :deep(.canvas-container) {
    min-height: 600px;
    flex: 1;
  }
}

@media (max-width: 768px) {
  .menu {
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
