<script setup lang="ts">
import { HighlightCard, Typography } from '@/components'
import { useSTLViewerStore } from '@/stores/stlViewerStore'
import { Camera, Rotate3D, Scaling } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const store = useSTLViewerStore()
const { controlMode } = storeToRefs(store)

const config = {
  object: {
    title: 'Modo de Rotação',
    icon: Rotate3D,
    list: [
      'Clique e arraste em qualquer lugar para rotacionar o objeto',
    ],
  },
  camera: {
    title: 'Modo de Câmera',
    icon: Camera,
    list: [
      'Clique e arraste em qualquer lugar para rotacionar a câmera',
      'Zoom in/out com o scroll do mouse',
      'Botão direito do mouse para mover lateralmente',
    ],
  },
  scale: {
    title: 'Modo de Escala',
    icon: Scaling,
    list: [
      'Utilize o scroll do mouse para aumentar ou diminuir a escala do objeto',
    ],
  }
}

const instruction = computed(() => config[controlMode.value])
</script>
<template>
  <section class="container">
    <HighlightCard :list="instruction.list">
      <Typography tag="h3" size="lg" color="primary" >
        <div class="title">
          <component :is="instruction.icon" :size="24" /> {{ instruction.title }}
        </div>
      </Typography>
    </HighlightCard>
  </section>
</template>
<style scoped>
.container {
  position: absolute;
  right: 26px;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
