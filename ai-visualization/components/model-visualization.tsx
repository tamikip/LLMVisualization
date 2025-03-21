"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Info, ZoomIn, ZoomOut, Plus, Minus, Play, Pause, Settings, HelpCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function ModelVisualization() {
  const { t, language } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [zoom, setZoom] = useState(1)
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null)
  const [layerCount, setLayerCount] = useState(8)
  const [isAnimating, setIsAnimating] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // 动态生成模型架构数据
  const generateLayers = (count: number) => {
    const baseNames =
      language === "en"
        ? [
            { name: "Input Embedding Layer", description: "Converts tokens into vector representations" },
            { name: "Encoder Layer", description: "Transformer encoder layer with self-attention" },
            { name: "Output Layer", description: "Converts hidden states to token probabilities" },
          ]
        : [
            { name: "输入嵌入层", description: "将词元转换为向量表示" },
            { name: "编码器层", description: "带有自注意力的 Transformer 编码器层" },
            { name: "输出层", description: "将隐藏状态转换为词元概率" },
          ]

    const layers = []

    // 添加输入嵌入层
    layers.push(baseNames[0])

    // 添加编码器层
    for (let i = 1; i < count; i++) {
      if (i === count - 1) {
        // 最后一层是输出层
        layers.push(baseNames[2])
      } else {
        // 中间层是编码器层
        layers.push({
          name: `${baseNames[1].name} ${i}`,
          description:
            language === "en"
              ? `Encoder layer ${i} with self-attention mechanism`
              : `第 ${i} 个${baseNames[1].description}`,
        })
      }
    }

    return layers
  }

  const [layers, setLayers] = useState(generateLayers(layerCount))

  // 当层数变化时更新层数据
  useEffect(() => {
    setLayers(generateLayers(layerCount))
  }, [layerCount, language])

  // 动画：数据流经模型
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布尺寸
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // 动画变量
    const particles: {
      x: number
      y: number
      speed: number
      size: number
      color: string
      sourceX: number
      sourceY: number
      targetX: number
      targetY: number
      progress: number
    }[] = []
    const layerPositions = Array.from({ length: layers.length }).map(
      (_, i) => 50 + (i * (canvas.offsetWidth - 100)) / (layers.length - 1),
    )

    // 创建粒子
    const createParticles = () => {
      if (particles.length < 50 && isAnimating) {
        const sourceLayer = Math.floor(Math.random() * (layerPositions.length - 1))
        const sourceX = layerPositions[sourceLayer]
        const sourceNodeIndex = Math.floor(Math.random() * 5)
        const sourceY = 50 + (sourceNodeIndex * (canvas.offsetHeight - 100)) / 4

        // 随机选择目标节点
        const targetX = layerPositions[sourceLayer + 1]
        const possibleTargets = []

        for (let k = 0; k < 5; k++) {
          const targetY = 50 + (k * (canvas.offsetHeight - 100)) / 4
          if ((sourceNodeIndex + k) % 2 === 0 || Math.abs(sourceNodeIndex - k) <= 1) {
            possibleTargets.push(targetY)
          }
        }

        // 如果没有可能的目标，跳过创建粒子
        if (possibleTargets.length === 0) return

        const targetY = possibleTargets[Math.floor(Math.random() * possibleTargets.length)]

        particles.push({
          x: sourceX,
          y: sourceY,
          sourceX: sourceX,
          sourceY: sourceY,
          targetX: targetX,
          targetY: targetY,
          progress: 0,
          speed: (0.005 + Math.random() * 0.01) * animationSpeed,
          size: 1.5 + Math.random() * 2.5, // 增加粒子大小
          color: `rgba(16, 185, 129, ${0.5 + Math.random() * 0.5})`, // 增加亮度
        })
      }
    }

    // 绘制函数
    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // 绘制层之间的连接
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 0.5

      for (let i = 0; i < layerPositions.length - 1; i++) {
        const x1 = layerPositions[i]
        const x2 = layerPositions[i + 1]

        for (let j = 0; j < 5; j++) {
          const y1 = 50 + (j * (canvas.offsetHeight - 100)) / 4

          // 为每个节点创建多个连接到下一层的不同节点
          for (let k = 0; k < 5; k++) {
            const y2 = 50 + (k * (canvas.offsetHeight - 100)) / 4

            // 使用交替模式创建连接
            if ((j + k) % 2 === 0 || Math.abs(j - k) <= 1) {
              ctx.beginPath()
              ctx.moveTo(x1, y1)
              ctx.lineTo(x2, y2)
              ctx.stroke()
            }
          }
        }
      }

      // 绘制层
      for (let i = 0; i < layerPositions.length; i++) {
        const x = layerPositions[i]
        const isHovered = hoveredLayer === i

        ctx.fillStyle = isHovered ? "rgba(16, 185, 129, 0.5)" : "rgba(16, 185, 129, 0.2)"
        ctx.strokeStyle = isHovered ? "rgba(16, 185, 129, 1)" : "rgba(16, 185, 129, 0.5)"
        ctx.lineWidth = isHovered ? 2 : 1

        // 绘制层节点
        for (let j = 0; j < 5; j++) {
          const y = 50 + (j * (canvas.offsetHeight - 100)) / 4

          ctx.beginPath()
          ctx.arc(x, y, isHovered ? 6 : 4, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        }
      }

      // 更新并绘制粒子
      particles.forEach((particle, index) => {
        // 更新进度
        particle.progress += particle.speed

        // 如果到达终点，移除粒子
        if (particle.progress >= 1) {
          particles.splice(index, 1)
          return
        }

        // 沿着连接线移动粒子
        particle.x = particle.sourceX + (particle.targetX - particle.sourceX) * particle.progress
        particle.y = particle.sourceY + (particle.targetY - particle.sourceY) * particle.progress

        // 绘制粒子
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // 创建新粒子
      createParticles()

      animationRef.current = requestAnimationFrame(draw)
    }

    // 开始动画
    draw()

    // 处理画布悬停
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left

      // 找到最近的层
      let closestLayer = null
      let minDistance = Number.POSITIVE_INFINITY

      layerPositions.forEach((pos, index) => {
        const distance = Math.abs(x - pos)
        if (distance < minDistance && distance < 30) {
          minDistance = distance
          closestLayer = index
        }
      })

      setHoveredLayer(closestLayer)
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      cancelAnimationFrame(animationRef.current)
      canvas.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [layers.length, hoveredLayer, isAnimating, animationSpeed])

  // 处理层数变化
  const handleLayerCountChange = (value: number[]) => {
    setLayerCount(Math.max(3, value[0])) // 至少需要3层（输入、中间、输出）
  }

  // 增加/减少层数
  const incrementLayers = () => {
    setLayerCount((prev) => Math.min(prev + 1, 12))
  }

  const decrementLayers = () => {
    setLayerCount((prev) => Math.max(prev - 1, 3))
  }

  // 切换动画状态
  const toggleAnimation = () => {
    setIsAnimating((prev) => !prev)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{t("main.modelArchitecture")}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowHelp(!showHelp)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900 h-10 w-10 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
          <Popover open={showSettings} onOpenChange={setShowSettings}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900 h-10 w-10 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-zinc-900 border-zinc-700">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">
                    {language === "en" ? "Number of Layers:" : "层数:"} {layerCount}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementLayers}
                      disabled={layerCount <= 3}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900 h-8 w-8 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Slider
                      value={[layerCount]}
                      min={3}
                      max={12}
                      step={1}
                      onValueChange={handleLayerCountChange}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementLayers}
                      disabled={layerCount >= 12}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900 h-8 w-8 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">
                    {language === "en" ? "Animation Speed:" : "动画速度:"} {animationSpeed.toFixed(1)}x
                  </h3>
                  <Slider
                    value={[animationSpeed]}
                    min={0.1}
                    max={3}
                    step={0.1}
                    onValueChange={(value) => setAnimationSpeed(value[0])}
                    className="flex-1"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleAnimation}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900 h-10 w-10 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
          >
            {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
            disabled={zoom <= 0.5}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900 h-10 w-10 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-zinc-400">{Math.round(zoom * 100)}%</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((prev) => Math.min(2, prev + 0.1))}
            disabled={zoom >= 2}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900 h-10 w-10 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showHelp && (
        <div className="mb-4 bg-zinc-900/80 border border-zinc-800 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            {language === "en" ? "Understanding the Visualization" : "理解可视化"}
          </h3>
          <p className="text-sm text-zinc-400 mb-3">
            {language === "en"
              ? "This visualization shows a simplified view of a Large Language Model's architecture. Each column represents a layer in the model, and the flowing particles represent information moving through the network."
              : "此可视化显示了大语言模型架构的简化视图。每一列代表模型中的一层，流动的粒子代表通过网络移动的信息。"}
          </p>
          <ul className="text-sm text-zinc-500 list-disc pl-5 space-y-1">
            <li>
              {language === "en" ? "Hover over nodes to see layer details" : "将鼠标悬停在节点上以查看层详细信息"}
            </li>
            <li>
              {language === "en"
                ? "Use the settings icon to adjust layers and animation speed"
                : "使用设置图标调整层和动画速度"}
            </li>
            <li>{language === "en" ? "Play/pause button controls the animation" : "播放/暂停按钮控制动画"}</li>
          </ul>
        </div>
      )}

      <div
        className="relative bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden"
        style={{ height: "400px" }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
        />

        {hoveredLayer !== null && (
          <div className="absolute bottom-4 left-4 right-4 bg-zinc-900/90 border border-zinc-700 rounded-lg p-3 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-emerald-400">{layers[hoveredLayer].name}</h3>
            <p className="text-xs text-zinc-400 mt-1">{layers[hoveredLayer].description}</p>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-emerald-900/30 rounded-lg flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{t("model.transformer")}</h3>
              <p className="text-xs text-zinc-400 mt-1">{t("model.transformer.desc")}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-emerald-900/30 rounded-lg flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{t("model.scaling")}</h3>
              <p className="text-xs text-zinc-400 mt-1">{t("model.scaling.desc")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">{t("model.layerDetails")}</h3>
        <div className="space-y-2">
          {layers.map((layer, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      hoveredLayer === index
                        ? "bg-emerald-900/20 border-emerald-700"
                        : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                    }`}
                    whileHover={{ y: -2 }}
                    onMouseEnter={() => setHoveredLayer(index)}
                    onMouseLeave={() => setHoveredLayer(null)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{layer.name}</span>
                      <span className="text-xs text-zinc-500">
                        {language === "en" ? "Layer" : t("model.layer")} {index + 1}
                      </span>
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-sm">{layer.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  )
}

