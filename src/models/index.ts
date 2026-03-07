export type TControlMode = 'object' | 'camera' | 'scale' | 'move'

export interface PrintMetrics {
  volume: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  filament: {
    pla: {
      weight: number
      length: number
    }
    abs: {
      weight: number
      length: number
    }
  }
  resin: {
    volume: number
  }
  surfaceArea: number
  triangles: number
}
