<script setup lang="ts">
import type { IDividerProps } from './types'

withDefaults(defineProps<IDividerProps>(), {
  orientation: 'horizontal',
  spacing: 'md',
})
</script>

<template>
  <div class="divider" :class="[`divider-${orientation}`, `spacing-${spacing}`]" />
</template>

<style scoped>
.divider {
  background-color: rgba(255, 255, 255, 0.1);
}

.divider-horizontal {
  width: 100%;
  height: 1px;
}

.divider-vertical {
  width: 1px;
  height: 100%;
}

.spacing-sm {
  margin: 0.5rem 0;
}

.spacing-sm.divider-vertical {
  margin: 0 0.5rem;
}

.spacing-md {
  margin: 0.75rem 0;
}

.spacing-md.divider-vertical {
  margin: 0 0.75rem;
}

.spacing-lg {
  margin: 1rem 0;
}

.spacing-lg.divider-vertical {
  margin: 0 1rem;
}

.spacing-none {
  margin: 0;
}
</style>
