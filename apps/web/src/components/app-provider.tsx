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
    poweredBy: string
    poweredByDescription: string
  }
  language: string
  home: {
    title: string
    subtitle: string
    whyQuickpoll: string
    whyQuickpollSubtitle: string
    activeQuizzes: string
    selectQuiz: string
    participations: string
    questions: string
    perRun: string
    startQuiz: string
    noQuizzes: {
      title: string
      description: string
      loginPrompt: string
    }
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
        delete: string
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
        heading: {
          title: string
          description: string
        }
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
        randomQuestion: {
          title: string
          description: string
        }
        pageBreak: {
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
        selectStack: string
        noStacksAvailable: string
      }
      options: {
        multipleChoice: string
        headingSize: string
        h1: string
        h2: string
        h3: string
      }
      qrCode: {
        showQR: string
        title: string
        titleExisting: string
        titleNew: string
        description: string
        copyLink: string
        copyUrl: string
        downloadQR: string
        downloadPng: string
        close: string
        urlLabel: string
      }
    }
    questions: {
      questionForm: {
        questionType: string
        singleChoice: string
        multipleChoice: string
        questionText: string
        answers: string
        addAnswer: string
        correctAnswers: string
        saveQuestion: string
        cancel: string
        editQuestion: string
        deleteQuestion: string
      }
      deleteConfirm: {
        title: string
        message: string
        confirm: string
        cancel: string
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
    accountSettings: {
      title: string
      subtitle: string
      name: string
      email: string
      currentPassword: string
      newPassword: string
      confirmPassword: string
      updateButton: string
      success: string
      error: string
      passwordMismatch: string
      invalidCurrentPassword: string
    }
    userManagement: {
      title: string
      subtitle: string
      createUser: string
      name: string
      email: string
      password: string
      confirmPassword: string
      role: string
      admin: string
      user: string
      createButton: string
      success: string
      error: string
      emailExists: string
      passwordMismatch: string
    }
    header: {
      backToHome: string
      backToDashboard: string
      logout: string
    }
    quizStart: {
      title: string
      subtitle: string
      quizLabel: string
      description: string
      instructions: {
        title: string
        items: string[]
      }
      startButton: string
      starting: string
      backToHome: string
    }
    quizDisplay: {
      title: string
      randomQuestion: string
      fromStack: string
      startQuiz: string
      notFound: {
        title: string
        description: string
      }
    }
    quizExecution: {
      pageCounter: string
      backButton: string
      nextButton: string
      submitButton: string
      congratulations: string
      quizCompleted: string
      backToHome: string
      resultsTitle: string
      loadingResults: string
      resultsNotFound: string
      resultsNotFoundDesc: string
      detailedEvaluation: string
      question: string
      correct: string
      incorrect: string
      multipleChoice: string
      singleChoice: string
      yourAnswer: string
      correctAnswer: string
      noAnswerSelected: string
      noCorrectAnswer: string
      multipleChoiceHint: string
      retryQuiz: string
      of: string
      notFound: {
        title: string
        description: string
        backToHome: string
      }
    }
  }
}

