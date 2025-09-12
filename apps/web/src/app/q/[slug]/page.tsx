'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useApp } from '@/components/app-provider'

interface QuizModule {
  id: string
  type: string
  data: any
  order: number
}

interface Quiz {
  id: string
  title: string
  slug: string
  isActive: boolean
  languages: string
}

export default function QuizDisplayPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [modules, setModules] = useState<QuizModule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState('de')
  const { translations, language } = useApp()
  const params = useParams()
  const quizSlug = params.slug as string

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        // Load quiz data
        const quizResponse = await fetch(`/api/quizzes/slug/${quizSlug}`)
        if (quizResponse.ok) {
          const quizData = await quizResponse.json()
          setQuiz(quizData)
          
          // Load quiz modules
          const modulesResponse = await fetch(`/api/quiz-modules?quizId=${quizData.id}`)
          if (modulesResponse.ok) {
            const modulesData = await modulesResponse.json()
            setModules(modulesData.sort((a: QuizModule, b: QuizModule) => a.order - b.order))
          }
        }
      } catch (error) {
        console.error('Error loading quiz:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (quizSlug) {
      loadQuiz()
    }
  }, [quizSlug])

  // Helper function to get text in current language
  const getTextInLanguage = (textData: any): string => {
    if (typeof textData === 'string') {
      return textData
    }
    if (typeof textData === 'object' && textData !== null) {
      return textData[currentLanguage] || textData.de || textData.en || textData.fr || ''
    }
    return ''
  }

  // Helper function to get answers in current language
  const getAnswersInLanguage = (answersData: any): string[] => {
    if (Array.isArray(answersData)) {
      return answersData
    }
    if (typeof answersData === 'object' && answersData !== null) {
      return answersData[currentLanguage] || answersData.de || answersData.en || answersData.fr || []
    }
    return []
  }

  const renderModule = (module: QuizModule) => {
    switch (module.type) {
      case 'title':
        const titleData = module.data
        const titleText = getTextInLanguage(titleData.text)
        const titleDescription = getTextInLanguage(titleData.description)
        const titleLevel = titleData.level || 'h1'
        
        return (
          <div key={module.id} className="text-center mb-8">
            {titleLevel === 'h1' && (
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                {titleText}
              </h1>
            )}
            {titleLevel === 'h2' && (
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {titleText}
              </h2>
            )}
            {titleLevel === 'h3' && (
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {titleText}
              </h3>
            )}
            {titleDescription && (
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {titleDescription}
              </p>
            )}
          </div>
        )

      case 'text':
        const textContent = getTextInLanguage(module.data.content)
        return (
          <div key={module.id} className="mb-6">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200/50 dark:border-slate-700/50">
              <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                {textContent}
              </p>
            </div>
          </div>
        )

      case 'question':
        const questionData = module.data
        const questionText = getTextInLanguage(questionData.question)
        const answers = getAnswersInLanguage(questionData.answers)
        
        return (
          <div key={module.id} className="mb-8">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-orange-200/50 dark:border-slate-700/50">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                {questionText}
              </h3>
              <div className="space-y-3">
                {answers.map((answer, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/40 dark:bg-slate-700/40 rounded-lg">
                    <div className="w-5 h-5 border-2 border-orange-400 rounded-full bg-white dark:bg-slate-700"></div>
                    <span className="text-slate-700 dark:text-slate-300">{answer}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'randomQuestion':
        const randomData = module.data
        return (
          <div key={module.id} className="mb-6">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200/50 dark:border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {translations?.admin?.quizDisplay?.randomQuestion || "Zufällige Frage"}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {translations?.admin?.quizDisplay?.fromStack || "Aus Fragenstapel"}: {randomData.stackName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'pageBreak':
        return (
          <div key={module.id} className="my-8">
            <div className="flex items-center justify-center">
              <div className="w-full h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {translations?.admin?.quizDisplay?.notFound?.title || "Quiz nicht gefunden"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {translations?.admin?.quizDisplay?.notFound?.description || "Das angeforderte Quiz konnte nicht gefunden werden."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 border border-orange-200/50 dark:border-slate-700/50">
          <div className="flex space-x-2">
            {['de', 'en', 'fr'].map((lang) => (
              <button
                key={lang}
                onClick={() => setCurrentLanguage(lang)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentLanguage === lang
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-orange-500'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Quiz Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {quiz.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-slate-600 dark:text-slate-400">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {translations?.admin?.quizDisplay?.title || "Quiz-Vorschau"}
            </span>
          </div>
        </div>

        {/* Quiz Modules */}
        <div className="space-y-6">
          {modules.map((module) => renderModule(module))}
        </div>

        {/* Start Quiz Button */}
        <div className="text-center mt-12">
          <a
            href={`/q/${quiz.slug}/start`}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
{translations?.admin?.quizDisplay?.startQuiz || "Quiz starten"}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
