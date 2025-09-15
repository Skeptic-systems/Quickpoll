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
  updatedAt: string
  isActive: boolean
  participations: number
  _count: {
    questions: number
    attempts: number
    modules: number
  }
}

export default function AdminPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, quizId: string} | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{quizId: string, quizTitle: string} | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { translations, language } = useApp()

  useEffect(() => {
    // Temporarily skip auth check to debug quiz loading
    setIsAuthenticated(true)
    
    /*
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
    */
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      const fetchQuizzes = async () => {
        try {
          console.log('Fetching quizzes...')
          const response = await fetch('/api/quizzes')
          console.log('Response status:', response.status)
          
          if (response.ok) {
            const data = await response.json()
            console.log('Quizzes data:', data)
            setQuizzes(data)
          } else {
            const errorData = await response.json()
            console.error('Error response:', errorData)
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

  const handleQuizRightClick = (e: React.MouseEvent, quizId: string) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      quizId
    })
  }

  const closeContextMenu = () => {
    setContextMenu(null)
  }

  const handleEditQuiz = (quizId: string) => {
    window.location.href = `/admin/quiz-editor?id=${quizId}`
    closeContextMenu()
  }

  const handleDeleteQuiz = (quizId: string, quizTitle: string) => {
    setShowDeleteConfirm({ quizId, quizTitle })
  }

  const confirmDeleteQuiz = async () => {
    if (!showDeleteConfirm) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/quizzes/${showDeleteConfirm.quizId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Remove quiz from local state
        setQuizzes(quizzes.filter(quiz => quiz.id !== showDeleteConfirm.quizId))
        console.log(`Quiz "${showDeleteConfirm.quizTitle}" wurde erfolgreich gelöscht`)
      } else {
        const errorData = await response.json()
        console.error('Fehler beim Löschen des Quizzes:', errorData)
        alert('Fehler beim Löschen des Quizzes. Bitte versuchen Sie es erneut.')
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Quizzes:', error)
      alert('Fehler beim Löschen des Quizzes. Bitte versuchen Sie es erneut.')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(null)
    }
  }

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, language }),
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
      {/* Temporarily disabled for debugging
      {!isAuthenticated && (
        <LoginOverlay onLogin={handleLogin} />
      )}
      */}
      
      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-16">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-orange-300/30 dark:from-orange-500/20 dark:to-orange-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-200/30 to-orange-300/30 dark:from-orange-500/20 dark:to-orange-600/20 rounded-full blur-3xl"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center max-w-6xl mx-auto pt-8">

            {/* Admin Features Section - 5 boxes in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {/* Create Quiz */}
              <Link
                href="/admin/quiz-editor"
                className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-400/70 dark:border-blue-500/70 hover:border-blue-500/90 dark:hover:border-blue-400/90 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
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
                className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-emerald-400/70 dark:border-emerald-500/70 hover:border-emerald-500/90 dark:hover:border-emerald-400/90 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {translations?.admin.features.manageQuestions.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {translations?.admin.features.manageQuestions.description}
                </p>
              </Link>

              {/* View Results */}
              <Link
                href="/admin/results"
                className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-400/70 dark:border-purple-500/70 hover:border-purple-500/90 dark:hover:border-purple-400/90 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
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

              {/* Account Settings */}
              <Link
                href="/admin/account"
                className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-cyan-400/70 dark:border-cyan-500/70 hover:border-cyan-500/90 dark:hover:border-cyan-400/90 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {translations?.admin.accountSettings.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {translations?.admin.accountSettings.subtitle}
                </p>
              </Link>

              {/* User Management */}
              <Link
                href="/admin/users"
                className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-rose-400/70 dark:border-rose-500/70 hover:border-rose-500/90 dark:hover:border-rose-400/90 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  {translations?.admin.userManagement.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {translations?.admin.userManagement.subtitle}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="group bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200/50 dark:border-slate-600/50 hover:border-orange-300/70 dark:hover:border-slate-500/70 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        onContextMenu={(e) => handleQuizRightClick(e, quiz.id)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                              Erstellt: {new Date(quiz.createdAt).toLocaleDateString('de-DE')}
                            </div>
                          </div>
                        </div>
                        
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {quiz.title}
                        </h4>
                        
                        <div className="flex items-center space-x-4 mb-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{quiz._count.modules} Module</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{quiz.participations} Teilnahmen</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/quiz-editor?id=${quiz.id}`}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 text-center text-sm shadow-md hover:shadow-lg"
                          >
                            {translations?.admin.quizList.actions.edit}
                          </Link>
                          <Link
                            href={`/admin/results?id=${quiz.id}`}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 text-center text-sm shadow-md hover:shadow-lg"
                          >
                            {translations?.admin.quizList.actions.results}
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteQuiz(quiz.id, quiz.title)
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200 text-sm flex items-center justify-center shadow-md hover:shadow-lg"
                            title={translations?.admin.quizList.actions.delete || "Quiz löschen"}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
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
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-t border-orange-200/50 dark:border-slate-700/50">
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

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 min-w-[150px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={closeContextMenu}
        >
          <button
            onClick={() => handleEditQuiz(contextMenu.quizId)}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Bearbeiten
          </button>
          <button
            onClick={() => {
              // TODO: Implement duplicate functionality
              closeContextMenu()
            }}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Duplizieren
          </button>
          <button
            onClick={() => {
              // TODO: Implement delete functionality
              closeContextMenu()
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Löschen
          </button>
        </div>
      )}

      {/* Click outside to close context menu */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeContextMenu}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full border-2 border-red-200/50 dark:border-slate-700/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Quiz löschen?
              </h2>
              
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Möchten Sie das Quiz <strong>"{showDeleteConfirm.quizTitle}"</strong> wirklich löschen?
                <br />
                <span className="text-red-600 dark:text-red-400 font-medium">
                  Diese Aktion kann nicht rückgängig gemacht werden!
                </span>
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={confirmDeleteQuiz}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Löschen...
                    </>
                  ) : (
                    'Löschen'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}