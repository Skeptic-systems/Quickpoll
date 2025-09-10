'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ThemeToggle } from './theme-toggle'
import { LanguageSwitcher } from './language-switcher'
import { useApp } from './app-provider'

export function AdminHeader() {
  const [isDark, setIsDark] = useState(false)
  const { translations } = useApp()

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark') ||
        (!document.documentElement.classList.contains('light') && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)
      setIsDark(isDarkMode)
    }

    checkTheme()

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => checkTheme()
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  if (!translations) {
    return null
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-orange-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Image
              src={isDark ? '/dark-logo.svg' : '/light-logo.svg'}
              alt="Quickpoll"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <h1 className="text-xl font-bold text-orange-600 dark:text-orange-400">
              Quickpoll Admin
            </h1>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link
              href="/"
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-base font-medium"
            >
              {translations?.admin.header.backToHome}
            </Link>
            <button
              onClick={async () => {
                try {
                  await fetch('/api/logout', {
                    method: 'POST',
                    credentials: 'include'
                  })
                  window.location.href = '/'
                } catch (error) {
                  console.error('Logout error:', error)
                  window.location.href = '/'
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base"
            >
              {translations?.admin.header.logout}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
