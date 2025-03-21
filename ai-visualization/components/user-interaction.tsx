"use client"

import type React from "react"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Loader2, Send, Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function UserInteraction() {
  const { t, language } = useLanguage()
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "system", content: t("chat.welcome") },
  ])
  const [activeTab, setActiveTab] = useState("chat")
  const [tokenProbabilities, setTokenProbabilities] = useState<{ token: string; probability: number }[]>([])
  const [attentionMap, setAttentionMap] = useState<number[][]>([])

  // 交互参数状态
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(50)
  const [modelType, setModelType] = useState("gpt-4")
  const [showTokenization, setShowTokenization] = useState(false)
  const [tokenizedInput, setTokenizedInput] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsGenerating(true)

    // 模拟分词
    const tokens = input.split(/\s+/).filter((t) => t.length > 0)
    setTokenizedInput(tokens)
    setShowTokenization(true)

    // 模拟模型响应，延迟基于温度
    // 更高的温度 = 更多的"思考"时间
    setTimeout(
      () => {
        let response = ""

        if (language === "en") {
          if (input.toLowerCase().includes("what is") || input.toLowerCase().includes("how")) {
            response =
              "Large Language Models (LLMs) are neural networks trained on vast amounts of text data. They learn patterns in language and can generate human-like text based on the input they receive. Key components include tokenization, embeddings, self-attention mechanisms, and prediction layers."
          } else if (input.toLowerCase().includes("example")) {
            response =
              "Here's an example of how an LLM works: When you input 'The capital of France is', the model tokenizes this text, processes it through multiple transformer layers, and predicts the most likely next token—in this case, 'Paris'."
          } else {
            response =
              "LLMs process your input through multiple transformer layers, using self-attention mechanisms to understand context and relationships between words. Each layer refines the representation until the final layer generates a probability distribution over the vocabulary to predict the next token."
          }
        } else {
          if (input.toLowerCase().includes("什么是") || input.toLowerCase().includes("如何")) {
            response =
              "大语言模型（LLM）是在大量文本数据上训练的神经网络。它们学习语言中的模式，并能基于接收到的输入生成类似人类的文本。关键组件包括分词、嵌入、自注意力机制和预测层。"
          } else if (input.toLowerCase().includes("例子")) {
            response =
              "这是 LLM 工作原理的一个例子：当您输入'法国的首都是'时，模型会对这段文本进行分词，通过多个 Transformer 层处理，并预测最可能的下一个词元——在这种情况下是'巴黎'。"
          } else {
            response =
              "LLM 通过多个 Transformer 层处理您的输入，使用自注意力机制理解上下文和单词之间的关系。每一层都会细化表示，直到最后一层生成词汇表上的概率分布来预测下一个词元。"
          }
        }

        // 根据 maxTokens 调整响应长度
        if (maxTokens < 30) {
          response = response.split(".")[0] + "."
        }

        setMessages((prev) => [...prev, { role: "assistant", content: response }])

        // 生成词元概率，更多词元
        const vocabTokens =
          language === "en"
            ? [
                "the",
                "model",
                "process",
                "input",
                "through",
                "layer",
                "transformer",
                "attention",
                "neural",
                "network",
                "language",
                "token",
                "embedding",
              ]
            : [
                "的",
                "模型",
                "处理",
                "输入",
                "通过",
                "层",
                "transformer",
                "注意力",
                "神经",
                "网络",
                "语言",
                "词元",
                "嵌入",
              ]

        // 温度影响概率的随机性
        const probs = vocabTokens
          .map((token) => {
            let baseProbability = Math.random()
            // 更高的温度 = 更随机/均匀的分布
            if (temperature > 0.7) {
              baseProbability = 0.3 + baseProbability * 0.7 // 更均匀
            } else {
              // 更低的温度 = 更尖峰的分布
              baseProbability = baseProbability * baseProbability // 更尖峰
            }

            return {
              token,
              probability: baseProbability,
            }
          })
          .sort((a, b) => b.probability - a.probability)

        // 归一化概率
        const sum = probs.reduce((acc, item) => acc + item.probability, 0)
        const normalizedProbs = probs.map((item) => ({
          ...item,
          probability: item.probability / sum,
        }))

        setTokenProbabilities(normalizedProbs)

        // 生成注意力图
        const size = 6
        const attMap: number[][] = []
        for (let i = 0; i < size; i++) {
          const row: number[] = []
          for (let j = 0; j < size; j++) {
            // 使对角线元素具有更高的注意力
            let value = Math.random()
            if (i === j) {
              value = 0.7 + Math.random() * 0.3 // 对角线元素有更高的注意力
            } else if (Math.abs(i - j) === 1) {
              value = 0.4 + Math.random() * 0.3 // 相邻词元有中等注意力
            }
            row.push(value)
          }
          attMap.push(row)
        }
        setAttentionMap(attMap)

        setIsGenerating(false)
      },
      1000 + temperature * 1000,
    ) // 更高的温度 = 更长的"思考"时间
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{t("main.interactiveDemo")}</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="chat">{language === "en" ? "Chat" : "对话"}</TabsTrigger>
            <TabsTrigger value="visualization">{language === "en" ? "Visualization" : "可视化"}</TabsTrigger>
            <TabsTrigger value="parameters">{language === "en" ? "Parameters" : "参数"}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className={`${activeTab === "parameters" ? "lg:col-span-5" : "lg:col-span-3"}`}>
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden h-[500px] flex flex-col">
            {activeTab === "parameters" ? (
              <div className="flex-1 overflow-auto p-6">
                <h3 className="text-xl font-semibold mb-6">{t("params.title")}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">
                          {t("params.temperature")}: {temperature.toFixed(2)}
                        </label>
                        <span className="text-xs text-zinc-500">
                          {temperature < 0.4
                            ? t("params.temperature.low")
                            : temperature > 0.7
                              ? t("params.temperature.high")
                              : t("params.temperature.balanced")}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={temperature}
                        onChange={(e) => setTemperature(Number.parseFloat(e.target.value))}
                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between mt-1 text-xs text-zinc-500">
                        <span>0.1</span>
                        <span>0.5</span>
                        <span>1.0</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">
                          {t("params.maxTokens")}: {maxTokens}
                        </label>
                        <span className="text-xs text-zinc-500">
                          {maxTokens < 30
                            ? t("params.maxTokens.short")
                            : maxTokens > 70
                              ? t("params.maxTokens.long")
                              : t("params.maxTokens.medium")}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="10"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(Number.parseInt(e.target.value))}
                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between mt-1 text-xs text-zinc-500">
                        <span>10</span>
                        <span>50</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium block mb-2">{t("params.modelType")}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["gpt-4", "llama-3", "mistral-7b", "claude-3"].map((model) => (
                          <Button
                            key={model}
                            variant={modelType === model ? "default" : "outline"}
                            className={
                              modelType === model
                                ? "bg-emerald-900/30 hover:bg-emerald-900/40 text-emerald-400 border-emerald-800"
                                : "bg-zinc-900 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-300 text-zinc-400"
                            }
                            onClick={() => setModelType(model)}
                          >
                            {model}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-2">{t("params.advancedSettings")}</label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-md p-3">
                          <span className="text-sm">{t("params.topP")}</span>
                          <div className="w-12 h-6 bg-zinc-800 rounded-full flex items-center px-1 cursor-pointer">
                            <motion.div animate={{ x: 18 }} className="w-4 h-4 bg-emerald-500 rounded-full" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-md p-3">
                          <span className="text-sm">{t("params.freqPenalty")}</span>
                          <div className="w-12 h-6 bg-zinc-800 rounded-full flex items-center px-1 cursor-pointer">
                            <motion.div className="w-4 h-4 bg-zinc-600 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-sm font-medium mb-3">{t("params.modelArch")}</h4>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm">{t("params.attentionHeads")}: 16</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">{t("params.layers")}: 24</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">{t("params.parameters")}: 7B</span>
                      </div>
                    </div>

                    <div className="h-20 relative">
                      <div className="absolute inset-0 flex items-end">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${30 + Math.random() * 50}%` }}
                            className="flex-1 bg-emerald-900/50 border-t border-emerald-700 mx-px"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-auto p-4">
                  {showTokenization && tokenizedInput.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 bg-zinc-900/50 border border-zinc-800 rounded-lg p-3"
                    >
                      <div className="text-xs text-zinc-500 mb-2">
                        {language === "en" ? "Tokenized input:" : "分词输入:"}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {tokenizedInput.map((token, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-xs"
                          >
                            {token}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`mb-4 ${message.role === "user" ? "ml-auto max-w-[80%]" : "mr-auto max-w-[80%]"}`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-emerald-900/30 border border-emerald-800"
                            : message.role === "system"
                              ? "bg-blue-900/30 border border-blue-800"
                              : "bg-zinc-800 border border-zinc-700"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className="text-xs text-zinc-500 mt-1 px-1">
                        {message.role === "user"
                          ? t("chat.you")
                          : message.role === "system"
                            ? t("chat.system")
                            : t("chat.assistant")}
                      </div>
                    </motion.div>
                  ))}
                  {isGenerating && (
                    <div className="flex flex-col gap-2 mr-auto max-w-[80%]">
                      <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{t("chat.thinking")}</span>
                        </div>

                        <div className="mt-2 space-y-1">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ width: "20%" }}
                              animate={{ width: ["20%", "100%", "20%"] }}
                              transition={{
                                repeat: Number.POSITIVE_INFINITY,
                                duration: 2,
                                delay: i * 0.3,
                              }}
                              className="h-1 bg-zinc-700 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-zinc-500 px-1">{t("chat.assistant")}</div>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-800 p-4">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={t("chat.placeholder")}
                      className="bg-zinc-900 border-zinc-700"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!input.trim() || isGenerating}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-zinc-900 h-10 w-10 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
                    >
                      <Send className="w-4 h-4" />
                      <span className="sr-only">{t("chat.send")}</span>
                    </Button>
                  </form>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-zinc-500">
                      {language === "en" ? "Model: " : "模型: "}
                      {modelType} • {language === "en" ? "Temp: " : "温度: "}
                      {temperature.toFixed(1)} • {language === "en" ? "Max tokens: " : "最大词元: "}
                      {maxTokens}
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-none text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-emerald-400 p-0 h-auto hover:text-emerald-500 underline-offset-4 hover:underline"
                      onClick={() => setActiveTab("parameters")}
                    >
                      {t("chat.adjustParams")}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {activeTab === "visualization" && (
          <div className="lg:col-span-2">
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden h-[500px] flex flex-col">
              <div className="border-b border-zinc-800 p-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  {language === "en" ? "Model Internals" : "模型内部"}
                </h3>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">{language === "en" ? "Token Probabilities" : "词元概率"}</h4>
                  <div className="space-y-2">
                    {tokenProbabilities.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-20 text-xs truncate">{item.token}</div>
                        <div className="flex-1 h-6 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.probability * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-emerald-900/70"
                          />
                        </div>
                        <div className="text-xs w-12 text-right">{(item.probability * 100).toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">{language === "en" ? "Attention Map" : "注意力图"}</h4>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2">
                    <div className="grid grid-cols-6 gap-1">
                      {attentionMap.map((row, i) =>
                        row.map((value, j) => (
                          <motion.div
                            key={`${i}-${j}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: (i * 6 + j) * 0.01 }}
                            className="aspect-square rounded relative group cursor-pointer"
                            style={{
                              backgroundColor: `rgba(16, 185, 129, ${value})`,
                              transform: `scale(${0.5 + value * 0.5})`,
                            }}
                          >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] font-bold bg-black/50 rounded transition-opacity">
                              {value.toFixed(2)}
                            </div>
                          </motion.div>
                        )),
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-zinc-500 mt-2">
                    {language === "en"
                      ? "Brighter cells indicate stronger attention between tokens"
                      : "更亮的单元格表示词元之间更强的注意力"}
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">{language === "en" ? "Layer Activations" : "层激活"}</h4>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                      <div className="space-y-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-20 text-xs">
                              {language === "en" ? "Layer" : "层"} {i + 1}
                            </div>
                            <div className="flex-1 h-4 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full w-full relative">
                                {Array.from({ length: 20 }).map((_, j) => {
                                  const height = 30 + Math.random() * 70
                                  return (
                                    <motion.div
                                      key={j}
                                      initial={{ height: 0 }}
                                      animate={{ height: `${height}%` }}
                                      transition={{ delay: j * 0.02 }}
                                      className="absolute bottom-0 w-[5%]"
                                      style={{
                                        left: `${j * 5}%`,
                                        backgroundColor: `rgba(16, 185, 129, ${0.3 + (height / 100) * 0.7})`,
                                      }}
                                    />
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

