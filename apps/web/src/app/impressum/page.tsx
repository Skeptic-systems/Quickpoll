'use client'

import { Button } from '@/components/ui'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import Link from 'next/link'

export default function ImpressumPage() {
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
            Impressum
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Angaben gemäß § 5 TMG
              </h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-2">
                <p>Quickpoll</p>
                <p>Musterstraße 123</p>
                <p>12345 Musterstadt</p>
                <p>Deutschland</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Kontakt
              </h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-2">
                <p>E-Mail: info@quickpoll.de</p>
                <p>Telefon: +49 (0) 123 456789</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-2">
                <p>Quickpoll</p>
                <p>Musterstraße 123</p>
                <p>12345 Musterstadt</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Haftungsausschluss
              </h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-2">
                <p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Urheberrecht
              </h2>
              <div className="text-slate-600 dark:text-slate-400 space-y-2">
                <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.</p>
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