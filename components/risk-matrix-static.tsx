'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RiskMatrixStaticProps {
  className?: string
  title?: string
}

const RiskMatrixStatic: React.FC<RiskMatrixStaticProps> = ({ 
  className = "",
  title = "MATRIZ QUANTITATIVA DE RISCOS"
}) => {
  // Definir os rótulos dos eixos
  const probabilityLabels = [
    'QUASE CERTO',
    'PROVÁVEL', 
    'POSSÍVEL',
    'POUCO PROVÁVEL',
    'RARO'
  ]
  
  const consequenceLabels = [
    'DESPREZÍVEL',
    'MARGINAL',
    'MÉDIA',
    'CRÍTICA',
    'EXTREMA'
  ]
  
  // Definir a matriz de riscos conforme a imagem
  const riskMatrix = [
    // QUASE CERTO
    [
      { level: 'ACEITÁVEL', color: '#22c55e', textColor: 'white' },
      { level: 'MODERADO', color: '#f59e0b', textColor: 'white' },
      { level: 'SUBSTANCIAL', color: '#f97316', textColor: 'white' },
      { level: 'INTOLERÁVEL', color: '#dc2626', textColor: 'white' },
      { level: 'INTOLERÁVEL', color: '#dc2626', textColor: 'white' }
    ],
    // PROVÁVEL
    [
      { level: 'TRIVIAL', color: '#3b82f6', textColor: 'white' },
      { level: 'ACEITÁVEL', color: '#22c55e', textColor: 'white' },
      { level: 'MODERADO', color: '#f59e0b', textColor: 'white' },
      { level: 'SUBSTANCIAL', color: '#f97316', textColor: 'white' },
      { level: 'INTOLERÁVEL', color: '#dc2626', textColor: 'white' }
    ],
    // POSSÍVEL
    [
      { level: 'TRIVIAL', color: '#3b82f6', textColor: 'white' },
      { level: 'ACEITÁVEL', color: '#22c55e', textColor: 'white' },
      { level: 'MODERADO', color: '#f59e0b', textColor: 'white' },
      { level: 'SUBSTANCIAL', color: '#f97316', textColor: 'white' },
      { level: 'INTOLERÁVEL', color: '#dc2626', textColor: 'white' }
    ],
    // POUCO PROVÁVEL
    [
      { level: 'TRIVIAL', color: '#3b82f6', textColor: 'white' },
      { level: 'ACEITÁVEL', color: '#22c55e', textColor: 'white' },
      { level: 'MODERADO', color: '#f59e0b', textColor: 'white' },
      { level: 'MODERADO', color: '#f59e0b', textColor: 'white' },
      { level: 'SUBSTANCIAL', color: '#f97316', textColor: 'white' }
    ],
    // RARO
    [
      { level: 'TRIVIAL', color: '#3b82f6', textColor: 'white' },
      { level: 'TRIVIAL', color: '#3b82f6', textColor: 'white' },
      { level: 'ACEITÁVEL', color: '#22c55e', textColor: 'white' },
      { level: 'MODERADO', color: '#f59e0b', textColor: 'white' },
      { level: 'MODERADO', color: '#f59e0b', textColor: 'white' }
    ]
  ]
  
  return (
    <Card className={`${className} bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-xl font-bold text-slate-800 dark:text-slate-200">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Tabela da matriz */}
            <div className="grid grid-cols-6 gap-0 border-2 border-black">
              {/* Célula vazia no canto superior esquerdo */}
              <div className="bg-black border border-black"></div>
              
              {/* Cabeçalho das consequências */}
              {consequenceLabels.map((label, index) => (
                <div 
                  key={index}
                  className="bg-black text-white text-xs font-bold p-3 text-center border border-black min-h-[60px] flex items-center justify-center"
                >
                  {label}
                </div>
              ))}
              
              {/* Linhas da matriz */}
              {probabilityLabels.map((probLabel, probIndex) => (
                <React.Fragment key={probIndex}>
                  {/* Rótulo da probabilidade */}
                  <div className="bg-black text-white text-xs font-bold p-3 text-center border border-black min-h-[60px] flex items-center justify-center">
                    <div className="transform -rotate-90 whitespace-nowrap">
                      {probLabel}
                    </div>
                  </div>
                  
                  {/* Células da matriz */}
                  {riskMatrix[probIndex].map((cell, consIndex) => (
                    <div 
                      key={consIndex}
                      className="text-xs font-bold p-3 text-center border border-white min-h-[60px] flex items-center justify-center"
                      style={{ 
                        backgroundColor: cell.color,
                        color: cell.textColor
                      }}
                    >
                      {cell.level}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
            
            {/* Rótulo do eixo Y (Probabilidade) */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90">
              <div className="text-lg font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                PROBABILIDADE
              </div>
            </div>
          </div>
          
          {/* Rótulo do eixo X (Consequência) */}
          <div className="text-center mt-4">
            <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
              CONSEQUÊNCIA
            </div>
          </div>
        </div>
        
        {/* Legenda */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 border border-gray-300"></div>
            <span className="text-xs font-medium">TRIVIAL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 border border-gray-300"></div>
            <span className="text-xs font-medium">ACEITÁVEL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 border border-gray-300"></div>
            <span className="text-xs font-medium">MODERADO</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 border border-gray-300"></div>
            <span className="text-xs font-medium">SUBSTANCIAL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 border border-gray-300"></div>
            <span className="text-xs font-medium">INTOLERÁVEL</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RiskMatrixStatic