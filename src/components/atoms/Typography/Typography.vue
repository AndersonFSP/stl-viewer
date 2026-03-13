<script setup lang="ts">
import { computed } from 'vue'
import { THEME_COLORS, type ITypographyProps } from './types';

const props = withDefaults(defineProps<ITypographyProps>(), {
  tag: 'p',
  size: 'base',
  bold: false,
  color: 'text',
  align: 'left',
})

const getColor = (colorProp: ITypographyProps['color']): string => {
  return THEME_COLORS[colorProp as keyof typeof THEME_COLORS] || colorProp
}

const classes = computed(() => ({
  'typography-bold': props.bold,
  [`typography-${props.size}`]: true,
  [`text-${props.align}`]: true,
}))

const styles = computed(() => ({
  color: getColor(props.color as string),
}))

const sizeMap = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
}
</script>

<template>
  <component :is="tag" :class="classes" :style="[styles, { fontSize: sizeMap[size] }]">
    <slot />
  </component>
</template>

<style scoped>
.typography-bold {
  font-weight: 600;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-justify {
  text-align: justify;
}

/* Tamanhos de fonte */
.typography-xs {
  font-size: 0.75rem;
}

.typography-sm {
  font-size: 0.875rem;
}

.typography-base {
  font-size: 1rem;
}

.typography-lg {
  font-size: 1.125rem;
}

.typography-xl {
  font-size: 1.25rem;
}

.typography-2xl {
  font-size: 1.5rem;
}

.typography-3xl {
  font-size: 1.875rem;
}

.typography-4xl {
  font-size: 2.25rem;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 1rem 0 0.5rem 0;
  line-height: 1.2;
}

p {
  margin: 0.5rem 0;
  line-height: 1.5;
}

span {
  margin: 0;
  line-height: inherit;
}
</style>
