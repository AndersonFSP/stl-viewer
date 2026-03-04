<script setup lang="ts">
import { computed } from 'vue'
import { Typography } from '@/components'
import type { IButtonProps } from './types'

const props = withDefaults(defineProps<IButtonProps>(), {
  type: 'primary',
  size: 'base',
  disabled: false,
  loading: false,
  fullWidth: false,
})

const typeStyles = {
  primary: {
    bg: '#42b983',
    bgHover: '#38a073',
    color: 'white',
  },
  secondary: {
    bg: '#e74c3c',
    bgHover: '#c0392b',
    color: 'white',
  },
  danger: {
    bg: '#e74c3c',
    bgHover: '#c0392b',
    color: 'white',
  },
  warning: {
    bg: '#e67e22',
    bgHover: '#d35400',
    color: 'white',
  },
  info: {
    bg: '#3498db',
    bgHover: '#2980b9',
    color: 'white',
  },
  success: {
    bg: '#27ae60',
    bgHover: '#229954',
    color: 'white',
  },
  muted: {
    bg: '#34495e',
    bgHover: '#2c3e50',
    color: '#ecf0f1',
  },
  light: {
    bg: '#FFD700',
    bgHover: '#FFC700',
    color: '#1a1a1a',
  },
}

const currentStyle = computed(() => typeStyles[props.type])

const paddingClasses = computed(() => {
  const paddingMap = {
    sm: 'button-sm',
    base: 'button-base',
    lg: 'button-lg',
  }
  return paddingMap[props.size]
})

const buttonClasses = computed(() => ({
  'w-full': props.fullWidth,
  'opacity-50 cursor-not-allowed': props.disabled,
  [paddingClasses.value]: true,
}))

const buttonStyle = computed(() => ({
  backgroundColor: currentStyle.value.bg,
  color: currentStyle.value.color,
}))
</script>

<template>
  <button
    :disabled="disabled || loading"
    :class="buttonClasses"
    class="button-component"
    :style="buttonStyle"
  >
    <slot>
      <Typography
        tag="span"
        :size="size === 'sm' ? 'xs' : size === 'lg' ? 'lg' : 'base'"
        bold
        :color="currentStyle.color"
      >
        {{ loading ? 'Carregando...' : 'Botão' }}
      </Typography>
    </slot>
  </button>
</template>

<style scoped>
.button-component {
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-height: 2.5rem;
}

.button-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.button-base {
  padding: 0.625rem 1.5rem;
  font-size: 1rem;
}

.button-lg {
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
}

.button-component:not(:disabled):hover {
  filter: brightness(0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.button-component:not(:disabled):active {
  transform: translateY(0);
}

.button-component:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.w-full {
  width: 100%;
}

/* Estilo especial para botão de luz acesa */
.button-component[style*="FFD700"],
.button-component[style*="FFC700"] {
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
  position: relative;
}

.button-component[style*="FFD700"]:not(:disabled):hover,
.button-component[style*="FFC700"]:not(:disabled):hover {
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.8), 0 4px 12px rgba(0, 0, 0, 0.3);
  filter: brightness(1.1);
}
</style>
