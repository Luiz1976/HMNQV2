
// HumaniQ AI - Signup Page
// User registration

import { Metadata } from 'next'
import { SignupForm } from './signup-form'
import Link from 'next/link'
import { Brain } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cadastro',
  description: 'Crie sua conta HumaniQ AI',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Image/Content */}
      <div className="hidden lg:flex lg:flex-1 gradient-bg text-white">
        <div className="flex flex-col justify-center px-12">
          <h1 className="text-4xl font-bold mb-6">
            Comece sua jornada
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Crie sua conta e revolucione suas avaliações psicossociais com IA.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Teste grátis por 30 dias</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>18 tipos de testes inclusos</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Suporte técnico especializado</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Sem compromisso ou fidelidade</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
              <Brain className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold gradient-text">HumaniQ AI</span>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Crie sua conta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Entre aqui
              </Link>
            </p>
          </div>

          <SignupForm />

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Ao criar uma conta, você concorda com nossos{' '}
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
    </div>
  )
}
