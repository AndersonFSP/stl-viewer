import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { TControlMode } from '@/models'

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

  // Luzes e helpers
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

  /**
   * Inicializa a cena, câmera, renderer e controles
   */
  init(): void {
    this.setupScene()
    this.setupCamera()
    this.setupRenderer()
    this.setupLights()
    this.setupControls()
    this.setupEventListeners()
    this.animate()
  }

  /**
   * Configura a cena Three.js
   */
  private setupScene(): void {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0a0a0a)

    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222)
    this.scene.add(gridHelper)

    const axesHelper = new THREE.AxesHelper(5)
    this.scene.add(axesHelper)
  }

  /**
   * Configura a câmera perspectiva
   */
  private setupCamera(): void {
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    this.camera.position.set(5, 5, 5)
    this.camera.lookAt(0, 0, 0)
  }

  /**
   * Configura o renderer WebGL
   */
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

  /**
   * Configura as luzes da cena
   */
  private setupLights(): void {
    // Luz ambiente - sempre ativa para manter o modelo visível
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    this.scene.add(this.ambientLight)

    // Luz direcional principal (de cima)
    this.mainLight = new THREE.DirectionalLight(0xffffff, 2.0)
    this.mainLight.position.set(15, 15, 15)
    this.mainLight.castShadow = true
    this.mainLight.shadow.mapSize.width = 2048
    this.mainLight.shadow.mapSize.height = 2048
    this.mainLight.shadow.camera.near = 0.5
    this.mainLight.shadow.camera.far = 500
    this.scene.add(this.mainLight)

    // Luz de preenchimento (de baixo/trás)
    this.fillLight = new THREE.DirectionalLight(0x6699ff, 1.2)
    this.fillLight.position.set(-15, -10, -15)
    this.scene.add(this.fillLight)

    // Luz lateral para dar volume
    this.sideLight = new THREE.PointLight(0xffffff, 1.0, 100)
    this.sideLight.position.set(10, 0, 10)
    this.scene.add(this.sideLight)

    // Criar helpers visuais para as luzes
    this.createLightHelpers()
  }

  /**
   * Cria representações visuais das luzes
   */
  private createLightHelpers(): void {
    const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16)

    // Esfera amarela para luz principal (de cima)
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

    // Esfera azul para luz de preenchimento (de baixo)
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

    // Esfera branca para luz lateral
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

    // Luz ambiente sempre ativa, mas ajusta intensidade
    this.ambientLight.intensity = this.lightsEnabled ? 0.8 : 1.5

    // Desliga/liga as luzes direcionais e pontuais
    this.mainLight.visible = this.lightsEnabled
    this.fillLight.visible = this.lightsEnabled
    this.sideLight.visible = this.lightsEnabled

    // Mostrar/ocultar helpers
    this.lightHelpers.forEach((helper) => {
      helper.visible = this.lightsEnabled
    })
  }

  /**
   * Retorna o estado atual das luzes
   */
  areLightsEnabled(): boolean {
    return this.lightsEnabled
  }

  /**
   * Altera a escala do modelo STL
   */
  scaleModel(factor: number): void {
    if (this.stlMesh) {
      this.stlMesh.scale.multiplyScalar(factor)
    }
  }

  /**
   * Define a escala absoluta do modelo
   */
  setModelScale(x: number, y?: number, z?: number): void {
    if (this.stlMesh) {
      this.stlMesh.scale.set(x, y ?? x, z ?? x)
    }
  }

  /**
   * Reseta a escala do modelo para 1
   */
  resetModelScale(): void {
    if (this.stlMesh) {
      this.stlMesh.scale.set(1, 1, 1)
    }
  }

  /**
   * Obtém a escala atual do modelo
   */
  getModelScale(): { x: number; y: number; z: number } | null {
    if (this.stlMesh) {
      return {
        x: this.stlMesh.scale.x,
        y: this.stlMesh.scale.y,
        z: this.stlMesh.scale.z,
      }
    }
    return null
  }

  /**
   * Configura os controles de órbita
   */
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
      l: () => this.toggleLights(),
    }
    const action = keyActionsConfig[key]
    if (!action) return
    action()
  }

  /**
   * Handler para mouse down
   */
  private handleMouseDown = (event: MouseEvent): void => {
    if (this.controlMode !== 'object' || !this.stlMesh) return

    event.preventDefault()
    this.isDragging = true
    this.previousMousePosition = { x: event.clientX, y: event.clientY }
    this.canvas.style.cursor = 'grabbing'
  }

  /**
   * Handler para mouse move
   */
  private handleMouseMove = (event: MouseEvent): void => {
    if (!this.isDragging || this.controlMode !== 'object' || !this.stlMesh) return

    const deltaX = event.clientX - this.previousMousePosition.x
    const deltaY = event.clientY - this.previousMousePosition.y

    // Rotacionar o objeto com base no movimento do mouse
    this.stlMesh.rotation.y += deltaX * 0.005
    this.stlMesh.rotation.x += deltaY * 0.005

    this.previousMousePosition = { x: event.clientX, y: event.clientY }
  }

  /**
   * Handler para mouse up
   */
  private handleMouseUp = (): void => {
    if (this.isDragging) {
      this.isDragging = false
      this.canvas.style.cursor = this.controlMode === 'object' ? 'grab' : 'default'
    }
  }

  /**
   * Handler para roda do mouse - controla escala em modo 'scale'
   */
  private handleWheel = (event: WheelEvent): void => {
    if (this.controlMode !== 'scale' || !this.stlMesh) return

    event.preventDefault()
    event.stopPropagation()

    const scaleSpeed = 0.05
    const direction = event.deltaY > 0 ? -1 : 1
    const scaleFactor = 1 + scaleSpeed * direction
    this.scaleModel(scaleFactor)
  }

  /**
   * Handler para redimensionamento da janela
   */
  private handleResize = (): void => {
    if (!this.canvas || !this.camera || !this.renderer) return

    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  /**
   * Carrega e renderiza um arquivo STL
   */
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

          this.scene.add(this.stlMesh)

          this.fitCameraToObject()

          // Mudar para modo objeto após carregar
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

  /**
   * Ajusta a câmera para visualizar o objeto completamente
   */
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

  /**
   * Remove o mesh STL atual da cena
   */
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
    this.setControlMode('camera')
  }

  setControlMode(mode: TControlMode): void {
    this.controlMode = mode

    // Habilita/desabilita controles conforme o modo
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
    }

    this.onControlModeChange?.(mode)
  }

  /**
   * Obtém o modo de controle atual
   */
  getControlMode(): TControlMode {
    return this.controlMode
  }

  onModeChange(callback: (mode: TControlMode) => void): void {
    this.onControlModeChange = callback
  }

  resetTransform(): void {
    if (this.stlMesh) {
      this.stlMesh.position.set(0, 0, 0)
      this.stlMesh.rotation.set(0, 0, 0)
      this.fitCameraToObject()
    }
  }

  /**
   * Loop de animação
   */
  animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate)

    this.controls.update()

    this.renderer.render(this.scene, this.camera)
  }

  /**
   * Obtém o mesh STL atual
   */
  getMesh(): THREE.Mesh | null {
    return this.stlMesh
  }

  /**
   * Limpa recursos e event listeners
   */
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
