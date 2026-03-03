import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { STLViewer } from '@/services/STLViewer'
import type { TControlMode } from '@/models'

export const useSTLViewerStore = defineStore('stlViewer', () => {
  // State
  let stlViewer: STLViewer | null = null
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const fileName = ref<string | null>(null)
  const controlMode = ref<'object' | 'camera'>('camera')
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const lightsEnabled = ref(true)

  // Actions
  const initViewer = (canvas: HTMLCanvasElement) => {
    if (!canvas) return

    canvasRef.value = canvas
    stlViewer = new STLViewer(canvas)
    stlViewer.init()

    stlViewer.onModeChange((mode) => {
      controlMode.value = mode
    })
  }

  const loadFile = async (file: File) => {
    if (!stlViewer) {
      error.value = 'Visualizador não inicializado'
      return
    }

    if (!file.name.toLowerCase().endsWith('.stl')) {
      error.value = 'Por favor, selecione um arquivo .stl'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      await stlViewer.loadSTL(file)
      fileName.value = file.name
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar arquivo STL'
      fileName.value = null
    } finally {
      isLoading.value = false
    }
  }

  const clearModel = () => {
    stlViewer?.clearSTL()
    fileName.value = null
    error.value = null
  }

  // const toggleControlMode = () => {
  //   stlViewer?.toggleControlMode()
  // }

  const setControlMode = (mode: TControlMode) => {
    stlViewer?.setControlMode(mode)
  }

  const getControlMode = () => {
    return stlViewer?.getControlMode() || 'camera'
  }

  const resetTransform = () => {
    stlViewer?.resetTransform()
  }

  const toggleLights = () => {
    stlViewer?.toggleLights()
    lightsEnabled.value = stlViewer?.areLightsEnabled() ?? true
  }

  const dispose = () => {
    stlViewer?.dispose()
    stlViewer = null
    fileName.value = null
    error.value = null
    canvasRef.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const hasFileAttached = computed(() => Boolean(fileName.value))

  return {
    isLoading,
    error,
    fileName,
    controlMode,
    canvasRef,
    lightsEnabled,
    hasFileAttached,
    initViewer,
    loadFile,
    clearModel,
    setControlMode,
    getControlMode,
    resetTransform,
    toggleLights,
    dispose,
    clearError,
  }
})
