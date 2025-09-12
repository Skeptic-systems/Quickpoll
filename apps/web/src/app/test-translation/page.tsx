'use client'

import { useState } from 'react'
import { useApp } from '@/components/app-provider'

export default function TranslationTest() {
  const { translations, language, setLanguage } = useApp()
  const [testText, setTestText] = useState('Hallo Welt! Das ist ein Test.')

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Lokale Übersetzungen Test
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
              Test-Text:
            </label>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-orange-200/50 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500/50 transition-all duration-200"
              rows={3}
            />
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              ✅ Lokale Übersetzungen aktiv!
            </h3>
            <p className="text-green-700 dark:text-green-300">
              Die App verwendet jetzt lokale Übersetzungsdateien anstatt der DeepL API. 
              Alle Übersetzungen werden aus den JSON-Dateien in <code>/public/locals/</code> geladen.
            </p>
          </div>

          {translations && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Aktuelle Übersetzungen (Beispiele):
              </label>
              <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border-2 border-orange-200/50 dark:border-slate-700/50 space-y-2">
                <p><strong>Quickpoll:</strong> {translations.common.quickpoll}</p>
                <p><strong>Login:</strong> {translations.common.login}</p>
                <p><strong>Impressum:</strong> {translations.common.impressum}</p>
                <p><strong>Datenschutz:</strong> {translations.common.datenschutz}</p>
                <p><strong>Powered by AI:</strong> {translations.common.poweredBy}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

