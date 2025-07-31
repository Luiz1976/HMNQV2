
// HumaniQ AI - Login Page
// User authentication with NextAuth

import { Metadata } from 'next'
import { LoginForm } from './login-form'
import Link from 'next/link'
import { Brain } from 'lucide-react'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Entre na sua conta HumaniQ AI',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
              <Brain className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold gradient-text">HumaniQ AI</span>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Entre na sua conta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link
                href="/auth/signup"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>

          <Suspense fallback={<div>Carregando...</div>}>
            <LoginForm />
          </Suspense>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Ao entrar, você concorda com nossos{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image/Content */}
      <div className="hidden lg:flex lg:flex-1 gradient-bg text-white">
        <div className="flex flex-col justify-center px-12">
          <h1 className="text-4xl font-bold mb-6">
            Bem-vindo de volta!
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Acesse sua plataforma de avaliações psicossociais com IA avançada.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Análise comportamental em tempo real</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Dashboards interativos e insights</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Integração completa com ERPs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
