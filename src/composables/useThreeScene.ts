import { onMounted, onUnmounted, type Ref } from 'vue'
import { ThreeScene } from '@/services/ThreeScene'

export function useThreeScene(canvasRef: Ref<HTMLCanvasElement | null>) {
  let threeScene: ThreeScene | null = null

  onMounted(() => {
    if (!canvasRef.value) return

    threeScene = new ThreeScene(canvasRef.value)
    threeScene.init()
    threeScene.animate()
  })

  onUnmounted(() => {
    threeScene?.dispose()
  })

  return {
    threeScene,
  }
}
