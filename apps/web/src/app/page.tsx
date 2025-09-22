'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LandingHeader } from '@/components/landing-header'
import { useApp } from '@/components/app-provider'

interface Quiz {
  id: string
  slug: string
  title: string
  questionsPerRun: number
  allowPublicResult: boolean
  createdAt: string
  participations: number
  _count: {
    questions: number
    attempts: number
  }
}

export default function LandingPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [quizQuestionCounts, setQuizQuestionCounts] = useState<Record<string, number>>({})
  const { translations, language } = useApp()

  // Debug logging
  console.log('LandingPage - language:', language)
  console.log('LandingPage - translations:', translations)
  console.log('LandingPage - translations.home:', translations?.home)
  console.log('LandingPage - translations.home?.subtitle:', translations?.home?.subtitle)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('/api/quizzes')
        if (response.ok) {
          const data = await response.json()
          setQuizzes(data)
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  // Compute number of question/randomQuestion modules per quiz for display
  useEffect(() => {
    if (!quizzes || quizzes.length === 0) return
    let cancelled = false
    const load = async () => {
      try {
        const pairs = await Promise.all(
          quizzes.map(async (q) => {
            try {
              const res = await fetch(`/api/quiz-modules?quizId=${q.id}`)
              if (!res.ok) return [q.id, undefined] as const
              const modules = await res.json()
              const count = Array.isArray(modules)
                ? modules.reduce((acc: number, m: any) => acc + ((m?.type === 'question' || m?.type === 'randomQuestion') ? 1 : 0), 0)
                : undefined
              return [q.id, count] as const
            } catch {
              return [q.id, undefined] as const
            }
          })
        )
        if (cancelled) return
        const map: Record<string, number> = {}
        for (const [id, c] of pairs) if (typeof c === 'number') map[id] = c
        setQuizQuestionCounts(map)
      } catch {
        // ignore
      }
    }
    load()
    return () => { cancelled = true }
  }, [quizzes])

  if (!translations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <LandingHeader />
      
      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-40 pb-16">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-orange-300/30 dark:from-orange-500/20 dark:to-orange-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-200/30 to-orange-300/30 dark:from-orange-500/20 dark:to-orange-600/20 rounded-full blur-3xl"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            {/* Main Title */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 dark:from-orange-400 dark:via-orange-500 dark:to-orange-600 bg-clip-text text-transparent">
                {translations?.common?.quickpoll || "VDMA QuickPoll"}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-2xl sm:text-3xl lg:text-4xl text-slate-600 dark:text-slate-300 mb-12 font-light max-w-3xl mx-auto leading-relaxed">
              {translations?.home?.subtitle || "Create and conduct surveys - simple, fast and anonymous"}
            </p>

            {/* Quiz Section */}
            <div className="max-w-6xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : quizzes && quizzes.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
                  {quizzes.map((quiz) => (
                    <Link
                      key={quiz.id}
                      href={`/q/${quiz.slug}/start`}
                      className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border-2 border-orange-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 w-full sm:w-80 md:w-96 lg:w-80 xl:w-96 max-w-sm flex-shrink-0"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-base text-slate-500 dark:text-slate-400 font-medium">
                          {quiz.participations} {translations?.home?.participations || "Teilnahmen"}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-base mb-6">
                        {(quizQuestionCounts[quiz.id] ?? quiz._count.questions)} {translations?.home?.questions || "Fragen"} • {translations?.home?.perRun || "pro Durchlauf"}
                      </p>
                      <div className="flex items-center text-orange-600 dark:text-orange-400 text-base font-medium group-hover:translate-x-2 transition-transform">
                        {translations?.home?.startQuiz || "Quiz starten"}
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-10 border-2 border-orange-200/50 dark:border-slate-700/50 max-w-lg mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 text-center">
                    {translations?.home?.noQuizzes?.title || "No quizzes available yet"}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-base mb-6 text-center">
                    {translations?.home?.noQuizzes?.description || "No quizzes have been created yet. Log in to create and manage quizzes."}
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 text-base mx-auto"
                  >
                    {translations?.home?.noQuizzes?.loginPrompt || "Login to Create"}
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                {translations?.home?.whyQuickpoll || "Warum Quickpoll?"}
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                {translations?.home?.whyQuickpollSubtitle || "Die einfachste Art, Umfragen zu erstellen und durchzuführen"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-10 border-2 border-blue-200/50 dark:border-blue-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mb-8">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                  {translations?.features?.anonymous?.title || "Anonymous participation"}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  {translations?.features?.anonymous?.description || "Participants can vote anonymously without registration"}
                </p>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-10 border-2 border-green-200/50 dark:border-green-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mb-8">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                  {translations?.common?.poweredBy || "Powered by AI"}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  {translations?.common?.poweredByDescription || "Intelligent surveys with AI support for optimal results"}
                </p>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-10 border-2 border-purple-200/50 dark:border-purple-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mb-8">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                  {translations?.features?.qrStart?.title || "QR Start"}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  {translations?.features?.qrStart?.description || "Easy access via QR code. Perfect for events and presentations."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-t border-orange-200/50 dark:border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  . {language === 'de' ? 'Alle Rechte vorbehalten.' : language === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}
                </div>
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>{translations?.common?.poweredBy || "Powered by AI"}</span>
                  </div>
                  <div className="flex space-x-8">
                    <a href="/impressum" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-base font-medium">
                      {translations?.common?.impressum || "Impressum"}
                    </a>
                    <a href="/datenschutz" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-base font-medium">
                      {translations?.common?.datenschutz || "Datenschutz"}
                    </a>
                  </div>
                </div>
              </div>
          </div>
        </footer>
      </main>
    </div>
  )
}