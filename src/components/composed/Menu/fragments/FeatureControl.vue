<script setup lang="ts">
import { Box, Button } from '@/components'
import { useSTLViewerStore } from '@/stores/stlViewerStore'
import { storeToRefs } from 'pinia'

const store = useSTLViewerStore()
const { controlMode } = storeToRefs(store)
const { toggleControlMode, resetTransform } = store
</script>
<template>
  <Box>
    <Button :type="controlMode === 'object' ? 'success' : 'info'" @click="toggleControlMode">
      <span v-if="controlMode === 'object'">🎯 Modo: Rotacionar Objeto</span>
      <span v-else>📷 Modo: Mover Câmera</span>
    </Button>
    <Button type="warning" @click="resetTransform"> ↺ Resetar Posição </Button>
  </Box>
</template>
