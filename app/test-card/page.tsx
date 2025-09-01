'use client'

import { TestResultCard } from '@/components/ui/test-result-card'

export default function TestCardPage() {
  console.log('🔍 TestCardPage renderizando...')
  
  const mockData = {
    id: 'test-123',
    title: 'Teste de Personalidade DISC',
    category: 'Personalidade',
    testType: 'PERSONALITY' as const,
    completedAt: new Date().toISOString(),
    overallScore: 85,
    status: 'CONCLUIDO' as const,
    chartData: [
      { name: 'Dominância', value: 85, fullMark: 100 },
      { name: 'Influência', value: 70, fullMark: 100 },
      { name: 'Estabilidade', value: 60, fullMark: 100 },
      { name: 'Conformidade', value: 75, fullMark: 100 }
    ],
    percentile: 85,
    aiAnalysis: {
      id: 'ai-analysis-123',
      analysis: 'Análise detalhada do perfil DISC mostrando forte dominância e boa influência.',
      confidence: 0.85,
      analysisType: 'COMPREHENSIVE',
      metadata: {},
      createdAt: new Date().toISOString(),
      hasAnalysis: true
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Teste de Renderização do Card</h1>
        
        <div className="bg-yellow-200 border border-yellow-400 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Debug Info</h2>
          <p className="text-yellow-700">Se você consegue ver este aviso amarelo, o React está funcionando.</p>
          <p className="text-yellow-700">O card deve aparecer abaixo com borda vermelha e fundo vermelho.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TestResultCard
            {...mockData}
            onView={() => {
              console.log('🔍 Botão Visualizar clicado')
              alert('Botão Visualizar funcionando!')
            }}
            onDownloadPDF={() => {
              console.log('📄 Botão PDF clicado')
              alert('Botão PDF funcionando!')
            }}
            isLoadingPDF={false}
          />
        </div>
        
        <div className="mt-8 bg-blue-100 border border-blue-400 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Resultados Esperados</h2>
          <ul className="text-blue-700 space-y-1">
            <li>✅ Card com borda vermelha e fundo vermelho deve ser visível</li>
            <li>✅ Título "Teste de Personalidade DISC" deve aparecer</li>
            <li>✅ Pontuação "85%" deve ser exibida</li>
            <li>✅ Botões "Visualizar" e "PDF" devem funcionar</li>
          </ul>
        </div>
        
        <div className="mt-4 bg-red-100 border border-red-400 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Se o card não aparecer:</h2>
          <ul className="text-red-700 space-y-1">
            <li>🔍 Verifique o console do navegador para erros</li>
            <li>🔍 Problema pode estar no componente TestResultCard</li>
            <li>🔍 Problema pode estar no componente MiniChart</li>
            <li>🔍 Problema pode estar nas dependências do Recharts</li>
          </ul>
        </div>
      </div>
    </div>
  )
}