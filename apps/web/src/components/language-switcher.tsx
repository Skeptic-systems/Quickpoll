'use client'

import { useApp } from './app-provider'

export function LanguageSwitcher() {
  const { language, setLanguage } = useApp()

  const languages = [
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' }
  ] as const

  const currentLanguage = languages.find(l => l.value === language) || languages[0]

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
        <span className="text-sm sm:text-lg">{currentLanguage.flag}</span>
        <span className="text-xs sm:text-sm font-medium hidden sm:block">{currentLanguage.label}</span>
      </button>
      
      <div className="absolute right-0 top-full mt-2 w-32 sm:w-36 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.value}
            onClick={() => {
              console.log('Language changed to:', lang.value)
              setLanguage(lang.value)
            }}
            className={`w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg transition-colors ${
              language === lang.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            <span className="text-sm sm:text-lg">{lang.flag}</span>
            <span className="text-xs sm:text-sm">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
