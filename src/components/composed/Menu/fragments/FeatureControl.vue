<script setup lang="ts">
import { Box, Button, Tooltip } from '@/components'
import { useSTLViewerStore } from '@/stores/stlViewerStore'
import { storeToRefs } from 'pinia'
import { Camera, Rotate3D, Lightbulb, Undo2, Scaling } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import type { TControlMode } from '@/models'
import type { TButtonType } from '@/components/base/Button/types'

const store = useSTLViewerStore()
const { controlMode, lightsEnabled } = storeToRefs(store)
const { resetTransform, setControlMode, toggleLights } = store

const buttonConfig = ref([
  {
    mode: 'object',
    icon: Rotate3D,
    description: 'Modo rotação: (R)',
  },
  {
    mode: 'camera',
    icon: Camera,
    description: 'Modo câmera: (C)',
  },
  {
    mode: 'scale',
    icon: Scaling,
    description: 'Modo escala: (S)',
  },
])

const controls = computed(() =>
  buttonConfig.value.map((button) => ({
    ...button,
    type: controlMode.value === button.mode ? 'success' : ('muted' as TButtonType),
  })),
)
</script>
<template>
  <section class="container">
    <Box title="Modos de controle">
      <div class="control-buttons">
        <Tooltip v-for="button in controls" :key="button.mode" position="bottom">
          <Button :type="button.type" @click="setControlMode(button.mode as TControlMode)">
            <component :is="button.icon" :size="18" />
          </Button>
          <template #content>
            {{ button.description }}
          </template>
        </Tooltip>
      </div>
    </Box>
    <Box title="Efeitos">
      <div class="control-buttons">
        <Tooltip position="bottom">
          <Button :type="lightsEnabled ? 'light' : 'muted'" @click="toggleLights">
            <Lightbulb :size="18" />
          </Button>
          <template #content>
            {{ lightsEnabled ? 'Desativar Luzes' : 'Ativar Luzes' }}
          </template>
        </Tooltip>
        <Tooltip text="Volta o objeto para posição inicial" position="bottom">
          <Button type="info" @click="resetTransform"> <Undo2 :size="18" /> </Button>
        </Tooltip>
      </div>
    </Box>
  </section>
</template>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.control-buttons {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1rem;
}
</style>
