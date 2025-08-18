'use client'

import { useState } from 'react'
import { LikertScale } from '@/components/ui/likert-scale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestLikertPage() {
  const [value, setValue] = useState<number | undefined>()

  const handleChange = (newValue: number) => {
    console.log('🔥 TestLikert - Valor recebido:', newValue)
    setValue(newValue)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Teste do Componente LikertScale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-lg">Esta é uma questão de teste para verificar se os cliques funcionam.</p>
            
            <LikertScale
              question="Você concorda com esta afirmação de teste?"
              value={value}
              onChange={handleChange}
            />
            
            <div className="mt-6 p-4 bg-gray-100 rounded">
              <p><strong>Valor selecionado:</strong> {value || 'Nenhum'}</p>
              <p><strong>Status:</strong> {value ? 'Respondido' : 'Aguardando resposta'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}