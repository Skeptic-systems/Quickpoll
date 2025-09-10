'use client'

import { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin-header'
import { useApp } from '@/components/app-provider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  order: number
  createdAt: string
  updatedAt: string
}

export default function QuestionsPage() {
  const [questionStacks, setQuestionStacks] = useState<QuestionStack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newStackName, setNewStackName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ stack: QuestionStack | null; show: boolean }>({ stack: null, show: false })
  const { translations } = useApp()
  const router = useRouter()

  useEffect(() => {
    const fetchQuestionStacks = async () => {
      try {
        const response = await fetch('/api/question-stacks')
        if (response.ok) {
          const data = await response.json()
          setQuestionStacks(data.questionStacks)
        }
      } catch (error) {
        console.error('Error fetching question stacks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestionStacks()
  }, [])

  const handleCreateStack = async () => {
    if (newStackName.trim()) {
      setIsCreating(true)
      try {
        const response = await fetch('/api/question-stacks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newStackName.trim()
          })
        })

        if (response.ok) {
          const data = await response.json()
          const newStack = data.questionStack
          
          // Add to local state
          setQuestionStacks(prev => [...prev, newStack])
          
          console.log('Creating stack:', newStackName)
          
          // Redirect immediately without closing modal first
          router.push(`/admin/questions/${newStack.id}`)
          
          // Clear form and close modal after redirect
          setNewStackName('')
          setShowCreateForm(false)
        } else {
          console.error('Failed to create question stack')
        }
      } catch (error) {
        console.error('Error creating stack:', error)
      } finally {
        setIsCreating(false)
      }
    }
  }

  const handleDeleteStack = async (stack: QuestionStack) => {
    try {
      const response = await fetch(`/api/question-stacks/${stack.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Remove from local state
        setQuestionStacks(prev => prev.filter(s => s.id !== stack.id))
        setDeleteConfirm({ stack: null, show: false })
      } else {
        console.error('Failed to delete question stack')
      }
    } catch (error) {
      console.error('Error deleting question stack:', error)
    }
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
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {translations.admin.features.manageQuestions.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {translations.admin.features.manageQuestions.description}
          </p>
        </div>

        {/* Create New Stack Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center mx-auto"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Neuen Fragenstapel erstellen
          </button>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full border-2 border-orange-200/50 dark:border-slate-700/50">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
                Neuen Fragenstapel erstellen
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Name des Fragenstapels
                  </label>
                  <input
                    type="text"
                    value={newStackName}
                    onChange={(e) => setNewStackName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200"
                    placeholder="z.B. Allgemeinwissen, Mathematik..."
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleCreateStack}
                    disabled={!newStackName.trim() || isCreating}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Erstelle...
                      </>
                    ) : (
                      'Erstellen'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateForm(false)
                      setNewStackName('')
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

        {/* Question Stacks List */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-orange-200/50 dark:border-slate-700/50">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Lade Fragenstapel...</p>
            </div>
          ) : questionStacks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
                Noch keine Fragenstapel erstellt
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-lg mb-6">
                Erstelle deinen ersten Fragenstapel, um Fragen und Antworten für deine Quizzes zu sammeln.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Ersten Fragenstapel erstellen →
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
                Meine Fragenstapel
              </h2>
              {questionStacks.map((stack) => (
                <div
                  key={stack.id}
                  className="bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200/30 dark:border-slate-600/30 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        {stack.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {stack.questions.length} Fragen • Erstellt am {new Date(stack.createdAt).toLocaleDateString('de-DE')}
                      </p>
                      <div className="flex space-x-3">
                        <Link
                          href={`/admin/questions/${stack.id}`}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 text-sm"
                        >
                          Bearbeiten
                        </Link>
                        <button 
                          onClick={() => setDeleteConfirm({ stack, show: true })}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200 text-sm"
                        >
                          Löschen
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && deleteConfirm.stack && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full border-2 border-red-200/50 dark:border-red-700/50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {translations?.admin.questions.deleteConfirm.title || 'Fragenstapel löschen'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {translations?.admin.questions.deleteConfirm.message || 'Bist du sicher, dass du diesen Fragenstapel löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.'}
                </p>
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>{deleteConfirm.stack.name}</strong> mit {deleteConfirm.stack.questions.length} Fragen wird gelöscht.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleDeleteStack(deleteConfirm.stack)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200"
              >
                {translations?.admin.questions.deleteConfirm.confirm || 'Löschen'}
              </button>
              <button
                onClick={() => setDeleteConfirm({ stack: null, show: false })}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200"
              >
                {translations?.admin.questions.deleteConfirm.cancel || 'Abbrechen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
