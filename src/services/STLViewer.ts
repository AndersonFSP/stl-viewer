import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { TControlMode, PrintMetrics } from '@/models'

export class STLViewer {
  private canvas: HTMLCanvasElement
  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private renderer!: THREE.WebGLRenderer
  private controls!: OrbitControls
  private stlMesh: THREE.Mesh | null = null
  private animationId: number | null = null
  private loader: STLLoader
  private isDragging = false
  private previousMousePosition = { x: 0, y: 0 }
  private controlMode: TControlMode = 'camera'
  private onControlModeChange?: (mode: TControlMode) => void
  private currentMetrics: PrintMetrics | null = null
  private initialPosition: THREE.Vector3 | null = null
  private initialScale: THREE.Vector3 | null = null

  private ambientLight!: THREE.AmbientLight
  private mainLight!: THREE.DirectionalLight
  private fillLight!: THREE.DirectionalLight
  private sideLight!: THREE.PointLight
  private lightHelpers: THREE.Object3D[] = []
  private lightsEnabled = true

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.loader = new STLLoader()
  }

  init(): void {
    this.setupScene()
    this.setupCamera()
    this.setupRenderer()
    this.setupLights()
    this.setupControls()
    this.setupEventListeners()
    this.animate()
  }

  private setupScene(): void {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0a0a0a)

    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222)
    this.scene.add(gridHelper)
  }

  private setupCamera(): void {
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    this.camera.position.set(5, 5, 5)
    this.camera.lookAt(0, 0, 0)
  }

  private setupRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap

    this.canvas.style.touchAction = 'none'
    this.canvas.tabIndex = 1
  }

  private setupLights(): void {

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    this.scene.add(this.ambientLight)

    this.mainLight = new THREE.DirectionalLight(0xffffff, 2.0)
    this.mainLight.position.set(15, 15, 15)
    this.mainLight.castShadow = true
    this.mainLight.shadow.mapSize.width = 2048
    this.mainLight.shadow.mapSize.height = 2048
    this.mainLight.shadow.camera.near = 0.5
    this.mainLight.shadow.camera.far = 500
    this.scene.add(this.mainLight)

    this.fillLight = new THREE.DirectionalLight(0x6699ff, 1.2)
    this.fillLight.position.set(-12, 5, 12)
    this.scene.add(this.fillLight)


    this.sideLight = new THREE.PointLight(0xffffff, 1.0, 100)
    this.sideLight.position.set(12, 8, -12)
    this.scene.add(this.sideLight)


    this.createLightHelpers()
  }

  private createLightHelpers(): void {
    const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16)

    const mainLightSphere = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.8,
      }),
    )
    mainLightSphere.position.copy(this.mainLight.position)
    this.lightHelpers.push(mainLightSphere)
    this.scene.add(mainLightSphere)

    const fillLightSphere = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x6699ff,
        transparent: true,
        opacity: 0.8,
      }),
    )
    fillLightSphere.position.copy(this.fillLight.position)
    this.lightHelpers.push(fillLightSphere)
    this.scene.add(fillLightSphere)

    const sideLightSphere = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
      }),
    )
    sideLightSphere.position.copy(this.sideLight.position)
    this.lightHelpers.push(sideLightSphere)
    this.scene.add(sideLightSphere)
  }

  toggleLights(): void {
    this.lightsEnabled = !this.lightsEnabled


    this.ambientLight.intensity = this.lightsEnabled ? 0.8 : 1.5

    this.mainLight.visible = this.lightsEnabled
    this.fillLight.visible = this.lightsEnabled
    this.sideLight.visible = this.lightsEnabled

    this.lightHelpers.forEach((helper) => {
      helper.visible = this.lightsEnabled
    })
  }

  areLightsEnabled(): boolean {
    return this.lightsEnabled
  }

  scaleModel(factor: number): void {
    if (this.stlMesh) {
      this.stlMesh.scale.multiplyScalar(factor)
    }
  }

  setModelScale(x: number, y?: number, z?: number): void {
    if (this.stlMesh) {
      this.stlMesh.scale.set(x, y ?? x, z ?? x)
    }
  }

  private setupControls(): void {
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.screenSpacePanning = false
    this.controls.minDistance = 1
    this.controls.maxDistance = 100
    this.controls.rotateSpeed = 1.8
    this.controls.zoomSpeed = 1.5
    this.controls.panSpeed = 1.2
    this.controls.enabled = true
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('keydown', this.handleKeyDown)
    this.canvas.addEventListener('mousedown', this.handleMouseDown)
    this.canvas.addEventListener('mousemove', this.handleMouseMove)
    this.canvas.addEventListener('mouseup', this.handleMouseUp)
    this.canvas.addEventListener('mouseleave', this.handleMouseUp)
    this.canvas.addEventListener('wheel', this.handleWheel, { passive: false, capture: true })
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase()
    const keyActionsConfig: Record<string, () => void> = {
      c: () => this.setControlMode('camera'),
      r: () => this.setControlMode('object'),
      s: () => this.setControlMode('scale'),
      m: () => this.setControlMode('move'),
      l: () => this.toggleLights(),
    }
    const action = keyActionsConfig[key]
    if (!action) return
    action()
  }

  private handleMouseDown = (event: MouseEvent): void => {
    if ((this.controlMode !== 'object' && this.controlMode !== 'move') || !this.stlMesh) return

    event.preventDefault()
    this.isDragging = true
    this.previousMousePosition = { x: event.clientX, y: event.clientY }
    this.canvas.style.cursor = 'grabbing'
  }

  private handleMouseMove = (event: MouseEvent): void => {
    if (
      !this.isDragging ||
      (this.controlMode !== 'object' && this.controlMode !== 'move') ||
      !this.stlMesh
    )
      return

    const deltaX = event.clientX - this.previousMousePosition.x
    const deltaY = event.clientY - this.previousMousePosition.y

    if (this.controlMode === 'object') {
      this.stlMesh.rotation.y += deltaX * 0.005
      this.stlMesh.rotation.x += deltaY * 0.005
    } else if (this.controlMode === 'move') {
      const moveSpeed = 0.02
      this.stlMesh.position.x += deltaX * moveSpeed
      this.stlMesh.position.y -= deltaY * moveSpeed
    }

    this.previousMousePosition = { x: event.clientX, y: event.clientY }
  }

  private handleMouseUp = (): void => {
    if (this.isDragging) {
      this.isDragging = false
      const cursorMap = {
        object: 'grab',
        move: 'move',
        camera: 'default',
        scale: 'ns-resize',
      }
      this.canvas.style.cursor = cursorMap[this.controlMode] || 'default'
    }
  }

  private handleWheel = (event: WheelEvent): void => {
    if (this.controlMode !== 'scale' || !this.stlMesh) return

    event.preventDefault()
    event.stopPropagation()

    const scaleSpeed = 0.05
    const direction = event.deltaY > 0 ? -1 : 1
    const scaleFactor = 1 + scaleSpeed * direction
    this.scaleModel(scaleFactor)
  }

  private handleResize = (): void => {
    if (!this.canvas || !this.camera || !this.renderer) return

    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  loadSTL(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        if (!event.target?.result) {
          reject(new Error('Erro ao ler arquivo'))
          return
        }

        try {
          this.clearSTL()

          const arrayBuffer = event.target.result as ArrayBuffer
          const geometry = this.loader.parse(arrayBuffer)

          geometry.center()
          geometry.computeVertexNormals()

          geometry.computeBoundingBox()
          const boundingBox = geometry.boundingBox!
          const size = new THREE.Vector3()
          boundingBox.getSize(size)
          const maxDim = Math.max(size.x, size.y, size.z)
          const scale = 5 / maxDim

          const material = new THREE.MeshPhongMaterial({
            color: 0x00aa88,
            specular: 0x111111,
            shininess: 200,
            flatShading: false,
          })

          this.stlMesh = new THREE.Mesh(geometry, material)
          this.stlMesh.scale.set(scale, scale, scale)
          this.stlMesh.castShadow = true
          this.stlMesh.receiveShadow = true

          const box = new THREE.Box3().setFromObject(this.stlMesh)
          const minY = box.min.y
          this.stlMesh.position.y = -minY

          this.initialPosition = this.stlMesh.position.clone()
          this.initialScale = this.stlMesh.scale.clone()

          this.scene.add(this.stlMesh)

          this.fitCameraToObject()

          this.setControlMode('object')

          resolve()
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
      reader.readAsArrayBuffer(file)
    })
  }

  private fitCameraToObject(): void {
    if (!this.stlMesh) return

    const box = new THREE.Box3().setFromObject(this.stlMesh)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = this.camera.fov * (Math.PI / 180)
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
    cameraZ *= 1.5

    this.camera.position.set(center.x + cameraZ, center.y + cameraZ, center.z + cameraZ)
    this.camera.lookAt(center)
    this.controls.target.copy(center)
    this.controls.update()
  }

  clearSTL(): void {
    if (this.stlMesh) {
      this.scene.remove(this.stlMesh)
      this.stlMesh.geometry.dispose()
      if (Array.isArray(this.stlMesh.material)) {
        this.stlMesh.material.forEach((material) => material.dispose())
      } else {
        this.stlMesh.material.dispose()
      }
      this.stlMesh = null
    }
    this.currentMetrics = null
    this.initialPosition = null
    this.initialScale = null
    this.setControlMode('camera')
  }

  setControlMode(mode: TControlMode): void {
    this.controlMode = mode

    if (mode === 'camera') {
      this.controls.enabled = true
      this.controls.enableZoom = true
      this.canvas.style.cursor = 'default'
    } else if (mode === 'object') {
      this.controls.enabled = false
      this.controls.enableZoom = false
      this.canvas.style.cursor = 'grab'
    } else if (mode === 'scale') {
      this.controls.enabled = false
      this.controls.enableZoom = false
      this.canvas.style.cursor = 'ns-resize'
    } else if (mode === 'move') {
      this.controls.enabled = false
      this.controls.enableZoom = false
      this.canvas.style.cursor = 'move'
    }

    this.onControlModeChange?.(mode)
  }

  getControlMode(): TControlMode {
    return this.controlMode
  }

  onModeChange(callback: (mode: TControlMode) => void): void {
    this.onControlModeChange = callback
  }

  resetTransform(): void {
    if (this.stlMesh && this.initialPosition && this.initialScale) {
      this.stlMesh.position.copy(this.initialPosition)
      this.stlMesh.scale.copy(this.initialScale)
      this.stlMesh.rotation.set(0, 0, 0)
      this.fitCameraToObject()
    }
  }

  animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate)

    this.controls.update()

    this.renderer.render(this.scene, this.camera)
  }

  calculatePrintMetrics(): PrintMetrics | null {
    if (!this.stlMesh) return null

    const geometry = this.stlMesh.geometry as THREE.BufferGeometry

    let volume = 0
    const position = geometry.attributes.position
    if (!position) return null
  
    for (let i = 0; i < position.count; i += 3) {
      const v1 = new THREE.Vector3(position.getX(i), position.getY(i), position.getZ(i))
      const v2 = new THREE.Vector3(position.getX(i + 1), position.getY(i + 1), position.getZ(i + 1))
      const v3 = new THREE.Vector3(position.getX(i + 2), position.getY(i + 2), position.getZ(i + 2))

      volume += v1.dot(v2.cross(v3)) / 6
    }

    volume = Math.abs(volume)

    const volumeCm3 = volume / 1000
    geometry.computeBoundingBox()
    const bbox = geometry.boundingBox!
    const originalSize = bbox.getSize(new THREE.Vector3())

    const dimensions = {
      width: originalSize.x,
      height: originalSize.y,
      depth: originalSize.z,
    }

    let surfaceArea = 0
    for (let i = 0; i < position.count; i += 3) {
      const v1 = new THREE.Vector3(position.getX(i), position.getY(i), position.getZ(i))
      const v2 = new THREE.Vector3(position.getX(i + 1), position.getY(i + 1), position.getZ(i + 1))
      const v3 = new THREE.Vector3(position.getX(i + 2), position.getY(i + 2), position.getZ(i + 2))

      const edge1 = v2.clone().sub(v1)
      const edge2 = v3.clone().sub(v1)
      const cross = edge1.cross(edge2)
      surfaceArea += cross.length() / 2
    }

    const surfaceAreaCm2 = surfaceArea / 100

    const triangleCount = position.count / 3
    const PLA_DENSITY = 1.24
    const ABS_DENSITY = 1.04
    const RESIN_DENSITY = 1.1
    const FILAMENT_DIAMETER = 1.75
    const FILAMENT_AREA = (Math.PI * Math.pow(FILAMENT_DIAMETER / 2, 2)) / 100

    const plaWeight = volumeCm3 * PLA_DENSITY
    const plaLength = volumeCm3 / FILAMENT_AREA / 100

    const absWeight = volumeCm3 * ABS_DENSITY
    const absLength = volumeCm3 / FILAMENT_AREA / 100
    const resinVolume = volumeCm3
    const resinWeight = volumeCm3 * RESIN_DENSITY

    this.currentMetrics = {
      volume: volumeCm3,
      dimensions,
      filament: {
        pla: {
          weight: plaWeight,
          length: plaLength,
        },
        abs: {
          weight: absWeight,
          length: absLength,
        },
      },
      resin: {
        volume: resinVolume,
        weight: resinWeight,
      },
      surfaceArea: surfaceAreaCm2,
      triangles: triangleCount,
    }
    return this.currentMetrics
  }

  getMetrics(): PrintMetrics | null {
    return this.currentMetrics
  }

  dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
    }

    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('keydown', this.handleKeyDown)
    this.canvas.removeEventListener('mousedown', this.handleMouseDown)
    this.canvas.removeEventListener('mousemove', this.handleMouseMove)
    this.canvas.removeEventListener('mouseup', this.handleMouseUp)
    this.canvas.removeEventListener('mouseleave', this.handleMouseUp)
    this.canvas.removeEventListener('wheel', this.handleWheel)

    this.clearSTL()

    this.controls?.dispose()

    this.renderer?.dispose()
  }
}
