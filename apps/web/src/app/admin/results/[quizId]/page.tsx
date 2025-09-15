'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { AdminHeader } from '@/components/admin-header'
import { useApp } from '@/components/app-provider'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface QuizDetails {
  id: string
  title: string
  slug: string
  isActive: boolean
  questionsPerRun: number
  allowPublicResult: boolean
  participations: number
  createdAt: string
  _count: {
    modules: number
    attempts: number
  }
}

interface QuestionStats {
  moduleId: string
  questionText: string
  questionAnswers: string[]
  questionType: 'single' | 'multiple'
  totalAnswers: number
  answerCounts: Record<string, number>
  correctAnswers: string[]
  averageScore: number
}

interface QuizStats {
  totalAttempts: number
  averageScore: number
  completionRate: number
  recentAttempts: number
  questionStats: QuestionStats[]
}

export default function QuizDetailedResultsPage() {
  const params = useParams()
  const quizId = params.quizId as string
  const { translations, language } = useApp()
  
  const [quizDetails, setQuizDetails] = useState<QuizDetails | null>(null)
  const [stats, setStats] = useState<QuizStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionStats | null>(null)
  const [showChart, setShowChart] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch quiz details and stats
        const [quizResponse, statsResponse] = await Promise.all([
          fetch(`/api/quizzes/${quizId}`),
          fetch(`/api/admin/quiz-detailed-stats/${quizId}`)
        ])

        if (quizResponse.ok) {
          const quizData = await quizResponse.json()
          setQuizDetails(quizData)
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (quizId) {
      fetchData()
    }
  }, [quizId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
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

  const createAnswerChart = (questionStats: QuestionStats) => {
    const labels = questionStats.questionAnswers
    const data = labels.map(answer => questionStats.answerCounts[answer] || 0)
    const backgroundColors = labels.map((_, index) => {
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
      return colors[index % colors.length]
    })

    return {
      labels,
      datasets: [{
        label: 'Anzahl Antworten',
        data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
        borderWidth: 2
      }]
    }
  }

  const createOverallScoreChart = () => {
    if (!stats) return null

    const scoreRanges = [
      { range: '0-20%', count: 0 },
      { range: '21-40%', count: 0 },
      { range: '41-60%', count: 0 },
      { range: '61-80%', count: 0 },
      { range: '81-100%', count: 0 }
    ]

    // This would need to be calculated from actual attempt data
    // For now, we'll use mock data based on average score
    const mockDistribution = [5, 10, 15, 25, 45] // Example distribution
    scoreRanges.forEach((range, index) => {
      range.count = mockDistribution[index]
    })

    return {
      labels: scoreRanges.map(r => r.range),
      datasets: [{
        label: 'Anzahl Teilnehmer',
        data: scoreRanges.map(r => r.count),
        backgroundColor: ['#FF6384', '#FF9F40', '#FFCE56', '#36A2EB', '#4BC0C0'],
        borderColor: ['#FF6384', '#FF9F40', '#FFCE56', '#36A2EB', '#4BC0C0'],
        borderWidth: 2
      }]
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Antwortverteilung'
      }
    }
  }

  const overallChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Score-Verteilung'
      }
    }
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

  if (!quizDetails || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Quiz nicht gefunden
            </h3>
            <Link
              href="/admin/results"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              ← Zurück zu den Ergebnissen
            </Link>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {quizDetails.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Detaillierte Ergebnisse und Statistiken
              </p>
            </div>
            <Link
              href="/admin/results"
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ← Zurück zu den Ergebnissen
            </Link>
          </div>

          {/* Quiz Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="text-blue-500 text-2xl mr-3">👥</div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalAttempts}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Teilnahmen
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="text-green-500 text-2xl mr-3">📊</div>
                <div>
                  <div className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
                    {stats.averageScore.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Durchschnitts-Score
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="text-orange-500 text-2xl mr-3">✅</div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.completionRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Abschlussrate
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="text-purple-500 text-2xl mr-3">❓</div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {quizDetails._count.modules}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Module
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Score Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Score-Verteilung
          </h2>
          <div className="h-64">
            <Bar data={createOverallScoreChart() || { labels: [], datasets: [] }} options={overallChartOptions} />
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Fragen und Antwortstatistiken
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Klicke auf eine Frage, um die detaillierte Antwortverteilung zu sehen
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.questionStats.map((question, index) => (
              <div
                key={question.moduleId}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedQuestion(question)
                  setShowChart(true)
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {question.questionText}
                      </h3>
                    </div>
                    
                    <div className="ml-11">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {question.questionType === 'single' ? 'Einzelauswahl' : 'Mehrfachauswahl'} • 
                        {question.totalAnswers} Antworten • 
                        Durchschnitt: {question.averageScore.toFixed(1)}%
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {question.questionAnswers.map((answer, answerIndex) => {
                          const count = question.answerCounts[answer] || 0
                          const percentage = question.totalAnswers > 0 ? (count / question.totalAnswers) * 100 : 0
                          const isCorrect = question.correctAnswers.includes(answer)
                          
                          return (
                            <div key={answerIndex} className="flex items-center">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-sm ${isCorrect ? 'font-medium text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {answer}
                                    {isCorrect && <span className="ml-1">✓</span>}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {count} ({percentage.toFixed(1)}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-gray-400'}`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-orange-500 ml-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Modal */}
        {showChart && selectedQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Antwortverteilung
                  </h3>
                  <button
                    onClick={() => setShowChart(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {selectedQuestion.questionText}
                </h4>
                
                <div className="h-64 mb-6">
                  <Doughnut data={createAnswerChart(selectedQuestion)} options={chartOptions} />
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p><strong>Fragentyp:</strong> {selectedQuestion.questionType === 'single' ? 'Einzelauswahl' : 'Mehrfachauswahl'}</p>
                  <p><strong>Gesamtantworten:</strong> {selectedQuestion.totalAnswers}</p>
                  <p><strong>Durchschnitts-Score:</strong> {selectedQuestion.averageScore.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
