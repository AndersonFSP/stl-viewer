import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { STLViewer } from '@/services/STLViewer'

export function useSTLViewer(canvasRef: Ref<HTMLCanvasElement | null>) {
  let stlViewer: STLViewer | null = null
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const fileName = ref<string | null>(null)

  onMounted(() => {
    if (!canvasRef.value) return

    stlViewer = new STLViewer(canvasRef.value)
    stlViewer.init()
  })

  onUnmounted(() => {
    stlViewer?.dispose()
  })

  const loadFile = async (file: File) => {
    if (!stlViewer) {
      error.value = 'Visualizador não inicializado'
      return
    }

    // Validar extensão do arquivo
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

  return {
    stlViewer,
    isLoading,
    error,
    fileName,
    loadFile,
    clearModel,
  }
}
