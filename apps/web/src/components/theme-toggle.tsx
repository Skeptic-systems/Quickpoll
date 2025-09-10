'use client'

import { Sun, Moon } from '@phosphor-icons/react/dist/ssr'
import { useApp } from './app-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useApp()

  const toggleTheme = () => {
    // Toggle between light and dark, but always use browser preference as base
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return (
    <button 
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      title={theme === 'light' ? 'Zu Dunkelmodus wechseln' : 'Zu Hellmodus wechseln'}
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-slate-700 dark:text-slate-300" />
      ) : (
        <Sun size={20} className="text-slate-700 dark:text-slate-300" />
      )}
    </button>
  )
}