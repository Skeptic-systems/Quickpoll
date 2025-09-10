'use client'

import { useState } from 'react'
import { useApp } from '@/components/app-provider'

export default function TranslationTest() {
  const { translateText, language, setLanguage } = useApp()
  const [testText, setTestText] = useState('Hallo Welt! Das ist ein Test.')
  const [translatedText, setTranslatedText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = async () => {
    setIsTranslating(true)
    try {
      const result = await translateText(testText, language)
      setTranslatedText(result)
    } catch (error) {
      console.error('Translation failed:', error)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Übersetzungs-Test
        </h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Aktuelle Sprache: {language}
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setLanguage('de')}
                className={`px-4 py-2 rounded-lg ${language === 'de' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                Deutsch
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-lg ${language === 'en' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-4 py-2 rounded-lg ${language === 'fr' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                Français
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Text zum Übersetzen:
            </label>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200"
              rows={3}
            />
          </div>

          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isTranslating ? 'Übersetze...' : 'Übersetzen'}
          </button>

          {translatedText && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Übersetztes Ergebnis:
              </label>
              <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border-2 border-orange-200/50 dark:border-slate-700/50">
                <p className="text-slate-900 dark:text-white">{translatedText}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
