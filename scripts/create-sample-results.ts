// Script para criar resultados de teste de exemplo
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createSampleResults() {
  console.log('🧪 Criando resultados de teste de exemplo...')

  try {
    // Buscar usuário colaborador
    const collaborator = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })

    if (!collaborator) {
      console.error('❌ Usuário colaborador não encontrado')
      return
    }

    // Buscar teste de Eneagrama
    const enneagramTest = await prisma.test.findFirst({
      where: {
        name: { contains: 'Eneagrama' }
      }
    })

    if (!enneagramTest) {
      console.error('❌ Teste de Eneagrama não encontrado')
      return
    }

    console.log(`📋 Encontrado teste: ${enneagramTest.name} (ID: ${enneagramTest.id})`)
    console.log(`👤 Usuário: ${collaborator.firstName} ${collaborator.lastName} (ID: ${collaborator.id})`)

    // Criar sessão de teste
    const testSession = await prisma.testSession.create({
      data: {
        testId: enneagramTest.id,
        userId: collaborator.id,
        startedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
        completedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
        currentQuestion: 108,
        totalQuestions: 108,
        metadata: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ipAddress: '127.0.0.1',
          sessionStarted: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      }
    })

    console.log(`✅ Sessão criada: ${testSession.id}`)

    // Criar resultado de teste com dados realistas do Eneagrama
    const testResult = await prisma.testResult.create({
      data: {
        testId: enneagramTest.id,
        sessionId: testSession.id,
        userId: collaborator.id,
        duration: 25 * 60, // 25 minutos em segundos
        overallScore: 85,
        dimensionScores: {
          type1: 45,
          type2: 52,
          type3: 78,
          type4: 41,
          type5: 63,
          type6: 55,
          type7: 72,
          type8: 68,
          type9: 38,
          dominantType: 3,
          wing: 2,
          instinct: 'so', // social
          subtype: '3w2-so',
          tritype: '378'
        },
        interpretation: JSON.stringify({
          dominantType: {
            number: 3,
            name: 'O Realizador',
            description: 'Pessoas adaptáveis, orientadas para o sucesso e impulsionadas. São diplomáticas e ambiciosas, mas também podem ser preocupadas com a imagem e hostis.',
            coreMotivation: 'Sentir-se valioso e digno de ser amado',
            coreFear: 'Ser sem valor ou sem valor intrínseco além de suas realizações',
            keyTraits: ['Ambicioso', 'Adaptável', 'Impulsionado', 'Orientado para a imagem']
          },
          wing: {
            number: 2,
            name: 'O Ajudador',
            influence: 'Adiciona carisma interpessoal e foco nas necessidades dos outros'
          },
          instinct: {
            type: 'social',
            description: 'Foco na posição social, status e reconhecimento do grupo'
          },
          subtype: {
            code: '3w2-so',
            name: 'O Encantador Social',
            description: 'Combina a ambição do Tipo 3 com o carisma do Tipo 2, focando em conquistar admiração e status social'
          },
          tritype: {
            code: '378',
            name: 'O Mentor',
            description: 'Combinação de assertividade (3), otimismo (7) e intensidade (8)'
          }
        }),
        recommendations: JSON.stringify([
          'Desenvolva a autenticidade além das conquistas externas',
          'Pratique a pausa antes de reagir a críticas',
          'Cultive relacionamentos genuínos, não apenas estratégicos',
          'Reserve tempo para reflexão pessoal e autoconhecimento',
          'Aprenda a valorizar o processo, não apenas os resultados'
        ]),
        metadata: {
          testVersion: '2.1',
          calculationMethod: 'weighted_scoring',
          confidence: 0.87,
          completionRate: 100,
          status: 'completed',
          analysisDate: new Date().toISOString(),
          subtypeData: {
            instinctualVariant: 'social',
            wingStrength: 'moderate',
            integrationLevel: 'average',
            stressLevel: 'low'
          }
        },
        completedAt: new Date(Date.now() - 5 * 60 * 1000) // 5 minutos atrás
      }
    })

    console.log(`✅ Resultado criado: ${testResult.id}`)
    console.log(`🔗 URL de teste: http://localhost:3000/colaborador/personalidade/eneagrama/resultado?id=${testResult.id}`)

    // Criar mais alguns resultados para outros tipos
    const additionalResults = [
      {
        dominantType: 7,
        name: 'O Entusiasta',
        scores: { type1: 32, type2: 45, type3: 58, type4: 41, type5: 52, type6: 48, type7: 89, type8: 55, type9: 38 },
        wing: 6,
        instinct: 'sx', // sexual
        subtype: '7w6-sx'
      },
      {
        dominantType: 1,
        name: 'O Perfeccionista',
        scores: { type1: 92, type2: 48, type3: 62, type4: 35, type5: 58, type6: 71, type7: 42, type8: 65, type9: 55 },
        wing: 9,
        instinct: 'sp', // self-preservation
        subtype: '1w9-sp'
      }
    ]

    for (const [index, resultData] of additionalResults.entries()) {
      const session = await prisma.testSession.create({
        data: {
          testId: enneagramTest.id,
          userId: collaborator.id,
          startedAt: new Date(Date.now() - (60 + index * 30) * 60 * 1000),
          completedAt: new Date(Date.now() - (30 + index * 15) * 60 * 1000),
          currentQuestion: 108,
          totalQuestions: 108,
          metadata: {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            ipAddress: '127.0.0.1'
          }
        }
      })

      const result = await prisma.testResult.create({
        data: {
          testId: enneagramTest.id,
          sessionId: session.id,
          userId: collaborator.id,
          duration: (20 + index * 5) * 60,
          overallScore: 80 + index * 5,
          dimensionScores: {
            ...resultData.scores,
            dominantType: resultData.dominantType,
            wing: resultData.wing,
            instinct: resultData.instinct,
            subtype: resultData.subtype
          },
          interpretation: JSON.stringify({
            dominantType: {
              number: resultData.dominantType,
              name: resultData.name,
              description: `Descrição do tipo ${resultData.dominantType}`
            }
          }),
          recommendations: JSON.stringify([
            'Recomendação personalizada 1',
            'Recomendação personalizada 2'
          ]),
          metadata: {
            testVersion: '2.1',
            calculationMethod: 'weighted_scoring',
            confidence: 0.85 + index * 0.02,
            completionRate: 100,
            status: 'completed'
          },
          completedAt: new Date(Date.now() - (30 + index * 15) * 60 * 1000)
        }
      })

      console.log(`✅ Resultado adicional criado: ${result.id} (Tipo ${resultData.dominantType})`)
    }

    console.log('\n🎉 Resultados de exemplo criados com sucesso!')
    console.log('\n📋 Para testar:')
    console.log('1. Faça login com: colaborador@demo.com / colaborador123')
    console.log('2. Acesse: /colaborador/personalidade/eneagrama/resultado')
    console.log('3. Ou use um ID específico: /colaborador/personalidade/eneagrama/resultado?id=<ID>')

  } catch (error) {
    console.error('❌ Erro ao criar resultados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleResults()