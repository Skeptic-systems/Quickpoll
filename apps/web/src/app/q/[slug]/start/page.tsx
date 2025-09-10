'use client'

import { useState } from 'react'
import { Button, Card } from '@/components/ui'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import Link from 'next/link'

interface QuizStartPageProps {
  params: {
    slug: string
  }
}

export default function QuizStartPage({ params }: QuizStartPageProps) {
  const [isStarting, setIsStarting] = useState(false)

  const handleStartQuiz = () => {
    setIsStarting(true)
    // Navigate to quiz or show quiz content
    setTimeout(() => {
      setIsStarting(false)
    }, 1000)
  }

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
            Quiz starten
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Bereit für das Quiz? Hier geht's los!
          </p>
        </div>

        <Card className="p-8 max-w-2xl mx-auto">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">📝</span>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Quiz: {params.slug}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Teste dein Wissen mit diesem spannenden Quiz!
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Anweisungen:
              </h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 text-left">
                <li>• Beantworte alle Fragen sorgfältig</li>
                <li>• Du kannst jederzeit zwischen den Fragen wechseln</li>
                <li>• Überprüfe deine Antworten vor dem Absenden</li>
                <li>• Viel Erfolg!</li>
              </ul>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleStartQuiz}
                disabled={isStarting}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg"
              >
                {isStarting ? 'Wird gestartet...' : 'Quiz starten'}
              </Button>
            </div>

            <div className="pt-4">
              <Link href="/" className="text-orange-600 hover:text-orange-700 text-sm">
                Zurück zur Startseite
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}