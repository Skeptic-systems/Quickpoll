'use client'

import { useState } from 'react'
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
  isMultipleChoice: boolean
}

interface TextModule {
  id: string
  type: 'text'
  content: string
}

interface ImageModule {
  id: string
  type: 'image'
  url: string
  alt: string
}

interface VideoModule {
  id: string
  type: 'video'
  url: string
  title: string
}

interface TitleModule {
  id: string
  type: 'title'
  text: string
  description: string
  level: 'h1' | 'h2' | 'h3'
}

type QuizModule = QuestionModule | TextModule | ImageModule | VideoModule | TitleModule

interface Module {
  id: string
  type: 'question' | 'text' | 'image' | 'video' | 'title'
  title: string
  icon: React.ReactNode
  description: string
}

export default function QuizEditorPage() {
  const [quizName, setQuizName] = useState('')
  const [modules, setModules] = useState<QuizModule[]>([])
  const { translations } = useApp()
  const [draggedModule, setDraggedModule] = useState<Module | null>(null)

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
      id: 'image',
      type: 'image',
      title: translations?.admin.quizEditor.modules.image.title || 'Bild',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: translations?.admin.quizEditor.modules.image.description || 'Füge ein Bild hinzu'
    },
    {
      id: 'video',
      type: 'video',
      title: translations?.admin.quizEditor.modules.video.title || 'Video',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      description: translations?.admin.quizEditor.modules.video.description || 'Füge ein Video hinzu'
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
        isMultipleChoice: false
      }),
      ...(draggedModule.type === 'text' && {
        content: ''
      }),
      ...(draggedModule.type === 'image' && {
        url: '',
        alt: ''
      }),
      ...(draggedModule.type === 'video' && {
        url: '',
        title: ''
      }),
      ...(draggedModule.type === 'title' && {
        text: '',
        description: '',
        level: 'h1' as const
      })
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
      updateModule(moduleId, { answers: [...module.answers, ''] })
    }
  }

  const removeAnswer = (moduleId: string, answerIndex: number) => {
    const module = modules.find(m => m.id === moduleId) as QuestionModule
    if (module && module.answers.length > 1) {
      const newAnswers = module.answers.filter((_, index) => index !== answerIndex)
      updateModule(moduleId, { answers: newAnswers })
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
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={module.isMultipleChoice}
                  onChange={(e) => updateModule(module.id, { isMultipleChoice: e.target.checked })}
                  className="text-orange-600"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">{translations?.admin.quizEditor.options.multipleChoice || "Mehrfachauswahl erlauben"}</span>
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
                {module.answers.map((answer, answerIndex) => (
                  <div key={answerIndex} className="flex items-center space-x-3">
                    {/* Radio Button für Einfachauswahl oder Checkbox für Mehrfachauswahl */}
                    <div className="flex-shrink-0">
                      {module.isMultipleChoice ? (
                        <div className="w-5 h-5 border-2 border-orange-400 rounded bg-white dark:bg-slate-700"></div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-orange-400 rounded-full bg-white dark:bg-slate-700"></div>
                      )}
                    </div>
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => updateAnswer(module.id, answerIndex, e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200"
                      placeholder={`${translations?.admin.quizEditor.placeholders.answer || "Antwort"} ${answerIndex + 1}`}
                    />
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
                ))}
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

      case 'image':
        return (
          <div key={module.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200/50 dark:border-slate-700/50 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
            {commonHeader}
            <div className="space-y-4">
              <input
                type="url"
                value={module.url}
                onChange={(e) => updateModule(module.id, { url: e.target.value })}
                className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200"
                placeholder={translations?.admin.quizEditor.placeholders.imageUrl || "Bild-URL eingeben..."}
              />
              <input
                type="text"
                value={module.alt}
                onChange={(e) => updateModule(module.id, { alt: e.target.value })}
                className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200"
                placeholder={translations?.admin.quizEditor.placeholders.altText || "Alt-Text eingeben..."}
              />
              {module.url && (
                <div className="mt-4">
                  <img
                    src={module.url}
                    alt={module.alt}
                    className="max-w-full h-auto rounded-lg border border-slate-200 dark:border-slate-600"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )

      case 'video':
        return (
          <div key={module.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200/50 dark:border-slate-700/50 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
            {commonHeader}
            <div className="space-y-4">
              <input
                type="url"
                value={module.url}
                onChange={(e) => updateModule(module.id, { url: e.target.value })}
                className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200"
                placeholder={translations?.admin.quizEditor.placeholders.videoUrl || "Video-URL eingeben..."}
              />
              <input
                type="text"
                value={module.title}
                onChange={(e) => updateModule(module.id, { title: e.target.value })}
                className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200"
                placeholder={translations?.admin.quizEditor.placeholders.videoTitle || "Video-Titel eingeben..."}
              />
            </div>
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
                onChange={(e) => setQuizName(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200 text-xl font-semibold mr-4"
                placeholder={translations?.admin.quizEditor.quizName || "Quiz-Name eingeben..."}
              />
              <button
                onClick={() => {
                  // TODO: Implement save functionality
                  console.log('Quiz speichern:', { quizName, modules })
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {translations?.admin.quizEditor.actions.save || "Speichern"}
              </button>
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
    </div>
  )
}