'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useApp } from '@/components/app-provider'
import { Button, Card } from '@/components/ui'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { CongratulationsAnimation } from '@/components/congratulations-animation'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

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

interface QuizPage {
  modules: QuizModule[]
  pageNumber: number
}

// Random Question Module Component - Verwendet vorab geladene Fragen
const RandomQuestionModule = React.memo(({ module, answers, setAnswers }: { 
  module: QuizModule, 
  answers: {[key: string]: any}, 
  setAnswers: (answers: {[key: string]: any}) => void 
}) => {
  const randomData = module.data
  const randomQuestion = randomData.preloadedQuestion

  console.log('🎲 RandomQuestion: Rendering module with preloaded question:', !!randomQuestion)
  console.log('🎲 RandomQuestion: Question data:', randomQuestion)

  if (!randomQuestion) {
    return (
      <div className="mb-6">
        <div className="bg-white/40 dark:bg-slate-700/40 rounded-2xl p-6 border border-orange-200/30 dark:border-slate-600/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                Keine Fragen verfügbar
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Fragenstapel "{randomData.stackName}" ist leer
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Parse answers safely
  let parsedAnswers: string[] = []
  try {
    if (typeof randomQuestion.answers === 'string') {
      parsedAnswers = JSON.parse(randomQuestion.answers)
    } else if (Array.isArray(randomQuestion.answers)) {
      parsedAnswers = randomQuestion.answers
    } else {
      console.error('🎲 RandomQuestion: Invalid answers format:', randomQuestion.answers)
      parsedAnswers = []
    }
  } catch (error) {
    console.error('🎲 RandomQuestion: Error parsing answers:', error)
    parsedAnswers = []
  }

  console.log('🎲 RandomQuestion: Parsed answers:', parsedAnswers)

  return (
    <div className="mb-6">
      <div className="bg-white/40 dark:bg-slate-700/40 rounded-2xl p-6 border border-orange-200/30 dark:border-slate-600/30">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {randomQuestion.question}
          </h3>
          
          <div className="space-y-3">
            {parsedAnswers.length > 0 ? parsedAnswers.map((answer: string, index: number) => (
              <button
                key={index}
                onClick={() => {
                  console.log('🖱️ RandomQuestion: Answer clicked:', { moduleId: module.id, answerIndex: index, answer })
                  setAnswers(prev => ({
                    ...prev,
                    [module.id]: index
                  }))
                }}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                  answers[module.id] === index
                    ? 'bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-400 dark:border-orange-500'
                    : 'bg-white/60 dark:bg-slate-600/60 border-2 border-slate-200 dark:border-slate-500 hover:border-orange-300 dark:hover:border-orange-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 border-2 rounded-full ${
                    answers[module.id] === index
                      ? 'border-orange-400 bg-orange-400'
                      : 'border-slate-400 dark:border-slate-500'
                  }`}>
                    {answers[module.id] === index && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">{answer}</span>
                </div>
              </button>
            )) : (
              <div className="text-center text-slate-500 dark:text-slate-400 py-4">
                Keine Antworten verfügbar
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

export default function QuizExecutionPage() {
  const params = useParams()
  const router = useRouter()
  const quizSlug = params.slug as string
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [quizPages, setQuizPages] = useState<QuizPage[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState<{[key: string]: any}>({})
  const [isLoading, setIsLoading] = useState(true)
  const [showCongratulations, setShowCongratulations] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { translations, language } = useApp()

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark')
      if (isDark) {
        document.documentElement.style.colorScheme = 'dark'
      } else {
        document.documentElement.style.colorScheme = 'light'
      }
    }

    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => checkTheme()
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Helper function to get text in current language
  const getTextInLanguage = (textData: any): string => {
    if (typeof textData === 'string') {
      return textData
    }
    if (typeof textData === 'object' && textData !== null) {
      return textData[language] || textData.de || textData.en || textData.fr || ''
    }
    return ''
  }

  // Helper function to get answers in current language
  const getAnswersInLanguage = (answersData: any): string[] => {
    if (Array.isArray(answersData)) {
      return answersData
    }
    if (typeof answersData === 'object' && answersData !== null) {
      return answersData[language] || answersData.de || answersData.en || answersData.fr || []
    }
    return []
  }

  // Load quiz data and split into pages
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        console.log('🔍 Quiz: Starting quiz load process...')
        
        // Load quiz data
        const quizResponse = await fetch(`/api/quizzes/slug/${quizSlug}`)
        if (quizResponse.ok) {
          const quizData = await quizResponse.json()
          setQuiz(quizData)
          console.log('✅ Quiz: Quiz data loaded:', quizData.title)
          
          // Load quiz modules
          const modulesResponse = await fetch(`/api/quiz-modules?quizId=${quizData.id}`)
          if (modulesResponse.ok) {
            const modules = await modulesResponse.json()
            const sortedModules = modules.sort((a: QuizModule, b: QuizModule) => a.order - b.order)
            
            console.log('📊 Quiz: Found modules:', sortedModules.length)
            
            // Preload all random questions to avoid duplicates
            const randomModules = sortedModules.filter(module => module.type === 'randomQuestion')
            console.log('🎲 Quiz: Found random modules:', randomModules.length)
            
            if (randomModules.length > 0) {
              console.log('🔄 Quiz: Preloading random questions...')
              
              // Group random modules by stackId to get unique questions per stack
              const stackGroups = randomModules.reduce((groups: {[key: string]: QuizModule[]}, module) => {
                const stackId = module.data.stackId
                if (!groups[stackId]) {
                  groups[stackId] = []
                }
                groups[stackId].push(module)
                return groups
              }, {})
              
              console.log('📚 Quiz: Stack groups:', Object.keys(stackGroups))
              
              // Load unique questions for each stack
              const preloadedQuestions: {[key: string]: any[]} = {}
              
              for (const [stackId, modules] of Object.entries(stackGroups)) {
                try {
                  console.log(`🔍 Quiz: Loading questions for stack ${stackId}...`)
                  const response = await fetch(`/api/random-question?stackId=${stackId}&count=${modules.length}`)
                  if (response.ok) {
                    const data = await response.json()
                    preloadedQuestions[stackId] = data.questions || []
                    console.log(`✅ Quiz: Loaded ${preloadedQuestions[stackId].length} questions for stack ${stackId}`)
                  }
                } catch (error) {
                  console.error(`❌ Quiz: Error loading questions for stack ${stackId}:`, error)
                  preloadedQuestions[stackId] = []
                }
              }
              
              // Assign preloaded questions to modules
              let questionIndex = 0
              for (const module of randomModules) {
                const stackId = module.data.stackId
                const questions = preloadedQuestions[stackId] || []
                
                if (questions.length > 0 && questionIndex < questions.length) {
                  module.data.preloadedQuestion = questions[questionIndex]
                  // Speichere auch die Frage-ID für die spätere Bewertung
                  module.data.usedQuestionId = questions[questionIndex].id
                  questionIndex++
                  console.log(`🎯 Quiz: Assigned question ${questionIndex} to module ${module.id}`)
                }
              }
            }
            
            // Split modules into pages based on pageBreak modules
            const pages: QuizPage[] = []
            let currentPageModules: QuizModule[] = []
            let pageNumber = 1
            
            for (const module of sortedModules) {
              if (module.type === 'pageBreak') {
                if (currentPageModules.length > 0) {
                  pages.push({
                    modules: currentPageModules,
                    pageNumber: pageNumber
                  })
                  currentPageModules = []
                  pageNumber++
                }
              } else {
                currentPageModules.push(module)
              }
            }
            
            // Add the last page if it has modules
            if (currentPageModules.length > 0) {
              pages.push({
                modules: currentPageModules,
                pageNumber: pageNumber
              })
            }
            
            console.log('📄 Quiz: Created pages:', pages.length)
            setQuizPages(pages)
          }
        }
      } catch (error) {
        console.error('❌ Quiz: Error loading quiz:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (quizSlug) {
      loadQuiz()
    }
  }, [quizSlug])

  // Handle answer selection - Stabilisiert mit useCallback
  const handleAnswerSelect = React.useCallback((moduleId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [moduleId]: answerIndex
    }))
  }, [setAnswers])

  // Navigate to next page
  const goToNextPage = () => {
    if (currentPage < quizPages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Navigate to previous page
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Submit quiz
  const handleSubmitQuiz = async () => {
    try {
      setIsSubmitted(true)
      
      // Quiz an Server senden
      const response = await fetch(`/api/quizzes/submit/${quizSlug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: answers
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Quiz erfolgreich abgegeben:', result)
        
        // Speichere die attemptId für die Weiterleitung
        if (result.attemptId) {
          localStorage.setItem('lastAttemptId', result.attemptId)
        }
        
        setShowCongratulations(true)
      } else {
        console.error('Fehler beim Abgeben des Quiz')
        setIsSubmitted(false)
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      setIsSubmitted(false)
    }
  }

  // Handle animation completion
  const handleAnimationComplete = () => {
    setShowCongratulations(false)
    // Weiterleitung zur Ergebnis-Seite
    if (quizSlug) {
      // Hole die attemptId aus der letzten Submit-Response
      const attemptId = localStorage.getItem('lastAttemptId')
      if (attemptId) {
        window.location.href = `/q/${quizSlug}/results?attemptId=${attemptId}`
      } else {
        // Fallback zur Startseite
        window.location.href = '/'
      }
    }
  }

  // Helper function to format page counter text
  const formatPageCounter = (current: number, total: number): string => {
    const template = translations?.admin?.quizExecution?.pageCounter || "Seite {current} von {total}"
    return template.replace('{current}', (current + 1).toString()).replace('{total}', total.toString())
  }

  // Render a single module
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
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {titleText}
              </h1>
            )}
            {titleLevel === 'h2' && (
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {titleText}
              </h2>
            )}
            {titleLevel === 'h3' && (
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {titleText}
              </h3>
            )}
            {titleDescription && (
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {titleDescription}
              </p>
            )}
          </div>
        )

      case 'question':
        const questionData = module.data
        const questionText = getTextInLanguage(questionData.question)
        const questionAnswers = getAnswersInLanguage(questionData.answers)
        const selectedAnswerIndex = answers[module.id] // This is the selected answer index from state
        
        console.log('🔍 Quiz: Rendering question module:', module.id)
        console.log('🔍 Quiz: Question text:', questionText)
        console.log('🔍 Quiz: Available answers:', questionAnswers)
        console.log('🔍 Quiz: Selected answer index:', selectedAnswerIndex)
        console.log('🔍 Quiz: All answers state:', answers)
        
        return (
          <div key={module.id} className="mb-8">
            <div className="bg-white/40 dark:bg-slate-700/40 rounded-2xl p-6 border border-orange-200/30 dark:border-slate-600/30">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                {questionText}
              </h3>
              <div className="space-y-3">
                {questionAnswers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      console.log('🖱️ Quiz: Answer clicked:', { moduleId: module.id, answerIndex: index, answer })
                      handleAnswerSelect(module.id, index)
                    }}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      selectedAnswerIndex === index
                        ? 'bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-400 dark:border-orange-500'
                        : 'bg-white/60 dark:bg-slate-600/60 border-2 border-slate-200 dark:border-slate-500 hover:border-orange-300 dark:hover:border-orange-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 border-2 rounded-full ${
                        selectedAnswerIndex === index
                          ? 'border-orange-400 bg-orange-400'
                          : 'border-slate-400 dark:border-slate-500'
                      }`}>
                        {selectedAnswerIndex === index && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{answer}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'randomQuestion':
        return <RandomQuestionModule key={module.id} module={module} answers={answers} setAnswers={setAnswers} />

      default:
        return null
    }
  }

  if (isLoading || !translations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Lade Quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {translations?.admin?.quizExecution?.notFound?.title || "Quiz nicht gefunden"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {translations?.admin?.quizExecution?.notFound?.description || "Das angeforderte Quiz konnte nicht gefunden werden."}
          </p>
          <Link href="/" className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            Zur Startseite
          </Link>
        </div>
      </div>
    )
  }

  const currentPageData = quizPages[currentPage]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-orange-200/30 dark:border-slate-700/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/light-logo.svg"
                  alt="Quickpoll Logo"
                  width={32}
                  height={32}
                  className="dark:hidden"
                />
                <Image
                  src="/dark-logo.svg"
                  alt="Quickpoll Logo"
                  width={32}
                  height={32}
                  className="hidden dark:block"
                />
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  VDMA Quickpoll
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {getTextInLanguage(quiz.title)}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {formatPageCounter(currentPage, quizPages.length)}
            </p>
          </div>

          {/* Quiz Content */}
          <div className="bg-white/40 dark:bg-slate-700/40 rounded-2xl p-8 border border-orange-200/30 dark:border-slate-600/30 mb-8">
            {currentPageData?.modules.map(renderModule)}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              variant="outline"
              className="flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {translations?.admin?.quizExecution?.backButton || "Zurück"}
            </Button>

            <div className="flex space-x-2">
              {quizPages.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentPage
                      ? 'bg-orange-500'
                      : index < currentPage
                      ? 'bg-green-500'
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>

            {currentPage === quizPages.length - 1 ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={isSubmitted}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {translations?.admin?.quizExecution?.submitButton || "Abgeben"}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </Button>
            ) : (
              <Button
                onClick={goToNextPage}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {translations?.admin?.quizExecution?.nextButton || "Weiter"}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Glückwunsch-Animation */}
      <CongratulationsAnimation
        isVisible={showCongratulations}
        onComplete={handleAnimationComplete}
        congratulationsText={translations?.admin?.quizExecution?.congratulations || "Glückwunsch!"}
        completedText={translations?.admin?.quizExecution?.quizCompleted || "Quiz erfolgreich abgeschlossen!"}
      />
    </div>
  )
}