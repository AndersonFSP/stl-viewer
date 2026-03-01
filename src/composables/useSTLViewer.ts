import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { STLViewer } from '@/services/STLViewer'

export function useSTLViewer(canvasRef: Ref<HTMLCanvasElement | null>) {
  let stlViewer: STLViewer | null = null
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const fileName = ref<string | null>(null)
  const controlMode = ref<'object' | 'camera'>('camera')

  onMounted(() => {
    if (!canvasRef.value) return

    stlViewer = new STLViewer(canvasRef.value)
    stlViewer.init()

    stlViewer.onModeChange((mode) => {
      controlMode.value = mode
    })
  })

  onUnmounted(() => {
    stlViewer?.dispose()
  })

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

  const toggleControlMode = () => {
    stlViewer?.toggleControlMode()
  }

  const getControlMode = () => {
    return stlViewer?.getControlMode() || 'camera'
  }

  const resetTransform = () => {
    stlViewer?.resetTransform()
  }

  return {
    stlViewer,
    isLoading,
    error,
    fileName,
    controlMode,
    loadFile,
    clearModel,
    toggleControlMode,
    getControlMode,
    resetTransform,
  }
}
