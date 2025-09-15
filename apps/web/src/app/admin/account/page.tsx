'use client'

import { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin-header'
import { LoginOverlay } from '@/components/login-overlay'
import { AccountSettings } from '@/components/account-settings'
import { useApp } from '@/components/app-provider'

export default function AccountPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { translations, language } = useApp()

  useEffect(() => {
    console.log('🔍 Account-Page: Starting authentication check...')
    // Skip auth check since user is already authenticated via BetterAuth
    console.log('✅ Account-Page: Skipping auth check, user already authenticated')
    setIsAuthenticated(true)
    
    /*
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        console.log('🔍 Account-Page: Checking auth via /api/auth/check...')
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include'
        })
        console.log('📡 Account-Page: Auth check response:', response.status)
        if (response.ok) {
          console.log('✅ Account-Page: Auth check successful')
          setIsAuthenticated(true)
        } else {
          console.log('❌ Account-Page: Auth check failed')
        }
      } catch (error) {
        console.error('💥 Account-Page: Auth check failed:', error)
      }
    }
    
    checkAuth()
    */
  }, [])

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, language })
      })

      if (response.ok) {
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
        <AdminHeader />
        <LoginOverlay onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
      <AdminHeader />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-800 dark:from-cyan-400 dark:to-cyan-600 bg-clip-text text-transparent mb-4 pb-2">
            {translations?.admin.accountSettings.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {translations?.admin.accountSettings.subtitle}
          </p>
        </div>

        {/* Account Settings Component */}
        <div className="max-w-2xl mx-auto px-4 sm:px-0">
          <AccountSettings />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-t border-orange-200/50 dark:border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center text-base text-slate-600 dark:text-slate-400">
              <div className="mb-4 sm:mb-0">
                © 2025{' '}
                <a 
                  href="https://skeptic-systems.de" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold transition-colors"
                >
                  Skeptic Systems
                </a>
                . {translations?.common.copyright || 'Alle Rechte vorbehalten.'}
              </div>
              <div className="flex space-x-8">
                <a href="/impressum" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-base font-medium">
                  {translations?.common.impressum || 'Impressum'}
                </a>
                <a href="/datenschutz" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-base font-medium">
                  {translations?.common.datenschutz || 'Datenschutz'}
                </a>
              </div>
            </div>
          </div>
        </footer>
    </div>
  )
}
