'use client'

import { useState } from 'react'
import { Button, Card, Progress } from '@/components/ui'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import Link from 'next/link'

interface QuizResultsPageProps {
  params: {
    slug: string
  }
}

export default function QuizResultsPage({ params }: QuizResultsPageProps) {
  const [score] = useState(85) // Mock score
  const [totalQuestions] = useState(10) // Mock total questions
  const [correctAnswers] = useState(8) // Mock correct answers

  const percentage = Math.round((correctAnswers / totalQuestions) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-orange-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/logo.png" alt="Quickpoll" className="h-8 w-8" />
                <h1 className="text-xl font-bold text-orange-600 dark:text-orange-400">Quickpoll</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Quiz-Ergebnisse
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Hier sind deine Ergebnisse!
          </p>
        </div>

        <Card className="p-8 max-w-2xl mx-auto">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">🎉</span>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {percentage}%
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Du hast {correctAnswers} von {totalQuestions} Fragen richtig beantwortet!
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Richtige Antworten
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {correctAnswers}/{totalQuestions}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {correctAnswers}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Richtig
                  </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {totalQuestions - correctAnswers}
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    Falsch
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <Button
                size="lg"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                Quiz wiederholen
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                >
                  Zurück zur Startseite
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}