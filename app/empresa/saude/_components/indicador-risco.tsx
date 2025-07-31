"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Users, Clock, Target, BarChart3 } from "lucide-react"
import { FiltrosSimples } from "./filtros-simples"
import { useFiltrosSimples } from "@/hooks/use-filtros-simples"

export default function IndicadorRiscoPsicossocial() {
  const [isVisible, setIsVisible] = useState(false)
  const { filtros, setFiltros, dadosFiltrados, metricas, limparFiltros } = useFiltrosSimples()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Calcular nível de risco geral baseado nas métricas filtradas
  const overallRisk = {
    level: metricas.totalRiscos > 0 ? Math.min(100, (metricas.riscosAltos * 15 + metricas.riscosCriticos * 25)) : 0,
    status: metricas.riscosCriticos > 0 ? "Crítico" : metricas.riscosAltos > 2 ? "Alto" : metricas.riscosAltos > 0 ? "Médio" : "Baixo",
    trend: "up",
    color: metricas.riscosCriticos > 0 ? "#dc2626" : metricas.riscosAltos > 2 ? "#ef4444" : metricas.riscosAltos > 0 ? "#f59e0b" : "#10b981"
  }

  // Métricas avançadas baseadas nos dados filtrados
  const advancedMetrics = {
    confiancaAnalise: { value: metricas.confianca, trend: "up" },
    tempoAcao: { value: 24, trend: "down" },
    colaboradoresAfetados: { value: metricas.colaboradoresAfetados, trend: "stable" },
    areasCriticas: { value: Math.max(1, Math.floor(metricas.totalRiscos / 3)), trend: "down" }
  }

  const MetricCard = ({ icon: Icon, title, value, unit, trend, description }: {
    icon: any
    title: string
    value: number
    unit?: string
    trend?: "up" | "down" | "stable"
    description?: string
  }) => {
    const getTrendIcon = () => {
      switch (trend) {
        case "up": return <TrendingUp className="h-4 w-4 text-red-500" />
        case "down": return <TrendingDown className="h-4 w-4 text-green-500" />
        case "stable": return <Minus className="h-4 w-4 text-yellow-500" />
        default: return null
      }
    }

    const getTrendColor = () => {
      switch (trend) {
        case "up": return "text-red-500"
        case "down": return "text-green-500"
        case "stable": return "text-yellow-500"
        default: return "text-gray-500"
      }
    }

    return (
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
              <Icon className="h-6 w-6 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
            </div>
            {trend && (
              <div className={`flex items-center gap-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-xs font-medium">
                  {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
                </span>
              </div>
            )}
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
  }

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
        <div className="bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Indicador de Risco Psicossocial Geral</h1>
              <p className="text-blue-100">Análise em tempo real dos riscos psicossociais organizacionais</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{overallRisk.level}%</div>
              <div className="text-sm text-blue-100">Nível de Risco</div>
            </div>
          </div>
        </div>

        {/* SPEEDOMETER SECTION */}
        <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-md mx-auto">
            <div className="relative">
              {/* Speedometer Background */}
              <div className="w-64 h-32 mx-auto relative overflow-hidden">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  {/* Background Arc */}
                  <defs>
                    <linearGradient id="speedometerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="33%" stopColor="#f59e0b" />
                      <stop offset="66%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Main Arc */}
                  <path
                    d="M 20 80 A 60 60 0 0 1 180 80"
                    fill="none"
                    stroke="url(#speedometerGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    className="drop-shadow-lg"
                  />
                  
                  {/* Tick Marks */}
                  {[0, 25, 50, 75, 100].map((tick, index) => {
                    const angle = (tick / 100) * 160 - 80
                    const radian = (angle * Math.PI) / 180
                    const x1 = 100 + 55 * Math.cos(radian)
                    const y1 = 80 + 55 * Math.sin(radian)
                    const x2 = 100 + 65 * Math.cos(radian)
                    const y2 = 80 + 65 * Math.sin(radian)
                    
                    return (
                      <g key={tick}>
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#374151"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <text
                          x={100 + 75 * Math.cos(radian)}
                          y={80 + 75 * Math.sin(radian) + 4}
                          textAnchor="middle"
                          className="text-xs font-semibold fill-gray-600"
                        >
                          {tick}
                        </text>
                      </g>
                    )
                  })}
                  
                  {/* Animated Pointer */}
                  <g className="transition-transform duration-1000 ease-out" 
                     style={{ transformOrigin: '100px 80px', transform: `rotate(${(overallRisk.level / 100) * 160 - 80}deg)` }}>
                    <line
                      x1="100"
                      y1="80"
                      x2="100"
                      y2="35"
                      stroke={overallRisk.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      filter="url(#glow)"
                    />
                    <circle
                      cx="100"
                      cy="80"
                      r="6"
                      fill={overallRisk.color}
                      filter="url(#glow)"
                      className={overallRisk.level > 75 ? "animate-pulse" : ""}
                    />
                  </g>
                </svg>
              </div>
              
              {/* Risk Status */}
              <div className="text-center mt-4">
                <Badge 
                  variant="outline" 
                  className={`text-lg px-4 py-2 font-bold border-2 ${overallRisk.level > 75 ? 'animate-pulse' : ''}`}
                  style={{ 
                    borderColor: overallRisk.color, 
                    color: overallRisk.color,
                    backgroundColor: `${overallRisk.color}10`
                  }}
                >
                  RISCO {overallRisk.status.toUpperCase()}
                </Badge>
                <div className="mt-2 text-sm text-gray-600">
                  {overallRisk.level > 75 ? "Ação imediata necessária" : 
                   overallRisk.level > 50 ? "Monitoramento intensivo" :
                   overallRisk.level > 25 ? "Acompanhamento regular" : "Situação controlada"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* METRICS SECTION */}
        <div className="p-6 bg-white">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Métricas Detalhadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={Target}
              title="Confiança da Análise"
              value={advancedMetrics.confiancaAnalise.value}
              unit="%"
              trend={advancedMetrics.confiancaAnalise.trend}
              description="Precisão dos dados coletados"
            />
            <MetricCard
              icon={Clock}
              title="Tempo para Ação"
              value={advancedMetrics.tempoAcao.value}
              unit="h"
              trend={advancedMetrics.tempoAcao.trend}
              description="Tempo médio de resposta"
            />
            <MetricCard
              icon={Users}
              title="Colaboradores Afetados"
              value={advancedMetrics.colaboradoresAfetados.value}
              trend={advancedMetrics.colaboradoresAfetados.trend}
              description="Pessoas impactadas"
            />
            <MetricCard
              icon={AlertTriangle}
              title="Áreas Críticas"
              value={advancedMetrics.areasCriticas.value}
              trend={advancedMetrics.areasCriticas.trend}
              description="Setores que requerem atenção"
            />
          </div>
        </div>

        {/* SUMMARY SECTION */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metricas.totalRiscos}</div>
              <div className="text-sm text-gray-600">Total de Riscos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metricas.riscosAltos}</div>
              <div className="text-sm text-gray-600">Riscos Altos</div>
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