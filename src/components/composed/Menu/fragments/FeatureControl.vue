<script setup lang="ts">
import { Box, Button, Tooltip } from '@/components'
import { useSTLViewerStore } from '@/stores/stlViewerStore'
import { storeToRefs } from 'pinia'
import { Camera, Rotate3D, Lightbulb } from 'lucide-vue-next'
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
    description: 'Modo rotação \n (R)',
  },
  {
    mode: 'camera',
    icon: Camera,
    description: 'Modo câmera: (C)',
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
  <Box title="Funcionalidades">
    <div class="control-buttons">
      <Tooltip v-for="button in controls" :key="button.mode" position="bottom">
        <Button :type="button.type" @click="setControlMode(button.mode as TControlMode)">
          <component :is="button.icon" :size="18" />
        </Button>
        <template #content>
          {{ button.description }}
        </template>
      </Tooltip>
      <Tooltip position="bottom">
        <Button :type="lightsEnabled ? 'success' : 'muted'" @click="toggleLights">
          <Lightbulb :size="18" />
        </Button>
        <template #content>
          {{ lightsEnabled ? 'Desativar Luzes' : 'Ativar Luzes' }}
        </template>
      </Tooltip>
    </div>
    <Tooltip text="Volta o objeto para posição inicial" position="bottom">
      <Button type="warning" @click="resetTransform"> ↺ Resetar Posição </Button>
    </Tooltip>
  </Box>
</template>
<style scoped>
.control-buttons {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1rem;
}
</style>
