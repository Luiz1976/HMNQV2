'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { EnneagramSubtype, getSubtypeByCode, instinctNames, instinctColors } from '@/data/enneagram-subtypes'
import { Heart, Brain, Zap, Target, TrendingUp, Users, Briefcase, Lightbulb, Shield, Star, AlertTriangle, CheckCircle, ArrowRight, Compass } from 'lucide-react'

interface SubtypeDetailsProps {
  dominantType: number
  dominantInstinct: 'sp' | 'so' | 'sx'
  secondaryInstinct?: 'sp' | 'so' | 'sx'
  className?: string
}

const SubtypeDetails: React.FC<SubtypeDetailsProps> = ({
  dominantType,
  dominantInstinct,
  secondaryInstinct,
  className = ''
}) => {
  const subtype = getSubtypeByCode(`${dominantType}${dominantInstinct}`)
  
  if (!subtype) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Dados do subtipo não encontrados.</p>
        </CardContent>
      </Card>
    )
  }

  const instinctColorMap = {
    sp: '#10B981',
    so: '#3B82F6', 
    sx: '#EF4444'
  }

  const instinctColor = instinctColorMap[dominantInstinct] || '#6B7280'

  const getInstinctDescription = (instinct: 'sp' | 'so' | 'sx') => {
    switch (instinct) {
      case 'sp':
        return 'O instinto de Autopreservação foca na sobrevivência física, segurança, conforto e bem-estar pessoal. Pessoas com este instinto dominante são naturalmente atentas às suas necessidades básicas e ao ambiente físico.'
      case 'so':
        return 'O instinto Social foca em pertencimento, hierarquia, grupos e conexões sociais. Pessoas com este instinto dominante são naturalmente atentas à dinâmica de grupo e ao seu lugar na sociedade.'
      case 'sx':
        return 'O instinto Sexual (ou de Atração) foca em intensidade, conexão íntima, química e energia. Pessoas com este instinto dominante são naturalmente atentas à atração, intensidade e conexões profundas.'
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="flex items-center gap-3">
          <div 
            className="w-6 h-6 rounded-full shadow-md" 
            style={{ backgroundColor: instinctColor }}
          />
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">{subtype.name}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant="secondary" 
                className="font-medium"
                style={{ 
                  backgroundColor: `${instinctColor}20`, 
                  color: instinctColor,
                  borderColor: instinctColor 
                }}
              >
                <Compass className="w-3 h-3 mr-1" />
                Instinto {instinctNames[dominantInstinct]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Tipo {dominantType}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8 p-6">
        {/* Descrição Expandida */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg">
          <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <Lightbulb className="w-6 h-6" style={{ color: instinctColor }} />
            Visão Geral do Subtipo
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
            {subtype.description}
          </p>
        </div>

        {/* Motivações e Medos Expandidos */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-l-4" style={{ borderLeftColor: instinctColor }}>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" style={{ color: instinctColor }} />
                Motivação Central
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{subtype.motivation}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-red-400">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Medo Fundamental
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{subtype.fear}</p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Características Detalhadas */}
        <div>
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6" style={{ color: instinctColor }} />
            Características Distintivas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subtype.characteristics.map((characteristic, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">{characteristic}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Pontos Fortes e Desafios Expandidos */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-green-800 dark:text-green-200">
                <Star className="w-5 h-5" />
                Pontos Fortes & Talentos
              </h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {subtype.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                    <span className="text-green-800 dark:text-green-200 font-medium">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <AlertTriangle className="w-5 h-5" />
                Desafios & Áreas de Crescimento
              </h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {subtype.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                    <span className="text-orange-800 dark:text-orange-200 font-medium">{challenge}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Comportamentos Característicos */}
        <div>
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" style={{ color: instinctColor }} />
            Padrões Comportamentais
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {subtype.keyBehaviors.map((behavior, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border shadow-sm">
                <ArrowRight className="w-4 h-4" style={{ color: instinctColor }} />
                <span className="text-gray-700 dark:text-gray-300 font-medium">{behavior}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Contextos Profissionais e Pessoais */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Briefcase className="w-5 h-5" />
                Ambiente Profissional
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                {subtype.workStyle}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-800">
            <CardHeader className="pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-pink-800 dark:text-pink-200">
                <Heart className="w-5 h-5" />
                Relacionamentos Interpessoais
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-pink-800 dark:text-pink-200 leading-relaxed">
                {subtype.relationships}
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Caminho de Desenvolvimento */}
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <h3 className="font-bold text-xl flex items-center gap-2 text-purple-800 dark:text-purple-200">
              <TrendingUp className="w-6 h-6" />
              Jornada de Desenvolvimento Pessoal
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-purple-800 dark:text-purple-200 leading-relaxed text-base font-medium">
              {subtype.growth}
            </p>
          </CardContent>
        </Card>

        {/* Informações do Instinto Expandidas */}
        <Card className="border-2" style={{ borderColor: `${instinctColor}40` }}>
          <CardHeader style={{ backgroundColor: `${instinctColor}10` }}>
            <h3 className="font-bold text-xl flex items-center gap-2">
              <Shield className="w-6 h-6" style={{ color: instinctColor }} />
              Compreendendo o Instinto {instinctNames[dominantInstinct]}
            </h3>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
              {getInstinctDescription(dominantInstinct)}
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default SubtypeDetails