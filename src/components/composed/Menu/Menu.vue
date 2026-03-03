<script setup lang="ts">
import { Typography, Button } from '@/components'
import { AttachSTL, FeatureControl } from '@/components/composed/Menu/fragments'
import { useSTLViewerStore } from '@/stores/stlViewerStore'
import { storeToRefs } from 'pinia'
import { FileBox, Trash2 } from 'lucide-vue-next'

const store = useSTLViewerStore()
const { fileName, error, hasFileAttached } = storeToRefs(store)
const { clearModel } = store
</script>
<template>
  <section class="about">
    <Typography tag="h1" size="3xl" bold color="primary" align="center">
      Visualizador de STL
    </Typography>
    <div v-if="hasFileAttached" class="file-name"> 
      <FileBox :size="18" color="white" />
      <Typography  size="base" bold color="primary" align="center">
        {{ fileName }}
      </Typography>
      <Button  type="secondary" @click="clearModel"  size="sm">
        <Trash2 :size="18" />
      </Button>
    </div>
    <AttachSTL v-if="!hasFileAttached" />
    <FeatureControl v-if="hasFileAttached"  />
    <Typography v-if="error" color="danger" size="lg">⚠️ {{ error }}</Typography>
  </section>
</template>
<style scoped>
.about {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(to bottom, #0f0f0f, #1a1a1a);
  width: 33%;
  max-width: 550px;
  border-right: 1px solid rgba(66, 185, 131, 0.3);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5);
  position: relative;
}

.about::after {
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
