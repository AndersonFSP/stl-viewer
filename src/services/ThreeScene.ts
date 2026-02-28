import * as THREE from 'three'

export class ThreeScene {
  private canvas: HTMLCanvasElement
  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private renderer!: THREE.WebGLRenderer
  private cube!: THREE.Mesh
  private animationId: number | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  init(): void {
    this.setupScene()
    this.setupCamera()
    this.setupRenderer()
    this.setupObjects()
    this.setupEventListeners()
  }

  /**
   * Configura a cena Three.js
   */
  private setupScene(): void {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x222222)
  }

  /**
   * Configura a câmera perspectiva
   */
  private setupCamera(): void {
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    this.camera.position.z = 5
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
   * Cria e adiciona objetos 3D à cena
   */
  private setupObjects(): void {
    const geometry = new THREE.BoxGeometry(2, 2, 2)

    // Materiais coloridos para cada face
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Vermelho
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Verde
      new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Azul
      new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Amarelo
      new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Magenta
      new THREE.MeshBasicMaterial({ color: 0x00ffff }), // Ciano
    ]

    this.cube = new THREE.Mesh(geometry, materials)
    this.scene.add(this.cube)
  }

  /**
   * Configura event listeners (ex: resize)
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
   * Loop de animação
   */
  animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate)

    // Atualizar objetos
    this.update()

    // Renderizar cena
    this.renderer.render(this.scene, this.camera)
  }

  /**
   * Atualiza objetos da cena a cada frame
   */
  private update(): void {
    if (this.cube) {
      this.cube.rotation.x += 0.01
      this.cube.rotation.y += 0.01
    }
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

    // Limpar geometrias e materiais
    if (this.cube) {
      this.cube.geometry.dispose()
      if (Array.isArray(this.cube.material)) {
        this.cube.material.forEach((material) => material.dispose())
      } else {
        this.cube.material.dispose()
      }
    }

    // Limpar renderer
    this.renderer?.dispose()
  }
}
