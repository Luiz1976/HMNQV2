
// HumaniQ AI - Login Page
// User authentication with NextAuth

import { Metadata } from 'next'
import { LoginForm } from './login-form'
import Link from 'next/link'
import { Brain } from 'lucide-react'
import { Suspense } from 'react'
import AuthErrorBoundary from '@/components/auth/AuthErrorBoundary'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Entre na sua conta HumaniQ AI',
}

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%), url('/humaniq-login-bg.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Overlay escuro para legibilidade */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative z-10 w-full max-w-sm sm:max-w-md px-4 sm:px-6 lg:px-8">
        <div className="w-full space-y-6 sm:space-y-8">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center space-x-2 mb-6 sm:mb-8">
              <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              <span className="text-xl sm:text-2xl font-bold gradient-text">HumaniQ AI</span>
            </Link>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Entre na sua conta
            </h2>
            <p className="mt-2 text-sm text-gray-200">
              Não tem uma conta?{' '}
              <Link
                href="/auth/signup"
                className="font-medium text-blue-300 hover:text-blue-200 transition-colors"
              >
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>

          <AuthErrorBoundary>
            <Suspense fallback={
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            }>
              <LoginForm />
            </Suspense>
          </AuthErrorBoundary>

          <div className="text-center">
            <p className="text-xs text-gray-300">
              Ao entrar, você concorda com nossos{' '}
              <Link href="/terms" className="text-blue-300 hover:text-blue-200 underline">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link href="/privacy" className="text-blue-300 hover:text-blue-200 underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
