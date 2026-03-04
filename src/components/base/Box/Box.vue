<script setup lang="ts">
import { Typography } from '@/components'
import type { IBoxProps } from './types'

defineProps<IBoxProps>()
</script>

<template>
  <section class="container">
    <Typography v-if="title" size="base" bold color="primary" class="box-title">
      {{ title }}
    </Typography>
    <slot />
  </section>
</template>

<style scoped>
.container {
  background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #42b983;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(66, 185, 131, 0.2);
  transition: all 0.3s ease; 
}

.container:hover {
  box-shadow: 0 8px 24px rgba(66, 185, 131, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-color: rgba(66, 185, 131, 0.4);
}

.box-title {
  margin-bottom: 1rem;
  margin-top: -0.5rem;
  /* text-transform: uppercase; */
  letter-spacing: 0.1em;
  font-size: 0.9rem;
}
</style>
