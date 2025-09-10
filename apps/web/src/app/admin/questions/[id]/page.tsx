'use client'

import { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin-header'
import { useApp } from '@/components/app-provider'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface QuestionStack {
  id: string
  name: string
  questions: QuestionStackItem[]
  createdAt: string
  updatedAt: string
}

interface QuestionStackItem {
  id: string
  stackId: string
  question: string
  answers: string // JSON stringified
  correctAnswer: string
  questionType: string // "single" | "multiple"
  order: number
  createdAt: string
  updatedAt: string
}

export default function QuestionStackEditorPage() {
  const params = useParams()
  const stackId = params.id as string
  
  const [questionStack, setQuestionStack] = useState<QuestionStack | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuestionStackItem | null>(null)
  const [draggedQuestion, setDraggedQuestion] = useState<QuestionStackItem | null>(null)
  const { translations } = useApp()

  // Form state
  const [questionText, setQuestionText] = useState('')
  const [answers, setAnswers] = useState<string[]>(['', ''])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [questionType, setQuestionType] = useState<'single' | 'multiple'>('single')

  useEffect(() => {
    const fetchQuestionStack = async () => {
      if (stackId) {
        try {
          const response = await fetch(`/api/question-stacks/${stackId}`)
          if (response.ok) {
            const data = await response.json()
            setQuestionStack(data.questionStack)
          } else {
            console.error('Failed to fetch question stack')
          }
        } catch (error) {
          console.error('Error fetching question stack:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchQuestionStack()
  }, [stackId])

  const addAnswer = () => {
    setAnswers([...answers, ''])
  }

  const removeAnswer = (index: number) => {
    if (answers.length > 2) {
      const newAnswers = answers.filter((_, i) => i !== index)
      setAnswers(newAnswers)
    }
  }

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSaveQuestion = async () => {
    if (questionText.trim() && answers.some(a => a.trim()) && correctAnswer.trim()) {
      try {
        const response = await fetch(`/api/question-stacks/${stackId}/questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: questionText.trim(),
            answers: answers.filter(a => a.trim()),
            correctAnswer: correctAnswer.trim(),
            questionType: questionType
          })
        })

        if (response.ok) {
          const data = await response.json()
          const newQuestion = data.questionStackItem
          
          // Add to local state
          if (questionStack) {
            setQuestionStack({
              ...questionStack,
              questions: [...questionStack.questions, newQuestion]
            })
          }
          
          // Reset form
          setQuestionText('')
          setAnswers(['', ''])
          setCorrectAnswer('')
          setQuestionType('single')
          setShowQuestionForm(false)
          setEditingQuestion(null)
        } else {
          console.error('Failed to save question')
        }
      } catch (error) {
        console.error('Error saving question:', error)
      }
    }
  }

  const handleDragStart = (e: React.DragEvent, question: QuestionStackItem) => {
    setDraggedQuestion(question)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedQuestion && questionStack) {
      // TODO: Reorder questions
      console.log('Reordering question:', draggedQuestion.id, 'to position:', targetIndex)
    }
    setDraggedQuestion(null)
  }

  if (!translations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/admin/questions"
              className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium mb-2 inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zurück zu Fragenstapeln
            </Link>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              {questionStack?.name || 'Fragenstapel bearbeiten'}
            </h1>
          </div>
          <button
            onClick={() => setShowQuestionForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Neue Frage hinzufügen
          </button>
        </div>

        {/* Questions List */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-orange-200/50 dark:border-slate-700/50">
          {questionStack?.questions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
                Noch keine Fragen erstellt
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-lg mb-6">
                Füge deine erste Frage zu diesem Fragenstapel hinzu.
              </p>
              <button
                onClick={() => setShowQuestionForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Erste Frage hinzufügen →
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
                Fragen ({questionStack?.questions.length || 0})
              </h2>
              {questionStack?.questions.map((question, index) => (
                <div
                  key={question.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, question)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200/30 dark:border-slate-600/30 hover:shadow-lg transition-all duration-200 cursor-move"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {question.question}
                      </h3>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingQuestion(question)
                          setQuestionText(question.question)
                          setAnswers(JSON.parse(question.answers))
                          setCorrectAnswer(question.correctAnswer)
                          setQuestionType(question.questionType as 'single' | 'multiple')
                          setShowQuestionForm(true)
                        }}
                        className="p-2 bg-blue-50/60 dark:bg-blue-900/20 hover:bg-blue-100/80 dark:hover:bg-blue-800/30 rounded-lg border border-blue-200/50 dark:border-blue-700/50 transition-all duration-200 text-blue-600 dark:text-blue-400"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-2 bg-red-50/60 dark:bg-red-900/20 hover:bg-red-100/80 dark:hover:bg-red-800/30 rounded-lg border border-red-200/50 dark:border-red-700/50 transition-all duration-200 text-red-600 dark:text-red-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      Antwortmöglichkeiten:
                    </div>
                    {JSON.parse(question.answers).map((answer: string, answerIndex: number) => (
                      <div key={answerIndex} className="flex items-center space-x-3">
                        <div className={`w-5 h-5 border-2 border-orange-400 bg-white dark:bg-slate-700 ${
                          question.questionType === 'multiple' ? 'rounded' : 'rounded-full'
                        }`}></div>
                        <span className={`text-sm ${answer === question.correctAnswer ? 'font-semibold text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}`}>
                          {answer}
                          {answer === question.correctAnswer && (
                            <span className="ml-2 text-green-600 dark:text-green-400">✓</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Question Form Modal */}
        {showQuestionForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-2xl w-full border-2 border-orange-200/50 dark:border-slate-700/50 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
                {editingQuestion ? 'Frage bearbeiten' : 'Neue Frage hinzufügen'}
              </h3>
              
              <div className="space-y-6">
                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Frage
                  </label>
                  <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200 min-h-[100px] resize-y"
                    placeholder="Formuliere deine Frage..."
                  />
                </div>

                {/* Question Type Toggle */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    {translations?.admin.questions.questionForm.questionType || 'Fragetyp'}
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setQuestionType('single')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        questionType === 'single'
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-500'
                      }`}
                    >
                      {translations?.admin.questions.questionForm.singleChoice || 'Einfachauswahl'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuestionType('multiple')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        questionType === 'multiple'
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-500'
                      }`}
                    >
                      {translations?.admin.questions.questionForm.multipleChoice || 'Mehrfachauswahl'}
                    </button>
                  </div>
                </div>

                {/* Answers */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Antwortmöglichkeiten
                    </label>
                    <button
                      onClick={addAnswer}
                      className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 text-sm flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Antwort hinzufügen
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {answers.map((answer, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-orange-400 rounded-full bg-white dark:bg-slate-700"></div>
                        <input
                          type="text"
                          value={answer}
                          onChange={(e) => updateAnswer(index, e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200"
                          placeholder={`Antwort ${index + 1}`}
                        />
                        {answers.length > 2 && (
                          <button
                            onClick={() => removeAnswer(index)}
                            className="p-2 bg-red-50/60 dark:bg-red-900/20 hover:bg-red-100/80 dark:hover:bg-red-800/30 rounded-lg border border-red-200/50 dark:border-red-700/50 transition-all duration-200 text-red-600 dark:text-red-400"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Richtige Antwort
                  </label>
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-green-200/50 dark:border-green-600/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500/50 transition-all duration-200"
                  >
                    <option value="">Wähle die richtige Antwort...</option>
                    {answers.filter(a => a.trim()).map((answer, index) => (
                      <option key={index} value={answer}>
                        {answer}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleSaveQuestion}
                    disabled={!questionText.trim() || !answers.some(a => a.trim()) || !correctAnswer.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-200"
                  >
                    {editingQuestion ? 'Aktualisieren' : 'Speichern'}
                  </button>
                  <button
                    onClick={() => {
                      setShowQuestionForm(false)
                      setEditingQuestion(null)
                      setQuestionText('')
                      setAnswers(['', ''])
                      setCorrectAnswer('')
                      setQuestionType('single')
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
