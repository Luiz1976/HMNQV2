'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Users, Briefcase, AlertTriangle, CheckCircle, Star, TrendingUp, Shield } from 'lucide-react'

interface CompatibilityAnalysisProps {
  dominantType: number
  dominantInstinct: 'sp' | 'so' | 'sx'
}

// Dados de compatibilidade entre tipos do Eneagrama
const typeCompatibility = {
  1: {
    highCompatibility: [2, 7, 9],
    mediumCompatibility: [1, 3, 5, 6],
    challenges: [4, 8],
    workStyle: "Orientado para qualidade e precisão",
    relationshipStyle: "Busca parceiros que compartilhem valores éticos"
  },
  2: {
    highCompatibility: [1, 4, 8, 9],
    mediumCompatibility: [2, 3, 6, 7],
    challenges: [5],
    workStyle: "Colaborativo e focado em pessoas",
    relationshipStyle: "Demonstra amor através do cuidado e apoio"
  },
  3: {
    highCompatibility: [1, 6, 9],
    mediumCompatibility: [2, 3, 7, 8],
    challenges: [4, 5],
    workStyle: "Orientado para resultados e eficiência",
    relationshipStyle: "Valoriza parceiros que apoiem seus objetivos"
  },
  4: {
    highCompatibility: [1, 2, 9],
    mediumCompatibility: [4, 5, 6, 7],
    challenges: [3, 8],
    workStyle: "Criativo e busca autenticidade",
    relationshipStyle: "Procura conexões profundas e significativas"
  },
  5: {
    highCompatibility: [1, 8, 9],
    mediumCompatibility: [4, 5, 6, 7],
    challenges: [2, 3],
    workStyle: "Independente e analítico",
    relationshipStyle: "Valoriza espaço pessoal e autonomia"
  },
  6: {
    highCompatibility: [1, 2, 9],
    mediumCompatibility: [3, 5, 6, 8],
    challenges: [4, 7],
    workStyle: "Leal e orientado para equipe",
    relationshipStyle: "Busca segurança e confiança mútua"
  },
  7: {
    highCompatibility: [1, 5, 9],
    mediumCompatibility: [2, 3, 4, 7],
    challenges: [6, 8],
    workStyle: "Entusiástico e inovador",
    relationshipStyle: "Procura aventura e variedade"
  },
  8: {
    highCompatibility: [2, 5, 9],
    mediumCompatibility: [1, 3, 6, 8],
    challenges: [4, 7],
    workStyle: "Assertivo e orientado para liderança",
    relationshipStyle: "Valoriza honestidade e força"
  },
  9: {
    highCompatibility: [1, 2, 3, 4, 5, 6, 7, 8],
    mediumCompatibility: [9],
    challenges: [],
    workStyle: "Harmonioso e mediador",
    relationshipStyle: "Busca paz e evita conflitos"
  }
}

// Compatibilidade por instinto
const instinctCompatibility = {
  sp: {
    name: "Autopreservação",
    bestWith: ["sp", "so"],
    challengesWith: ["sx"],
    description: "Foca em segurança, conforto e bem-estar pessoal"
  },
  so: {
    name: "Social",
    bestWith: ["so", "sx"],
    challengesWith: ["sp"],
    description: "Orientado para grupos, hierarquias e conexões sociais"
  },
  sx: {
    name: "Sexual/Um-a-um",
    bestWith: ["sx", "so"],
    challengesWith: ["sp"],
    description: "Busca intensidade, química e conexões profundas"
  }
}

const getTypeName = (type: number): string => {
  const typeNames = {
    1: "O Perfeccionista",
    2: "O Prestativo",
    3: "O Realizador",
    4: "O Individualista",
    5: "O Investigador",
    6: "O Leal",
    7: "O Entusiasta",
    8: "O Desafiador",
    9: "O Pacificador"
  }
  return typeNames[type as keyof typeof typeNames] || `Tipo ${type}`
}

