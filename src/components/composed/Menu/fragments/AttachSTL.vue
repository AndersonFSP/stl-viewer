<script setup lang="ts">
import { FileInput } from '@/components'
import { useSTLViewerStore } from '@/stores/stlViewerStore'
import { storeToRefs } from 'pinia'

const store = useSTLViewerStore()
const { isLoading } = storeToRefs(store)
const { loadFile } = store
</script>

<template>
  <div class="container">
    <FileInput
      accept=".stl"
      buttonText="Selecionar Arquivo STL"
      loadingText="Carregando..."
      :loading="isLoading"
      @fileSelected="loadFile"
    />
  </div>
</template>
<style scoped>
.container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
</style>
