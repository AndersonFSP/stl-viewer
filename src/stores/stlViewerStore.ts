import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { STLViewer } from '@/services/STLViewer'
import type { TControlMode, PrintMetrics } from '@/models'

export const useSTLViewerStore = defineStore('stlViewer', () => {
  // State
  let stlViewer: STLViewer | null = null
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const fileName = ref<string | null>(null)
  const controlMode = ref<TControlMode>('camera')
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const lightsEnabled = ref(true)
  const metrics = ref<PrintMetrics | null>(null)

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
      
      // Calcular métricas após carregar o arquivo
      const calculatedMetrics = stlViewer.calculatePrintMetrics()
      metrics.value = calculatedMetrics
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
    metrics.value = null
  }

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

  const scaleModel = (factor: number) => {
    stlViewer?.scaleModel(factor)
  }

  const setModelScale = (x: number, y?: number, z?: number) => {
    stlViewer?.setModelScale(x, y, z)
  }

  // const getModelScale = () => {
  //   return stlViewer?.getModelScale()
  // }

  const dispose = () => {
    stlViewer?.dispose()
    stlViewer = null
    fileName.value = null
    error.value = null
    canvasRef.value = null
    metrics.value = null
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
    metrics,
    hasFileAttached,
    initViewer,
    loadFile,
    clearModel,
    setControlMode,
    getControlMode,
    resetTransform,
    toggleLights,
    scaleModel,
    setModelScale,
    // getModelScale,
    dispose,
    clearError,
  }
})
