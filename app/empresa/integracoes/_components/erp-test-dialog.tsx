
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TestTube, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ERPConfig {
  id: string
  name: string
  erpType: string
  apiUrl: string
}

interface ERPTestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: ERPConfig | null
}

export function ERPTestDialog({ open, onOpenChange, config }: ERPTestDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const handleTest = async () => {
    if (!config) return

    try {
      setIsLoading(true)
      setTestResult(null)

      const response = await fetch('/api/erp/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ erpConfigId: config.id })
      })

      const result = await response.json()
      setTestResult(result)

      if (result.success) {
        toast.success('Teste de conexão bem-sucedido!')
      } else {
        toast.error('Falha no teste de conexão')
      }
    } catch (error) {
      const errorResult = {
        success: false,
        message: 'Erro ao executar teste',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      setTestResult(errorResult)
      toast.error('Erro ao executar teste')
    } finally {
      setIsLoading(false)
    }
  }

  if (!config) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Teste de Conectividade</DialogTitle>
          <DialogDescription>
            Teste a conexão com {config.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Integração:</span>
                  <span className="font-medium">{config.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tipo:</span>
                  <Badge variant="outline">{config.erpType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">URL:</span>
                  <span className="text-sm font-mono">{config.apiUrl}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleTest}
            disabled={isLoading}
            className="w-full"
          >
            <TestTube className={`mr-2 h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
            {isLoading ? 'Testando...' : 'Executar Teste'}
          </Button>

          {testResult && (
            <Card className={`${testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  {testResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 space-y-2">
                    <h4 className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                      {testResult.success ? 'Conexão Bem-sucedida' : 'Falha na Conexão'}
                    </h4>
                    <p className={`text-sm ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                      {testResult.message}
                    </p>
                    {testResult.error && (
                      <div className="text-sm text-red-600 bg-white p-2 rounded border">
                        <strong>Erro:</strong> {testResult.error}
                      </div>
                    )}
                    {testResult.details && (
                      <details className="text-sm">
                        <summary className="cursor-pointer font-medium mb-2">
                          Detalhes técnicos
                        </summary>
                        <pre className="text-xs bg-white p-2 rounded border overflow-auto">
                          {JSON.stringify(testResult.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
