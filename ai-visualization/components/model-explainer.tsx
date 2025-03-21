"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ModelExplainerProps {
  type: string
}

export default function ModelExplainer({ type }: ModelExplainerProps) {
  const { t, language } = useLanguage()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [speed, setSpeed] = useState(1)

  // 注意力机制步骤
  const getAttentionSteps = () => {
    if (language === "en") {
      return [
        {
          title: "Input Tokenization",
          description: "Input text is split into tokens, then embedded as vectors.",
          visual: (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="grid grid-cols-6 gap-2 mb-6">
                {["The", "quick", "brown", "fox", "jumps", "over"].map((token, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-zinc-800 border border-zinc-700 rounded-md p-2 text-center text-sm"
                  >
                    {token}
                  </motion.div>
                ))}
              </div>
              <div className="w-8 h-8 flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="grid grid-cols-6 gap-2 mt-6">
                {[101, 2048, 3012, 1996, 5438, 2058].map((id, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="bg-emerald-900/30 border border-emerald-800 rounded-md p-2 text-center text-sm"
                  >
                    {id}
                  </motion.div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Query, Key, Value Projections",
          description: "Each token embedding is projected into query, key, and value vectors.",
          visual: (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="grid grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium mb-2 text-emerald-400">Query</div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-900/20 border border-emerald-800 rounded-md p-3 w-full"
                  >
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                          className="bg-emerald-800/30 h-2 rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium mb-2 text-blue-400">Key</div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-blue-900/20 border border-blue-800 rounded-md p-3 w-full"
                  >
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + i * 0.02 }}
                          className="bg-blue-800/30 h-2 rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium mb-2 text-purple-400">Value</div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-purple-900/20 border border-purple-800 rounded-md p-3 w-full"
                  >
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + i * 0.02 }}
                          className="bg-purple-800/30 h-2 rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Attention Score Calculation",
          description:
            "Attention scores are calculated by multiplying queries and keys, then applying a softmax function.",
          visual: (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="grid grid-cols-6 gap-1 mb-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-900/30 border border-emerald-800 rounded-md flex items-center justify-center mb-2">
                      <span className="text-xs">Q{i + 1}</span>
                    </div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: [0, 100, 100] }}
                      transition={{ duration: 1, times: [0, 0.5, 1], delay: i * 0.1 }}
                      className="w-1 bg-emerald-500/50 rounded-full"
                    />
                  </div>
                ))}
              </div>

              <div className="w-full h-24 relative mb-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute inset-0 bg-zinc-800/50 border border-zinc-700 rounded-lg"
                >
                  <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
                    {Array.from({ length: 36 }).map((_, i) => {
                      const row = Math.floor(i / 6)
                      const col = i % 6
                      const value = Math.random()
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 + (row * 6 + col) * 0.02 }}
                          className="flex items-center justify-center"
                          style={{ backgroundColor: `rgba(16, 185, 129, ${value * 0.5})` }}
                        >
                          <span className="text-[10px]">{value.toFixed(1)}</span>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: [0, 100, 100] }}
                      transition={{ duration: 1, times: [0, 0.5, 1], delay: 1.5 + i * 0.1 }}
                      className="w-1 bg-purple-500/50 rounded-full mb-2"
                    />
                    <div className="w-10 h-10 bg-purple-900/30 border border-purple-800 rounded-md flex items-center justify-center">
                      <span className="text-xs">V{i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
      ]
    } else {
      return [
        {
          title: "输入分词",
          description: "输入文本被分割成词元，然后嵌入为向量。",
          visual: (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="grid grid-cols-6 gap-2 mb-6">
                {["这个", "快速", "棕色", "狐狸", "跳过", "懒狗"].map((token, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-zinc-800 border border-zinc-700 rounded-md p-2 text-center text-sm"
                  >
                    {token}
                  </motion.div>
                ))}
              </div>
              <div className="w-8 h-8 flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="grid grid-cols-6 gap-2 mt-6">
                {[101, 2048, 3012, 1996, 5438, 2058].map((id, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="bg-emerald-900/30 border border-emerald-800 rounded-md p-2 text-center text-sm"
                  >
                    {id}
                  </motion.div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "查询、键、值投影",
          description: "每个词元嵌入被投影为查询、键和值向量。",
          visual: (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="grid grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium mb-2 text-emerald-400">查询 (Query)</div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-900/20 border border-emerald-800 rounded-md p-3 w-full"
                  >
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                          className="bg-emerald-800/30 h-2 rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium mb-2 text-blue-400">键 (Key)</div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-blue-900/20 border border-blue-800 rounded-md p-3 w-full"
                  >
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + i * 0.02 }}
                          className="bg-blue-800/30 h-2 rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium mb-2 text-purple-400">值 (Value)</div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-purple-900/20 border border-purple-800 rounded-md p-3 w-full"
                  >
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + i * 0.02 }}
                          className="bg-purple-800/30 h-2 rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "注意力分数计算",
          description: "通过乘以查询和键，然后应用 softmax 函数来计算注意力分数。",
          visual: (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="grid grid-cols-6 gap-1 mb-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-900/30 border border-emerald-800 rounded-md flex items-center justify-center mb-2">
                      <span className="text-xs">Q{i + 1}</span>
                    </div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: [0, 100, 100] }}
                      transition={{ duration: 1, times: [0, 0.5, 1], delay: i * 0.1 }}
                      className="w-1 bg-emerald-500/50 rounded-full"
                    />
                  </div>
                ))}
              </div>

              <div className="w-full h-24 relative mb-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute inset-0 bg-zinc-800/50 border border-zinc-700 rounded-lg"
                >
                  <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
                    {Array.from({ length: 36 }).map((_, i) => {
                      const row = Math.floor(i / 6)
                      const col = i % 6
                      const value = Math.random()
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 + (row * 6 + col) * 0.02 }}
                          className="flex items-center justify-center"
                          style={{ backgroundColor: `rgba(16, 185, 129, ${value * 0.5})` }}
                        >
                          <span className="text-[10px]">{value.toFixed(1)}</span>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: [0, 100, 100] }}
                      transition={{ duration: 1, times: [0, 0.5, 1], delay: 1.5 + i * 0.1 }}
                      className="w-1 bg-purple-500/50 rounded-full mb-2"
                    />
                    <div className="w-10 h-10 bg-purple-900/30 border border-purple-800 rounded-md flex items-center justify-center">
                      <span className="text-xs">V{i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
      ]
    }
  }

  // 训练步骤
  const getTrainingSteps = () => {
    if (language === "en") {
      return [
        {
          title: "Data Collection & Preprocessing",
          description: "Large amounts of text data are collected from the internet and preprocessed to remove noise.",
          visual: (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-800 border border-zinc-700 rounded-md p-3"
                >
                  <div className="text-xs text-zinc-400 mb-2">Web Data</div>
                  <div className="space-y-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-2 bg-zinc-700 rounded-full" />
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-zinc-800 border border-zinc-700 rounded-md p-3"
                >
                  <div className="text-xs text-zinc-400 mb-2">Books</div>
                  <div className="space-y-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-2 bg-zinc-700 rounded-full" />
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-zinc-800 border border-zinc-700 rounded-md p-3"
                >
                  <div className="text-xs text-zinc-400 mb-2">Code</div>
                  <div className="space-y-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-2 bg-zinc-700 rounded-full" />
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-12 h-12 bg-emerald-900/30 border border-emerald-800 rounded-full flex items-center justify-center mb-6"
              >
                <ChevronRight className="w-6 h-6 text-emerald-400" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-emerald-900/20 border border-emerald-800 rounded-md p-4 w-full max-w-md"
              >
                <div className="text-sm text-emerald-400 mb-2">Cleaned & Tokenized Data</div>
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex flex-wrap gap-1">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 + (i * 8 + j) * 0.02 }}
                          className="bg-emerald-800/30 px-2 py-1 rounded text-xs"
                        >
                          {Math.floor(Math.random() * 10000)}
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          ),
        },
        {
          title: "Model Training",
          description: "The model is trained to predict the next token in a sequence, learning patterns from the data.",
          visual: (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="flex items-center gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-zinc-800 border border-zinc-700 rounded-md p-3 w-48"
                >
                  <div className="text-xs text-zinc-400 mb-2">Input Sequence</div>
                  <div className="flex gap-1">
                    {["The", "quick", "brown"].map((token, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className="bg-zinc-700 px-2 py-1 rounded text-xs"
                      >
                        {token}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="w-16 h-16 bg-emerald-900/30 border border-emerald-800 rounded-full flex items-center justify-center"
                >
                  <span className="text-sm font-medium">Model</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-zinc-800 border border-zinc-700 rounded-md p-3 w-48"
                >
                  <div className="text-xs text-zinc-400 mb-2">Predict Next Token</div>
                  <div className="flex gap-1">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="bg-emerald-900/30 border border-emerald-800 px-2 py-1 rounded text-xs"
                    >
                      fox
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-zinc-800 border border-zinc-700 rounded-md p-4 w-full max-w-md"
              >
                <div className="text-sm mb-2">Token Probabilities</div>
                <div className="space-y-2">
                  {[
                    { token: "fox", prob: 0.82 },
                    { token: "cat", prob: 0.12 },
                    { token: "dog", prob: 0.04 },
                    { token: "rabbit", prob: 0.02 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-16 text-xs">{item.token}</div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.prob * 100}%` }}
                        transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
                        className="h-4 bg-emerald-900/50 rounded-full"
                      />
                      <div className="text-xs">{(item.prob * 100).toFixed(0)}%</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          ),
        },
        {
          title: "Loss Calculation & Backpropagation",
          description: "The model's prediction error is calculated and used to update parameters.",
          visual: (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-zinc-800 border border-zinc-700 rounded-md p-3"
                >
                  <div className="text-xs text-zinc-400 mb-2">Predicted Distribution</div>
                  <div className="space-y-2">
                    {[
                      { token: "fox", prob: 0.82 },
                      { token: "cat", prob: 0.12 },
                      { token: "dog", prob: 0.04 },
                      { token: "rabbit", prob: 0.02 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-16 text-xs">{item.token}</div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.prob * 100}%` }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="h-3 bg-emerald-900/50 rounded-full"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-zinc-800 border border-zinc-700 rounded-md p-3"
                >
                  <div className="text-xs text-zinc-400 mb-2">Actual (Ground Truth)</div>
                  <div className="space-y-2">
                    {[
                      { token: "fox", prob: 1.0 },
                      { token: "cat", prob: 0.0 },
                      { token: "dog", prob: 0.0 },
                      { token: "rabbit", prob: 0.0 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-16 text-xs">{item.token}</div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.prob * 100}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                          className="h-3 bg-blue-900/50 rounded-full"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="bg-red-900/20 border border-red-800 rounded-md p-3 mb-6"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm">Loss: Cross Entropy</div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-sm font-medium text-red-400"
                  >
                    0.198
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="w-full max-w-md"
              >
                <div className="text-sm mb-2">Parameter Updates</div>
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const value = (Math.random() - 0.5) * 0.1
                    const color = value < 0 ? "bg-red-900/30" : "bg-emerald-900/30"
                    const border = value < 0 ? "border-red-800" : "border-emerald-800"
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 + i * 0.02 }}
                        className={`${color} ${border} border rounded-md p-1 text-center`}
                      >
                        <span className="text-[10px]">{value.toFixed(3)}</span>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            </div>
          ),
        },
      ]
    } else {
      return [
        {
          title: "数据收集与预处理",
          description: "从互联网收集大量文本数据，并进行预处理以去除噪声。",
          visual: (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-800 border border-zinc-700 rounded-md p-3"
                >
                  <div className="text-xs text-zinc-400 mb-2">网络数据</div>
                  <div className="space-y-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-2 bg-zinc-700 rounded-full" />
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-zinc-800 border border-zinc-700 rounded-md p-3"
                >
                  <div className="text-xs text-zinc-400 mb-2">书籍</div>
                  <div className="space-y-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-2 bg-zinc-700 rounded-full" />
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-zinc-800 border border-zinc-700 rounded-md p-3"
                >
                  <div className="text-xs text-zinc-400 mb-2">代码</div>
                  <div className="space-y-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-2 bg-zinc-700 rounded-full" />
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-12 h-12 bg-emerald-900/30 border border-emerald-800 rounded-full flex items-center justify-center mb-6"
              >
                <ChevronRight className="w-6 h-6 text-emerald-400" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-emerald-900/20 border border-emerald-800 rounded-md p-4 w-full max-w-md"
              >
                <div className="text-sm text-emerald-400 mb-2">清洗和分词后的数据</div>
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex flex-wrap gap-1">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 + (i * 8 + j) * 0.02 }}
                          className="bg-emerald-800/30 px-2 py-1 rounded text-xs"
                        >
                          {Math.floor(Math.random() * 10000)}
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          ),
        },
        {
          title: "模型训练",
          description: "模型被训练预测序列中的下一个词元，从数据中学习模式。",
          visual: (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="flex items-center gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-zinc-800 border border-zinc-700 rounded-md p-3 w-48"
                >
                  <div className="text-xs text-zinc-400 mb-2">输入序列</div>
                  <div className="flex gap-1">
                    {["这个", "快速", "棕色"].map((token, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className="bg-zinc-700 px-2 py-1 rounded text-xs"
                      >
                        {token}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="w-16 h-16 bg-emerald-900/30 border border-emerald-800 rounded-full flex items-center justify-center"
                >
                  <span className="text-sm font-medium">模型</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-zinc-800 border border-zinc-700 rounded-md p-3 w-48"
                >
                  <div className="text-xs text-zinc-400 mb-2">预测下一个词元</div>
                  <div className="flex gap-1">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="bg-emerald-900/30 border border-emerald-800 px-2 py-1 rounded text-xs"
                    >
                      狐狸
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-zinc-800 border border-zinc-700 rounded-md p-4 w-full max-w-md"
              >
                <div className="text-sm mb-2">词元概率</div>
                <div className="space-y-2">
                  {[
                    { token: "狐狸", prob: 0.82 },
                    { token: "猫", prob: 0.12 },
                    { token: "狗", prob: 0.04 },
                    { token: "兔子", prob: 0.02 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-16 text-xs">{item.token}</div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.prob * 100}%` }}
                        transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
                        className="h-4 bg-emerald-900/50 rounded-full"
                      />
                      <div className="text-xs">{(item.prob * 100).toFixed(0)}%</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          ),
        },
        {
          title: "损失计算与反向传播",
          description: "计算模型预测误差并用于更新参数。",
          visual: (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-zinc-800 border border-zinc-700 rounded-md p-3"
                >
                  <div className="text-xs text-zinc-400 mb-2">预测分布</div>
                  <div className="space-y-2">
                    {[
                      { token: "狐狸", prob: 0.82 },
                      { token: "猫", prob: 0.12 },
                      { token: "狗", prob: 0.04 },
                      { token: "兔子", prob: 0.02 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-16 text-xs">{item.token}</div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.prob * 100}%` }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="h-3 bg-emerald-900/50 rounded-full"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-zinc-800 border border-zinc-700 rounded-md p-3"
                >
                  <div className="text-xs text-zinc-400 mb-2">实际（真实标签）</div>
                  <div className="space-y-2">
                    {[
                      { token: "狐狸", prob: 1.0 },
                      { token: "猫", prob: 0.0 },
                      { token: "狗", prob: 0.0 },
                      { token: "兔子", prob: 0.0 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-16 text-xs">{item.token}</div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.prob * 100}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                          className="h-3 bg-blue-900/50 rounded-full"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="bg-red-900/20 border border-red-800 rounded-md p-3 mb-6"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm">损失：交叉熵</div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-sm font-medium text-red-400"
                  >
                    0.198
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="w-full max-w-md"
              >
                <div className="text-sm mb-2">参数更新</div>
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const value = (Math.random() - 0.5) * 0.1
                    const color = value < 0 ? "bg-red-900/30" : "bg-emerald-900/30"
                    const border = value < 0 ? "border-red-800" : "border-emerald-800"
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 + i * 0.02 }}
                        className={`${color} ${border} border rounded-md p-1 text-center`}
                      >
                        <span className="text-[10px]">{value.toFixed(3)}</span>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            </div>
          ),
        },
      ]
    }
  }

  const steps = type === "attention" ? getAttentionSteps() : getTrainingSteps()

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {type === "attention" ? t("main.attentionMechanism") : t("main.trainingProcess")}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentStep(0)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900 h-10 w-10 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900 h-10 w-10 p-0 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden mb-6">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{steps[currentStep].title}</h3>
            <div className="text-xs text-zinc-500">
              {language === "en" ? "Step" : "步骤"} {currentStep + 1} / {steps.length}
            </div>
          </div>
          <p className="text-sm text-zinc-400 mt-1">{steps[currentStep].description}</p>
        </div>

        <div className="h-[400px] p-6">{steps[currentStep].visual}</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm">{language === "en" ? "Step:" : "步骤："}</div>
        <Slider
          value={[currentStep]}
          max={steps.length - 1}
          step={1}
          onValueChange={(value) => setCurrentStep(value[0])}
          className="flex-1"
        />
      </div>

      <div className="mt-6">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">{language === "en" ? "Overview" : "概述"}</TabsTrigger>
            <TabsTrigger value="details">{language === "en" ? "Technical Details" : "技术细节"}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="p-4 bg-zinc-900 rounded-md mt-2">
            <p className="text-sm text-zinc-400">
              {type === "attention"
                ? language === "en"
                  ? "The attention mechanism allows the model to focus on different parts of the input sequence when generating each output token. This is crucial for understanding context and relationships between words in a sentence."
                  : "注意力机制允许模型在生成每个输出词元时关注输入序列的不同部分。这对于理解句子中单词之间的上下文和关系至关重要。"
                : language === "en"
                  ? "Large language models are trained using self-supervised learning, where the model learns to predict the next token in a sequence. This allows it to learn patterns and relationships in language without explicit human annotation."
                  : "大语言模型使用自监督学习进行训练，模型学习预测序列中的下一个词元。这使其能够在没有明确人工标注的情况下学习语言中的模式和关系。"}
            </p>
          </TabsContent>
          <TabsContent value="details" className="p-4 bg-zinc-900 rounded-md mt-2">
            <p className="text-sm text-zinc-400">
              {type === "attention"
                ? language === "en"
                  ? "Mathematically, attention is computed as Attention(Q, K, V) = softmax(QK^T / √d_k)V, where Q, K, and V are the query, key, and value matrices. The scaling factor √d_k prevents dot products from becoming too large."
                  : "从数学上讲，注意力计算为 Attention(Q, K, V) = softmax(QK^T / √d_k)V，其中 Q、K 和 V 是查询、键和值矩阵。缩放因子 √d_k 防止点积变得过大。"
                : language === "en"
                  ? "During training, the model minimizes the cross-entropy loss between its predicted token distribution and the actual next token. Optimization typically uses the Adam optimizer with learning rate scheduling and gradient clipping to stabilize training."
                  : "在训练过程中，模型最小化其预测的词元分布与实际下一个词元之间的交叉熵损失。优化通常使用 Adam 优化器进行，并采用学习率调度和梯度裁剪等技术来稳定训练。"}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

