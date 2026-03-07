<script setup lang="ts">
import { Box, Typography, CardInfo, CardInfoHighlight, Divider } from '@/components'
import { useSTLViewerStore } from '@/stores/stlViewerStore'
import { Box as BoxIcon, Ruler, Weight, Droplet, Maximize2, Triangle } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const store = useSTLViewerStore()
const { metrics } = storeToRefs(store)

const formatNumber = (value: number, decimals = 2) => {
  return value.toFixed(decimals)
}

const stlMetrics = computed(() => {
  if (!metrics.value)
    return {
      geometry: [],
      print: [],
    }
  return {
    geometry: [
      {
        label: 'Volume',
        value: formatNumber(metrics.value?.volume) + ' cm³',
        icon: BoxIcon,
      },
      {
        label: 'Dimensões',
        value: `${formatNumber(metrics.value?.dimensions.width, 1)}  x  ${formatNumber(metrics.value?.dimensions.height, 1)}  x  ${formatNumber(metrics.value?.dimensions.depth, 1)} mm`,
        icon: Ruler,
      },
      {
        label: 'Triângulos',
        value: metrics.value?.triangles,
        icon: Triangle,
      },
      {
        label: 'Área Superfície',
        value: `${formatNumber(metrics.value?.surfaceArea)} cm²`,
        icon: Maximize2,
      },
    ],
    print: [
      {
        title: 'Filamento PLA',
        icon: Weight,
        details: [
          { label: 'Peso', value: `${formatNumber(metrics.value?.filament.pla.weight)} g` },
          { label: 'Comprimento', value: `${formatNumber(metrics.value?.filament.pla.length)} m` },
        ],
      },
      {
        title: 'Filamento ABS',
        icon: Weight,
        details: [
          { label: 'Peso', value: `${formatNumber(metrics.value?.filament.abs.weight)} g` },
          { label: 'Comprimento', value: `${formatNumber(metrics.value?.filament.abs.length)} m` },
        ],
      },
      {
        title: 'Resina',
        icon: Droplet,
        details: [{ label: 'Volume', value: `${formatNumber(metrics.value?.resin.volume)} ml` }],
      },
    ],
  }
})
</script>

<template>
  <Box v-if="stlMetrics.geometry.length > 0" class="metrics-container">
    <div class="metrics-header">
      <Typography tag="h3" size="base" bold color="primary">
        <div class="header-title">
          <BoxIcon :size="20" />
          Métricas de Impressão 3D
        </div>
      </Typography>
    </div>
    <Divider spacing="none" />

    <div class="metrics-grid">
      <CardInfo
        v-for="metric in stlMetrics.geometry"
        :key="metric.label"
        :label="metric.label"
        :value="metric.value"
        :icon="metric.icon"
      />
      <CardInfoHighlight
        v-for="metric in stlMetrics.print"
        :key="metric.title"
        :title="metric.title"
        :details="metric.details"
        :icon="metric.icon"
      />
    <Divider spacing="none" />
    </div>
    <div class="metrics-footer">
      <Typography tag="p" size="xs" color="secondary" align="right">
        * Valores de materiais aproximados, sem considerar suportes.
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

.metrics-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}
</style>
