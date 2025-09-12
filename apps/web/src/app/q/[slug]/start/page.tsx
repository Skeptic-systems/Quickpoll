'use client'

import { useState, useEffect } from 'react'
import { Button, Card } from '@/components/ui'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useApp } from '@/components/app-provider'
import Image from 'next/image'
import Link from 'next/link'

interface QuizStartPageProps {
  params: {
    slug: string
  }
}

export default function QuizStartPage({ params }: QuizStartPageProps) {
  const [isStarting, setIsStarting] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const { translations, language } = useApp()

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark') ||
        (!document.documentElement.classList.contains('light') && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)
      setIsDark(isDarkMode)
    }

    checkTheme()

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => checkTheme()
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const handleStartQuiz = () => {
    setIsStarting(true)
    // Navigate to quiz execution page
    setTimeout(() => {
      window.location.href = `/q/${params.slug}/quiz`
    }, 1000)
  }

  if (!translations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-orange-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src={isDark ? '/dark-logo.svg' : '/light-logo.svg'}
                alt="Quickpoll"
                width={40}
                height={40}
                className="h-10 w-10"
              />
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              {translations?.admin?.quizStart?.title || "Quiz starten"}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {translations?.admin?.quizStart?.subtitle || "Bereit für das Quiz? Hier geht's los!"}
            </p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-orange-200/50 dark:border-slate-700/50 max-w-2xl mx-auto">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                  {translations?.admin?.quizStart?.quizLabel || "Quiz:"} {params.slug}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {translations?.admin?.quizStart?.description || "Teste dein Wissen mit diesem spannenden Quiz!"}
                </p>
              </div>

              <div className="bg-white/40 dark:bg-slate-700/40 rounded-2xl p-4 border border-orange-200/30 dark:border-slate-600/30">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {translations?.admin?.quizStart?.instructions?.title || "Anweisungen:"}
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 text-left">
                  {(translations?.admin?.quizStart?.instructions?.items || [
                    "Beantworte alle Fragen sorgfältig",
                    "Du kannst jederzeit zwischen den Fragen wechseln",
                    "Überprüfe deine Antworten vor dem Absenden",
                    "Viel Erfolg!"
                  ]).map((instruction: string, index: number) => (
                    <li key={index}>• {instruction}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleStartQuiz}
                  disabled={isStarting}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isStarting 
                    ? (translations?.admin?.quizStart?.starting || "Wird gestartet...")
                    : (translations?.admin?.quizStart?.startButton || "Quiz starten")
                  }
                </Button>
              </div>

              <div className="pt-4">
                <Link href="/" className="text-orange-600 hover:text-orange-700 text-sm">
                  {translations?.admin?.quizStart?.backToHome || "Zurück zur Startseite"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}