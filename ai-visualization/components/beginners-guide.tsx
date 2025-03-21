"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Lightbulb,
  HelpCircle,
  Zap,
  BookOpen,
  MessageSquare,
  Sparkles,
  Layers,
  ArrowRight,
  Cpu,
  Code,
  Puzzle,
  Compass,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function BeginnersGuide() {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState("what")

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          {t("beginner.title")}
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4 bg-zinc-900">
          <TabsTrigger value="what" className="data-[state=active]:bg-zinc-800">
            {language === "en" ? "What is LLM?" : "什么是LLM?"}
          </TabsTrigger>
          <TabsTrigger value="how" className="data-[state=active]:bg-zinc-800">
            {language === "en" ? "How it Works" : "工作原理"}
          </TabsTrigger>
          <TabsTrigger value="terms" className="data-[state=active]:bg-zinc-800">
            {language === "en" ? "Key Terms" : "关键术语"}
          </TabsTrigger>
          <TabsTrigger value="faq" className="data-[state=active]:bg-zinc-800">
            {language === "en" ? "FAQ" : "常见问题"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="what" className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-emerald-400" />
              {language === "en" ? "What is a Large Language Model (LLM)?" : "什么是大语言模型（LLM）？"}
            </h3>
            <p className="text-zinc-400 mb-4">
              {language === "en"
                ? "A Large Language Model (LLM) is an AI system trained on massive amounts of text data. Think of it like a super-advanced text prediction system - similar to your phone's keyboard suggestions, but much more powerful."
                : "大语言模型（LLM）是一种在海量文本数据上训练的AI系统。可以将其想象为一个超级先进的文本预测系统 - 类似于你手机键盘的预测功能，但强大得多。"}
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-400" />
                {language === "en" ? "Real-world analogy:" : "现实世界的类比："}
              </h4>
              <p className="text-sm text-zinc-400">
                {language === "en"
                  ? "Imagine an LLM as a student who has read millions of books, articles, and websites. This student doesn't truly 'understand' everything they've read, but they've memorized patterns so well that they can continue any text in a way that sounds natural and informed."
                  : "想象LLM就像一个阅读了数百万本书籍、文章和网站的学生。这个学生并不真正'理解'他们读过的所有内容，但他们已经很好地记住了模式，以至于他们可以以一种听起来自然且有见识的方式继续任何文本。"}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://chat.openai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col items-center text-center hover:border-blue-800 transition-colors"
              >
                <MessageSquare className="w-8 h-8 text-blue-500 mb-2" />
                <h3 className="text-sm font-medium mb-1">ChatGPT</h3>
                <p className="text-xs text-zinc-500">
                  {language === "en" ? "OpenAI's conversational AI" : "OpenAI的对话AI"}
                </p>
              </a>

              <a
                href="https://claude.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col items-center text-center hover:border-purple-800 transition-colors"
              >
                <BookOpen className="w-8 h-8 text-purple-500 mb-2" />
                <h3 className="text-sm font-medium mb-1">Claude</h3>
                <p className="text-xs text-zinc-500">
                  {language === "en" ? "Anthropic's helpful assistant" : "Anthropic的助手"}
                </p>
              </a>

              <a
                href="https://gemini.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col items-center text-center hover:border-yellow-800 transition-colors"
              >
                <Sparkles className="w-8 h-8 text-yellow-500 mb-2" />
                <h3 className="text-sm font-medium mb-1">Gemini</h3>
                <p className="text-xs text-zinc-500">
                  {language === "en" ? "Google's multimodal AI" : "谷歌的多模态AI"}
                </p>
              </a>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">
                {language === "en" ? "What can LLMs do?" : "大语言模型能做什么？"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-zinc-900 border border-zinc-800 rounded-md p-3 flex items-start gap-2">
                  <div className="w-6 h-6 bg-emerald-900/30 border border-emerald-800 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs">1</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">{language === "en" ? "Generate text" : "生成文本"}</h5>
                    <p className="text-xs text-zinc-500">
                      {language === "en"
                        ? "Write essays, stories, code, emails, etc."
                        : "撰写文章、故事、代码、电子邮件等"}
                    </p>
                  </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-md p-3 flex items-start gap-2">
                  <div className="w-6 h-6 bg-emerald-900/30 border border-emerald-800 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs">2</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">{language === "en" ? "Answer questions" : "回答问题"}</h5>
                    <p className="text-xs text-zinc-500">
                      {language === "en" ? "Provide information on various topics" : "提供各种主题的信息"}
                    </p>
                  </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-md p-3 flex items-start gap-2">
                  <div className="w-6 h-6 bg-emerald-900/30 border border-emerald-800 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs">3</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">{language === "en" ? "Summarize content" : "总结内容"}</h5>
                    <p className="text-xs text-zinc-500">
                      {language === "en" ? "Condense long texts into key points" : "将长文本浓缩为要点"}
                    </p>
                  </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-md p-3 flex items-start gap-2">
                  <div className="w-6 h-6 bg-emerald-900/30 border border-emerald-800 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs">4</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">{language === "en" ? "Translate languages" : "翻译语言"}</h5>
                    <p className="text-xs text-zinc-500">
                      {language === "en" ? "Convert text between different languages" : "在不同语言之间转换文本"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                {language === "en" ? "Try asking:" : "尝试提问:"}
              </h3>
              <div className="space-y-2">
                <div className="bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm cursor-pointer hover:bg-zinc-700 transition-colors">
                  {language === "en" ? '"What can LLMs do?"' : '"大语言模型能做什么？"'}
                </div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm cursor-pointer hover:bg-zinc-700 transition-colors">
                  {language === "en"
                    ? '"How are LLMs different from traditional AI?"'
                    : '"大语言模型与传统AI有何不同？"'}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="how" className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-400" />
              {language === "en" ? "How do LLMs work?" : "大语言模型如何工作？"}
            </h3>
            <p className="text-zinc-400 mb-6">
              {language === "en"
                ? "At their core, LLMs predict the next word in a sequence, similar to how your phone's keyboard suggests the next word when you're typing. They learn patterns from billions of examples during training."
                : "从本质上讲，大语言模型预测序列中的下一个词，类似于你手机键盘在你输入时如何建议下一个词。它们在训练过程中从数十亿个例子中学习模式。"}
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
              <h4 className="text-sm font-medium mb-4">{language === "en" ? "The basic process:" : "基本过程："}</h4>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-900/30 border border-blue-800 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">{language === "en" ? "Input Processing" : "输入处理"}</h3>
                    <p className="text-xs text-zinc-400 mb-2">
                      {language === "en"
                        ? "Your text is broken down into small pieces called 'tokens' (words or parts of words)"
                        : "你的文本被分解成称为'词元'的小片段（单词或单词的部分）"}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(language === "en"
                        ? ["The", "cat", "sat", "on", "the", "mat"]
                        : ["猫", "坐", "在", "垫", "子", "上"]
                      ).map((word, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          className="bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-xs"
                        >
                          {word}
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center w-full my-2">
                      <ArrowRight className="w-5 h-5 text-zinc-600" />\
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(language === "en"
                        ? ["ID:1234", "ID:5678", "ID:9012", "ID:3456", "ID:1234", "ID:7890"]
                        : ["ID:1234", "ID:5678", "ID:9012", "ID:3456", "ID:7890", "ID:2345"]
                      ).map((token, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          className="bg-blue-900/20 border border-blue-800 px-2 py-1 rounded text-xs"
                        >
                          {token}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-900/30 border border-emerald-800 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">
                      {language === "en" ? "Processing Through Layers" : "通过层处理"}
                    </h3>
                    <p className="text-xs text-zinc-400 mb-3">
                      {language === "en"
                        ? "These tokens pass through many neural network layers that understand context and relationships"
                        : "这些词元通过许多理解上下文和关系的神经网络层"}
                    </p>
                    <div className="relative h-20 bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full flex justify-between px-4">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center">
                              <div className="w-6 h-6 bg-emerald-900/40 border border-emerald-800 rounded-full flex items-center justify-center mb-1">
                                <Layers className="w-3 h-3 text-emerald-400" />
                              </div>
                              <div className="text-[10px] text-zinc-500">
                                {language === "en" ? `Layer ${i + 1}` : `层 ${i + 1}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 3,
                          ease: "linear",
                        }}
                        className="absolute top-1/2 h-0.5 w-10 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-900/30 border border-purple-800 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">{language === "en" ? "Prediction" : "预测"}</h3>
                    <p className="text-xs text-zinc-400 mb-3">
                      {language === "en"
                        ? "The model predicts the most likely next word(s) based on what it learned during training"
                        : "模型根据训练期间学到的内容预测最可能的下一个词"}
                    </p>
                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex flex-wrap gap-1">
                          {(language === "en"
                            ? ["The", "cat", "sat", "on", "the"]
                            : ["猫", "坐", "在", "垫", "子"]
                          ).map((word, i) => (
                            <div key={i} className="bg-zinc-700 px-2 py-1 rounded text-xs">
                              {word}
                            </div>
                          ))}
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-600" />
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="bg-purple-900/30 border border-purple-800 px-2 py-1 rounded text-xs"
                        >
                          {language === "en" ? "mat" : "上"}
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-zinc-500 mb-1">
                          {language === "en" ? "Possible next words:" : "可能的下一个词："}
                        </div>
                        {(language === "en"
                          ? [
                              { word: "mat", prob: 0.65 },
                              { word: "floor", prob: 0.2 },
                              { word: "chair", prob: 0.1 },
                              { word: "table", prob: 0.05 },
                            ]
                          : [
                              { word: "上", prob: 0.65 },
                              { word: "旁边", prob: 0.2 },
                              { word: "下面", prob: 0.1 },
                              { word: "附近", prob: 0.05 },
                            ]
                        ).map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-16 text-xs">{item.word}</div>
                            <div className="flex-1 h-4 bg-zinc-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.prob * 100}%` }}
                                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                className="h-full bg-purple-900/70"
                              />
                            </div>
                            <div className="text-xs w-12 text-right">{(item.prob * 100).toFixed(0)}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  {language === "en" ? "Training Process" : "训练过程"}
                </h4>
                <p className="text-xs text-zinc-400">
                  {language === "en"
                    ? "LLMs learn by reading billions of text examples and adjusting their internal parameters to better predict what comes next. This is like learning a language by reading millions of books."
                    : "大语言模型通过阅读数十亿个文本示例并调整其内部参数来更好地预测接下来会发生什么。这就像通过阅读数百万本书来学习一门语言。"}
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  {language === "en" ? "Transformer Architecture" : "Transformer架构"}
                </h4>
                <p className="text-xs text-zinc-400">
                  {language === "en"
                    ? "Modern LLMs use a design called 'Transformer' that helps them understand relationships between words that are far apart in a sentence."
                    : "现代大语言模型使用称为'Transformer'的设计，帮助它们理解句子中相距较远的单词之间的关系。"}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-emerald-900/20 border border-emerald-800 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Puzzle className="w-4 h-4 text-emerald-400" />
                {language === "en" ? "Simple analogy:" : "简单类比："}
              </h4>
              <p className="text-sm text-emerald-400">
                {language === "en"
                  ? "Think of an LLM like a super-advanced autocomplete. After seeing millions of examples of text, it can predict what should come next with surprising accuracy."
                  : "将大语言模型想象为一个超级先进的自动完成功能。在看到数百万个文本示例后，它可以以惊人的准确度预测接下来应该出现什么。"}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="terms" className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-400" />
              {language === "en" ? "Key Terms Simplified" : "关键术语简化"}
            </h3>

            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="token" className="bg-zinc-900 border border-zinc-800 rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-900/30 border border-blue-800 rounded-full flex items-center justify-center text-xs">
                      1
                    </div>
                    {language === "en" ? "Token" : "词元"}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                    <div className="text-xs text-zinc-400 mb-2">{language === "en" ? "Definition:" : "定义："}</div>
                    <p className="text-sm mb-3">
                      {language === "en"
                        ? "A piece of text (like a word or part of a word) that the model processes. The word 'hamburger' might be split into tokens like 'ham', 'bur', and 'ger'."
                        : "模型处理的文本片段（如单词或单词的一部分）。'汉堡包'这个词可能被分成'汉'、'堡'和'包'等词元。"}
                    </p>
                    <div className="text-xs text-zinc-400 mb-2">{language === "en" ? "Example:" : "示例："}</div>
                    <div className="flex flex-wrap gap-1">
                      {(language === "en"
                        ? ["The", "quick", "brown", "fox", "jump", "##s", "over"]
                        : ["这", "只", "快", "速", "的", "棕", "色", "狐", "狸"]
                      ).map((token, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          className="bg-zinc-700 border border-zinc-600 px-2 py-1 rounded text-xs cursor-help"
                        >
                          {token}
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">
                      {language === "en"
                        ? "Notice 'jumps' is split into 'jump' and '##s' - this is tokenization!"
                        : "注意 'jumps' 是如何被分成 'jump' 和 '##s' 的 - 这就是分词！"}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="attention" className="bg-zinc-900 border border-zinc-800 rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-900/30 border border-emerald-800 rounded-full flex items-center justify-center text-xs">
                      2
                    </div>
                    {language === "en" ? "Attention" : "注意力"}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                    <div className="text-xs text-zinc-400 mb-2">{language === "en" ? "Definition:" : "定义："}</div>
                    <p className="text-sm mb-3">
                      {language === "en"
                        ? "How the model focuses on different words to understand context. It's like how you pay more attention to certain parts of a sentence to understand its meaning."
                        : "模型如何关注不同的词以理解上下文。就像你如何更加关注句子的某些部分以理解其含义一样。"}
                    </p>
                    <div className="text-xs text-zinc-400 mb-2">{language === "en" ? "Example:" : "示例："}</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <div className="w-24 text-xs">{language === "en" ? "The bank" : "银行"}</div>
                        <div className="flex-1 h-4 bg-zinc-700 border border-zinc-600 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-900/70 w-[30%]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-24 text-xs">{language === "en" ? "is by" : "在"}</div>
                        <div className="flex-1 h-4 bg-zinc-700 border border-zinc-600 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-900/70 w-[20%]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-24 text-xs">{language === "en" ? "the river" : "河边"}</div>
                        <div className="flex-1 h-4 bg-zinc-700 border border-zinc-600 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-900/70 w-[80%]" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">
                      {language === "en"
                        ? "When predicting the next word after 'The bank is by the...', the model focuses more on 'river' than other words."
                        : "当预测'银行在...'之后的下一个词时，模型对'河边'的关注度高于其他词。"}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="parameters" className="bg-zinc-900 border border-zinc-800 rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-900/30 border border-purple-800 rounded-full flex items-center justify-center text-xs">
                      3
                    </div>
                    {language === "en" ? "Parameters" : "参数"}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                    <div className="text-xs text-zinc-400 mb-2">{language === "en" ? "Definition:" : "定义："}</div>
                    <p className="text-sm mb-3">
                      {language === "en"
                        ? "The model's 'knowledge' stored as numbers. These are like the model's brain cells - billions of them work together to generate text."
                        : "模型以数字形式存储的'知识'。这些就像模型的脑细胞 - 数十亿个共同工作以生成文本。"}
                    </p>
                    <div className="text-xs text-zinc-400 mb-2">{language === "en" ? "Example:" : "示例："}</div>
                    <div className="grid grid-cols-8 gap-1">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.1 }}
                          className="aspect-square bg-purple-900/30 border border-purple-800 rounded-sm flex items-center justify-center"
                        >
                          <span className="text-[8px]">{(Math.random() * 2 - 1).toFixed(1)}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">
                      {language === "en"
                        ? "These numbers represent the model's 'knowledge' - billions of such parameters work together to generate text."
                        : "这些数字代表模型的'知识' - 数十亿个这样的参数共同工作以生成文本。"}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="transformer" className="bg-zinc-900 border border-zinc-800 rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-900/30 border border-blue-800 rounded-full flex items-center justify-center text-xs">
                      4
                    </div>
                    {language === "en" ? "Transformer" : "Transformer"}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                    <div className="text-xs text-zinc-400 mb-2">{language === "en" ? "Definition:" : "定义："}</div>
                    <p className="text-sm mb-3">
                      {language === "en"
                        ? "The architecture (design) that most modern LLMs use. It's special because it can look at all words in a sentence at once, rather than one by one."
                        : "大多数现代大语言模型使用的架构（设计）。它的特别之处在于它可以一次查看句子中的所有单词，而不是一个接一个。"}
                    </p>
                    <div className="flex justify-center my-3">
                      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 w-full max-w-xs">
                        <div className="flex flex-col items-center">
                          <div className="w-full h-8 bg-blue-900/20 border border-blue-800 rounded-md mb-2 flex items-center justify-center">
                            <span className="text-xs">{language === "en" ? "Input Embedding" : "输入嵌入"}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-zinc-600 rotate-90 my-1" />
                          <div className="w-full h-8 bg-emerald-900/20 border border-emerald-800 rounded-md mb-2 flex items-center justify-center">
                            <span className="text-xs">{language === "en" ? "Self-Attention" : "自注意力"}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-zinc-600 rotate-90 my-1" />
                          <div className="w-full h-8 bg-purple-900/20 border border-purple-800 rounded-md flex items-center justify-center">
                            <span className="text-xs">{language === "en" ? "Feed Forward" : "前馈网络"}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-zinc-600 rotate-90 my-1" />
                          <div className="w-full h-8 bg-yellow-900/20 border border-yellow-800 rounded-md flex items-center justify-center">
                            <span className="text-xs">{language === "en" ? "Output" : "输出"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500">
                      {language === "en"
                        ? "This simplified diagram shows how information flows through a Transformer. The self-attention part is what helps the model understand relationships between words."
                        : "这个简化的图表显示了信息如何通过Transformer流动。自注意力部分是帮助模型理解单词之间关系的部分。"}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-6 bg-emerald-900/20 border border-emerald-800 rounded-lg p-4">
              <p className="text-sm text-emerald-400">
                {language === "en"
                  ? "Try changing these settings to see how the model behaves differently!"
                  : "尝试更改这些设置，看看模型的行为如何变化！"}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-blue-400" />
              {language === "en" ? "Frequently Asked Questions" : "常见问题"}
            </h3>

            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="understand" className="bg-zinc-900 border border-zinc-800 rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium py-3">
                  {language === "en" ? "Do LLMs really understand language?" : "大语言模型真的理解语言吗？"}
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <p className="text-sm text-zinc-400">
                    {language === "en"
                      ? "Not in the way humans do. LLMs recognize patterns in text and can predict what words should come next, but they don't have true understanding or consciousness. They're very good at mimicking understanding through pattern recognition."
                      : "不像人类那样理解。大语言模型识别文本中的模式，并可以预测接下来应该出现什么词，但它们没有真正的理解或意识。它们非常擅长通过模式识别来模仿理解。"}
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="hallucinate" className="bg-zinc-900 border border-zinc-800 rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium py-3">
                  {language === "en" ? "Why do LLMs sometimes make things up?" : "为什么大语言模型有时会编造事实？"}
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <p className="text-sm text-zinc-400">
                    {language === "en"
                      ? "LLMs predict what text should come next based on patterns they've seen, not based on a database of facts. When they're uncertain, they may generate text that sounds plausible but isn't factual. This is called 'hallucination' and is a known limitation."
                      : "大语言模型根据它们所见过的模式预测接下来应该出现什么文本，而不是基于事实数据库。当它们不确定时，它们可能会生成听起来合理但不是事实的文本。这被称为'幻觉'，是一个已知的局限性。"}
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="training" className="bg-zinc-900 border border-zinc-800 rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium py-3">
                  {language === "en" ? "How much data is used to train an LLM?" : "训练大语言模型使用多少数据？"}
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <p className="text-sm text-zinc-400">
                    {language === "en"
                      ? "Modern LLMs are trained on hundreds of billions to trillions of words from books, websites, articles, and other text sources. For comparison, the complete works of Shakespeare contain about 900,000 words - less than 0.0001% of what a modern LLM might be trained on."
                      : "现代大语言模型在来自书籍、网站、文章和其他文本来源的数千亿到数万亿个单词上进行训练。作为比较，莎士比亚的全部作品包含约90万个单词 - 不到现代大语言模型可能训练内容的0.0001%。"}
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="different" className="bg-zinc-900 border border-zinc-800 rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium py-3">
                  {language === "en"
                    ? "How are different LLMs (ChatGPT, Claude, etc.) different?"
                    : "不同的大语言模型（ChatGPT、Claude等）有何不同？"}
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <p className="text-sm text-zinc-400">
                    {language === "en"
                      ? "Different LLMs vary in their training data, size (number of parameters), architecture details, and how they're fine-tuned after initial training. These differences affect their capabilities, knowledge, writing style, and limitations. Companies also apply different safety measures and specialized training."
                      : "不同的大语言模型在训练数据、大小（参数数量）、架构细节以及初始训练后如何进行微调方面有所不同。这些差异影响它们的能力、知识、写作风格和局限性。公司还应用不同的安全措施和专门训练。"}
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="limitations" className="bg-zinc-900 border border-zinc-800 rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium py-3">
                  {language === "en" ? "What are the main limitations of LLMs?" : "大语言模型的主要局限性是什么？"}
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="text-sm text-zinc-400 space-y-2 list-disc pl-5">
                    <li>
                      {language === "en"
                        ? "They can generate incorrect information that sounds convincing"
                        : "它们可以生成听起来令人信服的错误信息"}
                    </li>
                    <li>
                      {language === "en"
                        ? "They don't truly understand context or have common sense"
                        : "它们不真正理解上下文或具有常识"}
                    </li>
                    <li>
                      {language === "en"
                        ? "Their knowledge is limited to what they were trained on"
                        : "它们的知识仅限于它们接受训练的内容"}
                    </li>
                    <li>
                      {language === "en"
                        ? "They can reflect biases present in their training data"
                        : "它们可以反映训练数据中存在的偏见"}
                    </li>
                    <li>
                      {language === "en"
                        ? "They can't access the internet or run code (unless specifically designed to)"
                        : "它们无法访问互联网或运行代码（除非专门设计为此）"}
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

