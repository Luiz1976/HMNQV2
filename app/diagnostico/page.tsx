'use client'

import { NavigationTest } from '@/components/debug/navigation-test'

export default function DiagnosticoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Página de Diagnóstico
          </h1>
          <p className="text-gray-600">
            Esta página é para diagnosticar problemas de navegação nos botões de teste
          </p>
        </div>
        
        <NavigationTest />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Acesse esta página em: <code className="bg-gray-200 px-2 py-1 rounded">/diagnostico</code>
          </p>
        </div>
      </div>
    </div>
  )
}