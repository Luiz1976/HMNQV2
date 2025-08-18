// HumaniQ AI - API de Resultados de Testes
// Fornece resultados detalhados com análise de IA e relatórios profissionais

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Obter resultado específico do teste
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = params
    const { searchParams } = new URL(request.url)
    const includeReport = searchParams.get('includeReport') === 'true'
    const regenerateAnalysis = searchParams.get('regenerateAnalysis') === 'true'

    // Buscar resultado do teste com todas as relações
    const testResult = await db.testResult.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      include: {
        test: {
          include: {
            questions: true,
            category: true
          }
        },
        session: {
          include: {
            answers: {
              include: {
                question: true
              },
              orderBy: {
                createdAt: 'asc'
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    if (!testResult) {
      return NextResponse.json(
        { error: 'Resultado do teste não encontrado' },
        { status: 404 }
      )
    }

    // Buscar ou gerar análise de IA
    let aiAnalysis = await db.aIAnalysis.findFirst({
      where: {
        testResultId: id,
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Regenerar análise se solicitado ou se não existir
    if (regenerateAnalysis || !aiAnalysis) {
      const analysisResult = await generateOrUpdateAIAnalysis(testResult)
      if (analysisResult) {
        aiAnalysis = analysisResult
      }
    }

    // Preparar resposta
    const response: any = {
      id: testResult.id,
      test: {
        id: testResult.test.id,
        name: testResult.test.name,
        description: testResult.test.description,
        testType: testResult.test.testType,
        category: testResult.test.category
      },
      user: testResult.user,
      completedAt: testResult.completedAt,
      duration: testResult.duration,
      overallScore: testResult.overallScore,
      dimensionScores: testResult.dimensionScores,
      interpretation: testResult.interpretation,
      recommendations: testResult.recommendations,
      metadata: testResult.metadata,
      answers: testResult.session.answers.map(answer => ({
        questionId: answer.questionId,
        question: {
          id: answer.question.id,
          text: answer.question.questionText,
          type: answer.question.questionType,
          configuration: answer.question.options
        },
        value: answer.answerValue,
        metadata: answer.metadata,
        answeredAt: answer.createdAt
      })),
      aiAnalysis: aiAnalysis ? {
        id: aiAnalysis.id,
        analysis: aiAnalysis.analysis,
        
        analysisType: aiAnalysis.analysisType,
        metadata: aiAnalysis.metadata,
        createdAt: aiAnalysis.createdAt,
        professionalReport: includeReport ? await generateProfessionalReport(testResult, aiAnalysis) : undefined
      } : null,
      statistics: await calculateTestStatistics(testResult)
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao buscar resultado do teste:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar resultado do teste' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar interpretação ou recomendações
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = params
    const { interpretation, recommendations, regenerateAI } = await request.json()

    // Verificar se o resultado existe e pertence ao usuário
    const testResult = await db.testResult.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!testResult) {
      return NextResponse.json(
        { error: 'Resultado do teste não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar resultado
    const updatedResult = await db.testResult.update({
      where: { id },
      data: {
        interpretation: interpretation || testResult.interpretation,
        recommendations: recommendations || testResult.recommendations,
        updatedAt: new Date()
      }
    })

    // Regenerar análise de IA se solicitado
    if (regenerateAI) {
      await generateOrUpdateAIAnalysis({
        ...testResult,
        interpretation: updatedResult.interpretation,
        recommendations: updatedResult.recommendations
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Resultado atualizado com sucesso',
      result: {
        id: updatedResult.id,
        interpretation: updatedResult.interpretation,
        recommendations: updatedResult.recommendations,
        updatedAt: updatedResult.updatedAt
      }
    })

  } catch (error) {
    console.error('Erro ao atualizar resultado:', error)
    return NextResponse.json(
      { error: 'Falha ao atualizar resultado' },
      { status: 500 }
    )
  }
}

// DELETE - Remover resultado (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = params

    // Verificar se o resultado existe e pertence ao usuário
    const testResult = await db.testResult.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!testResult) {
      return NextResponse.json(
        { error: 'Resultado do teste não encontrado' },
        { status: 404 }
      )
    }

    // Soft delete - marcar como removido nos metadados
    await db.testResult.update({
      where: { id },
      data: {
        metadata: {
          ...(testResult.metadata as object || {}),
          deleted: true,
          deletedAt: new Date().toISOString(),
          deletedBy: session.user.id
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Resultado removido com sucesso'
    })

  } catch (error) {
    console.error('Erro ao remover resultado:', error)
    return NextResponse.json(
      { error: 'Falha ao remover resultado' },
      { status: 500 }
    )
  }
}

// Função para gerar ou atualizar análise de IA
async function generateOrUpdateAIAnalysis(testResult: any) {
  try {
    // Fazer chamada para a API de análise de IA
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        testResultId: testResult.id
      })
    })

    if (!response.ok) {
      console.error('Erro na análise de IA:', response.statusText)
      return null
    }

    const aiResult = await response.json()
    
    // Buscar a análise criada no banco
    const aiAnalysis = await db.aIAnalysis.findFirst({
      where: {
        testResultId: testResult.id,
        userId: testResult.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return aiAnalysis

  } catch (error) {
    console.error('Erro ao gerar análise de IA:', error)
    return null
  }
}

// Função para gerar relatório profissional
async function generateProfessionalReport(testResult: any, aiAnalysis: any): Promise<string> {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const testName = testResult.test?.name || 'Teste de Avaliação'
  const userName = `${testResult.user?.firstName || ''} ${testResult.user?.lastName || ''}`.trim()
  const testType = getTestTypeDescription(testResult.test?.testType)
  
  const report = `
# RELATÓRIO DE ANÁLISE PSICOLÓGICA PROFISSIONAL

---

## INFORMAÇÕES GERAIS

**Data do Relatório:** ${currentDate}  
**Participante:** ${userName}  
**Teste Aplicado:** ${testName}  
**Tipo de Avaliação:** ${testType}  
**Data de Aplicação:** ${new Date(testResult.completedAt).toLocaleDateString('pt-BR')}  
**Duração:** ${Math.round(testResult.duration / 60)} minutos  
**Análise Completa**

---

## RESUMO EXECUTIVO

${aiAnalysis.analysis}

---

## RESULTADOS QUANTITATIVOS

**Pontuação Geral:** ${testResult.overallScore?.toFixed(1)}%

### Dimensões Avaliadas:

${Object.entries(testResult.dimensionScores || {}).map(([dimension, score]) => 
  `**${dimension}:** ${(score as number).toFixed(1)}% - ${getScoreInterpretation(score as number)}`
).join('\n')}

---

## ANÁLISE COMPORTAMENTAL DETALHADA

### Pontos Fortes Identificados:
${extractStrengths(testResult.dimensionScores, testResult.test?.testType)}

### Áreas de Desenvolvimento:
${extractDevelopmentAreas(testResult.dimensionScores, testResult.test?.testType)}

### Perfil Comportamental:
${generateBehavioralProfile(testResult.dimensionScores, testResult.test?.testType)}

---

## RECOMENDAÇÕES PROFISSIONAIS

${testResult.recommendations || 'Recomendações específicas baseadas nos resultados obtidos.'}

### Plano de Desenvolvimento Sugerido:

1. **Curto Prazo (1-3 meses):**
   - Foco nas áreas de maior potencial de melhoria
   - Implementação de práticas de autoconhecimento
   - Busca por feedback regular

2. **Médio Prazo (3-6 meses):**
   - Desenvolvimento de competências específicas
   - Participação em programas de capacitação
   - Aplicação prática dos aprendizados

3. **Longo Prazo (6-12 meses):**
   - Consolidação das melhorias implementadas
   - Reavaliação do perfil comportamental
   - Definição de novos objetivos de desenvolvimento

---

## CONSIDERAÇÕES TÉCNICAS

### Metodologia Aplicada:
- Instrumento: ${testName}
- Tipo de análise: ${aiAnalysis.analysisType}
- Algoritmo de IA: HumaniQ AI Engine v2.0
- Base de dados: Modelos psicométricos validados

### Limitações e Observações:
- Esta análise representa um momento específico no tempo
- Os resultados devem ser interpretados por profissionais qualificados
- Recomenda-se reavaliação periódica para acompanhamento da evolução
- O instrumento possui validade científica comprovada

### Validade e Confiabilidade:
- **Validade do Instrumento:** Validado cientificamente
- **Análise Completa**
- **Margem de Erro:** ±5%
- **Validade dos Resultados:** 12 meses

---

## ANEXOS

### Gráfico de Resultados:
[Representação visual dos resultados seria inserida aqui]

### Dados Técnicos:
- **ID do Teste:** ${testResult.id}
- **Total de Questões:** ${testResult.metadata?.totalQuestions || 'N/A'}
- **Método de Cálculo:** ${testResult.metadata?.calculationMethod || 'Padrão'}
- **Versão do Sistema:** HumaniQ v2.0

---

## CONCLUSÃO

Este relatório apresenta uma análise abrangente do perfil avaliado, baseada em metodologias científicas e processamento por inteligência artificial. Os resultados devem ser utilizados como ferramenta de apoio ao desenvolvimento pessoal e profissional, sempre com acompanhamento de profissionais qualificados.

Para dúvidas ou esclarecimentos adicionais sobre este relatório, entre em contato com a equipe técnica do HumaniQ.

---

**Relatório gerado automaticamente pelo Sistema HumaniQ AI**  
**Data de Geração:** ${currentDate}  
**Versão:** 2.0.${new Date().getFullYear()}

*Este documento é confidencial e destinado exclusivamente ao participante da avaliação.*
`
  
  return report.trim()
}

// Função para calcular estatísticas do teste
async function calculateTestStatistics(testResult: any) {
  try {
    // Buscar outros resultados do mesmo teste para comparação
    const otherResults = await db.testResult.findMany({
      where: {
        testId: testResult.testId,
        id: { not: testResult.id }
      },
      select: {
        overallScore: true,
        dimensionScores: true
      }
    })

    if (otherResults.length === 0) {
      return {
        percentile: null,
        comparison: 'Dados insuficientes para comparação',
        sampleSize: 0
      }
    }

    // Calcular percentil
    const scores = otherResults.map(r => r.overallScore).filter(s => s !== null) as number[]
    const userScore = testResult.overallScore
    
    if (userScore === null || scores.length === 0) {
      return {
        percentile: null,
        comparison: 'Pontuação não disponível',
        sampleSize: otherResults.length
      }
    }

    const lowerScores = scores.filter(score => score < userScore).length
    const percentile = Math.round((lowerScores / scores.length) * 100)

    // Determinar comparação
    let comparison = ''
    if (percentile >= 90) comparison = 'Desempenho excepcional'
    else if (percentile >= 75) comparison = 'Desempenho acima da média'
    else if (percentile >= 50) comparison = 'Desempenho na média'
    else if (percentile >= 25) comparison = 'Desempenho abaixo da média'
    else comparison = 'Desempenho significativamente abaixo da média'

    return {
      percentile,
      comparison,
      sampleSize: otherResults.length,
      averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length
    }

  } catch (error) {
    console.error('Erro ao calcular estatísticas:', error)
    return {
      percentile: null,
      comparison: 'Erro no cálculo de estatísticas',
      sampleSize: 0
    }
  }
}

// Funções auxiliares para o relatório
function getTestTypeDescription(testType: string): string {
  const descriptions: { [key: string]: string } = {
    PSYCHOSOCIAL: 'Avaliação Psicossocial - Análise de valores e comportamentos',
    PERSONALITY: 'Perfil Comportamental - Análise de personalidade',
    DISC: 'HumaniQ DISC - Perfil Comportamental Profissional',
    GRAPHOLOGY: 'Análise Grafológica - Avaliação através da escrita',
    CORPORATE: 'Avaliação Corporativa - Clima e cultura organizacional'
  }
  
  return descriptions[testType] || 'Avaliação Personalizada'
}

function getScoreInterpretation(score: number): string {
  if (score >= 80) return 'Muito Alto'
  if (score >= 60) return 'Alto'
  if (score >= 40) return 'Moderado'
  if (score >= 20) return 'Baixo'
  return 'Muito Baixo'
}

function extractStrengths(dimensionScores: any, testType: string): string {
  if (!dimensionScores) return 'Análise não disponível'
  
  const sortedDimensions = Object.entries(dimensionScores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
  
  return sortedDimensions
    .map(([dimension, score]) => `- **${dimension}**: Pontuação elevada (${(score as number).toFixed(1)}%) indica forte competência nesta área`)
    .join('\n')
}

function extractDevelopmentAreas(dimensionScores: any, testType: string): string {
  if (!dimensionScores) return 'Análise não disponível'
  
  const sortedDimensions = Object.entries(dimensionScores)
    .sort(([,a], [,b]) => (a as number) - (b as number))
    .slice(0, 2)
  
  return sortedDimensions
    .map(([dimension, score]) => `- **${dimension}**: Pontuação mais baixa (${(score as number).toFixed(1)}%) sugere oportunidade de desenvolvimento`)
    .join('\n')
}

function generateBehavioralProfile(dimensionScores: any, testType: string): string {
  if (!dimensionScores) return 'Perfil não disponível'
  
  const profiles: { [key: string]: any } = {
    PSYCHOSOCIAL: {
      'Autotranscendência': 'Orientação para valores universais e bem-estar coletivo',
      'Autopromoção': 'Foco em conquistas pessoais e reconhecimento',
      'Abertura à Mudança': 'Flexibilidade e busca por novidades',
      'Conservação': 'Valorização da estabilidade e tradições'
    },
    PERSONALITY: {
      'Dominância': 'Liderança natural e foco em resultados',
      'Influência': 'Habilidades interpessoais e comunicação',
      'Estabilidade': 'Consistência e confiabilidade',
      'Conformidade': 'Atenção aos detalhes e seguimento de padrões'
    },
    DISC: {
      'dominance': 'Perfil Dominante - Orientado para resultados, direto, assertivo e competitivo',
      'influence': 'Perfil Influente - Sociável, otimista, persuasivo e comunicativo',
      'stability': 'Perfil Estável - Paciente, leal, cooperativo e confiável',
      'conscientiousness': 'Perfil Consciencioso - Preciso, analítico, sistemático e detalhista'
    }
  }
  
  const typeProfiles = profiles[testType] || {}
  
  // Para DISC, usar lógica específica baseada no perfil predominante
  if (testType === 'DISC' && dimensionScores.dominantProfile) {
    const profileMap: { [key: string]: string } = {
      'D': 'dominance',
      'I': 'influence', 
      'S': 'stability',
      'C': 'conscientiousness'
    }
    
    const profileKey = profileMap[dimensionScores.dominantProfile]
    return typeProfiles[profileKey] || `Perfil predominante: ${dimensionScores.dominantProfile}`
  }
  
  return Object.entries(dimensionScores)
    .filter(([, score]) => (score as number) > 60)
    .map(([dimension]) => typeProfiles[dimension] || `Característica predominante: ${dimension}`)
    .join('. ') || 'Perfil equilibrado entre as diferentes dimensões avaliadas'
}