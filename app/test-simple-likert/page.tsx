'use client'

import { useState } from 'react'

export default function TestSimpleLikertPage() {
  const [selectedValue, setSelectedValue] = useState<number | undefined>()
  const [clickCount, setClickCount] = useState(0)

  const handleButtonClick = (value: number) => {
    console.log('🚀 SIMPLE TEST - Botão clicado:', value)
    console.log('🚀 SIMPLE TEST - Timestamp:', new Date().toISOString())
    
    setSelectedValue(value)
    setClickCount(prev => prev + 1)
    
    alert(`Botão ${value} funcionou! Cliques: ${clickCount + 1}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-8">
          🔧 Teste Simples - Botões Básicos
        </h1>
        
        <div className="mb-6 p-4 bg-blue-50 rounded">
          <p><strong>Valor Selecionado:</strong> {selectedValue || 'Nenhum'}</p>
          <p><strong>Total de Cliques:</strong> {clickCount}</p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Clique em qualquer botão:
          </h2>
          
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleButtonClick(value)}
                onMouseDown={(e) => {
                  console.log('🚀 MOUSE DOWN:', value)
                  e.preventDefault()
                }}
                className={`
                  w-12 h-12 rounded-full border-2 font-bold text-lg
                  transition-all duration-200 cursor-pointer
                  hover:scale-110 active:scale-95
                  ${
                    selectedValue === value
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }
                `}
                style={{
                  pointerEvents: 'auto',
                  zIndex: 10,
                  position: 'relative'
                }}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setSelectedValue(undefined)
              setClickCount(0)
              console.log('🚀 RESET - Teste resetado')
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Resetar
          </button>
          
          <button
            onClick={() => {
              console.log('🚀 MANUAL TEST - Botão manual funcionando')
              alert('Teste manual OK!')
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Teste Manual
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 rounded text-sm">
          <h3 className="font-semibold mb-2">📋 Instruções:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Clique nos botões numerados (1-5)</li>
            <li>Verifique se o valor aparece acima</li>
            <li>Observe os logs no console (F12)</li>
            <li>Deve aparecer um alert a cada clique</li>
          </ul>
        </div>
      </div>
    </div>
  )
}