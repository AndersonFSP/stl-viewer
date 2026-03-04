<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ITooltipProps } from './types'

const props = withDefaults(defineProps<ITooltipProps>(), {
  position: 'top',
  delay: 200,
})

const isVisible = ref(false)

const positionClasses = computed(() => {
  const positions = {
    top: 'tooltip-top',
    bottom: 'tooltip-bottom',
    left: 'tooltip-left',
    right: 'tooltip-right',
  }
  return positions[props.position]
})

let timeoutId: number | null = null

const showTooltip = () => {
  timeoutId = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

const hideTooltip = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  isVisible.value = false
}
</script>

<template>
  <div class="tooltip-wrapper" @mouseenter="showTooltip" @mouseleave="hideTooltip">
    <slot />
    <Transition name="tooltip-fade">
      <div v-if="isVisible" :class="['tooltip', positionClasses]">
        <slot name="content">
          {{ text }}
        </slot>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
  z-index: 10000;
}

.tooltip {
  position: absolute;
  background: rgba(80, 80, 80, 0.95);
  color: #e0e0e0;
  padding: 0.9rem 1.2rem;
  border-radius: 6px;
  font-size: 0.95rem;
  z-index: 999999;
  border: 1px solid rgba(150, 150, 150, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  pointer-events: none;
  font-weight: 500;
  letter-spacing: 0.3px;
  min-width: 180px;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: normal;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.tooltip-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.tooltip-top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.6rem;
}

.tooltip-bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0.6rem;
}

.tooltip-left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 0.6rem;
}

.tooltip-right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 0.6rem;
}
</style>
