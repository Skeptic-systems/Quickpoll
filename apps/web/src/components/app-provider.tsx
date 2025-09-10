'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'de' | 'en' | 'fr'
type Theme = 'light' | 'dark' | 'system'

interface Translations {
  common: {
    quickpoll: string
    login: string
    copyright: string
    impressum: string
    datenschutz: string
  }
  landing: {
    subtitle: string
    whyQuickpoll: string
    whyQuickpollSubtitle: string
    quizSection: {
      loading: string
      noQuizzesTitle: string
      noQuizzesDescription: string
      loginButton: string
      startQuiz: string
      participations: string
      questions: string
      perRun: string
    }
    features: {
      anonymous: {
        title: string
        description: string
      }
      oneQuestion: {
        title: string
        description: string
      }
      qrStart: {
        title: string
        description: string
      }
    }
  }
  datenschutz: {
    title: string
    lastUpdated: string
    intro: string
    dataController: {
      title: string
      content: string
    }
    dataProcessing: {
      title: string
      content: string
    }
    cookies: {
      title: string
      content: string
    }
    rights: {
      title: string
      content: string
    }
  }
  impressum: {
    title: string
    provider: {
      title: string
      name: string
      address: string
      city: string
      country: string
    }
    contact: {
      title: string
      email: string
      phone: string
    }
    responsible: {
      title: string
      name: string
      address: string
      city: string
    }
    disclaimer: {
      title: string
      content: string
    }
  }
  admin: {
    title: string
    subtitle: string
    features: {
      createQuiz: {
        title: string
        description: string
      }
      manageQuestions: {
        title: string
        description: string
      }
      viewResults: {
        title: string
        description: string
      }
    }
    quizList: {
      title: string
      createNew: string
      noQuizzes: {
        title: string
        description: string
        createFirst: string
      }
      actions: {
        edit: string
        results: string
      }
      status: {
        active: string
        inactive: string
      }
    }
    quizEditor: {
      title: string
      quizName: string
      emptyState: {
        title: string
        description: string
      }
      modules: {
        title: string
        question: {
          title: string
          description: string
        }
        text: {
          title: string
          description: string
        }
        image: {
          title: string
          description: string
        }
        video: {
          title: string
          description: string
        }
        heading: {
          title: string
          description: string
        }
      }
      actions: {
        save: string
        addAnswer: string
      }
      placeholders: {
        question: string
        answer: string
        text: string
        imageUrl: string
        altText: string
        videoUrl: string
        videoTitle: string
        heading: string
        description: string
      }
      options: {
        multipleChoice: string
        headingSize: string
        h1: string
        h2: string
        h3: string
      }
    }
    login: {
      title: string
      subtitle: string
      email: string
      password: string
      emailPlaceholder: string
      passwordPlaceholder: string
      submit: string
      loading: string
      error: string
    }
    header: {
      backToHome: string
      logout: string
    }
  }
}

