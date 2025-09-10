'use client'

import { useState } from 'react'
import { Eye, EyeSlash, CheckCircle, XCircle } from '@phosphor-icons/react/dist/ssr'

interface PasswordChangeModalProps {
  user: {
    id: string
    email: string
    name: string
    role: string
    isFirstLogin: boolean
  }
  onSuccess: () => void
}

export function PasswordChangeModal({ user, onSuccess }: PasswordChangeModalProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newEmail, setNewEmail] = useState(user.email)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const validatePassword = (password: string) => {
    if (password.length < 8) return 'Passwort muss mindestens 8 Zeichen lang sein'
    if (!/(?=.*[a-z])/.test(password)) return 'Passwort muss mindestens einen Kleinbuchstaben enthalten'
    if (!/(?=.*[A-Z])/.test(password)) return 'Passwort muss mindestens einen Großbuchstaben enthalten'
    if (!/(?=.*\d)/.test(password)) return 'Passwort muss mindestens eine Zahl enthalten'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Die neuen Passwörter stimmen nicht überein')
      setIsLoading(false)
      return
    }

    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      setError(passwordError)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword,
          newEmail: newEmail !== user.email ? newEmail : undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        setError(data.message || 'Fehler beim Ändern des Passworts')
      }
    } catch (err) {
      console.error('Password update error:', err)
      setError('Ein Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/50 max-w-md w-full mx-4">
          <div className="text-center">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              Erfolgreich!
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Ihr Passwort wurde erfolgreich geändert. Sie werden weitergeleitet...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/50 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Passwort ändern
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Für Ihre Sicherheit müssen Sie Ihr Passwort beim ersten Login ändern
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle size={20} className="text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              E-Mail-Adresse (optional)
            </label>
            <input
              type="email"
              id="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="neue@email.com"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Neues Passwort
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
              >
                {showNewPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Mindestens 8 Zeichen, Groß- und Kleinbuchstaben, Zahlen
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Neues Passwort bestätigen
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
              >
                {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Wird geändert...' : 'Passwort ändern'}
          </button>
        </form>
      </div>
    </div>
  )
}
