<script setup lang="ts">
import { Typography, Button, HighlightCard } from '@/components'
import { useSTLViewerStore } from '@/stores/stlViewerStore'
import { FileBoxIcon, Trash2Icon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const store = useSTLViewerStore()
const { fileName, hasFileAttached } = storeToRefs(store)
const { clearModel } = store
</script>
<template>
  <header class="header">
    <Typography tag="h1" size="3xl" bold color="primary" align="center" class="header-title">
      Visualizador de STL
    </Typography>

    <HighlightCard v-if="hasFileAttached" class="file-card">
      <div class="file-name">
        <div class="file-info">
          <FileBoxIcon :size="20" class="file-icon" />
          <Typography size="base" bold color="primary">
            {{ fileName }}
          </Typography>
        </div>
        <Button type="danger" @click="clearModel" size="sm">
          <Trash2Icon :size="16" />
        </Button>
      </div>
    </HighlightCard>
  </header>
</template>
<style scoped>
.header {
  margin-bottom: 0.5rem;
}

.header-title {
  margin-bottom: 1.5rem;
}

.file-card {
  max-width: 100%;
  padding: 0;
}

.file-name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  width: 100%;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.file-info :deep(p) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-icon {
  color: #27ae60;
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
