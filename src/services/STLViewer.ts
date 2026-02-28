import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export class STLViewer {
  private canvas: HTMLCanvasElement
  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private renderer!: THREE.WebGLRenderer
  private controls!: OrbitControls
  private stlMesh: THREE.Mesh | null = null
  private animationId: number | null = null
  private loader: STLLoader

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
  }

  /**
   * Configura event listeners
   */
  private setupEventListeners(): void {
    window.addEventListener('resize', this.handleResize)
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
      this.scene.remove(this.stlMesh)
      this.stlMesh.geometry.dispose()
      if (Array.isArray(this.stlMesh.material)) {
        this.stlMesh.material.forEach((material) => material.dispose())
      } else {
        this.stlMesh.material.dispose()
      }
      this.stlMesh = null
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
   * Limpa recursos e event listeners
   */
  dispose(): void {
    // Cancelar animação
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
    }

    // Remover event listeners
    window.removeEventListener('resize', this.handleResize)

    // Limpar STL
    this.clearSTL()

    // Limpar controles
    this.controls?.dispose()

    // Limpar renderer
    this.renderer?.dispose()
  }
}
