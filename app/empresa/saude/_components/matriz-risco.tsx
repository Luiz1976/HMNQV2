'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import React from 'react';

export function MatrizRiscoPsicossocial() {
  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number} | null>(null)
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null)

  const riskMatrix = {
    severity: [
      { level: 'DESPREZÍVEL', label: 'DESPREZÍVEL', description: 'Sem impacto significativo - Teste: 95% dos casos sem consequências' },
      { level: 'MARGINAL', label: 'MARGINAL', description: 'Impacto limitado - Teste: 78% resolvido em 24h' },
      { level: 'MÉDIA', label: 'MÉDIA', description: 'Impacto moderado - Teste: 65% requer intervenção' },
      { level: 'CRÍTICA', label: 'CRÍTICA', description: 'Impacto significativo - Teste: 45% afeta produtividade' },
      { level: 'EXTREMA', label: 'EXTREMA', description: 'Impacto severo - Teste: 25% requer ação imediata' }
    ],
    probability: [
      { level: 'QUASE CERTO', label: 'QUASE CERTO', description: 'Ocorrência > 90% - Teste: 8 em 10 casos confirmados' },
      { level: 'PROVÁVEL', label: 'PROVÁVEL', description: 'Ocorrência 70-90% - Teste: 6 em 10 casos confirmados' },
      { level: 'POSSÍVEL', label: 'POSSÍVEL', description: 'Ocorrência 30-70% - Teste: 4 em 10 casos confirmados' },
      { level: 'POUCO PROVÁVEL', label: 'POUCO PROVÁVEL', description: 'Ocorrência 10-30% - Teste: 2 em 10 casos confirmados' },
      { level: 'RARO', label: 'RARO', description: 'Ocorrência < 10% - Teste: 1 em 10 casos confirmados' }
    ],
    matrix: [
      ['TRIVIAL', 'TRIVIAL', 'ACEITÁVEL', 'MODERADO', 'MODERADO'],
      ['TRIVIAL', 'ACEITÁVEL', 'MODERADO', 'MODERADO', 'SUBSTANCIAL'],
      ['TRIVIAL', 'ACEITÁVEL', 'MODERADO', 'SUBSTANCIAL', 'INTOLERÁVEL'],
      ['ACEITÁVEL', 'MODERADO', 'SUBSTANCIAL', 'INTOLERÁVEL', 'INTOLERÁVEL'],
      ['ACEITÁVEL', 'MODERADO', 'SUBSTANCIAL', 'INTOLERÁVEL', 'INTOLERÁVEL']
    ],
    currentRisk: { severity: 2, probability: 2 },
    testResults: {
      totalTests: 1250,
      completedTests: 1180,
      successRate: 94.4,
      lastUpdate: '2024-01-15'
    }
  }

  const getRiskCellColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'TRIVIAL':
        return 'bg-green-400 text-black hover:bg-green-300';
      case 'ACEITÁVEL':
        return 'bg-green-500 text-white hover:bg-green-400';
      case 'MODERADO':
        return 'bg-yellow-400 text-black hover:bg-yellow-300';
      case 'SUBSTANCIAL':
        return 'bg-orange-500 text-white hover:bg-orange-400';
      case 'INTOLERÁVEL':
        return 'bg-red-600 text-white hover:bg-red-500';
      default:
        return 'bg-gray-300 text-black';
    }
  }

  return (
    <Card className="w-full mx-auto shadow-2xl border-0 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-50 to-white">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <CardTitle className="flex items-center gap-4 text-3xl font-bold relative z-10">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <span className="block text-3xl font-black tracking-tight">MATRIZ QUANTITATIVA</span>
              <span className="block text-xl font-medium opacity-90 mt-1">DE RISCOS</span>
            </div>
          </CardTitle>
        </div>
      <CardContent className="w-full p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Cabeçalho da Matriz */}
              <div className="bg-gradient-to-r from-slate-100 to-gray-100 text-gray-800 p-6 border-b border-gray-200">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-gray-700 tracking-wide">MATRIZ QUANTITATIVA DE RISCOS</div>
                  <div className="text-sm text-gray-500 mt-2">Avaliação de Probabilidade vs Consequência</div>
                  <div className="text-xs text-blue-600 mt-1 font-medium">
                    Baseado em {riskMatrix.testResults.totalTests} testes | Taxa de sucesso: {riskMatrix.testResults.successRate}% | Atualizado: {riskMatrix.testResults.lastUpdate}
                  </div>
                </div>
                <div className="grid grid-cols-6 border-t border-l border-gray-400 bg-white">
                  {/* Cabeçalho integrado: Célula PROBABILIDADE/CONSEQUÊNCIA + Níveis de Severidade */}
                  <div className="bg-gray-800 text-white h-16 flex flex-col items-center justify-center border-r border-b border-gray-400 relative">
                    <div className="text-xs font-bold tracking-wider mb-1">PROBABILIDADE</div>
                    <div className="text-xs font-bold tracking-wider text-gray-300">vs</div>
                    <div className="text-xs font-bold tracking-wider mt-1">CONSEQUÊNCIA</div>
                  </div>
                  {riskMatrix.severity.map((severity, index) => (
                    <div key={index} className="bg-gray-800 text-white h-16 text-center flex items-center justify-center border-r border-b border-gray-400 last:border-r-0">
                      <div className="font-bold text-xs tracking-wide">{severity.level}</div>
                    </div>
                  ))}

                  {/* Linhas da Matriz: Labels de Probabilidade + Células de Risco */}
                  {riskMatrix.probability.slice().reverse().map((prob, probIndex) => (
                    <React.Fragment key={prob.level}>
                      {/* Label de Probabilidade */}
                      <div className="bg-gray-800 text-white text-center h-12 flex items-center justify-center border-b border-r border-gray-400">
                        <div className="font-bold text-xs leading-tight">{prob.level}</div>
                      </div>
                      {/* Células de Risco para esta linha */}
                      {riskMatrix.severity.map((_, severityIndex) => {
                        const originalProbIndex = riskMatrix.probability.length - 1 - probIndex;
                        const cellValue = riskMatrix.matrix[originalProbIndex][severityIndex];
                        const isCurrentRisk = riskMatrix.currentRisk.severity === severityIndex && riskMatrix.currentRisk.probability === originalProbIndex;
                        
                        return (
                          <div
                            key={`${probIndex}-${severityIndex}`}
                            className={`
                              h-12 flex items-center justify-center text-center font-bold text-xs cursor-pointer transition-all duration-200 relative border-b border-r border-gray-400 last:border-r-0
                              ${getRiskCellColor(cellValue)}
                              ${isCurrentRisk ? 'ring-2 ring-blue-600 ring-inset' : ''}
                              ${hoveredCell?.row === originalProbIndex && hoveredCell?.col === severityIndex ? 'ring-1 ring-gray-600' : ''}
                            `}
                            onMouseEnter={() => setHoveredCell({row: originalProbIndex, col: severityIndex})}
                            onMouseLeave={() => setHoveredCell(null)}
                            onClick={() => setSelectedCell({row: originalProbIndex, col: severityIndex})}
                          >
                            <div className="leading-tight">
                              {cellValue}
                            </div>
                            {isCurrentRisk && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full">
                                <div className="w-1 h-1 bg-white rounded-full m-0.5"></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            
            {/* Informações da célula selecionada */}
            {selectedCell && (
              <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-0 rounded-2xl shadow-xl backdrop-blur-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Análise da Célula Selecionada
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/70 p-4 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-700 text-sm uppercase tracking-wide">Probabilidade</span>
                    <p className="text-gray-800 font-semibold mt-1">{riskMatrix.probability[riskMatrix.probability.length - 1 - selectedCell.row].label}</p>
                    <p className="text-gray-600 text-sm mt-2">{riskMatrix.probability[riskMatrix.probability.length - 1 - selectedCell.row].description}</p>
                  </div>
                  <div className="bg-white/70 p-4 rounded-xl border border-purple-100">
                    <span className="font-bold text-purple-700 text-sm uppercase tracking-wide">Consequência</span>
                    <p className="text-gray-800 font-semibold mt-1">{riskMatrix.severity[selectedCell.col].label}</p>
                    <p className="text-gray-600 text-sm mt-2">{riskMatrix.severity[selectedCell.col].description}</p>
                  </div>
                  <div className="bg-white/70 p-4 rounded-xl border border-indigo-100">
                    <span className="font-bold text-indigo-700 text-sm uppercase tracking-wide">Nível de Risco</span>
                    <div className={`inline-block px-4 py-2 rounded-lg font-bold text-sm mt-2 ${getRiskCellColor(riskMatrix.matrix[riskMatrix.matrix.length - 1 - selectedCell.row][selectedCell.col])}`}>
                      {riskMatrix.matrix[riskMatrix.matrix.length - 1 - selectedCell.row][selectedCell.col]}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Legenda modernizada */}
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-slate-100 border-0 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Legenda dos Níveis de Risco</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {['TRIVIAL', 'ACEITÁVEL', 'MODERADO', 'SUBSTANCIAL', 'INTOLERÁVEL'].map((level) => (
                  <div key={level} className="group">
                    <div className={`p-4 rounded-xl text-center font-bold text-sm transition-all duration-300 transform group-hover:scale-105 ${getRiskCellColor(level)}`}>
                      {level}
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-xs text-gray-600 font-medium">
                        {level === 'TRIVIAL' && 'Risco Mínimo - 0-5% dos testes'}
                        {level === 'ACEITÁVEL' && 'Risco Baixo - 5-15% dos testes'}
                        {level === 'MODERADO' && 'Risco Médio - 15-35% dos testes'}
                        {level === 'SUBSTANCIAL' && 'Risco Alto - 35-60% dos testes'}
                        {level === 'INTOLERÁVEL' && 'Risco Crítico - >60% dos testes'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">Dados dos Testes Realizados</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{riskMatrix.testResults.totalTests}</div>
                    <div className="text-gray-600">Total de Testes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">{riskMatrix.testResults.completedTests}</div>
                    <div className="text-gray-600">Testes Concluídos</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-600">{riskMatrix.testResults.successRate}%</div>
                    <div className="text-gray-600">Taxa de Sucesso</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-orange-600">{riskMatrix.testResults.lastUpdate}</div>
                    <div className="text-gray-600">Última Atualização</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}