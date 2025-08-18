"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Users, Clock, Target, BarChart3, Building } from "lucide-react"
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
    level: Math.min(85, Math.max(15, 
      (metricas.riscosCriticos * 20) + 
      (metricas.riscosAltos * 12) + 
      (metricas.totalRiscos * 3) + 25
    )),
    status: metricas.riscosCriticos > 0 ? 'CRÍTICO' : 
            metricas.riscosAltos > 2 ? 'ALTO' : 
            metricas.riscosAltos > 0 ? 'MODERADO' : 'BAIXO',
    color: metricas.riscosCriticos > 0 ? '#dc2626' : 
           metricas.riscosAltos > 2 ? '#ea580c' : 
           metricas.riscosAltos > 0 ? '#d97706' : '#059669'
  }

  // Métricas avançadas baseadas nos dados filtrados
  const advancedMetrics = {
    confiancaAnalise: {
      value: Math.min(95, Math.max(70, metricas.confianca + (metricas.totalRiscos * 2))),
      trend: "up" as const
    },
    tempoAcao: {
      value: Math.max(1, 48 - (metricas.riscosCriticos * 8) - (metricas.riscosAltos * 3)),
      trend: metricas.riscosCriticos > 0 ? "up" as const : "down" as const
    },
    colaboradoresAfetados: {
      value: metricas.colaboradoresAfetados,
      trend: metricas.totalRiscos > 4 ? "up" as const : "stable" as const
    },
    areasCriticas: {
      value: Math.min(6, Math.max(0, metricas.riscosCriticos + Math.floor(metricas.riscosAltos / 2))),
      trend: metricas.riscosCriticos > 0 ? "up" as const : metricas.riscosAltos > 2 ? "stable" as const : "down" as const
    }
  }



  return (
    <div className="space-y-4">
      {/* Filtros Simples */}
      <FiltrosSimples
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onLimparFiltros={limparFiltros}
      />

      <Card className="w-full mx-auto border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Indicador de Risco Psicossocial</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Análise geral dos riscos identificados na organização</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: overallRisk.color }}>{overallRisk.status}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Nível de Risco</div>
            </div>
          </div>
        </div>

        {/* VELOCÍMETRO */}
        <div className="bg-white dark:bg-slate-800 p-6">
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-32 mb-4">
              {/* SVG do velocímetro */}
              <svg className="w-full h-full" viewBox="0 0 200 100">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="25%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop offset="75%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/> 
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Arco do velocímetro */}
                <path
                  d="M 20 80 A 60 60 0 0 1 180 80"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                
                {/* Marcações de tique */}
                {[0, 25, 50, 75, 100].map((value, index) => {
                  const angle = (value / 100) * 160 - 80;
                  const radian = (angle * Math.PI) / 180;
                  const x1 = 100 + 55 * Math.cos(radian);
                  const y1 = 80 + 55 * Math.sin(radian);
                  const x2 = 100 + 65 * Math.cos(radian);
                  const y2 = 80 + 65 * Math.sin(radian);
                  const textX = 100 + 75 * Math.cos(radian);
                  const textY = 80 + 75 * Math.sin(radian);
                  
                  return (
                    <g key={value}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#64748b"
                        strokeWidth="2"
                      />
                      <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-medium fill-slate-600 dark:fill-slate-400"
                      >
                        {value}
                      </text>
                    </g>
                  );
                })}
                
                {/* Ponteiro */}
                <g transform={`rotate(${(overallRisk.level / 100) * 160 - 80} 100 80)`}>
                  <line
                    x1="100"
                    y1="80"
                    x2="100"
                    y2="30"
                    stroke={overallRisk.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />
                  <circle
                    cx="100"
                    cy="80"
                    r="5"
                    fill={overallRisk.color}
                    filter="url(#glow)"
                  />
                </g>
              </svg>
            </div>
            
            {/* Badge de status */}
            <Badge 
              variant="outline" 
              className={`text-sm px-3 py-1 font-semibold border-2`}
              style={{ 
                borderColor: overallRisk.color, 
                color: overallRisk.color,
                backgroundColor: `${overallRisk.color}15`
              }}
            >
              {overallRisk.status}
            </Badge>
          </div>
        </div>

        {/* MÉTRICAS AVANÇADAS */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800">
          <h3 className="text-lg font-semibold mb-6 text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Métricas Avançadas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-700 p-5 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Confiança da Análise</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{advancedMetrics.confiancaAnalise.value}%</p>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        advancedMetrics.confiancaAnalise.value >= 80 ? 'bg-green-500' : 
                        advancedMetrics.confiancaAnalise.value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${advancedMetrics.confiancaAnalise.value}%` }}
                    ></div>
                  </div>
                </div>
                <div className={`p-3 rounded-full ml-4 ${
                  advancedMetrics.confiancaAnalise.value >= 80 ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 
                  advancedMetrics.confiancaAnalise.value >= 60 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' : 
                  'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                }`}>
                  <Target className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-700 p-5 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tempo para Ação</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{advancedMetrics.tempoAcao.value}h</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {advancedMetrics.tempoAcao.value <= 24 ? 'Urgente' : advancedMetrics.tempoAcao.value <= 72 ? 'Moderado' : 'Baixa prioridade'}
                  </p>
                </div>
                <div className={`p-3 rounded-full ml-4 ${
                  advancedMetrics.tempoAcao.value <= 24 ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' : 
                  advancedMetrics.tempoAcao.value <= 72 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' : 
                  'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                }`}>
                  <Clock className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-700 p-5 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Colaboradores Afetados</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{advancedMetrics.colaboradoresAfetados.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {((advancedMetrics.colaboradoresAfetados.value / 150) * 100).toFixed(1)}% do total
                  </p>
                </div>
                <div className={`p-3 rounded-full ml-4 ${
                  advancedMetrics.colaboradoresAfetados.value >= 50 ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' : 
                  advancedMetrics.colaboradoresAfetados.value >= 20 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' : 
                  'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                }`}>
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-700 p-5 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Áreas Críticas</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{advancedMetrics.areasCriticas.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {advancedMetrics.areasCriticas.value >= 3 ? 'Múltiplas áreas' : advancedMetrics.areasCriticas.value >= 2 ? 'Algumas áreas' : 'Área isolada'}
                  </p>
                </div>
                <div className={`p-3 rounded-full ml-4 ${
                  advancedMetrics.areasCriticas.value >= 3 ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' : 
                  advancedMetrics.areasCriticas.value >= 2 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' : 
                  'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                }`}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>
            </div>
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