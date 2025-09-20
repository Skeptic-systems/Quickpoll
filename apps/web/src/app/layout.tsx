import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppProvider } from '@/components/app-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuickPoll',
  description: 'Mobile-optimierte Quiz-Webapp für Events und Umfragen',
  icons: {
    icon: [
      { url: '/light-logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: [
      { url: '/light-logo.svg', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
