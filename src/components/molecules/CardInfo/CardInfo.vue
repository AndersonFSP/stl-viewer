<script setup lang="ts">
import { Typography } from '@/components'
import type { ICardInfoProps } from './types'

defineProps<ICardInfoProps>()
</script>
<template>
  <div class="card-info">
    <div class="card-icon">
      <component :is="icon" :size="16" />
    </div>
    <div class="card-content">
      <Typography tag="span" size="sm" color="secondary">{{ label }}</Typography>
      <Typography tag="p" size="xs" weight="bold">
        {{ value }}
      </Typography>
    </div>
  </div>
</template>
<style scoped>
.card-info {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.card-info:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: rgba(0, 170, 136, 0.2);
  color: var(--color-primary);
  flex-shrink: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}
</style>
