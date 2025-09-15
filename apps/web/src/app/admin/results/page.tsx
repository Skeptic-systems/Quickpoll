'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AdminHeader } from '@/components/admin-header'
import { useApp } from '@/components/app-provider'

interface Quiz {
  id: string
  slug: string
  title: string
  questionsPerRun: number
  allowPublicResult: boolean
  createdAt: string
  updatedAt: string
  isActive: boolean
  participations: number
  _count: {
    modules: number
    attempts: number
  }
}

interface QuizStats {
  totalAttempts: number
  averageScore: number
  completionRate: number
  recentAttempts: number
}

export default function QuizResultsPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [quizStats, setQuizStats] = useState<Record<string, QuizStats>>({})
  const [isLoading, setIsLoading] = useState(true)
  const { translations, language } = useApp()

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        console.log('Fetching quizzes for results...')
        const response = await fetch('/api/quizzes')
        console.log('Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Quizzes data:', data)
          // API returns quizzes directly, not wrapped in an object
          setQuizzes(Array.isArray(data) ? data : (data.quizzes || []))
          
          // Fetch stats for each quiz (optional, don't block if stats fail)
          try {
            const quizzesArray = Array.isArray(data) ? data : (data.quizzes || [])
            const statsPromises = quizzesArray.map(async (quiz: Quiz) => {
              try {
                const statsResponse = await fetch(`/api/admin/quiz-stats/${quiz.id}`)
                if (statsResponse.ok) {
                  const stats = await statsResponse.json()
                  return { quizId: quiz.id, stats }
                }
              } catch (error) {
                console.error(`Error fetching stats for quiz ${quiz.id}:`, error)
              }
              return { quizId: quiz.id, stats: null }
            }) || []
            
            const statsResults = await Promise.all(statsPromises)
            const statsMap: Record<string, QuizStats> = {}
            statsResults.forEach(({ quizId, stats }) => {
              if (stats) {
                statsMap[quizId] = stats
              }
            })
            setQuizStats(statsMap)
          } catch (error) {
            console.error('Error fetching quiz stats:', error)
            // Continue without stats
          }
        } else {
          console.error('Failed to fetch quizzes:', response.status)
        }
      } catch (error) {
        console.error('Error loading quizzes:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchQuizzes()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 dark:text-green-400'
    if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Quiz-Ergebnisse
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Wähle ein Quiz aus, um detaillierte Ergebnisse und Statistiken zu sehen
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ← Zurück zum Admin
            </Link>
          </div>
        </div>

        {/* Quiz Grid */}
        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Keine Quizze gefunden
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Erstelle zuerst ein Quiz, um Ergebnisse zu sehen
            </p>
            <Link
              href="/admin/quiz-editor"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mt-4"
            >
              Quiz erstellen
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => {
              const stats = quizStats[quiz.id]
              return (
                <Link
                  key={quiz.id}
                  href={`/admin/results/${quiz.id}`}
                  className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-6">
                    {/* Quiz Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {quiz.slug}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        quiz.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {quiz.isActive ? 'Aktiv' : 'Inaktiv'}
                      </div>
                    </div>

                    {/* Quiz Info */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500">
                          {quiz._count.modules}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Module
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">
                          {quiz._count.attempts}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Teilnahmen
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    {stats && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">Durchschnitts-Score</div>
                            <div className={`font-semibold ${getScoreColor(stats.averageScore)}`}>
                              {stats.averageScore.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">Abschlussrate</div>
                            <div className={`font-semibold ${getCompletionRateColor(stats.completionRate)}`}>
                              {stats.completionRate.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Erstellt: {formatDate(quiz.createdAt)}</span>
                        <span className="text-orange-500 font-medium">→ Details ansehen</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start">
            <div className="text-blue-500 text-2xl mr-4">💡</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Über die Ergebnisansicht
              </h3>
              <p className="text-blue-700 dark:text-blue-200 text-sm leading-relaxed">
                In der detaillierten Ergebnisansicht kannst du alle Antworten zu jeder Frage sehen, 
                wie viele Personen welche Antwort gewählt haben, und schöne Diagramme zur Visualisierung 
                der Ergebnisse. Die Daten werden anonymisiert dargestellt.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
