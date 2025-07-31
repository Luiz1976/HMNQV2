'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function IndicadorRiscoPsicossocial() {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)

  const overallRisk = {
    percentage: 65,
    label: 'Médio Risco',
    recommendation: 'Ações corretivas necessárias',
    trend: 'stable', // 'up', 'down', 'stable'
    previousMonth: 62,
  }

  const advancedMetrics = {
    confidence: 87,
    timeToAction: '7 dias',
    affectedEmployees: 45,
    totalEmployees: 150,
    criticalAreas: 2,
    totalEvaluations: 120,
  }

  const riskLevels = [
    { min: 0, max: 25, label: 'BAIXO', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200' },
    { min: 26, max: 50, label: 'MODERADO', color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200' },
    { min: 51, max: 75, label: 'ALTO', color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' },
    { min: 76, max: 100, label: 'CRÍTICO', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' },
  ]

  const getCurrentRiskLevel = () => {
    return riskLevels.find(level => 
      overallRisk.percentage >= level.min && overallRisk.percentage <= level.max
    ) || riskLevels[0]
  }

  const getTrendIcon = () => {
    switch (overallRisk.trend) {
      case 'up': return <TrendingUp className="h-5 w-5 text-red-400" />
      case 'down': return <TrendingDown className="h-5 w-5 text-green-400" />
      default: return <Activity className="h-5 w-5 text-purple-300" />
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(overallRisk.percentage)
    }, 300)
    return () => clearTimeout(timer)
  }, [overallRisk.percentage])

  const currentLevel = getCurrentRiskLevel()

  const MetricCard = ({ icon, title, value, subtitle, progress, colorClass, trend }) => (
    <Card className={`${colorClass.bgColor} ${colorClass.borderColor} border-2 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 h-full group cursor-pointer`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className={`text-xs sm:text-sm font-medium ${colorClass.textColor} flex-1 pr-2 group-hover:font-semibold transition-all duration-300`}>{title}</CardTitle>
        <div className={`flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${trend ? 'animate-pulse' : ''}`}>{icon}</div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`text-xl sm:text-2xl font-bold ${colorClass.textColor} break-words group-hover:text-3xl transition-all duration-300`}>{value}</div>
        <p className={`text-xs ${colorClass.textColor} opacity-80 mt-1 break-words group-hover:opacity-100 transition-all duration-300`}>{subtitle}</p>
        {progress !== undefined && (
          <div className="mt-2">
            <Progress value={progress} className="h-2 group-hover:h-3 transition-all duration-300" indicatorClassName={`${colorClass.progressIndicator} group-hover:animate-pulse`} />
            <div className="flex justify-between text-xs mt-1 opacity-70">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        )}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-500'}`}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : trend === 'down' ? <TrendingDown className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
            <span>{trend === 'up' ? 'Aumentando' : trend === 'down' ? 'Diminuindo' : 'Estável'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Card className="w-full mx-auto shadow-2xl border-0 rounded-2xl overflow-hidden">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 text-white p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
              <div className="p-2 bg-white/25 rounded-lg">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="break-words">Indicador de Risco Psicossocial Geral</span>
            </CardTitle>
            <CardDescription className="text-purple-200 mt-2 text-sm sm:text-base">
              Índice de Risco Psicossocial consolidado com base nos testes realizados.
            </CardDescription>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-2">
            <Badge 
              className="text-sm sm:text-base font-semibold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-lg" 
              style={{ backgroundColor: getCurrentRiskLevel().bgColor.replace('bg-',''), color: getCurrentRiskLevel().color.replace('text-','') }}
            >
              {currentLevel.label}
            </Badge>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-200">
              {getTrendIcon()}
              <span className="break-words">
                {overallRisk.trend === 'stable' ? 'Estável vs mês anterior' : `${overallRisk.percentage - overallRisk.previousMonth > 0 ? '+' : ''}${overallRisk.percentage - overallRisk.previousMonth}% vs mês anterior`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <CardContent className="p-4 sm:p-6 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* COLUNA ESQUERDA: VELOCÍMETRO E LEGENDA */}
          <div className="lg:col-span-1 bg-white p-4 sm:p-6 rounded-xl shadow-md flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative w-full max-w-[280px] h-auto mb-4 group">
              <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-lg" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="25%" stopColor="#84CC16" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="75%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                  <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.3" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Background track with subtle glow */}
                <path d="M 20 90 A 70 70 0 0 1 180 90" fill="none" stroke="#E5E7EB" strokeWidth="12" strokeLinecap="round" />
                <path d="M 20 90 A 70 70 0 0 1 180 90" fill="none" stroke="url(#glowGradient)" strokeWidth="16" strokeLinecap="round" opacity="0.5" />
                
                {/* Main progress arc */}
                <path
                  d="M 20 90 A 70 70 0 0 1 180 90"
                  fill="none"
                  stroke="url(#riskGradient)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${(animatedPercentage / 100) * Math.PI * 70} ${Math.PI * 70}`}
                  style={{ transition: 'stroke-dasharray 1.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  filter="url(#glow)"
                />
                
                {/* Tick marks */}
                {[0, 25, 50, 75, 100].map(tick => {
                  const angle = (tick / 100) * 180 - 90;
                  const x1 = 100 + 65 * Math.cos(angle * Math.PI / 180);
                  const y1 = 90 + 65 * Math.sin(angle * Math.PI / 180);
                  const x2 = 100 + 75 * Math.cos(angle * Math.PI / 180);
                  const y2 = 90 + 75 * Math.sin(angle * Math.PI / 180);
                  return (
                    <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9CA3AF" strokeWidth="2" />
                  );
                })}
                
                {/* Animated pointer */}
                <g transform={`rotate(${(animatedPercentage / 100) * 180 - 90} 100 90)`} style={{ transition: 'transform 1.8s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  <line x1="100" y1="90" x2="100" y2="25" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" filter="url(#glow)" />
                  <circle cx="100" cy="90" r="8" fill="#1F2937" filter="url(#glow)" />
                  <circle cx="100" cy="90" r="5" fill="white" />
                  <circle cx="100" cy="90" r="2" fill="#1F2937" />
                </g>
                
                {/* Center percentage with enhanced styling */}
                <text x="100" y="65" textAnchor="middle" className="text-2xl sm:text-3xl font-black fill-gray-800 drop-shadow-sm">{`${Math.round(animatedPercentage)}%`}</text>
                <text x="100" y="110" textAnchor="middle" className="text-xs sm:text-sm fill-gray-600 font-medium">Risco Geral</text>
                
                {/* Subtle pulsing effect on high risk */}
                {animatedPercentage > 75 && (
                  <circle cx="100" cy="90" r="85" fill="none" stroke="#EF4444" strokeWidth="2" opacity="0.3" className="animate-pulse" />
                )}
              </svg>
            </div>
            
            <div className={`text-center p-3 rounded-lg ${currentLevel.bgColor} w-full max-w-[280px]`}>
              <p className={`font-bold text-base sm:text-lg ${currentLevel.color}`}>{currentLevel.label}</p>
              <p className={`text-xs sm:text-sm ${currentLevel.color} opacity-90`}>{overallRisk.recommendation}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 w-full max-w-[280px] text-xs">
              {riskLevels.map(level => (
                <div key={level.label} className={`p-2 rounded-md text-center border ${level.borderColor} ${level.bgColor}`}>
                  <p className={`font-semibold ${level.color} text-xs`}>{level.label}</p>
                  <p className={`${level.color} opacity-80 text-xs`}>{`${level.min}-${level.max}%`}</p>
                </div>
              ))}
            </div>
          </div>

          {/* COLUNA DIREITA: MÉTRICAS DETALHADAS */}
          <div className="lg:col-span-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Métricas Detalhadas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <MetricCard 
                icon={<CheckCircle className="h-5 w-5 text-blue-500" />} 
                title="Confiança da Análise" 
                value={`${advancedMetrics.confidence}%`} 
                subtitle={`Baseado em ${advancedMetrics.totalEvaluations} avaliações`} 
                progress={advancedMetrics.confidence} 
                trend="up"
                colorClass={{ bgColor: 'bg-blue-50', textColor: 'text-blue-800', borderColor: 'border-blue-200', progressIndicator: 'bg-blue-500' }}
              />
              <MetricCard 
                icon={<Clock className="h-5 w-5 text-orange-500" />} 
                title="Tempo para Ação" 
                value={advancedMetrics.timeToAction} 
                subtitle="Recomendação urgente" 
                trend="stable"
                colorClass={{ bgColor: 'bg-orange-50', textColor: 'text-orange-800', borderColor: 'border-orange-200' }}
              />
              <MetricCard 
                icon={<TrendingUp className="h-5 w-5 text-red-500" />} 
                title="Colaboradores Afetados" 
                value={advancedMetrics.affectedEmployees} 
                subtitle={`De ${advancedMetrics.totalEmployees} colaboradores totais`} 
                progress={(advancedMetrics.affectedEmployees / advancedMetrics.totalEmployees) * 100} 
                trend="down"
                colorClass={{ bgColor: 'bg-red-50', textColor: 'text-red-800', borderColor: 'border-red-200', progressIndicator: 'bg-red-500' }}
              />
              <MetricCard 
                icon={<AlertTriangle className="h-5 w-5 text-purple-500" />} 
                title="Áreas Críticas" 
                value={advancedMetrics.criticalAreas} 
                subtitle="Requerem atenção imediata" 
                trend="up"
                colorClass={{ bgColor: 'bg-purple-50', textColor: 'text-purple-800', borderColor: 'border-purple-200' }}
              />
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}