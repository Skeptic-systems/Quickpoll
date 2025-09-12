'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useApp } from '@/components/app-provider'
import Link from 'next/link'

interface QuizResult {
  attemptId: string
  quizTitle: string
  finishedAt: string
  score: {
    totalQuestions: number
    correctAnswers: number
    score: number
    percentage: string
  }
  answers: Array<{
    moduleId: string
    questionText: string
    questionAnswers: string[]
    questionType: string
    selectedChoices: number[]
    correctChoices: number[]
    isCorrect: boolean
    points: number
  }>
}

export default function QuizResultsPage() {
  const params = useParams()
  const quizSlug = params.slug as string
  const { translations, language } = useApp()
  
  const [result, setResult] = useState<QuizResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadResults = async () => {
      try {
        setIsLoading(true)
        
        // Hole die Ergebnisse aus der URL oder localStorage
        const attemptId = new URLSearchParams(window.location.search).get('attemptId')
        if (!attemptId) {
          console.error('No attempt ID found')
          return
        }

        const response = await fetch(`/api/quizzes/results/${attemptId}`)
        if (response.ok) {
          const data = await response.json()
          console.log('🔍 Results: Loaded data:', data)
          console.log('🔍 Results: Quiz title:', data.quizTitle)
          console.log('🔍 Results: Score:', data.score)
          console.log('🔍 Results: Answers count:', data.answers?.length)
          console.log('🔍 Results: All answers:', data.answers)
          
          // Detailliertes Logging für jede Antwort
          data.answers?.forEach((answer, index) => {
            console.log(`🔍 Results: Answer ${index + 1}:`, {
              moduleId: answer.moduleId,
              questionText: answer.questionText,
              questionAnswers: answer.questionAnswers,
              questionType: answer.questionType,
              selectedChoices: answer.selectedChoices,
              correctChoices: answer.correctChoices,
              isCorrect: answer.isCorrect
            })
          })
          
          setResult(data)
        } else {
          console.error('Failed to load results')
        }
      } catch (error) {
        console.error('Error loading results:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (quizSlug) {
      loadResults()
    }
  }, [quizSlug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Lade Ergebnisse...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Ergebnisse nicht gefunden
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Die Quiz-Ergebnisse konnten nicht geladen werden.
          </p>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30'
    return 'bg-red-100 dark:bg-red-900/30'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Hervorragend! 🏆'
    if (score >= 80) return 'Ausgezeichnet! 🎉'
    if (score >= 70) return 'Sehr gut! 👍'
    if (score >= 60) return 'Gut gemacht! ✅'
    if (score >= 50) return 'Nicht schlecht! 📚'
    return 'Weiter üben! 💪'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {translations?.admin?.quizExecution?.quizCompleted || 'Quiz abgeschlossen!'}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {result.quizTitle} • {formatDate(result.finishedAt)}
          </p>
        </div>

        {/* Score Card */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className={`rounded-2xl p-8 text-center border-2 ${getScoreBgColor(result.score.score)}`}>
            <div className="text-6xl font-bold mb-4">
              <span className={getScoreColor(result.score.score)}>
                {Math.round(result.score.score)}%
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              {result.score.correctAnswers} von {result.score.totalQuestions} richtig
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {getScoreMessage(result.score.score)}
            </p>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Detaillierte Auswertung
          </h3>
          
          <div className="space-y-6">
            {result.answers.map((answer, index) => (
              <div
                key={answer.moduleId}
                className={`rounded-xl p-6 border-2 ${
                  answer.isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex-1">
                    Frage {index + 1}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      answer.isCorrect
                        ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                        : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                    }`}>
                      {answer.isCorrect ? '✓ Richtig' : '✗ Falsch'}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {answer.questionType === 'multiple' ? 'Mehrfachauswahl' : 'Einfachauswahl'}
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg">
                  {answer.questionText}
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Deine Antwort:
                    </h5>
                    <div className="space-y-2">
                      {(() => {
                        // Robuste Behandlung der selectedChoices
                        let selectedChoicesArray = []
                        try {
                          if (Array.isArray(answer.selectedChoices)) {
                            selectedChoicesArray = answer.selectedChoices
                          } else if (typeof answer.selectedChoices === 'string') {
                            selectedChoicesArray = JSON.parse(answer.selectedChoices)
                          }
                        } catch (error) {
                          console.error('Error parsing selectedChoices:', error, answer.selectedChoices)
                          selectedChoicesArray = []
                        }

                        return selectedChoicesArray.length > 0 ? (
                          selectedChoicesArray.map((choiceIndex, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg border-2 ${
                                answer.isCorrect
                                  ? 'bg-green-100 dark:bg-green-800 border-green-300 dark:border-green-600 text-green-800 dark:text-green-200'
                                  : 'bg-red-100 dark:bg-red-800 border-red-300 dark:border-red-600 text-red-800 dark:text-red-200'
                              }`}
                            >
                              <div className="flex items-center">
                                <span className="font-medium mr-2">{choiceIndex + 1}.</span>
                                {answer.questionAnswers[choiceIndex] || 'Unbekannte Antwort'}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 italic">
                            Keine Antwort ausgewählt
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Richtige Antwort:
                    </h5>
                    <div className="space-y-2">
                      {(() => {
                        // Robuste Behandlung der correctChoices
                        let correctChoicesArray = []
                        try {
                          if (Array.isArray(answer.correctChoices)) {
                            correctChoicesArray = answer.correctChoices
                          } else if (typeof answer.correctChoices === 'string') {
                            correctChoicesArray = JSON.parse(answer.correctChoices)
                          }
                        } catch (error) {
                          console.error('Error parsing correctChoices:', error, answer.correctChoices)
                          correctChoicesArray = []
                        }

                        console.log('🔍 Results: correctChoices debug:', {
                          original: answer.correctChoices,
                          parsed: correctChoicesArray,
                          questionAnswers: answer.questionAnswers
                        })

                        return correctChoicesArray.length > 0 ? (
                          correctChoicesArray.map((choiceIndex, idx) => {
                            console.log('🔍 Results: Rendering correct choice:', {
                              choiceIndex,
                              answerText: answer.questionAnswers[choiceIndex]
                            })
                            return (
                              <div
                                key={idx}
                                className="p-3 bg-green-100 dark:bg-green-800 border-2 border-green-300 dark:border-green-600 rounded-lg text-green-800 dark:text-green-200"
                              >
                                <div className="flex items-center">
                                  <span className="font-medium mr-2">{choiceIndex + 1}.</span>
                                  {answer.questionAnswers[choiceIndex] || 'Unbekannte Antwort'}
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 italic">
                            Keine korrekte Antwort definiert
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </div>

                {/* Teilpunkte für Multiple Choice */}
                {answer.questionType === 'multiple' && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center text-blue-800 dark:text-blue-200">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">
                        Mehrfachauswahl: Teilpunkte werden für richtige und falsche Antworten vergeben
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/q/${quizSlug}/start`}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors duration-200"
            >
              Quiz nochmal machen
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors duration-200"
            >
              Zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}