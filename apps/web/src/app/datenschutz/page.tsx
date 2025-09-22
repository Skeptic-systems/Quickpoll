'use client'

import { Button } from '@/components/ui'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import Link from 'next/link'
import Image from 'next/image'
import { useApp } from '@/components/app-provider'

export default function DatenschutzPage() {
  const { translations } = useApp()
  if (!translations) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-orange-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
                  {translations.common.quickpoll}
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            {translations.datenschutz.title}
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-6">
              <p className="text-slate-700 dark:text-slate-300">
                {translations.datenschutz.summary}
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <Link href="/">
              <span className="px-6 py-2 inline-flex bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                {translations.admin.header.backToHome}
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}