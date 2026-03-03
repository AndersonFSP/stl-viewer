import { onMounted, onUnmounted, type Ref } from 'vue'
import { useSTLViewerStore } from '@/stores/stlViewerStore'

export function useSTLViewerSetup(canvasRef: Ref<HTMLCanvasElement | null>) {
  const store = useSTLViewerStore()

  onMounted(() => {
    if (canvasRef.value) {
      store.initViewer(canvasRef.value)
    }
  })

  onUnmounted(() => {
    store.dispose()
  })

  return store
}
