"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useLanguage } from "@/contexts/language-context"
import {
  CuboidIcon as Cube,
  ZoomIn,
  RotateCw,
  Eye,
  EyeOff,
  LayersIcon,
  Zap,
  HelpCircle,
  Maximize,
  Minimize,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FlyControls } from "three/examples/jsm/controls/FlyControls"

export default function EnhancedModel3D() {
  const { t, language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [activeTab, setActiveTab] = useState("explore")
  const [controlMode, setControlMode] = useState<"orbit" | "fly">("orbit")
  const [showHelp, setShowHelp] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [dataFlowSpeed, setDataFlowSpeed] = useState(1)
  const [layerVisibility, setLayerVisibility] = useState(true)
  const [currentLayer, setCurrentLayer] = useState(0)
  const [totalLayers, setTotalLayers] = useState(6)
  const [isInsideNetwork, setIsInsideNetwork] = useState(false)

  // Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | FlyControls | null>(null)
  const particlesRef = useRef<THREE.Points[]>([])
  const layersRef = useRef<THREE.Mesh[]>([])
  const connectionsRef = useRef<THREE.Line[]>([])
  const neuronGroupsRef = useRef<THREE.Group[]>([])

  // 切换控制模式
  const toggleControlMode = useCallback(() => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current || !rendererRef.current) return

    // 保存当前相机位置和旋转
    const position = cameraRef.current.position.clone()
    const rotation = cameraRef.current.rotation.clone()

    // 移除当前控制器
    if (controlsRef.current) {
      if (controlMode === "orbit") {
        ;(controlsRef.current as OrbitControls).dispose()
      } else {
        ;(controlsRef.current as FlyControls).dispose()
      }
    }

    // 创建新控制器
    if (controlMode === "orbit") {
      // 切换到飞行模式
      const flyControls = new FlyControls(cameraRef.current, rendererRef.current.domElement)
      flyControls.movementSpeed = 5
      flyControls.rollSpeed = 0.5
      flyControls.dragToLook = true
      controlsRef.current = flyControls
      setControlMode("fly")
      setIsInsideNetwork(true)
    } else {
      // 切换到轨道模式
      const orbitControls = new OrbitControls(cameraRef.current, rendererRef.current.domElement)
      orbitControls.enableDamping = true
      orbitControls.dampingFactor = 0.05
      controlsRef.current = orbitControls
      setControlMode("orbit")
      setIsInsideNetwork(false)

      // 重置相机位置
      cameraRef.current.position.set(0, 0, 10)
      cameraRef.current.lookAt(0, 0, 0)
    }
  }, [controlMode])

  // 切换全屏
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
      setIsFullscreen(false)
    }
  }, [isFullscreen])

  // 切换层可见性
  const toggleLayerVisibility = useCallback(() => {
    setLayerVisibility(!layerVisibility)

    // 更新层的可见性
    layersRef.current.forEach((layer) => {
      layer.visible = !layerVisibility
    })
  }, [layerVisibility])

  // 导航到下一层
  const navigateToNextLayer = useCallback(() => {
    if (currentLayer < totalLayers - 1) {
      setCurrentLayer(currentLayer + 1)

      // 移动相机到下一层
      if (cameraRef.current && controlMode === "fly") {
        const targetPosition = new THREE.Vector3(0, (currentLayer + 1) * 3 - 7.5, 0)
        const startPosition = cameraRef.current.position.clone()

        // 动画过渡到下一层
        const animate = (time: number) => {
          const t = Math.min(time / 1000, 1)
          cameraRef.current!.position.lerpVectors(startPosition, targetPosition, t)

          if (t < 1) {
            requestAnimationFrame(animate)
          }
        }

        requestAnimationFrame(animate)
      }
    }
  }, [currentLayer, totalLayers, controlMode])

  // 导航到上一层
  const navigateToPrevLayer = useCallback(() => {
    if (currentLayer > 0) {
      setCurrentLayer(currentLayer - 1)

      // 移动相机到上一层
      if (cameraRef.current && controlMode === "fly") {
        const targetPosition = new THREE.Vector3(0, (currentLayer - 1) * 3 - 7.5, 0)
        const startPosition = cameraRef.current.position.clone()

        // 动画过渡到上一层
        const animate = (time: number) => {
          const t = Math.min(time / 1000, 1)
          cameraRef.current!.position.lerpVectors(startPosition, targetPosition, t)

          if (t < 1) {
            requestAnimationFrame(animate)
          }
        }

        requestAnimationFrame(animate)
      }
    }
  }, [currentLayer, controlMode])

  // 初始化3D场景
  useEffect(() => {
    if (!containerRef.current) return

    // 场景设置
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0a)
    sceneRef.current = scene

    // 添加雾效，增强深度感
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.05)

    // 相机设置
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 10
    cameraRef.current = camera

    // 渲染器设置
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // 控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controlsRef.current = controls

    // 光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // 添加点光源，增强视觉效果
    const pointLight1 = new THREE.PointLight(0x10b981, 2, 20)
    pointLight1.position.set(5, -5, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x0ea5e9, 2, 20)
    pointLight2.position.set(-5, 5, 5)
    scene.add(pointLight2)

    // 创建神经网络层
    const layers: THREE.Mesh[] = []
    const layerGeometry = new THREE.BoxGeometry(8, 0.2, 8)
    const layerMaterials = [
      new THREE.MeshPhongMaterial({ color: 0x10b981, transparent: true, opacity: 0.3 }),
      new THREE.MeshPhongMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.3 }),
      new THREE.MeshPhongMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.3 }),
    ]

    // 创建6层
    for (let i = 0; i < 6; i++) {
      const materialIndex = i % layerMaterials.length
      const layer = new THREE.Mesh(layerGeometry, layerMaterials[materialIndex])
      layer.position.y = i * 3 - 7.5 // 垂直分布层
      layer.userData = { type: "layer", id: i }
      scene.add(layer)
      layers.push(layer)
    }
    layersRef.current = layers
    setTotalLayers(layers.length)

    // 创建神经元组
    const neuronGroups: THREE.Group[] = []

    // 为每层创建神经元
    layers.forEach((layer, layerIndex) => {
      const group = new THREE.Group()
      group.position.y = layer.position.y

      // 每层创建一个神经元网格
      const gridSize = 5
      const neuronGeometry = new THREE.SphereGeometry(0.15, 16, 16)

      for (let x = -gridSize / 2; x <= gridSize / 2; x++) {
        for (let z = -gridSize / 2; z <= gridSize / 2; z++) {
          // 随机化神经元位置，使其看起来更自然
          const offsetX = (Math.random() - 0.5) * 0.5
          const offsetZ = (Math.random() - 0.5) * 0.5

          const neuronMaterial = new THREE.MeshPhongMaterial({
            color: layerIndex % 2 === 0 ? 0x10b981 : 0x0ea5e9,
            emissive: layerIndex % 2 === 0 ? 0x10b981 : 0x0ea5e9,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.8,
          })

          const neuron = new THREE.Mesh(neuronGeometry, neuronMaterial)
          neuron.position.set(x + offsetX, 0, z + offsetZ)
          neuron.userData = { type: "neuron", layerId: layerIndex, x, z }
          group.add(neuron)
        }
      }

      scene.add(group)
      neuronGroups.push(group)
    })

    neuronGroupsRef.current = neuronGroups

    // 创建层之间的连接
    const connections: THREE.Line[] = []
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.3,
      linewidth: 1,
    })

    // 连接相邻层的神经元
    for (let i = 0; i < neuronGroups.length - 1; i++) {
      const currentGroup = neuronGroups[i]
      const nextGroup = neuronGroups[i + 1]

      // 获取当前层和下一层的所有神经元
      const currentNeurons = currentGroup.children
      const nextNeurons = nextGroup.children

      // 为每个神经元创建连接
      currentNeurons.forEach((currentNeuron) => {
        // 每个神经元连接到下一层的多个神经元，但不是全连接
        // 这样可以更好地可视化网络结构
        const connectionsCount = 2 + Math.floor(Math.random() * 3) // 每个神经元连接2-4个下一层神经元

        // 随机选择下一层的几个神经元进行连接
        const targetIndices = new Set()
        while (targetIndices.size < connectionsCount && targetIndices.size < nextNeurons.length) {
          targetIndices.add(Math.floor(Math.random() * nextNeurons.length))
        }

        // 创建连接线
        Array.from(targetIndices).forEach((index) => {
          const nextNeuron = nextNeurons[index]

          // 确保获取正确的神经元位置
          const sourcePosition = new THREE.Vector3().copy(currentNeuron.position).add(currentGroup.position)
          const targetPosition = new THREE.Vector3().copy(nextNeuron.position).add(nextGroup.position)

          const points = [sourcePosition, targetPosition]

          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          const line = new THREE.Line(geometry, connectionMaterial)
          line.userData = {
            type: "connection",
            sourceLayer: i,
            targetLayer: i + 1,
            sourceNeuron: currentNeuron.userData,
            targetNeuron: nextNeuron.userData,
            sourcePosition: sourcePosition.clone(),
            targetPosition: targetPosition.clone(),
          }

          scene.add(line)
          connections.push(line)
        })
      })
    }

    connectionsRef.current = connections

    // 创建数据流粒子
    const createDataFlowParticles = () => {
      // 为每个连接创建粒子系统
      connections.forEach((connection, index) => {
        if (connection.userData.type !== "connection") return

        // 获取连接的起点和终点
        const sourcePosition = connection.userData.sourcePosition
        const targetPosition = connection.userData.targetPosition

        if (!sourcePosition || !targetPosition) return

        // 创建粒子几何体
        const particleCount = 5
        const particlePositions = new Float32Array(particleCount * 3)

        // 初始化粒子位置 - 沿着连接线均匀分布
        for (let i = 0; i < particleCount; i++) {
          // 均匀分布在连接线上
          const t = i / particleCount
          const x = sourcePosition.x + (targetPosition.x - sourcePosition.x) * t
          const y = sourcePosition.y + (targetPosition.y - sourcePosition.y) * t
          const z = sourcePosition.z + (targetPosition.z - sourcePosition.z) * t

          particlePositions[i * 3] = x
          particlePositions[i * 3 + 1] = y
          particlePositions[i * 3 + 2] = z
        }

        const particleGeometry = new THREE.BufferGeometry()
        particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))

        // 创建粒子材质 - 使用更明亮的颜色和更大的尺寸，增强可见性
        const particleMaterial = new THREE.PointsMaterial({
          color: connection.userData.sourceLayer % 2 === 0 ? 0x10b981 : 0x0ea5e9,
          size: 0.15,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        })

        // 创建粒子系统
        const particles = new THREE.Points(particleGeometry, particleMaterial)
        particles.userData = {
          type: "dataFlow",
          connectionIndex: index,
          sourcePosition: sourcePosition.clone(),
          targetPosition: targetPosition.clone(),
          progress: Array(particleCount)
            .fill(0)
            .map(() => Math.random()), // 初始进度随机分布
          speeds: Array(particleCount)
            .fill(0)
            .map(() => 0.005 + Math.random() * 0.01), // 随机速度
        }

        scene.add(particles)
        particlesRef.current.push(particles)
      })
    }

    createDataFlowParticles()

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate)

      // 更新控制器
      if (controlsRef.current) {
        if (controlMode === "orbit") {
          ;(controlsRef.current as OrbitControls).update()
        } else {
          ;(controlsRef.current as FlyControls).update(0.05)
        }
      }

      // 更新神经元动画
      neuronGroups.forEach((group, groupIndex) => {
        group.children.forEach((neuron, neuronIndex) => {
          // 使神经元轻微脉动
          const scale = 0.9 + 0.2 * Math.sin(Date.now() * 0.001 + neuronIndex * 0.1 + groupIndex * 0.5)
          neuron.scale.set(scale, scale, scale)

          // 调整发光强度
          const material = neuron.material as THREE.MeshPhongMaterial
          material.emissiveIntensity = 0.2 + 0.1 * Math.sin(Date.now() * 0.002 + neuronIndex * 0.1)
        })
      })

      // 更新数据流粒子
      particlesRef.current.forEach((particles) => {
        const positions = particles.geometry.getAttribute("position").array as Float32Array
        const particleCount = positions.length / 3
        const sourcePosition = particles.userData.sourcePosition
        const targetPosition = particles.userData.targetPosition
        const progress = particles.userData.progress
        const speeds = particles.userData.speeds

        if (!sourcePosition || !targetPosition) return

        for (let i = 0; i < particleCount; i++) {
          // 更新进度
          progress[i] += speeds[i] * dataFlowSpeed

          // 如果到达终点，重置到起点
          if (progress[i] > 1) {
            progress[i] = 0
          }

          // 计算新位置 - 严格沿着连接线移动
          const t = progress[i]
          positions[i * 3] = sourcePosition.x + (targetPosition.x - sourcePosition.x) * t
          positions[i * 3 + 1] = sourcePosition.y + (targetPosition.y - sourcePosition.y) * t
          positions[i * 3 + 2] = sourcePosition.z + (targetPosition.z - sourcePosition.z) * t
        }

        particles.geometry.attributes.position.needsUpdate = true
      })

      renderer.render(scene, camera)
    }

    animate()

    // 处理窗口大小变化
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // 处理鼠标交互
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !camera || !renderer) return

      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)

      // 检测与神经元的交叉
      let intersects: THREE.Intersection[] = []

      neuronGroups.forEach((group) => {
        const groupIntersects = raycaster.intersectObjects(group.children)
        intersects = [...intersects, ...groupIntersects]
      })

      if (intersects.length > 0) {
        const object = intersects[0].object
        if (object.userData.type === "neuron") {
          const layerId = object.userData.layerId
          setHoveredPart(`${language === "en" ? "Neuron in Layer" : "神经元在层"} ${layerId + 1}`)
          document.body.style.cursor = "pointer"
        }
      } else {
        setHoveredPart(null)
        document.body.style.cursor = "default"
      }
    }

    const onClick = () => {
      if (hoveredPart) {
        setSelectedPart(hoveredPart)
      } else {
        setSelectedPart(null)
      }
    }

    containerRef.current.addEventListener("mousemove", onMouseMove)
    containerRef.current.addEventListener("click", onClick)

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize)

      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", onMouseMove)
        containerRef.current.removeEventListener("click", onClick)

        if (rendererRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
      }

      // 清理Three.js对象
      particlesRef.current.forEach((particles) => {
        particles.geometry.dispose()
        ;(particles.material as THREE.Material).dispose()
        scene.remove(particles)
      })

      connectionsRef.current.forEach((connection) => {
        connection.geometry.dispose()
        ;(connection.material as THREE.Material).dispose()
        scene.remove(connection)
      })

      neuronGroupsRef.current.forEach((group) => {
        group.children.forEach((child) => {
          ;(child as THREE.Mesh).geometry.dispose()
          ;((child as THREE.Mesh).material as THREE.Material).dispose()
        })
        scene.remove(group)
      })

      layersRef.current.forEach((layer) => {
        layer.geometry.dispose()
        ;(layer.material as THREE.Material).dispose()
        scene.remove(layer)
      })

      scene.remove(ambientLight)
      scene.remove(directionalLight)
      scene.remove(pointLight1)
      scene.remove(pointLight2)

      if (controlsRef.current) {
        if (controlMode === "orbit") {
          ;(controlsRef.current as OrbitControls).dispose()
        } else {
          ;(controlsRef.current as FlyControls).dispose()
        }
      }
    }
  }, [language, dataFlowSpeed, controlMode])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Cube className="w-6 h-6 text-purple-400" />
          {language === "en" ? "Enhanced 3D Neural Network" : "增强型3D神经网络"}
        </h2>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="explore">{language === "en" ? "Explore" : "探索"}</TabsTrigger>
            <TabsTrigger value="fly">{language === "en" ? "Fly Mode" : "飞行模式"}</TabsTrigger>
            <TabsTrigger value="data">{language === "en" ? "Data Flow" : "数据流"}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            ref={containerRef}
            className="relative bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden"
            style={{ height: isFullscreen ? "100vh" : "500px" }}
          >
            {/* Three.js canvas will be appended here */}

            {/* 控制面板 */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900/70 h-10 w-10 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleControlMode}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900/70 h-10 w-10 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
              >
                {controlMode === "orbit" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleLayerVisibility}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900/70 h-10 w-10 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
              >
                <LayersIcon className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowHelp(!showHelp)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900/70 h-10 w-10 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </div>

            {/* 层导航控制 - 仅在飞行模式下显示 */}
            {controlMode === "fly" && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-zinc-900/70 border border-zinc-700 rounded-lg p-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={navigateToPrevLayer}
                  disabled={currentLayer <= 0}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900 h-8 w-8 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="text-xs text-zinc-300">
                  {language === "en" ? "Layer" : "层"} {currentLayer + 1} / {totalLayers}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={navigateToNextLayer}
                  disabled={currentLayer >= totalLayers - 1}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900 h-8 w-8 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* 悬停信息 */}
            {hoveredPart && (
              <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:max-w-xs bg-zinc-900/90 border border-zinc-700 rounded-lg p-3 backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-emerald-400">{hoveredPart}</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {language === "en"
                    ? "Click to select this neuron and see its connections"
                    : "点击选择此神经元并查看其连接"}
                </p>
              </div>
            )}

            {/* 帮助提示 */}
            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute top-4 left-4 bg-zinc-900/90 border border-zinc-700 rounded-lg p-3 backdrop-blur-sm max-w-xs"
                >
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                    {language === "en" ? "Controls Guide" : "控制指南"}
                  </h3>
                  <ul className="text-xs text-zinc-400 space-y-2">
                    <li className="flex items-center gap-2">
                      <RotateCw className="w-3 h-3 text-zinc-500" />
                      <span>{language === "en" ? "Drag to rotate (Orbit mode)" : "拖动旋转（轨道模式）"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ZoomIn className="w-3 h-3 text-zinc-500" />
                      <span>{language === "en" ? "Scroll to zoom" : "滚动缩放"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Eye className="w-3 h-3 text-zinc-500" />
                      <span>{language === "en" ? "Click eye icon to enter fly mode" : "点击眼睛图标进入飞行模式"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-zinc-500" />
                      <span>
                        {language === "en"
                          ? "In fly mode: WASD to move, arrows to look"
                          : "飞行模式：WASD移动，箭头键转向"}
                      </span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="explore" className="mt-0 h-full">
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg h-full p-4">
                <h3 className="text-lg font-semibold mb-4">{language === "en" ? "Network Structure" : "网络结构"}</h3>

                <div className="space-y-4">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>\
                      {language === "en" ? "Neural Network Layers" : "神经网络层"}
                    </h4>
                    <p className="text-xs text-zinc-400 mb-3">
                      {language === "en"
                        ? "This 3D visualization shows a neural network with multiple layers. Each layer contains neurons that process information and pass it to the next layer."
                        : "这个3D可视化展示了一个多层神经网络。每一层包含处理信息并将其传递到下一层的神经元。"}
                    </p>
                    <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-3 mt-4">
                      <h4 className="text-sm font-medium text-purple-400 mb-2">
                        {language === "en" ? "Learning Tip" : "学习提示"}
                      </h4>
                      <p className="text-xs text-zinc-400">
                        {language === "en"
                          ? "Neural networks process information layer by layer. Each neuron receives inputs from the previous layer, applies a transformation, and passes the result to the next layer. This is how deep learning models learn complex patterns."
                          : "神经网络逐层处理信息。每个神经元从上一层接收输入，应用变换，并将结果传递到下一层。这就是深度学习模型如何学习复杂模式的方式。"}
                      </p>
                    </div>

                    <div className="mt-3 space-y-1">
                      {Array.from({ length: totalLayers }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                            currentLayer === i ? "bg-emerald-900/30 border border-emerald-800" : "hover:bg-zinc-800"
                          }`}
                          onClick={() => setCurrentLayer(i)}
                        >
                          <span className="text-xs">
                            {language === "en" ? "Layer" : "层"} {i + 1}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {i === 0
                              ? language === "en"
                                ? "Input"
                                : "输入"
                              : i === totalLayers - 1
                                ? language === "en"
                                  ? "Output"
                                  : "输出"
                                : language === "en"
                                  ? "Hidden"
                                  : "隐藏"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      {language === "en" ? "Neurons" : "神经元"}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {language === "en"
                        ? "Neurons are the basic processing units of the network. They receive inputs, apply weights and activation functions, and produce outputs."
                        : "神经元是网络的基本处理单元。它们接收输入，应用权重和激活函数，并产生输出。"}
                    </p>

                    <div className="mt-3 flex items-center justify-center">
                      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center relative">
                        <div className="w-10 h-10 bg-blue-900/30 border border-blue-800 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-blue-500/50 rounded-full animate-pulse"></div>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          <div className="w-14 h-14 border border-blue-500/30 rounded-full animate-ping opacity-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-3 mt-4">
                    <h4 className="text-sm font-medium text-purple-400 mb-2">
                      {language === "en" ? "Neural Connections" : "神经元连接"}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {language === "en"
                        ? "In neural networks, neurons from adjacent layers are connected to each other. Each connection has a weight that determines how much influence one neuron has on another. During training, these weights are adjusted to minimize prediction errors."
                        : "在神经网络中，相邻层的神经元相互连接。每个连接都有一个权重，决定了一个神经元对另一个神经元的影响程度。在训练过程中，这些权重会被调整以最小化预测误差。"}
                    </p>
                  </div>

                  {selectedPart && (
                    <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-blue-400 mb-2">{selectedPart}</h4>
                      <p className="text-xs text-zinc-400">
                        {language === "en"
                          ? "This neuron processes information from the previous layer and sends signals to neurons in the next layer. The strength of these connections determines the network's behavior."
                          : "这个神经元处理来自上一层的信息，并向下一层的神经元发送信号。这些连接的强度决定了网络的行为。"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fly" className="mt-0 h-full">
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg h-full p-4">
                <h3 className="text-lg font-semibold mb-4">
                  {language === "en" ? "Fly Mode Controls" : "飞行模式控制"}
                </h3>

                <div className="space-y-4">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-emerald-400" />
                      {language === "en" ? "Navigation Controls" : "导航控制"}
                    </h4>
                    <p className="text-xs text-zinc-400 mb-3">
                      {language === "en"
                        ? "Fly mode allows you to navigate inside the neural network. Use these controls to move around and explore the network from within."
                        : "飞行模式允许您在神经网络内部导航。使用这些控制来移动并从内部探索网络。"}
                    </p>
                    <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3 mt-4">
                      <p className="text-xs text-zinc-400">
                        {language === "en"
                          ? "Flying inside the neural network gives you a unique perspective on how information flows between layers. Notice how neurons are organized in layers and how connections form complex pathways for data to travel through."
                          : "在神经网络内部飞行可以让您从独特的角度了解信息如何在层之间流动。注意神经元如何在层中组织，以及连接如何形成复杂的数据传输路径。"}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="col-span-1"></div>
                      <div className="bg-zinc-800 border border-zinc-700 rounded p-2 text-center">
                        <span className="text-xs">W</span>
                      </div>
                      <div className="col-span-1"></div>

                      <div className="bg-zinc-800 border border-zinc-700 rounded p-2 text-center">
                        <span className="text-xs">A</span>
                      </div>
                      <div className="bg-zinc-800 border border-zinc-700 rounded p-2 text-center">
                        <span className="text-xs">S</span>
                      </div>
                      <div className="bg-zinc-800 border border-zinc-700 rounded p-2 text-center">
                        <span className="text-xs">D</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-500 text-center mb-4">
                      {language === "en" ? "Movement Controls" : "移动控制"}
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1"></div>
                      <div className="bg-zinc-800 border border-zinc-700 rounded p-2 text-center">
                        <span className="text-xs">↑</span>
                      </div>
                      <div className="col-span-1"></div>

                      <div className="bg-zinc-800 border border-zinc-700 rounded p-2 text-center">
                        <span className="text-xs">←</span>
                      </div>
                      <div className="bg-zinc-800 border border-zinc-700 rounded p-2 text-center">
                        <span className="text-xs">↓</span>
                      </div>
                      <div className="bg-zinc-800 border border-zinc-700 rounded p-2 text-center">
                        <span className="text-xs">→</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-500 text-center mt-1">
                      {language === "en" ? "Look Direction" : "视角方向"}
                    </p>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <LayersIcon className="w-4 h-4 text-blue-400" />
                      {language === "en" ? "Layer Navigation" : "层导航"}
                    </h4>
                    <p className="text-xs text-zinc-400 mb-3">
                      {language === "en"
                        ? "Use the layer navigation controls at the bottom of the screen to quickly move between network layers."
                        : "使用屏幕底部的层导航控制快速在网络层之间移动。"}
                    </p>

                    <div className="flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg p-2">
                      <ChevronLeft className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs text-zinc-300">{language === "en" ? "Previous Layer" : "上一层"}</span>
                      <div className="mx-2 text-zinc-500">|</div>
                      <span className="text-xs text-zinc-300">{language === "en" ? "Next Layer" : "下一层"}</span>
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    </div>
                  </div>

                  <Button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 w-full bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-4 py-2"
                    onClick={toggleControlMode}
                  >
                    {controlMode === "orbit"
                      ? language === "en"
                        ? "Enter Fly Mode"
                        : "进入飞行模式"
                      : language === "en"
                        ? "Exit Fly Mode"
                        : "退出飞行模式"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="mt-0 h-full">
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg h-full p-4">
                <h3 className="text-lg font-semibold mb-4">
                  {language === "en" ? "Data Flow Visualization" : "数据流可视化"}
                </h3>

                <div className="space-y-4">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      {language === "en" ? "Information Flow" : "信息流"}
                    </h4>
                    <p className="text-xs text-zinc-400 mb-3">
                      {language === "en"
                        ? "The glowing particles represent data flowing through the neural network. Information travels from the input layer through hidden layers to the output layer."
                        : "发光粒子代表通过神经网络流动的数据。信息从输入层通过隐藏层传递到输出层。"}
                    </p>

                    <div className="relative h-20 bg-zinc-800 rounded-lg overflow-hidden mb-2">
                      <div className="absolute inset-0 flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="relative flex-1 h-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-emerald-500/30 rounded-full"></div>
                            <motion.div
                              animate={{
                                x: ["-50%", "50%"],
                                opacity: [0, 1, 0],
                              }}
                              transition={{
                                repeat: Number.POSITIVE_INFINITY,
                                duration: 3,
                                ease: "linear",
                                delay: i * 0.4,
                              }}
                              className="absolute w-2 h-2 bg-emerald-500 rounded-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-zinc-500 text-center">
                      {language === "en" ? "Data flows from left to right" : "数据从左向右流动"}
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3 mt-4">
                    <h4 className="text-sm font-medium text-blue-400 mb-2">
                      {language === "en" ? "Forward Propagation" : "前向传播"}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {language === "en"
                        ? "The glowing particles represent data flowing through the network during forward propagation. In real neural networks, this is how input data is transformed layer by layer until it reaches the output. Each neuron applies a weighted sum of its inputs followed by an activation function."
                        : "发光粒子代表在前向传播过程中通过网络流动的数据。在真实的神经网络中，这就是输入数据逐层转换直到到达输出的方式。每个神经元对其输入应用加权和，然后应用激活函数。"}
                    </p>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-2">{language === "en" ? "Flow Speed" : "流动速度"}</h4>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-3 h-3 text-zinc-500" />
                      <Slider
                        value={[dataFlowSpeed]}
                        min={0.1}
                        max={3}
                        step={0.1}
                        onValueChange={(value) => setDataFlowSpeed(value[0])}
                      />
                      <Zap className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>{language === "en" ? "Slow" : "慢"}</span>
                      <span>{dataFlowSpeed.toFixed(1)}x</span>
                      <span>{language === "en" ? "Fast" : "快"}</span>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      {language === "en" ? "Neural Activation" : "神经元激活"}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {language === "en"
                        ? "As data flows through the network, neurons activate and pass information forward. The brightness of neurons indicates their activation level."
                        : "当数据流经网络时，神经元激活并向前传递信息。神经元的亮度表示其激活水平。"}
                    </p>

                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-purple-900/20 border border-purple-800 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-purple-500/30 rounded-full"></div>
                        </div>
                        <span className="text-[10px] text-zinc-500 mt-1">
                          {language === "en" ? "Inactive" : "未激活"}
                        </span>
                      </div>

                      <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-900/20 to-purple-500/80 mx-2"></div>

                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-purple-900/40 border border-purple-500 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-purple-500/80 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-[10px] text-zinc-500 mt-1">{language === "en" ? "Active" : "激活"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

