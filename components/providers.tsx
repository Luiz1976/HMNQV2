
'use client'

// HumaniQ AI - Application Providers
// Wraps the app with necessary providers

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from './theme-provider'
import { Toaster } from 'sonner'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </ThemeProvider>
    </SessionProvider>
  )
}
