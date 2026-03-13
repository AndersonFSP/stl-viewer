<script setup lang="ts">
import { ref } from 'vue'
import type { ITooltipProps } from './types'

const props = withDefaults(defineProps<ITooltipProps>(), {
  position: 'top',
  delay: 200,
})

const isVisible = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)
const tooltipStyle = ref({})

let timeoutId: number | null = null

const calculatePosition = () => {
  if (!wrapperRef.value) return

  const rect = wrapperRef.value.getBoundingClientRect()

  const styles: Record<string, string> = {
    position: 'fixed',
    zIndex: '999999',
  }

  switch (props.position) {
    case 'top':
      styles.left = `${rect.left + rect.width / 2}px`
      styles.bottom = `${window.innerHeight - rect.top + 10}px`
      styles.transform = 'translateX(-50%)'
      break
    case 'bottom':
      styles.left = `${rect.left + rect.width / 2}px`
      styles.top = `${rect.bottom + 10}px`
      styles.transform = 'translateX(-50%)'
      break
    case 'left':
      styles.right = `${window.innerWidth - rect.left + 10}px`
      styles.top = `${rect.top + rect.height / 2}px`
      styles.transform = 'translateY(-50%)'
      break
    case 'right':
      styles.left = `${rect.right + 10}px`
      styles.top = `${rect.top + rect.height / 2}px`
      styles.transform = 'translateY(-50%)'
      break
  }

  tooltipStyle.value = styles
}

const showTooltip = () => {
  timeoutId = setTimeout(() => {
    calculatePosition()
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
  <div ref="wrapperRef" class="tooltip-wrapper" @mouseenter="showTooltip" @mouseleave="hideTooltip">
    <slot />
  </div>
  <Teleport to="body">
    <Transition name="tooltip-fade">
      <div v-if="isVisible" class="tooltip" :style="tooltipStyle">
        <slot name="content">
          {{ text }}
        </slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip {
  background: rgba(80, 80, 80, 0.95);
  color: #e0e0e0;
  padding: 0.9rem 1.2rem;
  border-radius: 6px;
  font-size: 0.95rem;
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
}

.tooltip-fade-leave-to {
  opacity: 0;
}
</style>
