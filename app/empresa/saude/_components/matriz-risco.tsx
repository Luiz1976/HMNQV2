'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Info, Target, Activity, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import React from 'react';

export function MatrizRiscoPsicossocial() {
  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number} | null>(null)
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null)
  const [animatedValues, setAnimatedValues] = useState({ confidence: 0, coverage: 0, efficiency: 0 })
  const [isVisible, setIsVisible] = useState(false)

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

  const advancedMetrics = {
    confidence: 92,
    coverage: 78,
    efficiency: 85,
    totalRisks: 24,
    mitigatedRisks: 18,
    criticalRisks: 3,
    lastUpdate: '2 horas atrás'
  }

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setAnimatedValues({
        confidence: advancedMetrics.confidence,
        coverage: advancedMetrics.coverage,
        efficiency: advancedMetrics.efficiency
      })
    }, 500)
    return () => clearTimeout(timer)
  }, [])

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
    <Card className={`w-full mx-auto shadow-2xl border-0 rounded-2xl overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
      <div className="bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-700 text-white p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
              <div className="p-2 bg-white/25 rounded-lg">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="break-words">Matriz de Risco Psicossocial</span>
            </CardTitle>
            <CardDescription className="text-blue-200 mt-2 text-sm sm:text-base">
              Análise detalhada dos riscos identificados por severidade e probabilidade com métricas avançadas
            </CardDescription>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-2">
            <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 sm:px-4 sm:py-2 text-sm font-semibold rounded-full shadow-lg">
              <Activity className="h-4 w-4 mr-1" />
              {advancedMetrics.lastUpdate}
            </Badge>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-200">
              <Target className="h-4 w-4" />
              <span>{advancedMetrics.totalRisks} riscos identificados</span>
            </div>
          </div>
        </div>
      </div>
       
       {/* SEÇÃO DE MÉTRICAS AVANÇADAS */}
       <div className="bg-gray-50 p-4 sm:p-6">
         <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
           <Zap className="h-5 w-5 text-yellow-500" />
           Métricas de Performance
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           <div className="bg-white p-4 rounded-xl shadow-md border border-green-200">
             <div className="flex items-center justify-between mb-2">
               <span className="text-sm font-medium text-green-700">Confiança da Análise</span>
               <Target className="h-4 w-4 text-green-500" />
             </div>
             <div className="text-2xl font-bold text-green-800 mb-2">{Math.round(animatedValues.confidence)}%</div>
             <Progress value={animatedValues.confidence} className="h-2" indicatorClassName="bg-green-500" />
           </div>
           <div className="bg-white p-4 rounded-xl shadow-md border border-blue-200">
             <div className="flex items-center justify-between mb-2">
               <span className="text-sm font-medium text-blue-700">Cobertura de Riscos</span>
               <Activity className="h-4 w-4 text-blue-500" />
             </div>
             <div className="text-2xl font-bold text-blue-800 mb-2">{Math.round(animatedValues.coverage)}%</div>
             <Progress value={animatedValues.coverage} className="h-2" indicatorClassName="bg-blue-500" />
           </div>
           <div className="bg-white p-4 rounded-xl shadow-md border border-purple-200">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-sm font-medium text-purple-700">Eficiência de Mitigação</span>
                 <Zap className="h-4 w-4 text-purple-500" />
               </div>
               <div className="text-2xl font-bold text-purple-800 mb-2">{Math.round(animatedValues.efficiency)}%</div>
               <Progress value={animatedValues.efficiency} className="h-2" indicatorClassName="bg-purple-500" />
             </div>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
           <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-center">
             <div className="text-lg font-bold text-gray-800">{advancedMetrics.mitigatedRisks}/{advancedMetrics.totalRisks}</div>
             <div className="text-xs text-gray-600">Riscos Mitigados</div>
           </div>
           <div className="bg-white p-3 rounded-lg shadow-sm border border-red-200 text-center">
             <div className="text-lg font-bold text-red-600">{advancedMetrics.criticalRisks}</div>
             <div className="text-xs text-gray-600">Riscos Críticos</div>
           </div>
           <div className="bg-white p-3 rounded-lg shadow-sm border border-yellow-200 text-center">
             <div className="text-lg font-bold text-yellow-600">{Math.round((advancedMetrics.mitigatedRisks / advancedMetrics.totalRisks) * 100)}%</div>
             <div className="text-xs text-gray-600">Taxa de Sucesso</div>
           </div>
         </div>
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
                              h-12 flex items-center justify-center text-center font-bold text-xs cursor-pointer transition-all duration-300 ease-out relative border-b border-r border-gray-400 last:border-r-0
                              ${getRiskCellColor(cellValue)}
                              ${isCurrentRisk ? 'ring-2 ring-blue-600 ring-inset' : ''}
                              ${hoveredCell?.row === originalProbIndex && hoveredCell?.col === severityIndex ? 'ring-2 ring-blue-400 scale-105 z-20 shadow-xl transform rotate-1' : ''}
                              ${selectedCell?.row === originalProbIndex && selectedCell?.col === severityIndex ? 'ring-2 ring-purple-500 scale-105 z-20 shadow-xl' : ''}
                              hover:shadow-lg hover:scale-102
                            `}
                            onMouseEnter={() => setHoveredCell({row: originalProbIndex, col: severityIndex})}
                            onMouseLeave={() => setHoveredCell(null)}
                            onClick={() => setSelectedCell({row: originalProbIndex, col: severityIndex})}
                          >
                            <div className={`leading-tight transition-all duration-300 ${
                              hoveredCell?.row === originalProbIndex && hoveredCell?.col === severityIndex ? 'scale-110 font-extrabold' : ''
                            }`}>
                              {cellValue}
                            </div>
                            {isCurrentRisk && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full animate-pulse">
                                <div className="w-1 h-1 bg-white rounded-full m-0.5"></div>
                              </div>
                            )}
                            {hoveredCell?.row === originalProbIndex && hoveredCell?.col === severityIndex && (
                              <div className="absolute inset-0 bg-white/20 animate-pulse rounded"></div>
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