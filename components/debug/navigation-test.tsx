'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function NavigationTest() {
  const router = useRouter()
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    console.log(logMessage)
    setLogs(prev => [...prev, logMessage])
  }

  const testDirectNavigation = () => {
    addLog('🧪 Testando navegação direta...')
    try {
      const url = '/colaborador/psicossociais/humaniq-valores/introducao'
      addLog(`📍 Navegando para: ${url}`)
      router.push(url)
      addLog('✅ router.push() executado com sucesso')
    } catch (error) {
      addLog(`❌ Erro na navegação: ${error}`)
    }
  }

  const testWindowLocation = () => {
    addLog('🧪 Testando window.location...')
    try {
      const url = '/colaborador/psicossociais/humaniq-valores/introducao'
      addLog(`📍 Navegando para: ${url}`)
      window.location.href = url
      addLog('✅ window.location.href executado')
    } catch (error) {
      addLog(`❌ Erro na navegação: ${error}`)
    }
  }

  const testHandleStartTest = (testId: string) => {
    addLog(`🎯 Testando handleStartTest com testId: ${testId}`)
    
    try {
      if (testId === 'humaniq-valores-001') {
        addLog('📍 Navegando para: /colaborador/psicossociais/humaniq-valores/introducao')
        router.push('/colaborador/psicossociais/humaniq-valores/introducao')
      } else if (testId === 'humaniq-tipos') {
        addLog('📍 Navegando para: /colaborador/psicossociais/humaniq-tipos/introducao')
        router.push('/colaborador/psicossociais/humaniq-tipos/introducao')
      } else if (testId === 'humaniq-disc') {
        addLog('📍 Navegando para: /colaborador/psicossociais/humaniq-disc/introducao')
        router.push('/colaborador/psicossociais/humaniq-disc/introducao')
      } else {
        addLog(`❌ TestId não reconhecido: ${testId}`)
        addLog('💡 Tentando navegação genérica...')
        router.push('/colaborador/psicossociais/humaniq-valores/introducao')
      }
      
      addLog('✅ Comando de navegação executado')
    } catch (error) {
      addLog(`❌ Erro na função handleStartTest: ${error}`)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          🔧 Diagnóstico de Navegação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={testDirectNavigation}
            className="bg-blue-600 hover:bg-blue-700"
          >
            🧪 Testar router.push()
          </Button>
          
          <Button 
            onClick={testWindowLocation}
            className="bg-green-600 hover:bg-green-700"
          >
            🧪 Testar window.location
          </Button>
          
          <Button 
            onClick={() => testHandleStartTest('humaniq-valores-001')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            🧪 Testar HumaniQ Valores
          </Button>
          
          <Button 
            onClick={() => testHandleStartTest('humaniq-tipos')}
            className="bg-orange-600 hover:bg-orange-700"
          >
            🧪 Testar HumaniQ Tipos
          </Button>
          
          <Button 
            onClick={() => testHandleStartTest('humaniq-disc')}
            className="bg-red-600 hover:bg-red-700"
          >
            🧪 Testar HumaniQ DISC
          </Button>
        </div>
        
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">📋 Logs de Diagnóstico</h3>
          <Button 
            onClick={clearLogs}
            variant="outline"
            size="sm"
          >
            🗑️ Limpar Logs
          </Button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center">Nenhum log ainda. Clique em um botão para testar.</p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="text-sm font-mono">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2">📝 Instruções:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Clique nos botões acima para testar diferentes métodos de navegação</li>
            <li>• Verifique os logs aqui e no console do navegador (F12)</li>
            <li>• Se a navegação não funcionar, o problema está identificado</li>
            <li>• Se funcionar aqui mas não nos TestCards, o problema está na implementação dos cards</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}