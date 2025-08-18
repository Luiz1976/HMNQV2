'use client'

import { useState } from 'react'
import { LikertScale } from '@/components/ui/likert-scale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TestLikertDebugPage() {
  const [value, setValue] = useState<number | undefined>()
  const [clickCount, setClickCount] = useState(0)

  const handleChange = (newValue: number) => {
    console.log('🔥🔥🔥 DEBUG - Valor recebido no handleChange:', newValue)
    console.log('🔥🔥🔥 DEBUG - Timestamp:', new Date().toISOString())
    console.log('🔥🔥🔥 DEBUG - Valor anterior:', value)
    
    setValue(newValue)
    setClickCount(prev => prev + 1)
    
    // Alert para garantir que a função foi chamada
    alert(`Botão ${newValue} clicado! Total de cliques: ${clickCount + 1}`)
  }

  const resetTest = () => {
    setValue(undefined)
    setClickCount(0)
    console.log('🔥🔥🔥 DEBUG - Teste resetado')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              🔧 Teste de Debug - LikertScale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Display */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Status do Teste:</h3>
              <p><strong>Valor Selecionado:</strong> {value || 'Nenhum'}</p>
              <p><strong>Total de Cliques:</strong> {clickCount}</p>
              <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
            </div>

            {/* Test Question */}
            <div className="bg-white p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-6 text-center">
                Esta é uma questão de teste para verificar se os botões funcionam
              </h2>
              
              {/* LikertScale Component */}
              <LikertScale
                question="Clique em qualquer botão para testar:"
                value={value}
                onChange={handleChange}
                hideQuestion={false}
              />
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button 
                onClick={resetTest}
                variant="outline"
                className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
              >
                🔄 Resetar Teste
              </Button>
              
              <Button 
                onClick={() => {
                  console.log('🔥🔥🔥 DEBUG - Botão de log manual clicado')
                  alert('Botão de teste manual funcionando!')
                }}
                variant="outline"
                className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
              >
                ✅ Teste Manual
              </Button>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">📋 Instruções:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Clique em qualquer botão numerado (1-5) da escala</li>
                <li>Verifique se o valor aparece no "Status do Teste"</li>
                <li>Observe os logs no console do navegador (F12)</li>
                <li>Deve aparecer um alert quando clicar nos botões</li>
                <li>Use "Resetar Teste" para limpar e testar novamente</li>
              </ul>
            </div>

            {/* Debug Info */}
            <div className="bg-gray-50 p-4 rounded-lg text-xs">
              <h3 className="font-semibold mb-2">🔍 Debug Info:</h3>
              <p><strong>Component Path:</strong> @/components/ui/likert-scale</p>
              <p><strong>Test Page:</strong> /test-likert-debug</p>
              <p><strong>React State:</strong> {JSON.stringify({ value, clickCount })}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}