'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Download, Share2, RotateCcw, Home } from 'lucide-react'

interface EnneagramResult {
  id: string
  dominantType: number
  scores: number[]
  completedAt: string
  userId: string
}

interface EnneagramType {
  id: number
  name: string
  title: string
  description: string
  characteristics: string[]
  strengths: string[]
  challenges: string[]
  motivation: string
  fear: string
}

const enneagramTypes: EnneagramType[] = [
  {
    id: 1,
    name: "O Perfeccionista",
    title: "Tipo 1 - O Perfeccionista",
    description: "Pessoas do Tipo 1 são racionais, idealistas e têm princípios sólidos. São motivadas pelo desejo de viver corretamente, melhorar tudo e todos, e evitar erros.",
    characteristics: ["Organizados e detalhistas", "Críticos consigo mesmos e com outros", "Responsáveis e confiáveis", "Buscam a perfeição em tudo"],
    strengths: ["Integridade moral", "Disciplina", "Senso de responsabilidade", "Capacidade de melhoria contínua"],
    challenges: ["Perfeccionismo excessivo", "Crítica constante", "Rigidez", "Dificuldade em relaxar"],
    motivation: "Ser bom, correto, perfeito e melhorar tudo",
    fear: "Ser corrupto, defeituoso ou errado"
  },
  {
    id: 2,
    name: "O Prestativo",
    title: "Tipo 2 - O Prestativo",
    description: "Pessoas do Tipo 2 são empáticas, sinceras e calorosas. São orientadas para as pessoas, mas podem ser sentimentais, lisonjeiras e possessivas.",
    characteristics: ["Empáticos e carinhosos", "Focados nas necessidades dos outros", "Generosos com seu tempo e energia", "Buscam aprovação através da ajuda"],
    strengths: ["Empatia natural", "Capacidade de cuidar", "Generosidade", "Habilidades interpessoais"],
    challenges: ["Negligenciar próprias necessidades", "Manipulação emocional", "Dependência da aprovação", "Dificuldade em dizer não"],
    motivation: "Sentir-se amado e necessário",
    fear: "Ser rejeitado ou indesejado"
  },
  {
    id: 3,
    name: "O Realizador",
    title: "Tipo 3 - O Realizador",
    description: "Pessoas do Tipo 3 são adaptáveis, ambiciosas e orientadas para o sucesso. São energéticas e conscientes da própria imagem, mas podem ser competitivas e workaholics.",
    characteristics: ["Orientados para objetivos", "Adaptáveis e versáteis", "Conscientes da imagem", "Competitivos e ambiciosos"],
    strengths: ["Motivação para o sucesso", "Adaptabilidade", "Eficiência", "Liderança natural"],
    challenges: ["Workaholism", "Superficialidade", "Competitividade excessiva", "Dificuldade com vulnerabilidade"],
    motivation: "Sentir-se valioso e aceito",
    fear: "Ser sem valor ou sem mérito"
  },
  {
    id: 4,
    name: "O Individualista",
    title: "Tipo 4 - O Individualista",
    description: "Pessoas do Tipo 4 são expressivas, dramáticas, egocêntricas e temperamentais. São também criativas, emotivas e pessoais, mas podem ser mal-humoradas e autoconscientes.",
    characteristics: ["Criativos e artísticos", "Emocionalmente intensos", "Buscam autenticidade", "Sentem-se diferentes dos outros"],
    strengths: ["Criatividade", "Autenticidade", "Profundidade emocional", "Intuição"],
    challenges: ["Instabilidade emocional", "Melancolia", "Autocomiseração", "Inveja"],
    motivation: "Encontrar a si mesmo e seu significado",
    fear: "Não ter identidade ou significado pessoal"
  },
  {
    id: 5,
    name: "O Investigador",
    title: "Tipo 5 - O Investigador",
    description: "Pessoas do Tipo 5 são alertas, perspicazes e curiosas. São capazes de se concentrar e focar em desenvolver ideias e habilidades complexas.",
    characteristics: ["Observadores e analíticos", "Independentes e autossuficientes", "Reservados e privados", "Buscam conhecimento e compreensão"],
    strengths: ["Pensamento analítico", "Independência", "Objetividade", "Expertise técnica"],
    challenges: ["Isolamento social", "Avareza emocional", "Dificuldade em se conectar", "Procrastinação"],
    motivation: "Ser competente e compreender o mundo",
    fear: "Ser incompetente ou invadido"
  },
  {
    id: 6,
    name: "O Leal",
    title: "Tipo 6 - O Leal",
    description: "Pessoas do Tipo 6 são confiáveis, trabalhadoras e responsáveis, mas também podem ser defensivas, evasivas e altamente ansiosas.",
    characteristics: ["Leais e comprometidos", "Responsáveis e confiáveis", "Ansiosos e cautelosos", "Buscam segurança e apoio"],
    strengths: ["Lealdade", "Responsabilidade", "Trabalho em equipe", "Preparação para problemas"],
    challenges: ["Ansiedade crônica", "Dúvida constante", "Procrastinação", "Dependência de autoridade"],
    motivation: "Ter segurança e apoio",
    fear: "Ficar sem apoio ou orientação"
  },
  {
    id: 7,
    name: "O Entusiasta",
    title: "Tipo 7 - O Entusiasta",
    description: "Pessoas do Tipo 7 são versáteis, espontâneas e adquirem muitas habilidades. São alegres e animadas, mas podem ser dispersas e indisciplinadas.",
    characteristics: ["Otimistas e entusiasmados", "Versáteis e espontâneos", "Aventureiros e curiosos", "Evitam dor e limitações"],
    strengths: ["Otimismo", "Versatilidade", "Entusiasmo", "Capacidade de inspirar"],
    challenges: ["Impulsividade", "Superficialidade", "FOMO", "Dificuldade com compromisso"],
    motivation: "Manter felicidade e satisfação",
    fear: "Ficar preso na dor ou privação"
  },
  {
    id: 8,
    name: "O Desafiador",
    title: "Tipo 8 - O Desafiador",
    description: "Pessoas do Tipo 8 são autoconfiantes, fortes e assertivas. São protetoras, decididas e controladoras, mas também podem ser orgulhosas e confrontativas.",
    characteristics: ["Assertivos e confiantes", "Protetores dos outros", "Controladores e dominantes", "Buscam justiça e poder"],
    strengths: ["Liderança natural", "Proteção dos vulneráveis", "Decisão rápida", "Coragem"],
    challenges: ["Agressividade", "Dificuldade com vulnerabilidade", "Impaciência", "Tendência ao controle"],
    motivation: "Ser autossuficiente e controlar o próprio destino",
    fear: "Ser controlado ou vulnerável"
  },
  {
    id: 9,
    name: "O Pacificador",
    title: "Tipo 9 - O Pacificador",
    description: "Pessoas do Tipo 9 são receptivas, tranquilizadoras e agradáveis. São estáveis, criativas e otimistas, mas também podem ser complacentes e minimalistas.",
    characteristics: ["Pacíficos e harmoniosos", "Receptivos e empáticos", "Estáveis e consistentes", "Evitam conflitos"],
    strengths: ["Mediação", "Estabilidade", "Aceitação", "Capacidade de ver múltiplas perspectivas"],
    challenges: ["Procrastinação", "Passividade", "Evitação de conflitos", "Dificuldade em tomar decisões"],
    motivation: "Manter harmonia interna e externa",
    fear: "Perda de conexão e fragmentação"
  }
]

