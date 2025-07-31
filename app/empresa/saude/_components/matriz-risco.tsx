"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Info, Target, Activity, Zap, AlertTriangle } from "lucide-react"
import { FiltrosSimples } from "./filtros-simples"
import { useFiltrosSimples } from "@/hooks/use-filtros-simples"

export default function MatrizRiscoPsicossocial() {
  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number} | null>(null)
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { filtros, setFiltros, dadosFiltrados, metricas, limparFiltros } = useFiltrosSimples()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const riskMatrix = {
    severity: [
      { level: 'DESPREZÍVEL', label: 'DESPREZÍVEL', description: 'Sem impacto significativo', color: '#10b981' },
      { level: 'MARGINAL', label: 'MARGINAL', description: 'Impacto limitado', color: '#84cc16' },
      { level: 'MÉDIA', label: 'MÉDIA', description: 'Impacto moderado', color: '#f59e0b' },
      { level: 'CRÍTICA', label: 'CRÍTICA', description: 'Impacto significativo', color: '#f97316' },
      { level: 'EXTREMA', label: 'EXTREMA', description: 'Impacto severo', color: '#ef4444' }
    ],
    probability: [
      { level: 'QUASE CERTO', label: 'QUASE CERTO', description: 'Ocorrência > 90%', color: '#ef4444' },
      { level: 'PROVÁVEL', label: 'PROVÁVEL', description: 'Ocorrência 70-90%', color: '#f97316' },
      { level: 'POSSÍVEL', label: 'POSSÍVEL', description: 'Ocorrência 30-70%', color: '#f59e0b' },
      { level: 'POUCO PROVÁVEL', label: 'POUCO PROVÁVEL', description: 'Ocorrência 10-30%', color: '#84cc16' },
      { level: 'RARO', label: 'RARO', description: 'Ocorrência < 10%', color: '#10b981' }
    ],
    matrix: [
      ['TRIVIAL', 'TRIVIAL', 'ACEITÁVEL', 'MODERADO', 'MODERADO'],
      ['TRIVIAL', 'ACEITÁVEL', 'MODERADO', 'MODERADO', 'SUBSTANCIAL'],
      ['TRIVIAL', 'ACEITÁVEL', 'MODERADO', 'SUBSTANCIAL', 'INTOLERÁVEL'],
      ['ACEITÁVEL', 'MODERADO', 'SUBSTANCIAL', 'INTOLERÁVEL', 'INTOLERÁVEL'],
      ['ACEITÁVEL', 'MODERADO', 'SUBSTANCIAL', 'INTOLERÁVEL', 'INTOLERÁVEL']
    ]
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'TRIVIAL': return '#10b981'
      case 'ACEITÁVEL': return '#84cc16'
      case 'MODERADO': return '#f59e0b'
      case 'SUBSTANCIAL': return '#f97316'
      case 'INTOLERÁVEL': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getRiskLevel = (risk: string) => {
    switch (risk) {
      case 'TRIVIAL': return 1
      case 'ACEITÁVEL': return 2
      case 'MODERADO': return 3
      case 'SUBSTANCIAL': return 4
      case 'INTOLERÁVEL': return 5
      default: return 0
    }
  }

  // Calcular posição atual do risco baseado nas métricas filtradas
  const currentRiskPosition = {
    severity: Math.min(4, Math.floor(metricas.riscosCriticos > 0 ? 4 : metricas.riscosAltos > 2 ? 3 : metricas.riscosAltos > 0 ? 2 : 1)),
    probability: Math.min(4, Math.floor(metricas.totalRiscos > 10 ? 4 : metricas.totalRiscos > 5 ? 3 : metricas.totalRiscos > 2 ? 2 : 1))
  }

  const currentRisk = riskMatrix.matrix[currentRiskPosition.severity][currentRiskPosition.probability]

  const MetricCard = ({ icon: Icon, title, value, unit, description, color }: {
    icon: any
    title: string
    value: number
    unit?: string
    description?: string
    color?: string
  }) => (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
            <Icon className="h-6 w-6 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              {value}
            </span>
            {unit && (
              <span className="text-sm text-gray-500">{unit}</span>
            )}
          </div>
          {description && (
            <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Filtros Simples */}
      <FiltrosSimples
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onLimparFiltros={limparFiltros}
      />

      <Card className="w-full mx-auto shadow-2xl border-0 rounded-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <Shield className="h-8 w-8" />
                Matriz Quantitativa de Riscos Psicossociais
              </h1>
              <p className="text-emerald-100">Análise probabilística e impacto dos riscos organizacionais</p>
            </div>
            <div className="text-right">
              <Badge 
                className="text-lg px-4 py-2 font-bold"
                style={{ 
                  backgroundColor: getRiskColor(currentRisk),
                  color: 'white'
                }}
              >
                {currentRisk}
              </Badge>
              <div className="text-sm text-emerald-100 mt-1">Nível Atual</div>
            </div>
          </div>
        </div>

        {/* MATRIX SECTION */}
        <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <Target className="h-6 w-6 text-emerald-600" />
              Matriz de Risco 5x5
            </h2>
            
            <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
              <div className="grid grid-cols-6 gap-2 min-w-[600px]">
                {/* Header vazio */}
                <div className="p-3"></div>
                
                {/* Headers de Severidade */}
                {riskMatrix.severity.map((severity, index) => (
                  <div key={index} className="p-3 text-center">
                    <div className="text-xs font-semibold text-gray-700 mb-1">
                      {severity.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {severity.description}
                    </div>
                  </div>
                ))}
                
                {/* Linhas da matriz */}
                {riskMatrix.probability.map((probability, probIndex) => (
                  <React.Fragment key={probIndex}>
                    {/* Header de Probabilidade */}
                    <div className="p-3 text-center">
                      <div className="text-xs font-semibold text-gray-700 mb-1">
                        {probability.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {probability.description}
                      </div>
                    </div>
                    
                    {/* Células da matriz */}
                    {riskMatrix.matrix[probIndex].map((risk, sevIndex) => {
                      const isCurrentPosition = probIndex === currentRiskPosition.probability && sevIndex === currentRiskPosition.severity
                      const isHovered = hoveredCell?.row === probIndex && hoveredCell?.col === sevIndex
                      const isSelected = selectedCell?.row === probIndex && selectedCell?.col === sevIndex
                      
                      return (
                        <div
                          key={sevIndex}
                          className={`
                            p-4 text-center cursor-pointer transition-all duration-300 rounded-lg border-2
                            ${isCurrentPosition ? 'ring-4 ring-blue-500 ring-opacity-50 scale-105' : ''}
                            ${isHovered ? 'scale-110 shadow-lg' : ''}
                            ${isSelected ? 'ring-2 ring-purple-500' : 'border-gray-200'}
                          `}
                          style={{
                            backgroundColor: `${getRiskColor(risk)}20`,
                            borderColor: getRiskColor(risk)
                          }}
                          onMouseEnter={() => setHoveredCell({ row: probIndex, col: sevIndex })}
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() => setSelectedCell({ row: probIndex, col: sevIndex })}
                        >
                          <div 
                            className="text-sm font-bold mb-1"
                            style={{ color: getRiskColor(risk) }}
                          >
                            {risk}
                          </div>
                          <div className="text-xs text-gray-600">
                            Nível {getRiskLevel(risk)}
                          </div>
                          {isCurrentPosition && (
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs animate-pulse">
                                ATUAL
                              </Badge>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* Legenda */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
              {['TRIVIAL', 'ACEITÁVEL', 'MODERADO', 'SUBSTANCIAL', 'INTOLERÁVEL'].map((risk) => (
                <div key={risk} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getRiskColor(risk) }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{risk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* METRICS SECTION */}
        <div className="p-6 bg-white border-t">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Métricas da Matriz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={Shield}
              title="Confiança da Matriz"
              value={metricas.confianca}
              unit="%"
              description="Precisão da análise"
            />
            <MetricCard
              icon={Target}
              title="Cobertura de Riscos"
              value={Math.min(100, metricas.totalRiscos * 8)}
              unit="%"
              description="Riscos mapeados"
            />
            <MetricCard
              icon={Activity}
              title="Eficiência"
              value={Math.max(60, 100 - metricas.riscosCriticos * 10)}
              unit="%"
              description="Gestão de riscos"
            />
            <MetricCard
              icon={AlertTriangle}
              title="Alertas Ativos"
              value={metricas.riscosAltos + metricas.riscosCriticos}
              description="Requerem atenção"
            />
          </div>
        </div>

        {/* SUMMARY SECTION */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{metricas.totalRiscos}</div>
              <div className="text-sm text-gray-600">Total de Riscos Mapeados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metricas.riscosAltos}</div>
              <div className="text-sm text-gray-600">Riscos de Alto Impacto</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{metricas.riscosCriticos}</div>
              <div className="text-sm text-gray-600">Riscos Críticos</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}