import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

export class STLViewer {
  private canvas: HTMLCanvasElement
  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private renderer!: THREE.WebGLRenderer
  private controls!: OrbitControls
  private transformControls!: TransformControls
  private stlMesh: THREE.Mesh | null = null
  private animationId: number | null = null
  private loader: STLLoader
  private isDragging = false
  private previousMousePosition = { x: 0, y: 0 }
  private controlMode: 'object' | 'camera' = 'object'

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
    this.setupTransformControls()
    this.setupEventListeners()
    this.animate()
  }

  /**
   * Configura a cena Three.js
   */
  private setupScene(): void {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x1a1a1a)

    // Adicionar grid helper para referência
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222)
    this.scene.add(gridHelper)

    // Adicionar eixos helper
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
    
    // Garantir que o canvas pode receber eventos
    this.canvas.style.touchAction = 'none'
    this.canvas.tabIndex = 1
  }

  /**
   * Configura as luzes da cena
   */
  private setupLights(): void {
    // Luz ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    this.scene.add(ambientLight)

    // Luz direcional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 5)
    this.scene.add(directionalLight)

    // Luz adicional
    const light2 = new THREE.DirectionalLight(0xffffff, 0.5)
    light2.position.set(-5, 5, -5)
    this.scene.add(light2)
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
    
    // Configurar sensibilidade
    this.controls.rotateSpeed = 1.0
    this.controls.zoomSpeed = 1.2
    this.controls.panSpeed = 0.8
    
    // Inicialmente desabilitado (modo objeto)
    this.controls.enabled = false
  }

  /**
   * Configura os controles de transformação do objeto
   */
  private setupTransformControls(): void {
    this.transformControls = new TransformControls(this.camera, this.canvas)
    this.transformControls.setMode('rotate')
    this.transformControls.setSize(0.8)
    this.transformControls.enabled = false // Desabilitado por padrão
    this.scene.add(this.transformControls as unknown as THREE.Object3D)

    this.transformControls.addEventListener('dragging-changed', (event: any) => {
      this.controls.enabled = !event.value
    })
  }

  /**
   * Configura event listeners
   */
  private setupEventListeners(): void {
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('keydown', this.handleKeyDown)
    this.canvas.addEventListener('mousedown', this.handleMouseDown)
    this.canvas.addEventListener('mousemove', this.handleMouseMove)
    this.canvas.addEventListener('mouseup', this.handleMouseUp)
    this.canvas.addEventListener('wheel', this.handleWheel)
  }

  /**
   * Handler para teclas de atalho
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.stlMesh) return

    switch (event.key.toLowerCase()) {
      case 'g': // Move (G de "Grab" do Blender)
        this.setTransformMode('translate')
        break
      case 'r': // Rotate
        this.setTransformMode('rotate')
        break
      case 's': // Scale
        this.setTransformMode('scale')
        break
      case 'escape':
        this.transformControls.detach()
        setTimeout(() => this.transformControls.attach(this.stlMesh!), 100)
        break
    }
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
          // Remover mesh anterior se existir
          this.clearSTL()

          // Carregar geometria do buffer
          const arrayBuffer = event.target.result as ArrayBuffer
          const geometry = this.loader.parse(arrayBuffer)

          // Centralizar e normalizar geometria
          geometry.center()
          geometry.computeVertexNormals()

          // Calcular tamanho para ajustar escala
          geometry.computeBoundingBox()
          const boundingBox = geometry.boundingBox!
          const size = new THREE.Vector3()
          boundingBox.getSize(size)
          const maxDim = Math.max(size.x, size.y, size.z)
          const scale = 5 / maxDim

          // Criar material
          const material = new THREE.MeshPhongMaterial({
            color: 0x00aa88,
            specular: 0x111111,
            shininess: 200,
            flatShading: false,
          })

          // Criar mesh
          this.stlMesh = new THREE.Mesh(geometry, material)
          this.stlMesh.scale.set(scale, scale, scale)
          
          this.scene.add(this.stlMesh)

          // Ajustar câmera
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
    cameraZ *= 1.5 // Adicionar margem

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
      this.transformControls.detach()
      this.scene.remove(this.stlMesh)
      this.stlMesh.geometry.dispose()
      if (Array.isArray(this.stlMesh.material)) {
        this.stlMesh.material.forEach((material) => material.dispose())
      } else {
        this.stlMesh.material.dispose()
      }
      this.stlMesh = null
    }
    // Voltar para modo câmera quando não há objeto
    this.setControlMode('camera')
  }

  /**
   * Alterna entre modo objeto e câmera
   */
  toggleControlMode(): void {
    this.controlMode = this.controlMode === 'object' ? 'camera' : 'object'
    this.controls.enabled = this.controlMode === 'camera'
    this.canvas.style.cursor = this.controlMode === 'object' ? 'grab' : 'default'
  }

  /**
   * Define o modo de controle
   */
  setControlMode(mode: 'object' | 'camera'): void {
    this.controlMode = mode
    this.controls.enabled = mode === 'camera'
    this.canvas.style.cursor = mode === 'object' ? 'grab' : 'default'
  }

  /**
   * Obtém o modo de controle atual
   */
  getControlMode(): 'object' | 'camera' {
    return this.controlMode
  }

  /**
   * Define o modo de transformação
   */
  setTransformMode(mode: 'translate' | 'rotate' | 'scale'): void {
    this.transformControls.setMode(mode)
  }

  /**
   * Ativa/desativa os controles de transformação
   */
  setTransformEnabled(enabled: boolean): void {
    this.transformControls.enabled = enabled
    if (!enabled) {
      this.transformControls.detach()
    } else if (this.stlMesh) {
      this.transformControls.attach(this.stlMesh)
    }
  }

  /**
   * Reseta a transformação do modelo
   */
  resetTransform(): void {
    if (this.stlMesh) {
      this.stlMesh.position.set(0, 0, 0)
      this.stlMesh.rotation.set(0, 0, 0)
      // Manter a escala atual (calculada no carregamento)
      this.fitCameraToObject()
    }
  }

  /**
   * Loop de animação
   */
  animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate)

    // Atualizar controles
    this.controls.update()

    // Renderizar cena
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
    // Cancelar animação
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
    }

    // Remover event listeners
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('keydown', this.handleKeyDown)
    this.canvas.removeEventListener('mousedown', this.handleMouseDown)
    this.canvas.removeEventListener('mousemove', this.handleMouseMove)
    this.canvas.removeEventListener('mouseup', this.handleMouseUp)
    this.canvas.removeEventListener('wheel', this.handleWheel)

    // Limpar STL
    this.clearSTL()

    // Limpar controles
    this.transformControls?.dispose()
    this.controls?.dispose()

    // Limpar renderer
    this.renderer?.dispose()
  }
}