export default function EnneagramResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [result, setResult] = useState<EnneagramResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const resultId = searchParams.get('id')

  useEffect(() => {
    if (resultId) {
      fetchResults(resultId)
    } else {
      setError('ID do resultado não encontrado')
      setLoading(false)
    }
  }, [resultId])

  const fetchResults = async (id: string) => {
    try {
      setLoading(true)
      // Simular chamada da API - substituir pela API real
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Dados simulados - substituir pela resposta real da API
      const mockResult: EnneagramResult = {
        id: id,
        dominantType: Math.floor(Math.random() * 9) + 1,
        scores: Array.from({ length: 9 }, () => Math.floor(Math.random() * 100) + 1),
        completedAt: new Date().toISOString(),
        userId: 'user123'
      }
      
      setResult(mockResult)
    } catch (err) {
      setError('Erro ao carregar resultados')
    } finally {
      setLoading(false)
    }
  }

  const getDominantType = (): EnneagramType | null => {
    if (!result) return null
    return enneagramTypes.find(type => type.id === result.dominantType) || null
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-green-400'
    if (score >= 40) return 'bg-yellow-400'
    if (score >= 20) return 'bg-orange-400'
    return 'bg-red-400'
  }

  const handleDownloadPDF = () => {
    // Implementar download do PDF
    console.log('Download PDF')
  }

  const handleShare = () => {
    // Implementar compartilhamento
    console.log('Compartilhar resultados')
  }

  const handleNewTest = () => {
    router.push('/colaborador/personalidade/eneagrama')
  }

  const handleBackToDashboard = () => {
    router.push('/colaborador/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus resultados...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Resultado não encontrado'}</p>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    )
  }

  const dominantType = getDominantType()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-green-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">HumaniQ Eneagrama</h1>
                <p className="text-green-100">Resultados do Teste</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-100">Concluído em</p>
              <p className="font-semibold">{new Date(result.completedAt).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tipo Dominante */}
        {dominantType && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full text-3xl font-bold mb-4">
                {dominantType.id}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{dominantType.title}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">{dominantType.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Características Principais</h3>
                <ul className="space-y-2">
                  {dominantType.characteristics.map((char, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Pontos Fortes</h3>
                <ul className="space-y-2">
                  {dominantType.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Motivação Principal</h4>
                  <p className="text-gray-700">{dominantType.motivation}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Medo Básico</h4>
                  <p className="text-gray-700">{dominantType.fear}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gráfico de Pontuações */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Suas Pontuações por Tipo</h3>
          <div className="space-y-4">
            {result.scores.map((score, index) => {
              const type = enneagramTypes[index]
              const isHighest = score === Math.max(...result.scores)
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                      isHighest ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {type.id}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{type.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${getScoreColor(score)}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Interpretação e Próximos Passos */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Interpretação dos Resultados</h3>
            <div className="space-y-3 text-gray-700">
              <p>Seu tipo dominante representa sua personalidade principal, mas lembre-se de que todos nós temos aspectos de todos os tipos.</p>
              <p>As pontuações mais altas indicam características mais presentes em sua personalidade atual.</p>
              <p>Use estes insights para desenvolvimento pessoal e melhor autoconhecimento.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Próximos Passos</h3>
            <div className="space-y-3 text-gray-700">
              <p>• Estude mais sobre seu tipo dominante</p>
              <p>• Observe os padrões em seu comportamento</p>
              <p>• Trabalhe no desenvolvimento de pontos fracos</p>
              <p>• Use os pontos fortes a seu favor</p>
              <p>• Considere coaching ou terapia para aprofundamento</p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Baixar PDF</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Compartilhar</span>
            </button>
            
            <button
              onClick={handleNewTest}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Fazer Novo Teste</span>
            </button>
            
            <button
              onClick={handleBackToDashboard}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}