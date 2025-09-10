'use client'

import { Button } from '@/components/ui'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import Link from 'next/link'

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-orange-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/logo.png" alt="Quickpoll" className="h-8 w-8" />
                <h1 className="text-xl font-bold text-orange-600 dark:text-orange-400">Quickpoll</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            Datenschutzerklärung
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Einleitung
              </h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-2">
                <p>Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. In dieser Datenschutzerklärung informieren wir Sie über die Verarbeitung personenbezogener Daten bei der Nutzung unserer Website.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Datenerhebung und -verwendung
              </h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-2">
                <p>Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung unserer Dienstleistungen erforderlich ist.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Cookies
              </h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-2">
                <p>Unsere Website verwendet Cookies, um die Benutzererfahrung zu verbessern und bestimmte Funktionen zu ermöglichen.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Datensicherheit
              </h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-2">
                <p>Wir verwenden angemessene technische und organisatorische Maßnahmen, um Ihre Daten vor unbefugtem Zugriff zu schützen.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Ihre Rechte
              </h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-2">
                <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Widerspruch bezüglich Ihrer personenbezogenen Daten.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Kontakt
              </h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-2">
                <p>Bei Fragen zum Datenschutz können Sie uns unter info@quickpoll.de kontaktieren.</p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <Link href="/">
              <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                Zurück zur Startseite
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}