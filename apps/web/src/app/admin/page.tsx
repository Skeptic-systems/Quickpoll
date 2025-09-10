'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AdminHeader } from '@/components/admin-header'
import { LoginOverlay } from '@/components/login-overlay'
import { useApp } from '@/components/app-provider'

interface Quiz {
  id: string
  slug: string
  title: string
  questionsPerRun: number
  allowPublicResult: boolean
  createdAt: string
  isActive: boolean
  _count: {
    questions: number
    attempts: number
  }
}

export default function AdminPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { translations } = useApp()

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include'
        })
        if (response.ok) {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      }
    }
    
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      const fetchQuizzes = async () => {
        try {
          const response = await fetch('/api/quizzes')
          if (response.ok) {
            const data = await response.json()
            setQuizzes(data.quizzes)
          }
        } catch (error) {
          console.error('Error fetching quizzes:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchQuizzes()
    }
  }, [isAuthenticated])

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      if (response.ok) {
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
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
      
      {/* Login Overlay */}
      {!isAuthenticated && (
        <LoginOverlay onLogin={handleLogin} />
      )}
      
      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center h-screen px-4 sm:px-6 lg:px-8">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-orange-300/30 dark:from-orange-500/20 dark:to-orange-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-200/30 to-orange-300/30 dark:from-orange-500/20 dark:to-orange-600/20 rounded-full blur-3xl"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center max-w-6xl mx-auto">

            {/* Admin Features Section - 3 smaller boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Create Quiz */}
              <Link
                href="/admin/quiz-editor"
                className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200/50 dark:border-blue-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {translations?.admin.features.createQuiz.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {translations?.admin.features.createQuiz.description}
                </p>
              </Link>

              {/* Manage Questions */}
              <Link
                href="/admin/questions"
                className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-200/50 dark:border-green-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {translations?.admin.features.manageQuestions.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {translations?.admin.features.manageQuestions.description}
                </p>
              </Link>

              {/* View Results */}
              <Link
                href="/admin/results"
                className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200/50 dark:border-purple-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {translations?.admin.features.viewResults.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {translations?.admin.features.viewResults.description}
                </p>
              </Link>
            </div>

            {/* Quiz List Section - Large horizontal box below the 3 boxes */}
            <div className="w-full">
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
              ) : quizzes.length > 0 ? (
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {translations?.admin.quizList.title}
                    </h3>
                    <Link
                      href="/admin/quiz-editor"
                      className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-md transition-all duration-200 text-xs"
                    >
                      {translations?.admin.quizList.createNew}
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {quizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm rounded-xl p-4 border border-orange-200/30 dark:border-slate-600/30 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            quiz.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {quiz.isActive ? translations?.admin.quizList.status.active : translations?.admin.quizList.status.inactive}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                          {quiz.title}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 text-xs mb-3">
                          {quiz._count.questions} Fragen • {quiz._count.attempts} Teilnahmen
                        </p>
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/quiz-editor?id=${quiz.id}`}
                            className="flex-1 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-md transition-all duration-200 text-center text-xs"
                          >
                            {translations?.admin.quizList.actions.edit}
                          </Link>
                          <Link
                            href={`/admin/results?id=${quiz.id}`}
                            className="flex-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-md transition-all duration-200 text-center text-xs"
                          >
                            {translations?.admin.quizList.actions.results}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-orange-200/50 dark:border-slate-700/50 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {translations?.admin.quizList.noQuizzes.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-base mb-6">
                    {translations?.admin.quizList.noQuizzes.description}
                  </p>
                  <Link
                    href="/admin/quiz-editor"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 text-base"
                  >
                    {translations?.admin.quizList.noQuizzes.createFirst}
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 right-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-t border-orange-200/50 dark:border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center text-base text-slate-600 dark:text-slate-400">
              <div className="mb-4 sm:mb-0">
                © 2025{' '}
                <a 
                  href="https://skeptic-systems.de" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold transition-colors"
                >
                  Skeptic Systems
                </a>
                . Alle Rechte vorbehalten.
              </div>
              <div className="flex space-x-8">
                <a href="/impressum" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-base font-medium">
                  Impressum
                </a>
                <a href="/datenschutz" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-base font-medium">
                  Datenschutz
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}