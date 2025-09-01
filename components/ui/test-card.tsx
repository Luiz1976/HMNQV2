import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, BarChart3, Play, CheckCircle, AlertCircle, Sparkles, Zap, Target, Brain, Lightbulb, Eye, Puzzle, Star, Compass, Flame, Heart, Shuffle, AlertTriangle, Shield, Settings, Users, Building2, PenTool } from 'lucide-react'
import { getCategoryConfig, getButtonColor } from '@/lib/test-categories'

interface TestCardProps {
  id: string
  title: string
  description: string
  estimatedTime: number
  status: 'available' | 'in_progress' | 'completed' | 'locked'
  dimensions: string[]
  onStartTest?: (id: string) => void
  onViewResults?: (id: string) => void
  onContinueTest?: (id: string) => void
  score?: number
  completedAt?: string
  category?: string // Nova prop para categoria
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'available':
      return {
        text: 'Disponível',
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <Play className="h-3 w-3" />
      }
    case 'in_progress':
      return {
        text: 'Em Progresso',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <AlertCircle className="h-3 w-3" />
      }
    case 'completed':
      return {
        text: 'Concluído',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <CheckCircle className="h-3 w-3" />
      }
    case 'locked':
      return {
        text: 'Bloqueado',
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <AlertCircle className="h-3 w-3" />
      }
    default:
      return {
        text: 'Disponível',
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <Play className="h-3 w-3" />
      }
  }
}

