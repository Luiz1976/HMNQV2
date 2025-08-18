'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface AuthErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface AuthErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>
}

class AuthErrorBoundary extends React.Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Auth Error Boundary caught an error:', error, errorInfo)
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined })
    // Force a page reload to reset the auth state
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultAuthErrorFallback
      return <FallbackComponent error={this.state.error} retry={this.retry} />
    }

    return this.props.children
  }
}

interface AuthErrorFallbackProps {
  error?: Error
  retry: () => void
}

const DefaultAuthErrorFallback: React.FC<AuthErrorFallbackProps> = ({ error, retry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erro de Autenticação
          </h2>
          
          <p className="text-gray-600 mb-6">
            Ocorreu um erro inesperado durante o processo de autenticação. 
            Por favor, tente novamente.
          </p>
          
          {error && process.env.NODE_ENV === 'development' && (
            <details className="mb-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Detalhes do erro (desenvolvimento)
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          
          <button
            onClick={retry}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </button>
          
          <div className="mt-4">
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Voltar ao início
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthErrorBoundary
export { DefaultAuthErrorFallback }
export type { AuthErrorBoundaryProps, AuthErrorFallbackProps }