const getCompatibilityLevel = (userType: number, otherType: number): 'high' | 'medium' | 'challenge' => {
  const compatibility = typeCompatibility[userType as keyof typeof typeCompatibility]
  if (compatibility.highCompatibility.includes(otherType)) return 'high'
  if (compatibility.mediumCompatibility.includes(otherType)) return 'medium'
  return 'challenge'
}

const getCompatibilityColor = (level: 'high' | 'medium' | 'challenge'): string => {
  switch (level) {
    case 'high': return 'bg-green-100 text-green-800 border-green-200'
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'challenge': return 'bg-red-100 text-red-800 border-red-200'
  }
}

const getCompatibilityIcon = (level: 'high' | 'medium' | 'challenge') => {
  switch (level) {
    case 'high': return <CheckCircle className="w-4 h-4" />
    case 'medium': return <Star className="w-4 h-4" />
    case 'challenge': return <AlertTriangle className="w-4 h-4" />
  }
}

export default function CompatibilityAnalysis({ dominantType, dominantInstinct }: CompatibilityAnalysisProps) {
  const userCompatibility = typeCompatibility[dominantType as keyof typeof typeCompatibility]
  const userInstinct = instinctCompatibility[dominantInstinct]

  return (
    <div className="space-y-8">
      {/* Compatibility Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-rose-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            Análise de Compatibilidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Relationship Style */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Seu Estilo de Relacionamento
              </h4>
              <p className="text-gray-700">{userCompatibility.relationshipStyle}</p>
            </div>

            {/* Work Style */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                Seu Estilo de Trabalho
              </h4>
              <p className="text-gray-700">{userCompatibility.workStyle}</p>
            </div>
          </div>

          {/* Instinct Compatibility */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              Compatibilidade por Instinto ({userInstinct.name})
            </h4>
            <p className="text-gray-700 mb-4">{userInstinct.description}</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Melhor compatibilidade:</span>
              {userInstinct.bestWith.map((instinct) => (
                <Badge key={instinct} className="bg-green-100 text-green-800">
                  {instinctCompatibility[instinct as keyof typeof instinctCompatibility].name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Type Compatibility Grid */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            Compatibilidade com Outros Tipos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* High Compatibility */}
            <div className="space-y-4">
              <h4 className="font-semibold text-green-700 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Alta Compatibilidade
              </h4>
              <div className="space-y-2">
                {userCompatibility.highCompatibility.map((type) => (
                  <div key={type} className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {type}
                      </div>
                      <span className="font-medium text-green-800">{getTypeName(type)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medium Compatibility */}
            <div className="space-y-4">
              <h4 className="font-semibold text-yellow-700 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Compatibilidade Moderada
              </h4>
              <div className="space-y-2">
                {userCompatibility.mediumCompatibility.map((type) => (
                  <div key={type} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {type}
                      </div>
                      <span className="font-medium text-yellow-800">{getTypeName(type)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div className="space-y-4">
              <h4 className="font-semibold text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Desafios Potenciais
              </h4>
              <div className="space-y-2">
                {userCompatibility.challenges.map((type) => (
                  <div key={type} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {type}
                      </div>
                      <span className="font-medium text-red-800">{getTypeName(type)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compatibility Tips */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Dicas para Relacionamentos Saudáveis
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium text-blue-700">Para Relacionamentos Pessoais:</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Comunique suas necessidades claramente</li>
                  <li>• Respeite as diferenças de personalidade</li>
                  <li>• Pratique a empatia e compreensão</li>
                  <li>• Trabalhe em suas áreas de crescimento</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-indigo-700">Para Relacionamentos Profissionais:</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Adapte seu estilo de comunicação</li>
                  <li>• Valorize as forças de cada tipo</li>
                  <li>• Estabeleça expectativas claras</li>
                  <li>• Busque complementaridade nas equipes</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}