<script setup lang="ts">
import { Typography } from '@/components'
import { AttachSTL, FeatureControl, Header, PrintMetrics } from '@/components/templates/Menu/fragments'
import { useSTLViewerStore } from '@/stores/stlViewerStore'
import { storeToRefs } from 'pinia'

const store = useSTLViewerStore()
const { error, hasFileAttached } = storeToRefs(store)
</script>
<template>
  <section class="menu">
    <Header />
    <AttachSTL v-if="!hasFileAttached" />
    <FeatureControl v-if="hasFileAttached"  />
    <PrintMetrics v-if="hasFileAttached" />
    <Typography v-if="error" color="danger" size="lg">⚠️ {{ error }}</Typography>
  </section>
</template>
<style scoped>
.menu {
  min-height: 100vh;
  padding: 0 1.5rem;
  background: linear-gradient(to bottom, #0f0f0f, #1a1a1a);
  width: 33%;
  max-width: 550px;
  border-right: 1px solid rgba(66, 185, 131, 0.3);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5);
  position: relative;
}

.menu::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(66, 185, 131, 0.6) 20%,
    rgba(66, 185, 131, 0.6) 80%,
    transparent
  );
}

.file-name {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem ;
}
</style>
