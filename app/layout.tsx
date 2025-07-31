
// HumaniQ AI - Root Layout
// Main layout with providers and global styles

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { APP_CONFIG } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.name,
    template: `%s | ${APP_CONFIG.name}`
  },
  description: APP_CONFIG.description,
  keywords: [
    'avaliação psicossocial',
    'psicologia organizacional',
    'teste de personalidade',
    'recursos humanos',
    'saas',
    'inteligência artificial'
  ],
  authors: [{ name: 'HumaniQ AI Team' }],
  creator: 'HumaniQ AI',
  publisher: 'HumaniQ AI',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://humaniq-ai.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background font-sans antialiased">
            <main className="relative">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
