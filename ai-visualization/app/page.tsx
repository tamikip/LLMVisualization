"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Brain, Github, Menu, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import LanguageSwitcher from "@/components/language-switcher"
import ModelVisualization from "@/components/model-visualization"
import ModelExplainer from "@/components/model-explainer"
import UserInteraction from "@/components/user-interaction"
import BeginnersGuide from "@/components/beginners-guide"
// 添加增强型3D模型组件的导入
import EnhancedModel3D from "@/components/enhanced-3d-model"

export default function Home() {
  const { t, language } = useLanguage()
  const [activeSection, setActiveSection] = useState("architecture")

  // 创建对各部分的引用
  const architectureRef = useRef<HTMLDivElement>(null)
  const attentionRef = useRef<HTMLDivElement>(null)
  const trainingRef = useRef<HTMLDivElement>(null)
  const interactRef = useRef<HTMLDivElement>(null)

  // 处理导航点击
  const handleNavClick = (section: string, ref: React.RefObject<HTMLDivElement>) => {
    setActiveSection(section)
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // 关闭侧边栏的函数
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 头部导航 */}
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Brain className="w-6 h-6 text-emerald-500" />
            <span>LLM Visualizer</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <button
                onClick={() => handleNavClick("architecture", architectureRef)}
                className="text-sm hover:text-emerald-400 transition-colors"
              >
                {t("nav.architecture")}
              </button>
              <button
                onClick={() => handleNavClick("attention", attentionRef)}
                className="text-sm hover:text-emerald-400 transition-colors"
              >
                {t("nav.attention")}
              </button>
              <button
                onClick={() => handleNavClick("training", trainingRef)}
                className="text-sm hover:text-emerald-400 transition-colors"
              >
                {t("nav.training")}
              </button>
              <button
                onClick={() => handleNavClick("interact", interactRef)}
                className="text-sm hover:text-emerald-400 transition-colors"
              >
                {t("nav.interact")}
              </button>
            </nav>
            <LanguageSwitcher />
            <Button
              variant="outline"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900 h-10 px-4 py-2 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400 gap-2"
            >
              <Github className="w-4 h-4" />
              <span>{t("nav.github")}</span>
            </Button>
          </div>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="w-5 h-5" />
                <span className="sr-only">{t("nav.toggleMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-zinc-900 border-zinc-800">
              <div className="flex flex-col gap-6 mt-8">
                <button
                  onClick={() => {
                    handleNavClick("architecture", architectureRef)
                    setIsSheetOpen(false)
                  }}
                  className="text-lg hover:text-emerald-400 transition-colors text-left"
                >
                  {t("nav.architecture")}
                </button>
                <button
                  onClick={() => {
                    handleNavClick("attention", attentionRef)
                    setIsSheetOpen(false)
                  }}
                  className="text-lg hover:text-emerald-400 transition-colors text-left"
                >
                  {t("nav.attention")}
                </button>
                <button
                  onClick={() => {
                    handleNavClick("training", trainingRef)
                    setIsSheetOpen(false)
                  }}
                  className="text-lg hover:text-emerald-400 transition-colors text-left"
                >
                  {t("nav.training")}
                </button>
                <button
                  onClick={() => {
                    handleNavClick("interact", interactRef)
                    setIsSheetOpen(false)
                  }}
                  className="text-lg hover:text-emerald-400 transition-colors text-left"
                >
                  {t("nav.interact")}
                </button>
                <LanguageSwitcher />
                <Button
                  variant="outline"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900 h-10 px-4 py-2 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400 gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>{t("nav.github")}</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* 主页横幅 */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent_70%)]" />

        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-400">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-8">{t("hero.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                onClick={() => handleNavClick("beginner", architectureRef)}
              >
                {t("hero.startExploring")}
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-900 h-10 px-4 py-2 border-zinc-700 hover:bg-zinc-800 text-white hover:text-emerald-400 gap-2"
              >
                {t("hero.learnMore")}
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 主要内容 */}
      <section className="py-20 bg-zinc-950">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 侧边栏 */}
            <div className="lg:col-span-3">
              <div className="sticky top-24 space-y-2">
                <Button
                  variant={activeSection === "beginner" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeSection === "beginner" ? "bg-yellow-900/30 hover:bg-yellow-900/40 text-yellow-400" : "hover:bg-zinc-900 text-white"}`}
                  onClick={() => setActiveSection("beginner")}
                >
                  {t("beginner.title")}
                </Button>
                <Button
                  variant={activeSection === "architecture" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeSection === "architecture" ? "bg-emerald-900/30 hover:bg-emerald-900/40 text-emerald-400" : "hover:bg-zinc-900 text-white"}`}
                  onClick={() => setActiveSection("architecture")}
                >
                  {t("main.modelArchitecture")}
                </Button>
                <Button
                  variant={activeSection === "attention" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeSection === "attention" ? "bg-emerald-900/30 hover:bg-emerald-900/40 text-emerald-400" : "hover:bg-zinc-900 text-white"}`}
                  onClick={() => setActiveSection("attention")}
                >
                  {t("main.attentionMechanism")}
                </Button>
                <Button
                  variant={activeSection === "training" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeSection === "training" ? "bg-emerald-900/30 hover:bg-emerald-900/40 text-emerald-400" : "hover:bg-zinc-900 text-white"}`}
                  onClick={() => setActiveSection("training")}
                >
                  {t("main.trainingProcess")}
                </Button>
                <Button
                  variant={activeSection === "enhanced3d" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeSection === "enhanced3d" ? "bg-purple-900/30 hover:bg-purple-900/40 text-purple-400" : "hover:bg-zinc-900 text-white"}`}
                  onClick={() => setActiveSection("enhanced3d")}
                >
                  {language === "en" ? "Enhanced 3D Network" : "增强型3D网络"}
                </Button>
                <Button
                  variant={activeSection === "interact" ? "default" : "ghost"}
                  className={`w-full justify-start ${activeSection === "interact" ? "bg-emerald-900/30 hover:bg-emerald-900/40 text-emerald-400" : "hover:bg-zinc-900 text-white"}`}
                  onClick={() => setActiveSection("interact")}
                >
                  {t("main.interactiveDemo")}
                </Button>
              </div>
            </div>

            {/* 主内容区 */}
            <div className="lg:col-span-9">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                {activeSection === "beginner" && <BeginnersGuide />}
                <div ref={architectureRef}>{activeSection === "architecture" && <ModelVisualization />}</div>
                {activeSection === "enhanced3d" && <EnhancedModel3D />}
                <div ref={attentionRef}>{activeSection === "attention" && <ModelExplainer type="attention" />}</div>
                <div ref={trainingRef}>{activeSection === "training" && <ModelExplainer type="training" />}</div>
                <div ref={interactRef}>{activeSection === "interact" && <UserInteraction />}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特性部分 */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{t("features.title")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-emerald-900 transition-colors">
              <div className="w-12 h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("features.interactive.title")}</h3>
              <p className="text-zinc-400">{t("features.interactive.desc")}</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-emerald-900 transition-colors">
              <div className="w-12 h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("features.realtime.title")}</h3>
              <p className="text-zinc-400">{t("features.realtime.desc")}</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-emerald-900 transition-colors">
              <div className="w-12 h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("features.educational.title")}</h3>
              <p className="text-zinc-400">{t("features.educational.desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-12 border-t border-zinc-800">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Brain className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold">LLM Visualizer</span>
            </div>

            <div className="text-sm text-zinc-500">
              © {new Date().getFullYear()} LLM Visualizer. {t("footer.rights")}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