export function TestCard({
  id,
  title,
  description,
  estimatedTime,
  status,
  dimensions,
  onStartTest,
  onViewResults,
  onContinueTest,
  score,
  completedAt,
  category = 'default'
}: TestCardProps) {
  const statusConfig = getStatusConfig(status)
  const categoryConfig = getCategoryConfig(category)
  
  // Função para obter ícone específico baseado no ID do teste
  const getTestIcon = (testId: string) => {
    switch (testId) {
      // Testes Psicossociais
      case 'humaniq-insight':
      case 'humaniq-cobe':
      case 'humaniq-qvt':
      case 'humaniq-karasek-siegrist':
      case 'humaniq-rpo':
      case 'humaniq-eo':
      case 'humaniq-pas':
      case 'humaniq-mgrp':
        return category === 'Testes Psicossociais' ? Heart : Brain
      // Testes de Perfil
      case 'humaniq-qi':
      case 'humaniq-tipos':
      case 'humaniq-bigfive':
      case 'humaniq-eneagrama':
      case 'humaniq-valores':
      case 'humaniq-motiva':
      case 'humaniq-bolie':
      // Caso removido: humaniq-flex
      // Testes Corporativos
      case 'humaniq-lid':
      case 'humaniq-teq':
      case 'humaniq-adt':
      case 'humaniq-cri':
      case 'humaniq-pre':
      case 'humaniq-com':
      case 'humaniq-mot':
      case 'humaniq-est':
      case 'humaniq-eti':
        return category === 'Testes Corporativos' ? Building2 : Brain
      // Teste Grafológico
      case 'humaniq-gra':
        return category === 'Teste Grafológico' ? PenTool : Brain
      default:
        return Brain // Ícone padrão
    }
  }
  
  const IconComponent = getTestIcon(id)

  const handleButtonClick = () => {
    console.log('🖱️ TestCard button clicked!')
    console.log('📋 Test ID:', id)
    console.log('📊 Status:', status)
    console.log('🔧 onStartTest function:', typeof onStartTest)
    console.log('🔧 onContinueTest function:', typeof onContinueTest)
    console.log('🔧 onViewResults function:', typeof onViewResults)
    
    // Garantir que as funções existem antes de chamar
    if (status === 'available' && typeof onStartTest === 'function') {
      console.log('✅ Calling onStartTest with ID:', id)
      onStartTest(id)
    } else if (status === 'in_progress' && typeof onContinueTest === 'function') {
      console.log('✅ Calling onContinueTest with ID:', id)
      onContinueTest(id)
    } else if (status === 'completed' && typeof onViewResults === 'function') {
      console.log('✅ Calling onViewResults with ID:', id)
      onViewResults(id)
    } else {
      console.log('❌ No valid function to call for status:', status)
    }
  }

  const getButtonText = () => {
    switch (status) {
      case 'available':
        return 'Iniciar Teste'
      case 'in_progress':
        return 'Continuar'
      case 'completed':
        return 'Ver Resultados'
      case 'locked':
        return 'Bloqueado'
      default:
        return 'Iniciar Teste'
    }
  }

  return (
    <Card className="relative h-[420px] flex flex-col border-0 rounded-2xl overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
      {/* Main Purple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-violet-800 rounded-2xl" />
      
      {/* Floating Particles - Layer 1: Small white particles */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
        <div className="absolute top-8 left-8 w-2 h-2 bg-white rounded-full animate-pulse" />
        <div className="absolute top-16 right-12 w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-24 left-16 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-8 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-32 left-12 w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '2.5s' }} />
      </div>
      
      {/* Floating Particles - Layer 2: Medium purple particles */}
      <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-700">
        <div className="absolute top-12 right-16 w-3 h-3 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        <div className="absolute bottom-16 left-20 w-4 h-4 bg-purple-200 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-1/2 left-8 w-2.5 h-2.5 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '1.3s' }} />
        <div className="absolute bottom-24 right-20 w-3 h-3 bg-purple-200 rounded-full animate-bounce" style={{ animationDelay: '1.8s' }} />
      </div>
      
      {/* Floating Particles - Layer 3: Large gradient particles */}
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
        <div className="absolute top-6 right-6 w-8 h-8 bg-gradient-to-br from-white/30 to-purple-300/30 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="absolute bottom-8 left-6 w-6 h-6 bg-gradient-to-br from-purple-200/30 to-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-1/3 right-1/3 w-5 h-5 bg-gradient-to-br from-white/20 to-purple-300/20 rounded-full animate-ping" style={{ animationDelay: '1.2s' }} />
      </div>
      
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl" />
      
      {/* Status Badge - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <Badge className="bg-white/20 text-white border-white/30 flex items-center gap-1 text-xs font-medium shadow-sm backdrop-blur-sm">
          {statusConfig.icon}
          {statusConfig.text}
        </Badge>
      </div>

      <CardHeader className="pb-3 pl-6 relative z-10">
        {/* Ícone da categoria com efeito moderno */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300 bg-white/20" />
            <div className="relative p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300 bg-white/10 backdrop-blur-sm">
              <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
              {category}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
              <span className="text-xs text-white/70 font-medium">Disponível</span>
            </div>
          </div>
        </div>
        <CardTitle className="text-lg font-bold leading-tight pr-20 text-white group-hover:text-white/95 transition-colors duration-300">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pl-6 relative z-10">
        <div className="flex-1 space-y-3">
          {/* Description */}
          <p className="text-sm text-white/80 leading-relaxed font-medium">
            {description}
          </p>

          {/* Time com design compacto */}
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
               <Clock className="h-3.5 w-3.5 text-white" />
               <span className="text-xs font-semibold text-white">{estimatedTime} min</span>
             </div>
           </div>

          {/* Score Display for Completed Tests com design moderno */}
          {status === 'completed' && score && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">Pontuação</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-green-600">{score}</span>
                  <span className="text-sm font-medium text-green-500">%</span>
                </div>
              </div>
              {completedAt && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Concluído em {new Date(completedAt).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          )}

          {/* Dimensions com design compacto */}
           <div className="space-y-2">
             <div className="flex items-center gap-1.5">
               <Zap className="w-3.5 h-3.5 text-white" />
               <p className="text-xs font-semibold text-white/90 uppercase tracking-wide">Dimensões</p>
             </div>
             <div className="flex flex-wrap gap-1.5">
               {dimensions && dimensions.slice(0, 3).map((dimension, index) => (
                 <Badge 
                   key={index} 
                   className="text-xs px-2 py-1 transition-all duration-300 font-medium bg-white/15 text-white border-white/30"
                 >
                   {dimension}
                 </Badge>
               ))}
               {dimensions && dimensions.length > 3 && (
                 <Badge className="text-xs px-2 py-1 bg-white/10 text-white/70 border-white/20 font-medium">
                   +{dimensions.length - 3} mais
                 </Badge>
               )}
             </div>
           </div>
        </div>

        {/* Action Button moderno - Always at bottom */}
         <div className="mt-4">
          <Button 
            className="w-full text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group/btn"
            style={{
               background: status === 'available' ? `linear-gradient(135deg, ${categoryConfig.color}, ${categoryConfig.color}CC)` :
                          status === 'in_progress' ? 'linear-gradient(135deg, #EAB308, #F59E0B)' :
                          status === 'completed' ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'linear-gradient(135deg, #9CA3AF, #6B7280)'
             }}
            onClick={handleButtonClick}
            disabled={status === 'locked'}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -top-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            
            <div className="flex items-center justify-center gap-2 relative z-10">
              {status === 'available' && <Play className="h-4 w-4" />}
              {status === 'in_progress' && <AlertCircle className="h-4 w-4" />}
              {status === 'completed' && <CheckCircle className="h-4 w-4" />}
              {status === 'locked' && <AlertCircle className="h-4 w-4" />}
              <span>{getButtonText()}</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}