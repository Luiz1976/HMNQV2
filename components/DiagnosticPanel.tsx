'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

interface DiagnosticResult {
  test: string
  status: 'success' | 'error' | 'warning'
  message: string
  details?: any
}

export default function DiagnosticPanel() {
  const { data: session, status } = useSession()
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostics = async () => {
    setIsRunning(true)
    const diagnostics: DiagnosticResult[] = []

    // Test 1: Session Status
    diagnostics.push({
      test: 'Autenticação',
      status: session ? 'success' : 'error',
      message: session ? `Usuário logado: ${session.user?.email}` : 'Usuário não autenticado',
      details: { sessionStatus: status, userId: session?.user?.id }
    })

    // Test 2: API Session
    try {
      const sessionResponse = await fetch('/api/auth/session')
      const sessionData = await sessionResponse.json()
      
      diagnostics.push({
        test: 'API de Sessão',
        status: sessionResponse.ok ? 'success' : 'error',
        message: sessionResponse.ok ? 'API de sessão funcionando' : `Erro ${sessionResponse.status}`,
        details: sessionData
      })
    } catch (error) {
      diagnostics.push({
        test: 'API de Sessão',
        status: 'error',
        message: 'Erro ao conectar com API de sessão',
        details: error
      })
    }

    // Test 3: Results API
    if (session) {
      try {
        const resultsResponse = await fetch('/api/colaborador/resultados?page=1&limit=5')
        const resultsData = await resultsResponse.json()
        
        diagnostics.push({
          test: 'API de Resultados',
          status: resultsResponse.ok ? 'success' : 'error',
          message: resultsResponse.ok 
            ? `API funcionando. ${resultsData.results?.length || 0} resultados encontrados`
            : `Erro ${resultsResponse.status}: ${resultsData.error || 'Erro desconhecido'}`,
          details: resultsData
        })
      } catch (error) {
        diagnostics.push({
          test: 'API de Resultados',
          status: 'error',
          message: 'Erro ao conectar com API de resultados',
          details: error
        })
      }
    } else {
      diagnostics.push({
        test: 'API de Resultados',
        status: 'warning',
        message: 'Não testado - usuário não autenticado',
        details: null
      })
    }

    // Test 4: Debug Session API
    try {
      const debugResponse = await fetch('/api/debug/session')
      const debugData = await debugResponse.json()
      
      diagnostics.push({
        test: 'Debug de Sessão',
        status: debugData.debug?.hasSession ? 'success' : 'error',
        message: debugData.debug?.hasSession 
          ? `Sessão encontrada no servidor para ${debugData.debug.sessionUser?.email}`
          : 'Nenhuma sessão encontrada no servidor',
        details: debugData.debug
      })
    } catch (error) {
      diagnostics.push({
        test: 'Debug de Sessão',
        status: 'error',
        message: 'Erro ao conectar com API de debug',
        details: error
      })
    }

    // Test 5: Browser Storage
    const cookies = document.cookie
    const hasSessionToken = cookies.includes('next-auth.session-token')
    
    diagnostics.push({
      test: 'Cookies de Sessão (Cliente)',
      status: hasSessionToken ? 'success' : 'warning',
      message: hasSessionToken ? 'Token de sessão presente no cliente' : 'Token de sessão ausente no cliente',
      details: { cookies: cookies.split(';').map(c => c.trim()) }
    })

    // Test 6: JavaScript Errors
    const jsErrors = (window as any).__diagnosticErrors || []
    diagnostics.push({
      test: 'Erros JavaScript',
      status: jsErrors.length === 0 ? 'success' : 'error',
      message: jsErrors.length === 0 ? 'Nenhum erro detectado' : `${jsErrors.length} erro(s) detectado(s)`,
      details: jsErrors
    })

    setResults(diagnostics)
    setIsRunning(false)
  }

  useEffect(() => {
    // Capturar erros JavaScript
    const errors: any[] = []
    const originalError = window.onerror
    
    window.onerror = (message, source, lineno, colno, error) => {
      errors.push({ message, source, lineno, colno, error: error?.toString() })
      ;(window as any).__diagnosticErrors = errors
      if (originalError) originalError(message, source, lineno, colno, error)
    }

    return () => {
      window.onerror = originalError
    }
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Diagnóstico do Sistema</span>
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            size="sm"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isRunning ? 'Executando...' : 'Executar Diagnóstico'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            Clique em "Executar Diagnóstico" para verificar o status do sistema
          </p>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-2 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(result.status)}
                    <span className="font-semibold">{result.test}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{result.message}</p>
                {result.details && (
                  <details className="text-xs text-gray-600">
                    <summary className="cursor-pointer hover:text-gray-800">
                      Ver detalhes
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-32">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}