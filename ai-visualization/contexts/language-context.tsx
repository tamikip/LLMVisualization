"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "zh" | "en"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.architecture": "Model Architecture",
    "nav.attention": "Attention Mechanism",
    "nav.training": "Training Process",
    "nav.interact": "Try It",
    "nav.github": "GitHub",
    "nav.toggleMenu": "Toggle menu",

    // Hero section
    "hero.title": "Visualizing the Inner Workings of LLM Models",
    "hero.subtitle":
      "Explore and understand how Large Language Models process information, with interactive visualizations that demystify AI's most powerful technology.",
    "hero.startExploring": "Start Exploring",
    "hero.learnMore": "Learn More",

    // Main content
    "main.modelArchitecture": "Model Architecture",
    "main.attentionMechanism": "Attention Mechanism",
    "main.trainingProcess": "Training Process",
    "main.interactiveDemo": "Interactive Demo",

    // Features
    "features.title": "Key Features",
    "features.interactive.title": "Interactive Visualizations",
    "features.interactive.desc":
      "Explore dynamic, interactive visualizations that demonstrate how LLMs process and generate text.",
    "features.realtime.title": "Real-time Demonstrations",
    "features.realtime.desc":
      "See how models respond to your inputs in real-time, with visualizations of the internal processes.",
    "features.educational.title": "Educational Resources",
    "features.educational.desc":
      "Access comprehensive explanations and resources to deepen your understanding of LLM technology.",

    // Footer
    "footer.rights": "All rights reserved.",

    // Beginner's guide
    "beginner.title": "LLM for Beginners",
    "beginner.whatIsLLM": "What is an LLM?",
    "beginner.whatIsLLM.desc":
      "A Large Language Model (LLM) is an AI system trained on massive amounts of text data. It can understand and generate human-like text, answer questions, write essays, summarize content, and more.",
    "beginner.howItWorks": "How does it work?",
    "beginner.howItWorks.desc":
      "LLMs work by predicting the next word in a sequence, similar to how your phone's keyboard suggests the next word when you're typing. They learn patterns from millions of examples during training.",
    "beginner.keyTerms": "Key Terms Simplified",
    "beginner.keyTerms.token": "Token: A piece of text (like a word or part of a word)",
    "beginner.keyTerms.attention": "Attention: How the model focuses on different words to understand context",
    "beginner.keyTerms.parameters": "Parameters: The model's knowledge stored as numbers",
    "beginner.tryIt": "Try changing these settings to see how the model behaves differently!",

    // 3D Model
    "3d.title": "3D Model Visualization",
    "3d.description":
      "Explore the structure of a Large Language Model in 3D. Rotate, zoom, and click on different parts to learn more.",
    "3d.layers": "Layers",
    "3d.attention": "Attention Heads",
    "3d.rotate": "Drag to rotate",
    "3d.zoom": "Scroll to zoom",

    // Language switcher
    "language.switch": "中文",

    // Model visualization
    "model.zoom": "Zoom",
    "model.transformer": "Transformer Architecture",
    "model.transformer.desc":
      "Modern LLMs use transformer architectures with self-attention mechanisms to process sequences in parallel, capturing long-range dependencies in text.",
    "model.scaling": "Scaling Properties",
    "model.scaling.desc":
      "LLM capabilities scale with model size, training data, and compute. Larger models with more parameters can capture more complex patterns.",
    "model.layerDetails": "Layer Details",
    "model.layer": "Layer",

    // Chat interface
    "chat.welcome":
      "Welcome to the LLM Visualizer! Try asking a question or providing a prompt to see how the model responds.",
    "chat.placeholder": "Ask about LLMs or provide a prompt...",
    "chat.send": "Send",
    "chat.thinking": "AI is thinking...",
    "chat.you": "You",
    "chat.system": "System",
    "chat.assistant": "AI Assistant",
    "chat.adjustParams": "Adjust Parameters",

    // Parameters
    "params.title": "Model Parameters",
    "params.temperature": "Temperature",
    "params.temperature.low": "More deterministic",
    "params.temperature.balanced": "Balanced",
    "params.temperature.high": "More creative",
    "params.maxTokens": "Max Tokens",
    "params.maxTokens.short": "Short responses",
    "params.maxTokens.medium": "Medium responses",
    "params.maxTokens.long": "Long responses",
    "params.modelType": "Model Type",
    "params.advancedSettings": "Advanced Settings",
    "params.topP": "Top-p Sampling",
    "params.freqPenalty": "Frequency Penalty",
    "params.modelArch": "Model Architecture",
    "params.attentionHeads": "Attention Heads",
    "params.layers": "Layers",
    "params.parameters": "Parameters",

    // Examples and Prediction
    "try.asking": "Try asking:",
    "llm.examples.chatgpt": "ChatGPT",
    "llm.examples.claude": "Anthropic Assistant",
    "llm.examples.gemini": "Google AI",
    "llm.question1": "What can LLMs do?",
    "llm.question2": "How are LLMs different from traditional AI?",
    "prediction.example": "Example:",
    "prediction.tokenization": 'Notice "jumps" is split into "jump" and "##s" - this is tokenization!',
    "prediction.attention.example":
      'When predicting the next word after "The bank is by the...", the model focuses more on "river" than other words.',
    "prediction.parameters.example":
      'These numbers represent the model\'s "knowledge" - billions of such parameters work together to generate text.',

    "enhanced3d.title": "Enhanced 3D Neural Network",
    "enhanced3d.description":
      "Explore the neural network in immersive 3D. Fly inside the network and observe data flow between neurons.",
    "enhanced3d.controls":
      "Use orbit controls to rotate and zoom, or switch to fly mode to navigate inside the network.",
    "enhanced3d.dataflow": "Observe how data flows through the neural network, from input to output layers.",
  },
  zh: {
    // 导航
    "nav.architecture": "模型架构",
    "nav.attention": "注意力机制",
    "nav.training": "训练过程",
    "nav.interact": "互动体验",
    "nav.github": "GitHub",
    "nav.toggleMenu": "切换菜单",

    // 主页横幅
    "hero.title": "探索大语言模型的内部运作机制",
    "hero.subtitle": "通过交互式可视化，深入了解大语言模型如何处理信息，揭秘AI技术背后的强大原理。",
    "hero.startExploring": "开始探索",
    "hero.learnMore": "了解更多",

    // 主要内容
    "main.modelArchitecture": "模型架构",
    "main.attentionMechanism": "注意力机制",
    "main.trainingProcess": "训练过程",
    "main.interactiveDemo": "互动演示",

    // 特性
    "features.title": "核心特性",
    "features.interactive.title": "交互式可视化",
    "features.interactive.desc": "探索动态、交互式的可视化展示，了解大语言模型如何处理和生成文本。",
    "features.realtime.title": "实时演示",
    "features.realtime.desc": "实时查看模型如何响应您的输入，并可视化内部处理过程。",
    "features.educational.title": "教育资源",
    "features.educational.desc": "获取全面的解释和资源，深入了解大语言模型技术。",

    // 页脚
    "footer.rights": "保留所有权利。",

    // 新手指南
    "beginner.title": "大语言模型入门",
    "beginner.whatIsLLM": "什么是大语言模型？",
    "beginner.whatIsLLM.desc":
      "大语言模型（LLM）是一种在海量文本数据上训练的AI系统。它能理解并生成类似人类的文本，回答问题，撰写文章，总结内容等。",
    "beginner.howItWorks": "它是如何工作的？",
    "beginner.howItWorks.desc":
      "大语言模型通过预测序列中的下一个词来工作，类似于您手机键盘如何在您输入时建议下一个词。它们在训练过程中从数百万个例子中学习模式。",
    "beginner.keyTerms": "关键术语简化",
    "beginner.keyTerms.token": "词元：文本的一部分（如一个词或词的一部分）",
    "beginner.keyTerms.attention": "注意力：模型如何关注不同的词以理解上下文",
    "beginner.keyTerms.parameters": "参数：模型以数字形式存储的知识",
    "beginner.tryIt": "尝试更改这些设置，看看模型的行为如何变化！",

    // 3D模型
    "3d.title": "3D模型可视化",
    "3d.description": "以3D方式探索大语言模型的结构。旋转、缩放并点击不同部分以了解更多信息。",
    "3d.layers": "层",
    "3d.attention": "注意力头",
    "3d.rotate": "拖动旋转",
    "3d.zoom": "滚动缩放",

    // 语言切换器
    "language.switch": "English",

    // 模型可视化
    "model.zoom": "缩放",
    "model.transformer": "Transformer 架构",
    "model.transformer.desc":
      "现代大语言模型使用 Transformer 架构和自注意力机制并行处理序列，捕捉文本中的长距离依赖关系。",
    "model.scaling": "扩展特性",
    "model.scaling.desc": "LLM 能力随模型大小、训练数据和计算资源而扩展。参数更多的大型模型能够捕捉更复杂的模式。",
    "model.layerDetails": "层详情",
    "model.layer": "层",

    // 聊天界面
    "chat.welcome": "欢迎使用 LLM 可视化工具！尝试提问或输入提示，看看模型如何响应。",
    "chat.placeholder": "询问关于大语言模型的问题或提供提示...",
    "chat.send": "发送",
    "chat.thinking": "AI 正在思考...",
    "chat.you": "你",
    "chat.system": "系统",
    "chat.assistant": "AI 助手",
    "chat.adjustParams": "调整参数",

    // 参数
    "params.title": "模型参数",
    "params.temperature": "温度",
    "params.temperature.low": "更确定性",
    "params.temperature.balanced": "平衡",
    "params.temperature.high": "更创造性",
    "params.maxTokens": "最大词元数",
    "params.maxTokens.short": "简短回复",
    "params.maxTokens.medium": "中等回复",
    "params.maxTokens.long": "长回复",
    "params.modelType": "模型类型",
    "params.advancedSettings": "高级设置",
    "params.topP": "Top-p 采样",
    "params.freqPenalty": "频率惩罚",
    "params.modelArch": "模型架构",
    "params.attentionHeads": "注意力头",
    "params.layers": "层数",
    "params.parameters": "参数",

    // Examples and Prediction
    "try.asking": "尝试提问：",
    "llm.examples.chatgpt": "对话AI",
    "llm.examples.claude": "Anthropic助手",
    "llm.examples.gemini": "谷歌AI",
    "llm.question1": "大语言模型能做什么？",
    "llm.question2": "大语言模型与传统AI有何不同？",
    "prediction.example": "示例：",
    "prediction.tokenization": '注意"jumps"被分割成"jump"和"##s" - 这就是分词！',
    "prediction.attention.example": '当预测"The bank is by the..."之后的下一个词时，模型对"river"的关注度高于其他词。',
    "prediction.parameters.example": '这些数字代表模型的"知识" - 数十亿个这样的参数共同工作以生成文本。',

    "enhanced3d.title": "增强型3D神经网络",
    "enhanced3d.description": "在沉浸式3D环境中探索神经网络。飞入网络内部并观察神经元之间的数据流动。",
    "enhanced3d.controls": "使用轨道控制旋转和缩放，或切换到飞行模式在网络内部导航。",
    "enhanced3d.dataflow": "观察数据如何从输入层流向输出层，穿过整个神经网络。",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh")

  // Try to load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "zh")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

