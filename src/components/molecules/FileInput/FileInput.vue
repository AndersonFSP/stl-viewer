<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components'
import type { IFileInputProps } from './types';
import {  Paperclip } from 'lucide-vue-next'


withDefaults(defineProps<IFileInputProps>(), {
  accept: '*',
  buttonText: 'Selecionar Arquivo',
  loadingText: 'Carregando...',
  buttonType: 'primary',
  buttonSize: 'base',
  loading: false,
  disabled: false,
})

const emit = defineEmits<{
  fileSelected: [file: File]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('fileSelected', file)
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}
</script>

<template>
  <div class="file-input-wrapper">
    <input
      ref="fileInputRef"
      type="file"
      :accept="accept"
      @change="handleFileSelect"
      class="hidden-input"
    />

    <Button
      :type="buttonType"
      :size="buttonSize"
      :loading="loading"
      :disabled="disabled"
      @click="triggerFileInput"
    >
      {{ loading ? loadingText : buttonText }}
      <Paperclip :size="18" v-if="!loading"/>
    </Button>
  </div>
</template>

<style scoped>
.file-input-wrapper {
  display: inline-block;
}

.hidden-input {
  display: none;
}
</style>