interface AppContextType {
  language: Language
  setLanguage: (lang: Language) => void
  theme: Theme
  setTheme: (theme: Theme) => void
  translations: Translations | null
  translateText: (text: string, targetLang: Language) => Promise<string>
  isTranslating: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [language, setLanguageState] = useState<Language>('de')
  const [theme, setThemeState] = useState<Theme>('light')
  const [translations, setTranslations] = useState<Translations | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)

  // German base translations (hardcoded)
  const germanTranslations: Translations = {
    common: {
      quickpoll: "Quickpoll",
      login: "Anmelden",
      copyright: "© 2025 Skeptic Systems. Alle Rechte vorbehalten.",
      poweredBy: "Powered by AI",
      poweredByDescription: "Intelligente Umfragen mit KI-Unterstützung für optimale Ergebnisse",
      impressum: "Impressum",
      datenschutz: "Datenschutz"
    },
    landing: {
      subtitle: "Erstelle und führe Umfragen durch - einfach, schnell und anonym",
      whyQuickpoll: "Warum Quickpoll?",
      whyQuickpollSubtitle: "Die einfachste Art, Umfragen zu erstellen und durchzuführen",
      quizSection: {
        loading: "Lade verfügbare Quizzes...",
        noQuizzesTitle: "Noch keine Quizzes verfügbar",
        noQuizzesDescription: "Melde dich an, um Quizzes zu erstellen und Umfragen durchzuführen.",
        loginButton: "Jetzt anmelden",
        startQuiz: "Quiz starten",
        participations: "Teilnahmen",
        questions: "Fragen",
        perRun: "pro Durchlauf"
      },
      features: {
        anonymous: {
          title: "Anonyme Teilnahme",
          description: "Teilnehmer können anonym abstimmen ohne Registrierung"
        },
        oneQuestion: {
          title: "Eine Frage pro Durchlauf",
          description: "Fokussierte Umfragen mit einer zentralen Frage"
        },
        qrStart: {
          title: "QR-Code Start",
          description: "Einfacher Start über QR-Code für schnelle Teilnahme"
        }
      }
    },
    datenschutz: {
      title: "Datenschutzerklärung",
      lastUpdated: "Letzte Aktualisierung: 1. Januar 2025",
      intro: "Diese Datenschutzerklärung informiert Sie über die Verarbeitung personenbezogener Daten bei der Nutzung unserer Website.",
      dataController: {
        title: "Verantwortlicher",
        content: "Verantwortlicher für die Datenverarbeitung ist Skeptic Systems."
      },
      dataProcessing: {
        title: "Datenverarbeitung",
        content: "Wir verarbeiten personenbezogene Daten nur im Rahmen der gesetzlichen Bestimmungen."
      },
      cookies: {
        title: "Cookies",
        content: "Unsere Website verwendet Cookies zur Verbesserung der Benutzererfahrung."
      },
      rights: {
        title: "Ihre Rechte",
        content: "Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Widerspruch bezüglich Ihrer Daten."
      }
    },
    impressum: {
      title: "Impressum",
      provider: {
        title: "Anbieter",
        name: "Skeptic Systems",
        address: "Musterstraße 123",
        city: "12345 Musterstadt",
        country: "Deutschland"
      },
      contact: {
        title: "Kontakt",
        email: "info@skeptic-systems.de",
        phone: "+49 123 456789"
      },
      responsible: {
        title: "Verantwortlich für den Inhalt",
        name: "Max Mustermann",
        address: "Musterstraße 123",
        city: "12345 Musterstadt"
      },
      disclaimer: {
        title: "Haftungsausschluss",
        content: "Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen."
      }
    },
    admin: {
      title: "Admin Dashboard",
      subtitle: "Verwalte deine Quizzes und Umfragen",
      features: {
        createQuiz: {
          title: "Quiz erstellen",
          description: "Erstelle neue Quizzes mit Fragen und Antwortmöglichkeiten für deine Events."
        },
        manageQuestions: {
          title: "Fragen erstellen",
          description: "Erstelle Fragenstapel mit Fragen und Antworten für deine Quizzes."
        },
        viewResults: {
          title: "Ergebnisse anzeigen",
          description: "Analysiere die Ergebnisse und Statistiken deiner durchgeführten Quizzes."
        }
      },
      quizList: {
        title: "Meine Quizzes",
        createNew: "Neues Quiz erstellen",
        noQuizzes: {
          title: "Noch keine Quizzes erstellt",
          description: "Erstelle dein erstes Quiz, um loszulegen und Umfragen durchzuführen.",
          createFirst: "Erstes Quiz erstellen →"
        },
        actions: {
          edit: "Bearbeiten",
          results: "Ergebnisse"
        },
        status: {
          active: "Aktiv",
          inactive: "Inaktiv"
        }
      },
      quizEditor: {
        title: "Quiz-Editor",
        quizName: "Quiz-Name eingeben...",
        emptyState: {
          title: "Quiz-Editor",
          description: "Ziehe Module von rechts hierher, um dein Quiz zu erstellen"
        },
        modules: {
          title: "Module",
          question: {
            title: "Frage",
            description: "Erstelle eine Frage mit Antworten"
          },
          text: {
            title: "Text",
            description: "Füge Text hinzu"
          },
          image: {
            title: "Bild",
            description: "Füge ein Bild hinzu"
          },
          video: {
            title: "Video",
            description: "Füge ein Video hinzu"
          },
          heading: {
            title: "Überschrift",
            description: "Füge eine Überschrift hinzu"
          }
        },
        actions: {
          save: "Speichern",
          addAnswer: "Antwort hinzufügen"
        },
        placeholders: {
          question: "Frage eingeben...",
          answer: "Antwort",
          text: "Text eingeben...",
          imageUrl: "Bild-URL eingeben...",
          altText: "Alt-Text eingeben...",
          videoUrl: "Video-URL eingeben...",
          videoTitle: "Video-Titel eingeben...",
          heading: "Überschrift eingeben...",
          description: "Beschreibung eingeben..."
        },
        options: {
          multipleChoice: "Mehrfachauswahl erlauben",
          headingSize: "Größe:",
          h1: "H1 (Groß)",
          h2: "H2 (Mittel)",
          h3: "H3 (Klein)"
        }
      },
      login: {
        title: "Anmelden",
        subtitle: "Melde dich an, um auf das Admin-Panel zuzugreifen",
        email: "E-Mail",
        password: "Passwort",
        emailPlaceholder: "deine@email.com",
        passwordPlaceholder: "••••••••",
        submit: "Anmelden",
        loading: "Wird geladen...",
        error: "Ungültige Anmeldedaten"
      },
      header: {
        backToHome: "Zurück zur Startseite",
        logout: "Logout"
      },
      questions: {
        title: "Fragenstapel verwalten",
        createNew: "Neuen Fragenstapel erstellen",
        createStack: "Neuen Fragenstapel erstellen",
        stackName: "Name des Fragenstapels",
        stackNamePlaceholder: "z.B. Allgemeinwissen, Mathematik...",
        create: "Erstellen",
        cancel: "Abbrechen",
        noStacks: {
          title: "Noch keine Fragenstapel erstellt",
          description: "Erstelle deinen ersten Fragenstapel, um Fragen und Antworten für deine Quizzes zu sammeln.",
          createFirst: "Ersten Fragenstapel erstellen →"
        },
        myStacks: "Meine Fragenstapel",
        questions: "Fragen",
        edit: "Bearbeiten",
        delete: "Löschen",
        backToStacks: "Zurück zu Fragenstapeln",
        editStack: "Fragenstapel bearbeiten",
        addQuestion: "Neue Frage hinzufügen",
        noQuestions: {
          title: "Noch keine Fragen erstellt",
          description: "Füge deine erste Frage zu diesem Fragenstapel hinzu.",
          addFirst: "Erste Frage hinzufügen →"
        },
        questionForm: {
          title: "Neue Frage hinzufügen",
          editTitle: "Frage bearbeiten",
          question: "Frage",
          questionPlaceholder: "Formuliere deine Frage...",
          questionType: "Fragetyp",
          singleChoice: "Einfachauswahl",
          multipleChoice: "Mehrfachauswahl",
          answers: "Antwortmöglichkeiten",
          addAnswer: "Antwort hinzufügen",
          answerPlaceholder: "Antwort",
          correctAnswer: "Richtige Antwort",
          correctAnswerPlaceholder: "Wähle die richtige Antwort...",
          save: "Speichern",
          update: "Aktualisieren",
          cancel: "Abbrechen"
        },
        deleteConfirm: {
          title: "Fragenstapel löschen",
          message: "Bist du sicher, dass du diesen Fragenstapel löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.",
          confirm: "Löschen",
          cancel: "Abbrechen"
        }
      }
    }
  }

  // Initialize with German translations
  useEffect(() => {
    if (!translations) {
      console.log('Initializing with German translations')
      setTranslations(germanTranslations)
    }
  }, [])

  // Load translations with caching
  useEffect(() => {
    console.log('Language changed to:', language)
    const loadTranslations = async () => {
      if (language === 'de') {
        console.log('Setting German translations')
        setTranslations(germanTranslations)
        return
      }

      // Check localStorage cache first
      const cacheKey = `quickpoll-translations-${language}`
      const cachedTranslations = localStorage.getItem(cacheKey)
      
      if (cachedTranslations) {
        try {
          const parsed = JSON.parse(cachedTranslations)
          console.log(`Loaded cached translations for ${language}`)
          setTranslations(parsed)
          return
        } catch (error) {
          console.warn('Failed to parse cached translations:', error)
        }
      }

      // If no cache, translate and cache
      console.log(`No cache found for ${language}, starting translation...`)
      setIsTranslating(true)
      try {
        await translateAllTexts(language)
        // Cache will be set in translateAllTexts
      } catch (error) {
        console.error('Translation failed:', error)
        setTranslations(germanTranslations)
      } finally {
        setIsTranslating(false)
      }
    }
    loadTranslations()
  }, [language])

  // Detect browser theme preference on first load
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as Language
    if (['de', 'en', 'fr'].includes(browserLang)) {
      setLanguageState(browserLang)
    }
    
    // Set initial theme based on browser preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setThemeState(prefersDark ? 'dark' : 'light')
  }, [])

  // Detect browser theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        document.documentElement.classList.toggle('dark', mediaQuery.matches)
      }
    }
    
    handleChange()
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  // Apply theme
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const setLanguage = (lang: Language) => {
    console.log('setLanguage called with:', lang)
    
    // Clear cache to force reload of translations
    const cacheKey = `quickpoll-translations-${lang}`
    localStorage.removeItem(cacheKey)
    
    setLanguageState(lang)
    localStorage.setItem('quickpoll-language', lang)
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('quickpoll-theme', newTheme)
  }

  // Translate single text with better error handling
  const translateText = async (text: string, targetLang: Language): Promise<string> => {
    if (targetLang === 'de' || !text.trim()) {
      return text
    }

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          targetLang: targetLang
        })
      })

      if (response.ok) {
        const data = await response.json()
        return data.translatedText || text
      } else {
        console.warn(`Translation failed for "${text}":`, response.statusText)
        return text
      }
    } catch (error) {
      console.warn(`Translation error for "${text}":`, error)
      return text
    }
  }

  // Simple translation with manual translations for key texts
  const translateAllTexts = async (targetLang: Language) => {
    if (targetLang === 'de') {
      setTranslations(germanTranslations)
      return
    }

    try {
      console.log(`Starting translation to ${targetLang}...`)
      
      // Create translated version with manual translations for key texts
      const translatedTranslations = JSON.parse(JSON.stringify(germanTranslations)) // Deep clone
      
      // Translate key texts manually
      if (targetLang === 'en') {
        translatedTranslations.common.login = "Login"
        translatedTranslations.common.copyright = "© 2025 Skeptic Systems. All rights reserved."
        translatedTranslations.common.poweredBy = "Powered by AI"
        translatedTranslations.common.poweredByDescription = "Intelligent surveys with AI support for optimal results"
        translatedTranslations.common.impressum = "Imprint"
        translatedTranslations.common.datenschutz = "Privacy"
        
        translatedTranslations.landing.subtitle = "Create and conduct surveys - simple, fast and anonymous"
        translatedTranslations.landing.whyQuickpoll = "Why Quickpoll?"
        translatedTranslations.landing.whyQuickpollSubtitle = "The easiest way to create and conduct surveys"
        
        translatedTranslations.landing.quizSection.loading = "Loading available quizzes..."
        translatedTranslations.landing.quizSection.noQuizzesTitle = "No quizzes available yet"
        translatedTranslations.landing.quizSection.noQuizzesDescription = "Sign up to create quizzes and conduct surveys."
        translatedTranslations.landing.quizSection.loginButton = "Sign up now"
        translatedTranslations.landing.quizSection.startQuiz = "Start quiz"
        translatedTranslations.landing.quizSection.participations = "Participations"
        translatedTranslations.landing.quizSection.questions = "Questions"
        translatedTranslations.landing.quizSection.perRun = "per run"
        
        translatedTranslations.landing.features.anonymous.title = "Anonymous participation"
        translatedTranslations.landing.features.anonymous.description = "Participants can vote anonymously without registration"
        translatedTranslations.landing.features.oneQuestion.title = "Focused surveys"
        translatedTranslations.landing.features.oneQuestion.description = "With a central question"
        translatedTranslations.landing.features.qrStart.title = "QR code start"
        translatedTranslations.landing.features.qrStart.description = "Easy start via QR code for quick participation"
        
        // Admin translations
        translatedTranslations.admin.features.createQuiz.title = "Create quiz"
        translatedTranslations.admin.features.createQuiz.description = "Create new quizzes with questions and answer options for your events."
        translatedTranslations.admin.features.manageQuestions.title = "Create questions"
        translatedTranslations.admin.features.manageQuestions.description = "Create question stacks with questions and answers for your quizzes."
        translatedTranslations.admin.features.viewResults.title = "View results"
        translatedTranslations.admin.features.viewResults.description = "Analyze the results and statistics of your conducted quizzes."
        
        translatedTranslations.admin.quizList.title = "My Quizzes"
        translatedTranslations.admin.quizList.createNew = "Create new quiz"
        translatedTranslations.admin.quizList.noQuizzes.title = "No quizzes created yet"
        translatedTranslations.admin.quizList.noQuizzes.description = "Create your first quiz to get started and conduct surveys."
        translatedTranslations.admin.quizList.noQuizzes.createFirst = "Create first quiz →"
        translatedTranslations.admin.quizList.actions.edit = "Edit"
        translatedTranslations.admin.quizList.actions.results = "Results"
        translatedTranslations.admin.quizList.status.active = "Active"
        translatedTranslations.admin.quizList.status.inactive = "Inactive"
        
        translatedTranslations.admin.login.title = "Login"
        translatedTranslations.admin.login.subtitle = "Sign in to access the admin panel"
        translatedTranslations.admin.login.email = "Email"
        translatedTranslations.admin.login.password = "Password"
        translatedTranslations.admin.login.emailPlaceholder = "your@email.com"
        translatedTranslations.admin.login.passwordPlaceholder = "••••••••"
        translatedTranslations.admin.login.submit = "Login"
        translatedTranslations.admin.login.loading = "Loading..."
        translatedTranslations.admin.login.error = "Invalid login credentials"
        
        translatedTranslations.admin.header.backToHome = "Back to homepage"
        translatedTranslations.admin.header.logout = "Logout"
        
        // Quiz Editor translations
        translatedTranslations.admin.quizEditor.title = "Quiz Editor"
        translatedTranslations.admin.quizEditor.quizName = "Enter quiz name..."
        translatedTranslations.admin.quizEditor.emptyState.title = "Quiz Editor"
        translatedTranslations.admin.quizEditor.emptyState.description = "Drag modules from the right here to create your quiz"
        
        translatedTranslations.admin.quizEditor.modules.title = "Modules"
        translatedTranslations.admin.quizEditor.modules.question.title = "Question"
        translatedTranslations.admin.quizEditor.modules.question.description = "Create a question with answers"
        translatedTranslations.admin.quizEditor.modules.text.title = "Text"
        translatedTranslations.admin.quizEditor.modules.text.description = "Add text"
        translatedTranslations.admin.quizEditor.modules.image.title = "Image"
        translatedTranslations.admin.quizEditor.modules.image.description = "Add an image"
        translatedTranslations.admin.quizEditor.modules.video.title = "Video"
        translatedTranslations.admin.quizEditor.modules.video.description = "Add a video"
        translatedTranslations.admin.quizEditor.modules.heading.title = "Heading"
        translatedTranslations.admin.quizEditor.modules.heading.description = "Add a heading"
        
        translatedTranslations.admin.quizEditor.actions.save = "Save"
        translatedTranslations.admin.quizEditor.actions.addAnswer = "Add answer"
        
        translatedTranslations.admin.quizEditor.placeholders.question = "Enter question..."
        translatedTranslations.admin.quizEditor.placeholders.answer = "Answer"
        translatedTranslations.admin.quizEditor.placeholders.text = "Enter text..."
        translatedTranslations.admin.quizEditor.placeholders.imageUrl = "Enter image URL..."
        translatedTranslations.admin.quizEditor.placeholders.altText = "Enter alt text..."
        translatedTranslations.admin.quizEditor.placeholders.videoUrl = "Enter video URL..."
        translatedTranslations.admin.quizEditor.placeholders.videoTitle = "Enter video title..."
        translatedTranslations.admin.quizEditor.placeholders.heading = "Enter heading..."
        translatedTranslations.admin.quizEditor.placeholders.description = "Enter description..."
        
        translatedTranslations.admin.quizEditor.options.multipleChoice = "Allow multiple choice"
        translatedTranslations.admin.quizEditor.options.headingSize = "Size:"
        translatedTranslations.admin.quizEditor.options.h1 = "H1 (Large)"
        translatedTranslations.admin.quizEditor.options.h2 = "H2 (Medium)"
        translatedTranslations.admin.quizEditor.options.h3 = "H3 (Small)"
        
        // Admin questions translations
        translatedTranslations.admin.questions.title = "Manage Question Stacks"
        translatedTranslations.admin.questions.createNew = "Create New Question Stack"
        translatedTranslations.admin.questions.createStack = "Create New Question Stack"
        translatedTranslations.admin.questions.stackName = "Question Stack Name"
        translatedTranslations.admin.questions.stackNamePlaceholder = "e.g. General Knowledge, Mathematics..."
        translatedTranslations.admin.questions.create = "Create"
        translatedTranslations.admin.questions.cancel = "Cancel"
        translatedTranslations.admin.questions.noStacks.title = "No Question Stacks created yet"
        translatedTranslations.admin.questions.noStacks.description = "Create your first question stack to collect questions and answers for your quizzes."
        translatedTranslations.admin.questions.noStacks.createFirst = "Create first Question Stack →"
        translatedTranslations.admin.questions.myStacks = "My Question Stacks"
        translatedTranslations.admin.questions.questions = "Questions"
        translatedTranslations.admin.questions.edit = "Edit"
        translatedTranslations.admin.questions.delete = "Delete"
        translatedTranslations.admin.questions.backToStacks = "Back to Question Stacks"
        translatedTranslations.admin.questions.editStack = "Edit Question Stack"
        translatedTranslations.admin.questions.addQuestion = "Add New Question"
        translatedTranslations.admin.questions.noQuestions.title = "No Questions created yet"
        translatedTranslations.admin.questions.noQuestions.description = "Add your first question to this question stack."
        translatedTranslations.admin.questions.noQuestions.addFirst = "Add first Question →"
        translatedTranslations.admin.questions.questionForm.title = "Add New Question"
        translatedTranslations.admin.questions.questionForm.editTitle = "Edit Question"
        translatedTranslations.admin.questions.questionForm.question = "Question"
        translatedTranslations.admin.questions.questionForm.questionPlaceholder = "Formulate your question..."
        translatedTranslations.admin.questions.questionForm.questionType = "Question Type"
        translatedTranslations.admin.questions.questionForm.singleChoice = "Single Choice"
        translatedTranslations.admin.questions.questionForm.multipleChoice = "Multiple Choice"
        translatedTranslations.admin.questions.questionForm.answers = "Answer Options"
        translatedTranslations.admin.questions.questionForm.addAnswer = "Add Answer"
        translatedTranslations.admin.questions.questionForm.answerPlaceholder = "Answer"
        translatedTranslations.admin.questions.questionForm.correctAnswer = "Correct Answer"
        translatedTranslations.admin.questions.questionForm.correctAnswerPlaceholder = "Select the correct answer..."
        translatedTranslations.admin.questions.questionForm.save = "Save"
        translatedTranslations.admin.questions.questionForm.update = "Update"
        translatedTranslations.admin.questions.questionForm.cancel = "Cancel"
        translatedTranslations.admin.questions.deleteConfirm.title = "Delete Question Stack"
        translatedTranslations.admin.questions.deleteConfirm.message = "Are you sure you want to delete this question stack? This action cannot be undone."
        translatedTranslations.admin.questions.deleteConfirm.confirm = "Delete"
        translatedTranslations.admin.questions.deleteConfirm.cancel = "Cancel"
      } else if (targetLang === 'fr') {
        translatedTranslations.common.login = "Connexion"
        translatedTranslations.common.copyright = "© 2025 Skeptic Systems. Tous droits réservés."
        translatedTranslations.common.poweredBy = "Alimenté par l'IA"
        translatedTranslations.common.poweredByDescription = "Sondages intelligents avec support IA pour des résultats optimaux"
        translatedTranslations.common.impressum = "Mentions légales"
        translatedTranslations.common.datenschutz = "Confidentialité"
        
        translatedTranslations.landing.subtitle = "Créez et menez des sondages - simple, rapide et anonyme"
        translatedTranslations.landing.whyQuickpoll = "Pourquoi Quickpoll ?"
        translatedTranslations.landing.whyQuickpollSubtitle = "Le moyen le plus simple de créer et mener des sondages"
        
        translatedTranslations.landing.quizSection.loading = "Chargement des quiz disponibles..."
        translatedTranslations.landing.quizSection.noQuizzesTitle = "Aucun quiz disponible pour le moment"
        translatedTranslations.landing.quizSection.noQuizzesDescription = "Inscrivez-vous pour créer des quiz et mener des sondages."
        translatedTranslations.landing.quizSection.loginButton = "S'inscrire maintenant"
        translatedTranslations.landing.quizSection.startQuiz = "Commencer le quiz"
        translatedTranslations.landing.quizSection.participations = "Participations"
        translatedTranslations.landing.quizSection.questions = "Questions"
        translatedTranslations.landing.quizSection.perRun = "par exécution"
        
        translatedTranslations.landing.features.anonymous.title = "Participation anonyme"
        translatedTranslations.landing.features.anonymous.description = "Les participants peuvent voter anonymement sans inscription"
        translatedTranslations.landing.features.oneQuestion.title = "Sondages ciblés"
        translatedTranslations.landing.features.oneQuestion.description = "Avec une question centrale"
        translatedTranslations.landing.features.qrStart.title = "Démarrage QR"
        translatedTranslations.landing.features.qrStart.description = "Démarrage facile via QR code pour une participation rapide"
        
        // Admin translations
        translatedTranslations.admin.features.createQuiz.title = "Créer un quiz"
        translatedTranslations.admin.features.createQuiz.description = "Créez de nouveaux quiz avec des questions et des options de réponse pour vos événements."
        translatedTranslations.admin.features.manageQuestions.title = "Créer des questions"
        translatedTranslations.admin.features.manageQuestions.description = "Créez des piles de questions avec des questions et réponses pour vos quiz."
        translatedTranslations.admin.features.viewResults.title = "Voir les résultats"
        translatedTranslations.admin.features.viewResults.description = "Analysez les résultats et statistiques de vos quiz menés."
        
        translatedTranslations.admin.quizList.title = "Mes Quiz"
        translatedTranslations.admin.quizList.createNew = "Créer un nouveau quiz"
        translatedTranslations.admin.quizList.noQuizzes.title = "Aucun quiz créé pour le moment"
        translatedTranslations.admin.quizList.noQuizzes.description = "Créez votre premier quiz pour commencer et mener des sondages."
        translatedTranslations.admin.quizList.noQuizzes.createFirst = "Créer le premier quiz →"
        translatedTranslations.admin.quizList.actions.edit = "Modifier"
        translatedTranslations.admin.quizList.actions.results = "Résultats"
        translatedTranslations.admin.quizList.status.active = "Actif"
        translatedTranslations.admin.quizList.status.inactive = "Inactif"
        
        translatedTranslations.admin.login.title = "Connexion"
        translatedTranslations.admin.login.subtitle = "Connectez-vous pour accéder au panneau d'administration"
        translatedTranslations.admin.login.email = "Email"
        translatedTranslations.admin.login.password = "Mot de passe"
        translatedTranslations.admin.login.emailPlaceholder = "votre@email.com"
        translatedTranslations.admin.login.passwordPlaceholder = "••••••••"
        translatedTranslations.admin.login.submit = "Connexion"
        translatedTranslations.admin.login.loading = "Chargement..."
        translatedTranslations.admin.login.error = "Identifiants de connexion invalides"
        
        translatedTranslations.admin.header.backToHome = "Retour à l'accueil"
        translatedTranslations.admin.header.logout = "Déconnexion"
        
        // Quiz Editor translations
        translatedTranslations.admin.quizEditor.title = "Éditeur de Quiz"
        translatedTranslations.admin.quizEditor.quizName = "Entrez le nom du quiz..."
        translatedTranslations.admin.quizEditor.emptyState.title = "Éditeur de Quiz"
        translatedTranslations.admin.quizEditor.emptyState.description = "Glissez les modules de droite ici pour créer votre quiz"
        
        translatedTranslations.admin.quizEditor.modules.title = "Modules"
        translatedTranslations.admin.quizEditor.modules.question.title = "Question"
        translatedTranslations.admin.quizEditor.modules.question.description = "Créer une question avec des réponses"
        translatedTranslations.admin.quizEditor.modules.text.title = "Texte"
        translatedTranslations.admin.quizEditor.modules.text.description = "Ajouter du texte"
        translatedTranslations.admin.quizEditor.modules.image.title = "Image"
        translatedTranslations.admin.quizEditor.modules.image.description = "Ajouter une image"
        translatedTranslations.admin.quizEditor.modules.video.title = "Vidéo"
        translatedTranslations.admin.quizEditor.modules.video.description = "Ajouter une vidéo"
        translatedTranslations.admin.quizEditor.modules.heading.title = "Titre"
        translatedTranslations.admin.quizEditor.modules.heading.description = "Ajouter un titre"
        
        translatedTranslations.admin.quizEditor.actions.save = "Enregistrer"
        translatedTranslations.admin.quizEditor.actions.addAnswer = "Ajouter une réponse"
        
        translatedTranslations.admin.quizEditor.placeholders.question = "Entrez la question..."
        translatedTranslations.admin.quizEditor.placeholders.answer = "Réponse"
        translatedTranslations.admin.quizEditor.placeholders.text = "Entrez le texte..."
        translatedTranslations.admin.quizEditor.placeholders.imageUrl = "Entrez l'URL de l'image..."
        translatedTranslations.admin.quizEditor.placeholders.altText = "Entrez le texte alternatif..."
        translatedTranslations.admin.quizEditor.placeholders.videoUrl = "Entrez l'URL de la vidéo..."
        translatedTranslations.admin.quizEditor.placeholders.videoTitle = "Entrez le titre de la vidéo..."
        translatedTranslations.admin.quizEditor.placeholders.heading = "Entrez le titre..."
        translatedTranslations.admin.quizEditor.placeholders.description = "Entrez la description..."
        
        translatedTranslations.admin.quizEditor.options.multipleChoice = "Autoriser le choix multiple"
        translatedTranslations.admin.quizEditor.options.headingSize = "Taille :"
        translatedTranslations.admin.quizEditor.options.h1 = "H1 (Grand)"
        translatedTranslations.admin.quizEditor.options.h2 = "H2 (Moyen)"
        translatedTranslations.admin.quizEditor.options.h3 = "H3 (Petit)"
        
        // Admin questions translations
        translatedTranslations.admin.questions.title = "Gérer les Piles de Questions"
        translatedTranslations.admin.questions.createNew = "Créer une Nouvelle Pile de Questions"
        translatedTranslations.admin.questions.createStack = "Créer une Nouvelle Pile de Questions"
        translatedTranslations.admin.questions.stackName = "Nom de la Pile de Questions"
        translatedTranslations.admin.questions.stackNamePlaceholder = "ex. Culture Générale, Mathématiques..."
        translatedTranslations.admin.questions.create = "Créer"
        translatedTranslations.admin.questions.cancel = "Annuler"
        translatedTranslations.admin.questions.noStacks.title = "Aucune Pile de Questions créée"
        translatedTranslations.admin.questions.noStacks.description = "Créez votre première pile de questions pour collecter des questions et réponses pour vos quiz."
        translatedTranslations.admin.questions.noStacks.createFirst = "Créer la première Pile de Questions →"
        translatedTranslations.admin.questions.myStacks = "Mes Piles de Questions"
        translatedTranslations.admin.questions.questions = "Questions"
        translatedTranslations.admin.questions.edit = "Modifier"
        translatedTranslations.admin.questions.delete = "Supprimer"
        translatedTranslations.admin.questions.backToStacks = "Retour aux Piles de Questions"
        translatedTranslations.admin.questions.editStack = "Modifier la Pile de Questions"
        translatedTranslations.admin.questions.addQuestion = "Ajouter une Nouvelle Question"
        translatedTranslations.admin.questions.noQuestions.title = "Aucune Question créée"
        translatedTranslations.admin.questions.noQuestions.description = "Ajoutez votre première question à cette pile de questions."
        translatedTranslations.admin.questions.noQuestions.addFirst = "Ajouter la première Question →"
        translatedTranslations.admin.questions.questionForm.title = "Ajouter une Nouvelle Question"
        translatedTranslations.admin.questions.questionForm.editTitle = "Modifier la Question"
        translatedTranslations.admin.questions.questionForm.question = "Question"
        translatedTranslations.admin.questions.questionForm.questionPlaceholder = "Formulez votre question..."
        translatedTranslations.admin.questions.questionForm.questionType = "Type de Question"
        translatedTranslations.admin.questions.questionForm.singleChoice = "Choix Unique"
        translatedTranslations.admin.questions.questionForm.multipleChoice = "Choix Multiple"
        translatedTranslations.admin.questions.questionForm.answers = "Options de Réponse"
        translatedTranslations.admin.questions.questionForm.addAnswer = "Ajouter une Réponse"
        translatedTranslations.admin.questions.questionForm.answerPlaceholder = "Réponse"
        translatedTranslations.admin.questions.questionForm.correctAnswer = "Bonne Réponse"
        translatedTranslations.admin.questions.questionForm.correctAnswerPlaceholder = "Sélectionnez la bonne réponse..."
        translatedTranslations.admin.questions.questionForm.save = "Enregistrer"
        translatedTranslations.admin.questions.questionForm.update = "Mettre à jour"
        translatedTranslations.admin.questions.questionForm.cancel = "Annuler"
        translatedTranslations.admin.questions.deleteConfirm.title = "Supprimer la Pile de Questions"
        translatedTranslations.admin.questions.deleteConfirm.message = "Êtes-vous sûr de vouloir supprimer cette pile de questions ? Cette action ne peut pas être annulée."
        translatedTranslations.admin.questions.deleteConfirm.confirm = "Supprimer"
        translatedTranslations.admin.questions.deleteConfirm.cancel = "Annuler"
      }
      
      console.log(`Translation to ${targetLang} completed`)
      
      // Cache the translations
      const cacheKey = `quickpoll-translations-${targetLang}`
      localStorage.setItem(cacheKey, JSON.stringify(translatedTranslations))
      
      setTranslations(translatedTranslations)
    } catch (error) {
      console.error('Failed to translate texts:', error)
      console.log('Falling back to German translations')
      setTranslations(germanTranslations)
    }
  }

  const translateObject = async (obj: any, targetLang: Language): Promise<any> => {
    if (typeof obj === 'string') {
      try {
        const translated = await translateText(obj, targetLang)
        console.log(`Translated: "${obj}" -> "${translated}"`)
        return translated
      } catch (error) {
        console.warn(`Failed to translate "${obj}":`, error)
        return obj // Return original text on error
      }
    } else if (Array.isArray(obj)) {
      const result = []
      for (const item of obj) {
        result.push(await translateObject(item, targetLang))
      }
      return result
    } else if (obj && typeof obj === 'object') {
      const result: any = {}
      for (const [key, value] of Object.entries(obj)) {
        result[key] = await translateObject(value, targetLang)
      }
      return result
    }
    return obj
  }

  // Load saved preferences
  useEffect(() => {
    const savedLanguage = localStorage.getItem('quickpoll-language') as Language
    const savedTheme = localStorage.getItem('quickpoll-theme') as Theme
    
    console.log('Loading saved preferences:', { savedLanguage, savedTheme })
    
    if (savedLanguage && ['de', 'en', 'fr'].includes(savedLanguage)) {
      console.log('Setting saved language:', savedLanguage)
      setLanguageState(savedLanguage)
    }
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      setThemeState(savedTheme)
    }
  }, [])

  if (!translations) {
    return <div>Loading...</div>
  }

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      theme,
      setTheme,
      translations,
      translateText,
      isTranslating
    }}>
      {children}
    </AppContext.Provider>
  )
}
