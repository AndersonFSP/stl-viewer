<script setup lang="ts">
import { Typography } from '@/components'
import type { IHighlightCardProps } from './types'

withDefaults(defineProps<IHighlightCardProps>(), {
  list: () => [],
})
</script>
<template>
  <div class="highlight">
    <slot />
    <ul>
      <li v-for="value in list" :key="value">
        <Typography size="sm" color="text">{{ value }}</Typography>
      </li>
    </ul>
  </div>
</template>
<style scoped>
.highlight {
  max-width: 350px;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
  border-radius: 12px;
  border-left: 4px solid #27ae60;
  border: 1px solid rgba(39, 174, 96, 0.3);
  border-left: 4px solid #27ae60;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
}

.highlight::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(39, 174, 96, 0.3), rgba(39, 174, 96, 0.1));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.highlight:hover {
  box-shadow:
    0 8px 24px rgba(39, 174, 96, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-color: rgba(39, 174, 96, 0.5);
  transform: translateY(-2px);
}

.highlight:hover::before {
  opacity: 1;
}

.highlight ul {
  list-style: none;
  padding: 0;
  padding-left: 0.5rem;
  margin: 0;
}

.highlight li {
  position: relative;
  padding-left: 1.5rem;
  transition: transform 0.2s ease;
}

.highlight li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: #27ae60;
  font-weight: bold;
  transition: transform 0.2s ease;
}

.highlight li:hover {
  transform: translateX(4px);
}

.highlight li:hover::before {
  transform: translateX(-2px);
}
</style>