interface AppContextType {
  language: Language
  setLanguage: (lang: Language) => void
  theme: Theme
  setTheme: (theme: Theme) => void
  translations: Translations | null
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
      poweredBy: "Unterstützt von KI",
      poweredByDescription: "Intelligente Umfragen mit KI-Unterstützung für optimale Ergebnisse",
      impressum: "Impressum",
      datenschutz: "Datenschutz"
    },
    language: "de",
    home: {
      title: "Mobile-optimierte Quiz-Webapp für Events und Umfragen",
      subtitle: "Erstelle und führe Umfragen durch - einfach, schnell und anonym",
      whyQuickpoll: "Warum Quickpoll?",
      whyQuickpollSubtitle: "Die einfachste Art, Umfragen zu erstellen und durchzuführen",
      activeQuizzes: "Aktive",
      selectQuiz: "Wählen Sie ein Quiz aus und starten Sie sofort",
      participations: "Teilnahmen",
      questions: "Fragen",
      perRun: "pro Durchlauf",
      startQuiz: "Quiz starten",
      noQuizzes: {
        title: "Noch keine Quizzes verfügbar",
        description: "Melde dich an, um Quizzes zu erstellen und Umfragen durchzuführen.",
        loginPrompt: "Jetzt anmelden"
      }
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
          results: "Ergebnisse",
          delete: "Löschen"
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
          heading: {
            title: "Überschrift",
            description: "Eine Überschrift für Strukturierung"
          },
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
          randomQuestion: {
            title: "Zufällige Frage",
            description: "Frage aus Stapel"
          },
          pageBreak: {
            title: "Seitenumbruch",
            description: "Seitenende"
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
          description: "Beschreibung eingeben...",
          selectStack: "Fragenstapel auswählen...",
          noStacksAvailable: "Keine Fragenstapel verfügbar"
        },
        options: {
          multipleChoice: "Mehrfachauswahl erlauben",
          headingSize: "Größe:",
          h1: "H1 (Groß)",
          h2: "H2 (Mittel)",
          h3: "H3 (Klein)"
        },
        qrCode: {
          showQR: "QR-Code anzeigen",
          title: "QR-Code für Quiz",
          titleExisting: "QR-Code für Quiz",
          titleNew: "Quiz erfolgreich erstellt!",
          description: "Teile diesen QR-Code oder Link mit Teilnehmern",
          copyLink: "Link kopieren",
          copyUrl: "URL kopieren",
          downloadQR: "QR-Code herunterladen",
          downloadPng: "PNG Download",
          close: "Schließen",
          urlLabel: "Quiz-URL:"
        }
      },
      questions: {
        questionForm: {
          questionType: "Fragetyp",
          singleChoice: "Einfachauswahl",
          multipleChoice: "Mehrfachauswahl",
          questionText: "Fragentext",
          answers: "Antwortmöglichkeiten",
          addAnswer: "Antwort hinzufügen",
          correctAnswers: "Korrekte Antworten",
          saveQuestion: "Frage speichern",
          cancel: "Abbrechen",
          editQuestion: "Frage bearbeiten",
          deleteQuestion: "Frage löschen"
        },
        deleteConfirm: {
          title: "Fragenstapel löschen",
          message: "Bist du sicher, dass du diesen Fragenstapel löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.",
          confirm: "Löschen",
          cancel: "Abbrechen"
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
      accountSettings: {
        title: "Account-Einstellungen",
        subtitle: "Verwalten Sie Ihre persönlichen Daten",
        name: "Name",
        email: "E-Mail",
        currentPassword: "Aktuelles Passwort",
        newPassword: "Neues Passwort",
        confirmPassword: "Passwort bestätigen",
        updateButton: "Aktualisieren",
        success: "Account erfolgreich aktualisiert",
        error: "Fehler beim Aktualisieren des Accounts",
        passwordMismatch: "Passwörter stimmen nicht überein",
        invalidCurrentPassword: "Aktuelles Passwort ist falsch"
      },
      userManagement: {
        title: "Benutzerverwaltung",
        subtitle: "Erstellen und verwalten Sie Benutzer",
        createUser: "Neuen Benutzer erstellen",
        name: "Name",
        email: "E-Mail",
        password: "Passwort",
        confirmPassword: "Passwort bestätigen",
        role: "Rolle",
        admin: "Administrator",
        user: "Benutzer",
        createButton: "Benutzer erstellen",
        success: "Benutzer erfolgreich erstellt",
        error: "Fehler beim Erstellen des Benutzers",
        emailExists: "E-Mail-Adresse bereits vorhanden",
        passwordMismatch: "Passwörter stimmen nicht überein"
      },
      header: {
        backToHome: "Zurück zur Startseite",
        backToDashboard: "Zurück zum Admin-Dashboard",
        logout: "Logout"
      },
      quizStart: {
        title: "Quiz starten",
        subtitle: "Bereit für das Quiz? Hier geht's los!",
        quizLabel: "Quiz:",
        description: "Teste dein Wissen mit diesem spannenden Quiz!",
        instructions: {
          title: "Anweisungen:",
          items: [
            "Beantworte alle Fragen sorgfältig",
            "Du kannst jederzeit zwischen den Fragen wechseln",
            "Überprüfe deine Antworten vor dem Absenden",
            "Viel Erfolg!"
          ]
        },
        startButton: "Quiz starten",
        starting: "Wird gestartet...",
        backToHome: "Zurück zur Startseite"
      },
      quizDisplay: {
        title: "Quiz-Vorschau",
        randomQuestion: "Zufällige Frage",
        fromStack: "Aus Fragenstapel",
        startQuiz: "Quiz starten",
        notFound: {
          title: "Quiz nicht gefunden",
          description: "Das angeforderte Quiz konnte nicht gefunden werden."
        }
      },
      quizExecution: {
        pageCounter: "Seite {current} von {total}",
        backButton: "Zurück",
        nextButton: "Weiter",
        submitButton: "Abgeben",
        congratulations: "Glückwunsch!",
        quizCompleted: "Quiz erfolgreich abgeschlossen!",
        backToHome: "Zurück zur Startseite",
        resultsTitle: "Quiz abgeschlossen!",
        loadingResults: "Lade Ergebnisse...",
        resultsNotFound: "Ergebnisse nicht gefunden",
        resultsNotFoundDesc: "Die Quiz-Ergebnisse konnten nicht geladen werden.",
        detailedEvaluation: "Detaillierte Auswertung",
        question: "Frage",
        correct: "Richtig",
        incorrect: "Falsch",
        multipleChoice: "Mehrfachauswahl",
        singleChoice: "Einfachauswahl",
        yourAnswer: "Deine Antwort",
        correctAnswer: "Richtige Antwort",
        noAnswerSelected: "Keine Antwort ausgewählt",
        noCorrectAnswer: "Keine korrekte Antwort definiert",
        multipleChoiceHint: "Mehrfachauswahl: Teilpunkte werden für richtige und falsche Antworten vergeben",
        retryQuiz: "Quiz nochmal machen",
        of: "von",
        notFound: {
          title: "Quiz nicht gefunden",
          description: "Das angeforderte Quiz konnte nicht gefunden werden.",
          backToHome: "Zurück zur Startseite"
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

  // Ensure admin user exists on app startup
  useEffect(() => {
    const ensureAdmin = async () => {
      try {
        await fetch('/api/ensure-admin', { method: 'POST' })
      } catch (error) {
        console.error('Failed to ensure admin user:', error)
      }
    }
    
    ensureAdmin()
  }, [])

  // Load translations from local files
  useEffect(() => {
    console.log('Language changed to:', language)
    const loadTranslations = async () => {
      setIsTranslating(true)
      try {
        // Load translations from local JSON files
        const response = await fetch(`/locals/${language}/translation.json`)
        if (response.ok) {
          const translations = await response.json()
          console.log(`Loaded local translations for ${language}:`, translations)
          console.log('Home section:', translations.home)
          console.log('Home subtitle:', translations.home?.subtitle)
          setTranslations(translations)
        } else {
          console.warn(`Failed to load translations for ${language}, falling back to German`)
          setTranslations(germanTranslations)
        }
      } catch (error) {
        console.error('Failed to load translations:', error)
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
    setLanguageState(lang)
    localStorage.setItem('quickpoll-language', lang)
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('quickpoll-theme', newTheme)
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
      isTranslating
    }}>
      {children}
    </AppContext.Provider>
  )
}
