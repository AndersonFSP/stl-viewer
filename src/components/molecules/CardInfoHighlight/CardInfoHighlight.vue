<script setup lang="ts">
import { Typography } from '@/components'
import type { ICardInfoHighlightProps } from './types'
defineProps<ICardInfoHighlightProps>()
</script>
<template>
  <div class="card-info-highlight">
    <div class="header">
      <component :is="icon" :size="16" />
      <Typography tag="span" size="sm" weight="bold" color="primary">
        {{ title }}
      </Typography>
    </div>
    <div class="details">
      <div class="row" v-for="{ label, value } in details" :key="label">
        <Typography tag="span" size="xs" color="secondary">{{ label }}:</Typography>
        <Typography tag="span" size="xs" weight="bold">
          {{ value }}
        </Typography>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card-info-highlight {
  background: rgba(0, 170, 136, 0.1);
  border-color: rgba(0, 170, 136, 0.3);
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.2s ease;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-info-highlight:hover {
  background: rgba(0, 170, 136, 0.15);
  border-color: rgba(0, 170, 136, 0.4);
}
.header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
}

.details {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding-left: 0.25rem;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}
</style>
