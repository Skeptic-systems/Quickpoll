'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginOverlay } from '@/components/login-overlay'
import { useApp } from '@/components/app-provider'

export default function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { translations } = useApp()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include'
        })
        if (response.ok) {
          setIsAuthenticated(true)
          router.push('/admin')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })
      if (response.ok) {
        setIsAuthenticated(true)
        router.push('/admin')
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect to /admin
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Admin Dashboard Preview */}
      <div className="absolute inset-0 opacity-30">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-orange-300/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-orange-300/30 to-orange-400/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-200/30 to-orange-300/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-orange-300/30 to-orange-400/30 rounded-full blur-xl"></div>
        
        {/* Mock Admin Dashboard Elements */}
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-96 h-64 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm rounded-2xl border border-orange-200/30 dark:border-slate-700/30">
          <div className="p-6">
            <div className="h-4 bg-orange-200/40 dark:bg-slate-600/40 rounded mb-4"></div>
            <div className="h-3 bg-orange-200/30 dark:bg-slate-600/30 rounded mb-2 w-3/4"></div>
            <div className="h-3 bg-orange-200/30 dark:bg-slate-600/30 rounded mb-4 w-1/2"></div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="h-16 bg-orange-200/30 dark:bg-slate-600/30 rounded-lg"></div>
              <div className="h-16 bg-orange-200/30 dark:bg-slate-600/30 rounded-lg"></div>
              <div className="h-16 bg-orange-200/30 dark:bg-slate-600/30 rounded-lg"></div>
            </div>
            <div className="h-20 bg-orange-200/20 dark:bg-slate-600/20 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Login Overlay */}
      <LoginOverlay onLogin={handleLogin} />
    </div>
  )
}
