<script setup lang="ts">
import { Typography } from '@/components'
import { AttachSTL, FeatureControl } from '@/components/composed/Menu/fragments'
import { useSTLViewerStore } from '@/stores/stlViewerStore'
import { storeToRefs } from 'pinia'

const store = useSTLViewerStore()
const { fileName, error, hasFileAttached } = storeToRefs(store)
</script>
<template>
  <section class="about">
    <Typography tag="h1" size="3xl" bold color="primary" align="center">
      Visualizador de STL
    </Typography>
    <Typography v-if="hasFileAttached" size="base" bold color="primary" align="center">
      📄 {{ fileName }}
    </Typography>
    <AttachSTL />
    <FeatureControl v-if="hasFileAttached"  />
    <Typography v-if="error" color="danger" size="lg">⚠️ {{ error }}</Typography>
  </section>
</template>
<style scoped>
.about {
  min-height: 100vh;
  padding: 2rem;
  background: #0f0f0f;
  width: 500px;
}
</style>
