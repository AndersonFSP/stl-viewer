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
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #42b983;
}

.box-title {
  margin-bottom: 1rem;
  margin-top: -0.5rem;
}
</style>
