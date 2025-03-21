"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Cpu, Zap, Download, Share, Sparkles, BarChart } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ModelBuilder() {
  const { t, language } = useLanguage()
  const [layers, setLayers] = useState(8)
  const [attentionHeads, setAttentionHeads] = useState(12)
  const [parameters, setParameters] = useState(7)
  const [trainingData, setTrainingData] = useState(300)
  const [trainingTime, setTrainingTime] = useState(5)
  const [activeTab, setActiveTab] = useState("architecture")

  // 计算模型性能指标
  const calculatePerformance = () => {
    // 简化的性能计算模型
    const baseAccuracy = 0.7
    const layerContribution = layers * 0.01
    const headContribution = attentionHeads * 0.005
    const paramContribution = Math.log10(parameters) * 0.05
    const dataContribution = Math.log10(trainingData) * 0.03
    const timeContribution = Math.log10(trainingTime) * 0.02

    const accuracy = Math.min(
      0.98,
      baseAccuracy + layerContribution + headContribution + paramContribution + dataContribution + timeContribution,
    )
    const speed = Math.max(0.1, 1 - (layers * 0.03 + attentionHeads * 0.01 + Math.log10(parameters) * 0.1))
    const cost = (parameters * 0.5 + trainingData * 0.3 + trainingTime * 2) / 10

    return { accuracy, speed, cost }
  }

  const performance = calculatePerformance()

  // 生成性能历史数据
  const generateHistoryData = () => {
    const data = []
    const baseAccuracy = 0.65

    for (let i = 1; i <= 10; i++) {
      const modelSize = (i * parameters) / 5
      data.push({
        size: modelSize.toFixed(1) + "B",
        accuracy: Math.min(0.98, baseAccuracy + Math.log10(modelSize) * 0.08).toFixed(2),
        speed: Math.max(0.2, 1 - Math.log10(modelSize) * 0.15).toFixed(2),
        cost: (modelSize * 0.7).toFixed(1),
      })
    }

    return data
  }

  const historyData = generateHistoryData()

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          {language === "en" ? "AI Model Builder" : "AI模型构建器"}
        </h2>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="architecture">{language === "en" ? "Architecture" : "架构"}</TabsTrigger>
            <TabsTrigger value="training">{language === "en" ? "Training" : "训练"}</TabsTrigger>
            <TabsTrigger value="performance">{language === "en" ? "Performance" : "性能"}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>
                {activeTab === "architecture"
                  ? language === "en"
                    ? "Model Architecture"
                    : "模型架构"
                  : activeTab === "training"
                    ? language === "en"
                      ? "Training Configuration"
                      : "训练配置"
                    : language === "en"
                      ? "Performance Metrics"
                      : "性能指标"}
              </CardTitle>
              <CardDescription>
                {activeTab === "architecture"
                  ? language === "en"
                    ? "Customize your model's neural network structure"
                    : "自定义您的模型神经网络结构"
                  : activeTab === "training"
                    ? language === "en"
                      ? "Configure training parameters"
                      : "配置训练参数"
                    : language === "en"
                      ? "Analyze model performance"
                      : "分析模型性能"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="architecture" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">
                        {language === "en" ? "Number of Layers:" : "层数:"} {layers}
                      </label>
                      <span className="text-xs text-zinc-500">
                        {layers < 6
                          ? language === "en"
                            ? "Shallow"
                            : "浅层"
                          : layers > 12
                            ? language === "en"
                              ? "Deep"
                              : "深层"
                            : language === "en"
                              ? "Balanced"
                              : "平衡"}
                      </span>
                    </div>
                    <Slider value={[layers]} min={2} max={24} step={1} onValueChange={(value) => setLayers(value[0])} />
                    <div className="flex justify-between mt-1 text-xs text-zinc-500">
                      <span>2</span>
                      <span>12</span>
                      <span>24</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">
                        {language === "en" ? "Attention Heads:" : "注意力头:"} {attentionHeads}
                      </label>
                      <span className="text-xs text-zinc-500">
                        {attentionHeads < 8
                          ? language === "en"
                            ? "Limited Context"
                            : "有限上下文"
                          : attentionHeads > 16
                            ? language === "en"
                              ? "Rich Context"
                              : "丰富上下文"
                            : language === "en"
                              ? "Standard"
                              : "标准"}
                      </span>
                    </div>
                    <Slider
                      value={[attentionHeads]}
                      min={4}
                      max={32}
                      step={4}
                      onValueChange={(value) => setAttentionHeads(value[0])}
                    />
                    <div className="flex justify-between mt-1 text-xs text-zinc-500">
                      <span>4</span>
                      <span>16</span>
                      <span>32</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">
                        {language === "en" ? "Parameters (billions):" : "参数 (十亿):"} {parameters}B
                      </label>
                      <span className="text-xs text-zinc-500">
                        {parameters < 3
                          ? language === "en"
                            ? "Small Model"
                            : "小型模型"
                          : parameters > 13
                            ? language === "en"
                              ? "Large Model"
                              : "大型模型"
                            : language === "en"
                              ? "Medium Model"
                              : "中型模型"}
                      </span>
                    </div>
                    <Slider
                      value={[parameters]}
                      min={1}
                      max={70}
                      step={1}
                      onValueChange={(value) => setParameters(value[0])}
                    />
                    <div className="flex justify-between mt-1 text-xs text-zinc-500">
                      <span>1B</span>
                      <span>7B</span>
                      <span>70B</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-purple-400" />
                        {language === "en" ? "Architecture Preview" : "架构预览"}
                      </h3>

                      <div className="relative h-40 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {Array.from({ length: Math.min(12, layers) }).map((_, i) => (
                            <div key={i} className="relative mx-1">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${60 + (i % 3) * 20}px` }}
                                className="w-4 bg-purple-900/50 rounded-full"
                              />
                              <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-around">
                                {Array.from({ length: Math.min(3, Math.ceil(attentionHeads / 4)) }).map((_, j) => (
                                  <motion.div
                                    key={j}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.1 + j * 0.05 }}
                                    className="w-2 h-2 bg-purple-400 rounded-full"
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="absolute bottom-2 right-2 text-xs text-zinc-500">
                          {language === "en" ? `${parameters}B parameters` : `${parameters}B 参数`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="training" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">
                        {language === "en" ? "Training Data (GB):" : "训练数据 (GB):"} {trainingData}
                      </label>
                      <span className="text-xs text-zinc-500">
                        {trainingData < 100
                          ? language === "en"
                            ? "Limited Knowledge"
                            : "有限知识"
                          : trainingData > 500
                            ? language === "en"
                              ? "Extensive Knowledge"
                              : "广泛知识"
                            : language === "en"
                              ? "Moderate Knowledge"
                              : "适中知识"}
                      </span>
                    </div>
                    <Slider
                      value={[trainingData]}
                      min={50}
                      max={1000}
                      step={50}
                      onValueChange={(value) => setTrainingData(value[0])}
                    />
                    <div className="flex justify-between mt-1 text-xs text-zinc-500">
                      <span>50GB</span>
                      <span>500GB</span>
                      <span>1TB</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">
                        {language === "en" ? "Training Time (days):" : "训练时间 (天):"} {trainingTime}
                      </label>
                      <span className="text-xs text-zinc-500">
                        {trainingTime < 3
                          ? language === "en"
                            ? "Quick Training"
                            : "快速训练"
                          : trainingTime > 7
                            ? language === "en"
                              ? "Extended Training"
                              : "延长训练"
                            : language === "en"
                              ? "Standard Training"
                              : "标准训练"}
                      </span>
                    </div>
                    <Slider
                      value={[trainingTime]}
                      min={1}
                      max={14}
                      step={1}
                      onValueChange={(value) => setTrainingTime(value[0])}
                    />
                    <div className="flex justify-between mt-1 text-xs text-zinc-500">
                      <span>1</span>
                      <span>7</span>
                      <span>14</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        {language === "en" ? "Training Visualization" : "训练可视化"}
                      </h3>

                      <div className="relative h-40 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 p-4">
                          <div className="h-full flex items-end">
                            {Array.from({ length: 10 }).map((_, i) => {
                              const height = 20 + (i < 5 ? i * 15 : (10 - i) * 5)
                              return (
                                <motion.div
                                  key={i}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${height}%` }}
                                  transition={{ duration: 1, delay: i * 0.1 }}
                                  className="flex-1 mx-1 bg-gradient-to-t from-yellow-600/70 to-yellow-400/30 rounded-t-sm"
                                />
                              )
                            })}
                          </div>

                          <div className="absolute bottom-2 left-0 w-full flex justify-between px-4 text-[10px] text-zinc-500">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>

                        <div className="absolute top-2 left-2 text-xs text-zinc-400">
                          {language === "en" ? "Training Progress" : "训练进度"}
                        </div>

                        <div className="absolute bottom-2 right-2 text-xs text-zinc-500">
                          {language === "en" ? `${trainingData}GB data` : `${trainingData}GB 数据`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="mt-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col items-center">
                      <div className="text-xs text-zinc-500 mb-1">{language === "en" ? "Accuracy" : "准确率"}</div>
                      <div className="text-2xl font-bold text-emerald-400">
                        {(performance.accuracy * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col items-center">
                      <div className="text-xs text-zinc-500 mb-1">{language === "en" ? "Speed" : "速度"}</div>
                      <div className="text-2xl font-bold text-blue-400">{(performance.speed * 100).toFixed(0)}%</div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col items-center">
                      <div className="text-xs text-zinc-500 mb-1">{language === "en" ? "Cost" : "成本"}</div>
                      <div className="text-2xl font-bold text-yellow-400">${performance.cost.toFixed(1)}K</div>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                      <BarChart className="w-4 h-4 text-purple-400" />
                      {language === "en" ? "Performance Comparison" : "性能比较"}
                    </h3>

                    <div className="h-60">
                      <ChartContainer
                        config={{
                          accuracy: {
                            label: language === "en" ? "Accuracy" : "准确率",
                            color: "hsl(var(--chart-1))",
                          },
                          speed: {
                            label: language === "en" ? "Speed" : "速度",
                            color: "hsl(var(--chart-2))",
                          },
                          cost: {
                            label: language === "en" ? "Cost" : "成本",
                            color: "hsl(var(--chart-3))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={historyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="size" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Line type="monotone" dataKey="accuracy" stroke="var(--color-accuracy)" strokeWidth={2} />
                            <Line type="monotone" dataKey="speed" stroke="var(--color-speed)" strokeWidth={2} />
                            <Line type="monotone" dataKey="cost" stroke="var(--color-cost)" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-zinc-800 bg-zinc-950 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                {language === "en" ? "Your Model" : "您的模型"}
              </CardTitle>
              <CardDescription>
                {language === "en" ? "Model specifications and capabilities" : "模型规格和能力"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-3">
                    {language === "en" ? "Model Specifications" : "模型规格"}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-zinc-400">{language === "en" ? "Architecture" : "架构"}</span>
                      <span>Transformer</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-zinc-400">{language === "en" ? "Layers" : "层数"}</span>
                      <span>{layers}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-zinc-400">{language === "en" ? "Attention Heads" : "注意力头"}</span>
                      <span>{attentionHeads}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-zinc-400">{language === "en" ? "Parameters" : "参数"}</span>
                      <span>{parameters}B</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-zinc-400">{language === "en" ? "Training Data" : "训练数据"}</span>
                      <span>{trainingData}GB</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-zinc-400">{language === "en" ? "Training Time" : "训练时间"}</span>
                      <span>
                        {trainingTime} {language === "en" ? "days" : "天"}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-3">{language === "en" ? "Capabilities" : "能力"}</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{language === "en" ? "Text Generation" : "文本生成"}</span>
                        <span>
                          {performance.accuracy > 0.9 ? "★★★★★" : performance.accuracy > 0.8 ? "★★★★☆" : "★★★☆☆"}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600" style={{ width: `${performance.accuracy * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{language === "en" ? "Code Generation" : "代码生成"}</span>
                        <span>
                          {performance.accuracy > 0.85 && parameters > 10
                            ? "★★★★☆"
                            : performance.accuracy > 0.75
                              ? "★★★☆☆"
                              : "★★☆☆☆"}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${(performance.accuracy * 0.9 - 0.1) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{language === "en" ? "Reasoning" : "推理能力"}</span>
                        <span>{parameters > 20 ? "★★★★☆" : parameters > 7 ? "★★★☆☆" : "★★☆☆☆"}</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600" style={{ width: `${Math.log10(parameters) * 20}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{language === "en" ? "Context Length" : "上下文长度"}</span>
                        <span>{attentionHeads > 24 ? "★★★★★" : attentionHeads > 12 ? "★★★★☆" : "★★★☆☆"}</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-600" style={{ width: `${(attentionHeads / 32) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Download className="w-4 h-4 mr-2" />
                    {language === "en" ? "Export" : "导出"}
                  </Button>
                  <Button variant="outline" className="w-full border-zinc-700">
                    <Share className="w-4 h-4 mr-2" />
                    {language === "en" ? "Share" : "分享"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

