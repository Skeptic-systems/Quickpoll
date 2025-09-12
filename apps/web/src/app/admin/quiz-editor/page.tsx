'use client'

import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { AdminHeader } from '@/components/admin-header'
import { useApp } from '@/components/app-provider'
import Link from 'next/link'

interface QuestionModule {
  id: string
  type: 'question'
  question: string
  answers: string[]
  correctAnswers: string[]
  questionType: 'single' | 'multiple'
}

interface TextModule {
  id: string
  type: 'text'
  content: string
}

interface TitleModule {
  id: string
  type: 'title'
  text: string
  description: string
  level: 'h1' | 'h2' | 'h3'
}

interface RandomQuestionModule {
  id: string
  type: 'randomQuestion'
  stackId: string
  stackName: string
}

interface PageBreakModule {
  id: string
  type: 'pageBreak'
}

type QuizModule = QuestionModule | TextModule | TitleModule | RandomQuestionModule | PageBreakModule

interface Module {
  id: string
  type: 'question' | 'text' | 'title' | 'randomQuestion' | 'pageBreak'
  title: string
  icon: React.ReactNode
  description: string
}

export default function QuizEditorPage() {
  const [quizName, setQuizName] = useState('')
  const [modules, setModules] = useState<QuizModule[]>([])
  const [questionStacks, setQuestionStacks] = useState<{id: string, name: string}[]>([])
  const [questionStacksLoaded, setQuestionStacksLoaded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [qrCodeDataURL, setQrCodeDataURL] = useState('')
  const [qrCodeDownloadURL, setQrCodeDownloadURL] = useState('')
  const [quizUrl, setQuizUrl] = useState('')
  const [quizTitle, setQuizTitle] = useState('')
  const [isQuizSaved, setIsQuizSaved] = useState(false)
  const [isEditingExistingQuiz, setIsEditingExistingQuiz] = useState(false)
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null)
  const { translations, language } = useApp()
  const [draggedModule, setDraggedModule] = useState<Module | null>(null)

  // Helper function to extract text in current language
  const getTextInLanguage = (textData: any, currentLang: string = 'de'): string => {
    if (typeof textData === 'string') {
      return textData
    }
    if (typeof textData === 'object' && textData !== null) {
      return textData[currentLang] || textData.de || textData.en || textData.fr || ''
    }
    return ''
  }

  // Helper function to extract answers in current language
  const getAnswersInLanguage = (answersData: any, currentLang: string = 'de'): string[] => {
    if (Array.isArray(answersData)) {
      return answersData
    }
    if (typeof answersData === 'object' && answersData !== null) {
      return answersData[currentLang] || answersData.de || answersData.en || answersData.fr || []
    }
    return []
  }

  // Function to generate QR code
  const generateQRCode = async (url: string, showModal: boolean = false) => {
    try {
      console.log('🔄 Generating QR code for URL:', url)
      
      const response = await fetch('/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ QR code generated successfully')
        
        setQrCodeDataURL(result.qrCodeDataURL)
        setQrCodeDownloadURL(result.qrCodeDownloadURL)
        setQuizUrl(result.url || url)
        setQuizTitle(quizName)
        setIsQuizSaved(true)
        
        if (showModal) {
          setShowQRCode(true)
        }
      } else {
        const errorData = await response.json()
        console.error('❌ Failed to generate QR code:', errorData)
      }
    } catch (error) {
      console.error('❌ Error generating QR code:', error)
    }
  }

  // Function to download QR code as PNG
  const downloadQRCode = () => {
    if (!qrCodeDownloadURL) {
      console.error('❌ No QR code download URL available')
      return
    }
    
    const link = document.createElement('a')
    link.href = qrCodeDownloadURL
    const fileName = quizTitle 
      ? `${quizTitle.toLowerCase().replace(/\s+/g, '-')}-qr-code.png`
      : 'quiz-qr-code.png'
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    console.log('📥 QR code downloaded:', fileName)
  }

  // Function to show QR code modal
  const showQRCodeModal = async () => {
    try {
      console.log('🔘 Showing QR Code Modal')
      console.log('🔍 Debug Info:', {
        quizName,
        quizTitle,
        currentQuizId,
        isEditingExistingQuiz,
        isQuizSaved,
        quizUrl
      })
      
      // Use existing quiz URL if available, otherwise generate it
      let finalQuizUrl = quizUrl
      
      if (!finalQuizUrl || finalQuizUrl.includes('//start')) {
        // Fallback: generate URL from quiz name or fetch from DB
        let quizSlug = ''
        
        if (isEditingExistingQuiz && currentQuizId) {
          // Try to fetch the quiz again to get the slug
          try {
            const response = await fetch(`/api/quizzes/${currentQuizId}`)
            if (response.ok) {
              const quiz = await response.json()
              quizSlug = quiz.slug
              console.log('📥 Re-fetched quiz slug:', quizSlug)
            }
          } catch (error) {
            console.error('❌ Error re-fetching quiz:', error)
          }
        }
        
        // If still no slug, use quiz name
        if (!quizSlug && quizName) {
          quizSlug = quizName.toLowerCase().replace(/\s+/g, '-')
          console.log('📝 Generated slug from quiz name:', quizSlug)
        }
        
        finalQuizUrl = `${window.location.origin}/q/${quizSlug}/start`
        console.log('⚠️ Generated final quiz URL:', finalQuizUrl)
      }
      
      console.log('🔗 Using Quiz URL:', finalQuizUrl)
      
      // Always generate a fresh QR code
      await generateQRCode(finalQuizUrl, true)
      
    } catch (error) {
      console.error('❌ Error showing QR code modal:', error)
    }
  }

  // Load question stacks on component mount
  useEffect(() => {
    const fetchQuestionStacks = async () => {
      try {
        const response = await fetch('/api/question-stacks')
        console.log('Question stacks response status:', response.status)
        if (response.ok) {
          const data = await response.json()
          console.log('Question stacks data:', data)
          console.log('Question stacks array:', data.questionStacks)
          console.log('Question stacks length:', data.questionStacks?.length)
          setQuestionStacks(data.questionStacks || [])
          setQuestionStacksLoaded(true)
          console.log('Question stacks state updated:', data.questionStacks || [])
        } else {
          console.error('Failed to fetch question stacks:', response.status)
        }
      } catch (error) {
        console.error('Error loading question stacks:', error)
      }
    }
    
    fetchQuestionStacks()
  }, [])

  // Load existing quiz if editing
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const quizId = urlParams.get('id')
    
    console.log('🔍 Quiz Editor Debug:')
    console.log('- URL:', window.location.href)
    console.log('- Search params:', window.location.search)
    console.log('- Quiz ID from URL:', quizId)
    
    if (quizId) {
      setIsEditingExistingQuiz(true)
      const loadQuiz = async () => {
        try {
          console.log('📥 Loading quiz with ID:', quizId)
          
          // Load quiz modules first
          const response = await fetch(`/api/quiz-modules?quizId=${quizId}`)
          console.log('- Modules response status:', response.status)
          
          if (response.ok) {
            const modules = await response.json()
            console.log('- Loaded modules:', modules.length, 'modules')
            
            // Convert database modules to editor format
            const editorModules = modules.map((module: any) => {
              const moduleData = module.data
              return {
                id: module.id,
                type: module.type,
                // Extract text in current language for editing
                ...(module.type === 'question' && {
                  question: getTextInLanguage(moduleData.question, language),
                  answers: getAnswersInLanguage(moduleData.answers, language),
                  correctAnswers: moduleData.correctAnswers || [],
                  questionType: moduleData.questionType || 'single'
                }),
                ...(module.type === 'text' && {
                  content: getTextInLanguage(moduleData.content, language)
                }),
                ...(module.type === 'title' && {
                  text: getTextInLanguage(moduleData.text, language),
                  description: getTextInLanguage(moduleData.description, language),
                  level: moduleData.level
                }),
                ...(module.type === 'randomQuestion' && {
                  stackId: moduleData.stackId,
                  stackName: moduleData.stackName
                }),
                ...(module.type === 'pageBreak' && {})
              }
            })
            setModules(editorModules)
            console.log('- Set modules:', editorModules.length, 'modules')
            
            // Load quiz title and set QR code status
            const quizResponse = await fetch(`/api/quizzes/${quizId}`)
            console.log('- Quiz response status:', quizResponse.status)
            
            if (quizResponse.ok) {
              const quiz = await quizResponse.json()
              console.log('- Loaded quiz:', quiz)
              console.log('- Quiz title:', quiz.title)
              console.log('- Quiz slug:', quiz.slug)
              
              setQuizName(quiz.title)
              setQuizTitle(quiz.title)
              setCurrentQuizId(quizId)
              setIsQuizSaved(true)
              
              // Store the quiz slug for QR code generation
              const quizSlug = quiz.slug || quiz.title.toLowerCase().replace(/\s+/g, '-')
              const quizUrl = `${window.location.origin}/q/${quizSlug}/start`
              setQuizUrl(quizUrl)
              
              console.log('✅ Quiz loaded successfully:')
              console.log('- Quiz name set to:', quiz.title)
              console.log('- Quiz slug:', quiz.slug)
              console.log('- Generated quiz URL:', quizUrl)
              console.log('- Quiz saved status:', true)
              console.log('- Quiz ID:', quizId)
              console.log('- Current quizUrl state:', quizUrl)
            } else {
              console.error('❌ Failed to load quiz:', quizResponse.status)
            }
          } else {
            console.error('❌ Failed to load modules:', response.status)
          }
        } catch (error) {
          console.error('❌ Error loading quiz:', error)
        }
      }
      
      loadQuiz()
    } else {
      console.log('ℹ️ No quiz ID found in URL - creating new quiz')
    }
  }, [])

  const availableModules: Module[] = [
    {
      id: 'question',
      type: 'question',
      title: translations?.admin.quizEditor.modules.question.title || 'Frage',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: translations?.admin.quizEditor.modules.question.description || 'Erstelle eine Frage mit Antworten'
    },
    {
      id: 'text',
      type: 'text',
      title: translations?.admin.quizEditor.modules.text.title || 'Text',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ),
      description: translations?.admin.quizEditor.modules.text.description || 'Füge Text hinzu'
    },
    {
      id: 'title',
      type: 'title',
      title: translations?.admin.quizEditor.modules.heading.title || 'Überschrift',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ),
      description: translations?.admin.quizEditor.modules.heading.description || 'Füge eine Überschrift hinzu'
    },
    {
      id: 'randomQuestion',
      type: 'randomQuestion',
      title: translations?.admin.quizEditor.modules.randomQuestion.title || 'Zufällige Frage',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: translations?.admin.quizEditor.modules.randomQuestion.description || 'Wähle eine zufällige Frage aus einem Fragenstapel'
    },
    {
      id: 'pageBreak',
      type: 'pageBreak',
      title: translations?.admin.quizEditor.modules.pageBreak.title || 'Seitenumbruch',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      description: translations?.admin.quizEditor.modules.pageBreak.description || 'Markiert das Ende einer Quiz-Seite'
    }
  ]

  const handleDragStart = (e: React.DragEvent, module: Module) => {
    setDraggedModule(module)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedModule) return

    const newModule: QuizModule = {
      id: `${draggedModule.type}-${Date.now()}`,
      type: draggedModule.type,
      ...(draggedModule.type === 'question' && {
        question: '',
        answers: [''],
        correctAnswers: [],
        questionType: 'single' as const
      }),
      ...(draggedModule.type === 'text' && {
        content: ''
      }),
      ...(draggedModule.type === 'title' && {
        text: '',
        description: '',
        level: 'h1' as const
      }),
      ...(draggedModule.type === 'randomQuestion' && {
        stackId: '',
        stackName: ''
      }),
      ...(draggedModule.type === 'pageBreak' && {})
    } as QuizModule

    setModules([...modules, newModule])
    setDraggedModule(null)
  }

  const updateModule = (id: string, updates: Partial<QuizModule>) => {
    setModules(modules.map(module => 
      module.id === id ? { ...module, ...updates } as QuizModule : module
    ))
  }

  const removeModule = (id: string) => {
    setModules(modules.filter(module => module.id !== id))
  }

  const moveModuleUp = (index: number) => {
    if (index > 0) {
      const newModules = [...modules]
      const temp = newModules[index]
      newModules[index] = newModules[index - 1]
      newModules[index - 1] = temp
      setModules(newModules)
    }
  }

  const moveModuleDown = (index: number) => {
    if (index < modules.length - 1) {
      const newModules = [...modules]
      const temp = newModules[index]
      newModules[index] = newModules[index + 1]
      newModules[index + 1] = temp
      setModules(newModules)
    }
  }

  const addAnswer = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId) as QuestionModule
    if (module) {
      updateModule(moduleId, { 
        answers: [...module.answers, ''],
        correctAnswers: [...module.correctAnswers]
      })
    }
  }

  const removeAnswer = (moduleId: string, answerIndex: number) => {
    const module = modules.find(m => m.id === moduleId) as QuestionModule
    if (module && module.answers.length > 1) {
      const newAnswers = module.answers.filter((_, index) => index !== answerIndex)
      const newCorrectAnswers = module.correctAnswers.filter(answer => answer !== module.answers[answerIndex])
      updateModule(moduleId, { 
        answers: newAnswers,
        correctAnswers: newCorrectAnswers
      })
    }
  }

  const updateAnswer = (moduleId: string, answerIndex: number, value: string) => {
    const module = modules.find(m => m.id === moduleId) as QuestionModule
    if (module) {
      const newAnswers = [...module.answers]
      newAnswers[answerIndex] = value
      updateModule(moduleId, { answers: newAnswers })
    }
  }

  const toggleCorrectAnswer = (moduleId: string, answer: string) => {
    const module = modules.find(m => m.id === moduleId) as QuestionModule
    if (module) {
      const isCorrect = module.correctAnswers.includes(answer)
      let newCorrectAnswers: string[]
      
      if (module.questionType === 'single') {
        // Bei Single Choice: Nur eine Antwort kann richtig sein
        newCorrectAnswers = isCorrect ? [] : [answer]
      } else {
        // Bei Multiple Choice: Mehrere Antworten können richtig sein
        newCorrectAnswers = isCorrect 
          ? module.correctAnswers.filter(a => a !== answer)
          : [...module.correctAnswers, answer]
      }
      
      updateModule(moduleId, { correctAnswers: newCorrectAnswers })
    }
  }

  // Helper function to convert editor modules to multilingual format for saving
  const convertModulesForSaving = (editorModules: QuizModule[]): any[] => {
    return editorModules.map(module => {
      const moduleData: any = {}
      
      if (module.type === 'question') {
        const questionModule = module as QuestionModule
        moduleData.question = questionModule.question
        moduleData.answers = questionModule.answers
        moduleData.correctAnswers = questionModule.correctAnswers
        moduleData.questionType = questionModule.questionType
      } else if (module.type === 'text') {
        const textModule = module as TextModule
        moduleData.content = textModule.content
      } else if (module.type === 'title') {
        const titleModule = module as TitleModule
        moduleData.text = titleModule.text
        moduleData.description = titleModule.description
        moduleData.level = titleModule.level
      } else if (module.type === 'randomQuestion') {
        const randomModule = module as RandomQuestionModule
        moduleData.stackId = randomModule.stackId
        moduleData.stackName = randomModule.stackName
      }
      
      return {
        type: module.type,
        data: moduleData
      }
    })
  }

  const renderModule = (module: QuizModule, index: number) => {
    const commonHeader = (
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {availableModules.find(m => m.type === module.type)?.title}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => moveModuleUp(index)}
            disabled={index === 0}
            className="p-2 h-8 w-8 bg-white/60 dark:bg-slate-700/60 hover:bg-white/80 dark:hover:bg-slate-600/60 rounded-lg border border-slate-200/50 dark:border-slate-600/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={() => moveModuleDown(index)}
            disabled={index === modules.length - 1}
            className="p-2 h-8 w-8 bg-white/60 dark:bg-slate-700/60 hover:bg-white/80 dark:hover:bg-slate-600/60 rounded-lg border border-slate-200/50 dark:border-slate-600/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={() => removeModule(module.id)}
            className="p-2 h-8 w-8 bg-red-50/60 dark:bg-red-900/20 hover:bg-red-100/80 dark:hover:bg-red-800/30 rounded-lg border border-red-200/50 dark:border-red-700/50 transition-all duration-200 text-red-600 dark:text-red-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    )

    switch (module.type) {
      case 'question':
        return (
          <div key={module.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200/50 dark:border-slate-700/50 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
            {commonHeader}
            <div className="space-y-4">
              <input
                type="text"
                value={module.question}
                onChange={(e) => updateModule(module.id, { question: e.target.value })}
                className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200"
                placeholder={translations?.admin.quizEditor.placeholders.question || "Frage eingeben..."}
              />
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`questionType-${module.id}`}
                    checked={module.questionType === 'single'}
                    onChange={() => updateModule(module.id, { 
                      questionType: 'single',
                      correctAnswers: module.correctAnswers.slice(0, 1) // Nur erste richtige Antwort behalten
                    })}
                    className="w-5 h-5 text-orange-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Einfachauswahl</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`questionType-${module.id}`}
                    checked={module.questionType === 'multiple'}
                    onChange={() => updateModule(module.id, { questionType: 'multiple' })}
                    className="w-5 h-5 text-orange-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Mehrfachauswahl</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{translations?.admin.quizEditor.placeholders.answer || "Antworten:"}</span>
                  <button
                    onClick={() => addAnswer(module.id)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 text-sm flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {translations?.admin.quizEditor.actions.addAnswer || "Antwort hinzufügen"}
                  </button>
                </div>
                {module.answers.map((answer, answerIndex) => {
                  const isCorrect = module.correctAnswers.includes(answer)
                  return (
                    <div key={answerIndex} className="flex items-center space-x-3 p-3 bg-white/40 dark:bg-slate-700/40 rounded-xl border border-orange-200/30 dark:border-slate-600/30">
                      {/* Klickbarer Bereich für richtige Antwort */}
                      <button
                        onClick={() => toggleCorrectAnswer(module.id, answer)}
                        className={`flex-shrink-0 w-6 h-6 border-2 transition-all duration-200 ${
                          module.questionType === 'single' ? 'rounded-full' : 'rounded-lg'
                        } ${
                          isCorrect 
                            ? 'border-green-500 bg-green-500' 
                            : 'border-orange-400 hover:border-orange-500'
                        }`}
                      >
                        {isCorrect && (
                          module.questionType === 'single' ? (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-2"></div>
                          ) : (
                            <svg className="w-4 h-4 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )
                        )}
                      </button>
                      
                      {/* Antwort-Input */}
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => updateAnswer(module.id, answerIndex, e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200"
                        placeholder={`${translations?.admin.quizEditor.placeholders.answer || "Antwort"} ${answerIndex + 1}`}
                      />
                      
                      {/* Entfernen-Button */}
                      {module.answers.length > 1 && (
                        <button
                          onClick={() => removeAnswer(module.id, answerIndex)}
                          className="p-2 h-8 w-8 bg-red-50/60 dark:bg-red-900/20 hover:bg-red-100/80 dark:hover:bg-red-800/30 rounded-lg border border-red-200/50 dark:border-red-700/50 transition-all duration-200 text-red-600 dark:text-red-400"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )

      case 'text':
        return (
          <div key={module.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200/50 dark:border-slate-700/50 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
            {commonHeader}
            <textarea
              value={module.content}
              onChange={(e) => updateModule(module.id, { content: e.target.value })}
              className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200 min-h-[120px] resize-y"
              placeholder={translations?.admin.quizEditor.placeholders.text || "Text eingeben..."}
            />
          </div>
        )

      case 'title':
        return (
          <div key={module.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200/50 dark:border-slate-700/50 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
            {commonHeader}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600 dark:text-slate-400">{translations?.admin.quizEditor.options.headingSize || "Größe:"}</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={module.level === 'h1'}
                    onChange={() => updateModule(module.id, { level: 'h1' })}
                    className="text-orange-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{translations?.admin.quizEditor.options.h1 || "H1 (Groß)"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={module.level === 'h2'}
                    onChange={() => updateModule(module.id, { level: 'h2' })}
                    className="text-orange-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{translations?.admin.quizEditor.options.h2 || "H2 (Mittel)"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={module.level === 'h3'}
                    onChange={() => updateModule(module.id, { level: 'h3' })}
                    className="text-orange-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{translations?.admin.quizEditor.options.h3 || "H3 (Klein)"}</span>
                </div>
              </div>
              <input
                type="text"
                value={module.text}
                onChange={(e) => updateModule(module.id, { text: e.target.value })}
                className={`w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200 font-bold ${
                  module.level === 'h1' ? 'text-3xl' :
                  module.level === 'h2' ? 'text-2xl' :
                  'text-xl'
                }`}
                placeholder={translations?.admin.quizEditor.placeholders.heading || "Überschrift eingeben..."}
              />
              <textarea
                value={module.description}
                onChange={(e) => updateModule(module.id, { description: e.target.value })}
                className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200 min-h-[80px] resize-y"
                placeholder={translations?.admin.quizEditor.placeholders.description || "Beschreibung eingeben..."}
              />
            </div>
          </div>
        )

      case 'randomQuestion':
        return (
          <div key={module.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200/50 dark:border-slate-700/50 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
            {commonHeader}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {translations?.admin.quizEditor.modules.randomQuestion.title || 'Zufällige Frage'}
                </span>
              </div>
              <select
                value={module.stackId}
                onChange={(e) => {
                  const selectedStack = questionStacks?.find(stack => stack.id === e.target.value)
                  updateModule(module.id, { 
                    stackId: e.target.value, 
                    stackName: selectedStack?.name || '' 
                  })
                }}
                className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200"
              >
                <option value="">
                  {!questionStacksLoaded ? "Lade Fragenstapel..." : (translations?.admin.quizEditor.placeholders.selectStack || "Fragenstapel auswählen...")}
                </option>
                {(() => {
                  console.log('Rendering question stacks:', questionStacks)
                  console.log('Question stacks type:', typeof questionStacks)
                  console.log('Question stacks is array:', Array.isArray(questionStacks))
                  console.log('Question stacks length:', questionStacks?.length)
                  
                  if (questionStacks && questionStacks.length > 0) {
                    return questionStacks.map(stack => (
                      <option key={stack.id} value={stack.id}>
                        {stack.name}
                      </option>
                    ))
                  } else {
                    console.log('No question stacks to render')
                    return (
                      <option value="" disabled>
                        {questionStacksLoaded ? "Keine Fragenstapel verfügbar" : "Lade..."}
                      </option>
                    )
                  }
                })()}
              </select>
              {module.stackId && (
                <div className="p-3 bg-orange-50/60 dark:bg-orange-900/20 rounded-lg border border-orange-200/50 dark:border-orange-700/50">
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    <strong>{translations?.admin.quizEditor.modules.randomQuestion.title || 'Zufällige Frage'}:</strong> {module.stackName}
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    Eine zufällige Frage aus diesem Stapel wird beim Quiz angezeigt.
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 'pageBreak':
        return (
          <div key={module.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border-2 border-orange-200/50 dark:border-slate-700/50 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
            {commonHeader}
            <div className="flex items-center justify-center py-2">
              <div className="w-full h-1 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AdminHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="flex gap-8">
          {/* Canvas Area */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <input
                type="text"
                value={quizName}
                onChange={(e) => {
                  console.log('📝 Quiz name changed:', e.target.value)
                  setQuizName(e.target.value)
                }}
                className="flex-1 px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200 text-xl font-semibold mr-4"
                placeholder={quizName ? "" : (translations?.admin.quizEditor.quizName || "Quiz-Name eingeben...")}
              />
              <button
                onClick={async () => {
                  setIsSaving(true)
                  try {
                    const urlParams = new URLSearchParams(window.location.search)
                    const quizId = urlParams.get('id')
                    
                    console.log('Saving quiz:', { quizName, modules, quizId })
                    
                    let response
                    if (quizId) {
                      // Update existing quiz
                      console.log('Updating existing quiz:', quizId)
                      response = await fetch('/api/quiz-modules', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          quizId,
                          modules: convertModulesForSaving(modules)
                        })
                      })
                    } else {
                      // Create new quiz
                      console.log('Creating new quiz')
                      response = await fetch('/api/quizzes/create', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          title: quizName,
                          modules: convertModulesForSaving(modules)
                        })
                      })
                    }

                    if (response.ok) {
                      const result = await response.json()
                      console.log(quizId ? 'Quiz erfolgreich aktualisiert:' : 'Quiz erfolgreich erstellt:', result)
                      
                      // Set quiz as saved and store the ID
                      setIsQuizSaved(true)
                      setCurrentQuizId(result.id || quizId)
                      
                      // Generate quiz URL and QR code
                      const quizSlug = result.slug || quizName.toLowerCase().replace(/\s+/g, '-')
                      const quizUrl = `${window.location.origin}/q/${quizSlug}/start`
                      
                      console.log('🔗 Generated quiz URL:', quizUrl)
                      
                      // Show QR code modal after successful save
                      await generateQRCode(quizUrl, true)
                    } else {
                      const errorData = await response.json()
                      console.error(`Fehler beim ${quizId ? 'Aktualisieren' : 'Erstellen'} des Quizzes:`, errorData)
                    }
                  } catch (error) {
                    console.error('Fehler beim Speichern:', error)
                  } finally {
                    setIsSaving(false)
                  }
                }}
                disabled={!quizName.trim() || modules.length === 0 || isSaving}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-500 disabled:to-green-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Speichern...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {translations?.admin.quizEditor.actions.save || "Speichern"}
                  </>
                )}
              </button>

              {/* QR Code Button - Show when quiz is saved or when editing existing quiz */}
              {console.log('🔘 QR Code Button Debug:', { isQuizSaved, isEditingExistingQuiz, quizName, currentQuizId, quizUrl })}
              {(isQuizSaved || isEditingExistingQuiz) && (
                <button
                  onClick={showQRCodeModal}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center ml-3"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  {translations?.admin?.quizEditor?.qrCode?.showQR || "QR-Code anzeigen"}
                </button>
              )}
            </div>

            <div
              className="min-h-[600px] p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-orange-200/50 dark:border-slate-600/50 transition-all duration-200 hover:border-orange-300/70 dark:hover:border-slate-500/70"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {modules.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
                    {translations?.admin.quizEditor.emptyState.title || "Quiz-Editor"}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md text-lg">
                    {translations?.admin.quizEditor.emptyState.description || "Ziehe Module von rechts hierher, um dein Quiz zu erstellen"}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {modules.map((module, index) => renderModule(module, index))}
                </div>
              )}
            </div>
          </div>

          {/* Module Sidebar */}
          <div className="w-80">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200/50 dark:border-slate-700/50 sticky top-24">
              <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">
                {translations?.admin.quizEditor.modules.title || "Module"}
              </h2>
              <div className="space-y-4">
                {availableModules.map((module) => (
                  <div
                    key={module.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, module)}
                    className="p-4 bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm rounded-xl border-2 border-orange-200/30 dark:border-slate-600/30 cursor-grab hover:shadow-lg hover:-translate-y-1 transition-all duration-200 active:cursor-grabbing"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center text-white">
                        {module.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                          {module.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full border-2 border-orange-200/50 dark:border-slate-700/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {isEditingExistingQuiz 
                  ? (translations?.admin?.quizEditor?.qrCode?.titleExisting || "QR-Code für Quiz")
                  : (translations?.admin?.quizEditor?.qrCode?.titleNew || "Quiz erfolgreich erstellt!")
                }
              </h2>
              
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {translations?.admin?.quizEditor?.qrCode?.description || "Hier ist der QR-Code für Ihr Quiz:"}
              </p>
              
              <div className="bg-white p-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 mb-6 inline-block">
                {qrCodeDataURL ? (
                  <img 
                    src={qrCodeDataURL} 
                    alt="QR Code" 
                    className="w-48 h-48 mx-auto"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">QR-Code wird generiert...</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 mb-6">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  {translations?.admin?.quizEditor?.qrCode?.urlLabel || "Quiz-URL:"}
                </p>
                <p className="text-slate-900 dark:text-white font-mono text-sm break-all">
                  {quizUrl}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(quizUrl)
                    console.log('📋 Copied URL:', quizUrl)
                  }}
                  className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  {translations?.admin?.quizEditor?.qrCode?.copyUrl || "URL kopieren"}
                </button>
                <button
                  onClick={downloadQRCode}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {translations?.admin?.quizEditor?.qrCode?.downloadPng || "PNG Download"}
                </button>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  {translations?.admin?.quizEditor?.qrCode?.close || "Schließen"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}