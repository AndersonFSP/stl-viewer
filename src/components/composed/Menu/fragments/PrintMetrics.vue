<script setup lang="ts">
import { Box, Typography } from '@/components'
import { useSTLViewerStore } from '@/stores/stlViewerStore'
import { Box as BoxIcon, Ruler, Weight, Droplet, Maximize2, Triangle } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const store = useSTLViewerStore()
const { metrics } = storeToRefs(store)

const formatNumber = (value: number, decimals = 2) => {
  return value.toFixed(decimals)
}

const hasMetrics = computed(() => metrics.value !== null)
</script>

<template>
  <Box v-if="hasMetrics && metrics" class="metrics-container">
    <div class="metrics-header">
      <Typography tag="h3" size="lg" color="primary">
        <div class="header-title">
          <BoxIcon :size="20" />
          Métricas de Impressão 3D
        </div>
      </Typography>
    </div>

    <div class="metrics-grid">
      <!-- Volume e Dimensões -->
      <div class="metric-card">
        <div class="metric-icon">
          <BoxIcon :size="18" />
        </div>
        <div class="metric-content">
          <Typography tag="span" size="sm" color="secondary">Volume</Typography>
          <Typography tag="p" size="md" weight="bold">
            {{ formatNumber(metrics.volume) }} cm³
          </Typography>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">
          <Ruler :size="18" />
        </div>
        <div class="metric-content">
          <Typography tag="span" size="sm" color="secondary">Dimensões</Typography>
          <Typography tag="p" size="sm" weight="bold">
            {{ formatNumber(metrics.dimensions.width, 1) }} ×
            {{ formatNumber(metrics.dimensions.height, 1) }} ×
            {{ formatNumber(metrics.dimensions.depth, 1) }} mm
          </Typography>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">
          <Triangle :size="18" />
        </div>
        <div class="metric-content">
          <Typography tag="span" size="sm" color="secondary">Triângulos</Typography>
          <Typography tag="p" size="md" weight="bold">
            {{ formatNumber(metrics.triangles) }}
          </Typography>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">
          <Maximize2 :size="18" />
        </div>
        <div class="metric-content">
          <Typography tag="span" size="sm" color="secondary">Área Superfície</Typography>
          <Typography tag="p" size="md" weight="bold">
            {{ formatNumber(metrics.surfaceArea) }} cm²
          </Typography>
        </div>
      </div>

      <!-- Filamento PLA -->
      <div class="metric-card highlight">
        <div class="metric-header-small">
          <Weight :size="16" />
          <Typography tag="span" size="sm" weight="bold" color="primary">
            Filamento PLA
          </Typography>
        </div>
        <div class="metric-details">
          <div class="detail-row">
            <Typography tag="span" size="xs" color="secondary">Peso:</Typography>
            <Typography tag="span" size="sm" weight="bold">
              {{ formatNumber(metrics.filament.pla.weight) }}g
            </Typography>
          </div>
          <div class="detail-row">
            <Typography tag="span" size="xs" color="secondary">Comprimento:</Typography>
            <Typography tag="span" size="sm" weight="bold">
              {{ formatNumber(metrics.filament.pla.length) }}m
            </Typography>
          </div>
        </div>
      </div>

      <!-- Filamento ABS -->
      <div class="metric-card highlight">
        <div class="metric-header-small">
          <Weight :size="16" />
          <Typography tag="span" size="sm" weight="bold" color="primary">
            Filamento ABS
          </Typography>
        </div>
        <div class="metric-details">
          <div class="detail-row">
            <Typography tag="span" size="xs" color="secondary">Peso:</Typography>
            <Typography tag="span" size="sm" weight="bold">
              {{ formatNumber(metrics.filament.abs.weight) }}g
            </Typography>
          </div>
          <div class="detail-row">
            <Typography tag="span" size="xs" color="secondary">Comprimento:</Typography>
            <Typography tag="span" size="sm" weight="bold">
              {{ formatNumber(metrics.filament.abs.length) }}m
            </Typography>
          </div>
        </div>
      </div>

      <!-- Resina -->
      <div class="metric-card highlight">
        <div class="metric-header-small">
          <Droplet :size="16" />
          <Typography tag="span" size="sm" weight="bold" color="primary"> Resina </Typography>
        </div>
        <div class="metric-details">
          <div class="detail-row">
            <Typography tag="span" size="xs" color="secondary">Volume:</Typography>
            <Typography tag="span" size="sm" weight="bold">
              {{ formatNumber(metrics.resin.volume) }}ml
            </Typography>
          </div>
        </div>
      </div>
    </div>

    <div class="metrics-footer">
      <Typography tag="p" size="xs" color="secondary">
        * Valores aproximados, sem considerar suportes
      </Typography>
    </div>
  </Box>
</template>

<style scoped>
.metrics-container {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 70vh;
  overflow-y: auto;
}

.metrics-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.75rem;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.metric-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.metric-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

.metric-card.highlight {
  background: rgba(0, 170, 136, 0.1);
  border-color: rgba(0, 170, 136, 0.3);
  flex-direction: column;
  gap: 0.5rem;
}

.metric-card.highlight:hover {
  background: rgba(0, 170, 136, 0.15);
  border-color: rgba(0, 170, 136, 0.4);
}

.metric-icon {
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

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.metric-header-small {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
}

.metric-details {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding-left: 0.25rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.metrics-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 0.75rem;
  text-align: center;
}

/* Scrollbar styling */
.metrics-container::-webkit-scrollbar {
  width: 6px;
}

.metrics-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.metrics-container::-webkit-scrollbar-thumb {
  background: rgba(0, 170, 136, 0.3);
  border-radius: 3px;
}

.metrics-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 170, 136, 0.5);
}
</style>
