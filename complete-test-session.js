const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function completeTestSession() {
  try {
    console.log('🎯 Completando sessão de teste...')
    
    // Buscar a sessão mais recente do usuário colaborador@humaniq.com
    const session = await prisma.testSession.findFirst({
      where: {
        user: {
          email: 'colaborador@humaniq.com'
        },
        testId: 'humaniq_eneagrama',
        status: 'STARTED'
      },
      orderBy: {
        startedAt: 'desc'
      },
      include: {
        test: {
          include: {
            questions: {
              orderBy: {
                questionNumber: 'asc'
              }
            }
          }
        },
        user: true
      }
    })
    
    if (!session) {
      console.log('❌ Nenhuma sessão ativa encontrada!')
      return
    }
    
    console.log(`✅ Sessão encontrada: ${session.id}`)
    console.log(`📝 Teste: ${session.test.name}`)
    console.log(`📊 Total questões: ${session.test.questions.length}`)
    
    // Simular respostas para todas as questões
    console.log('📝 Criando respostas simuladas...')
    
    const responses = []
    
    for (const question of session.test.questions) {
      // Gerar resposta aleatória entre 1 e 5 (escala Likert)
      const answer = Math.floor(Math.random() * 5) + 1
      const timeSpent = Math.floor(Math.random() * 30) + 10 // Entre 10 e 40 segundos
      
      responses.push({
        sessionId: session.id,
        questionId: question.id,
        userId: session.userId,
        answerValue: answer,
        timeSpent: timeSpent
      })
    }
    
    // Salvar todas as respostas
    await prisma.answer.createMany({
      data: responses
    })
    
    console.log(`✅ ${responses.length} respostas criadas!`)
    
    // Calcular resultados do Eneagrama
    console.log('🧮 Calculando resultados do Eneagrama...')
    
    // Contar respostas por tipo de eneagrama
    const typeScores = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0
    }
    
    // Simular pontuação baseada nas respostas
    for (let i = 0; i < responses.length; i++) {
      const enneagramType = (i % 9) + 1 // Distribuir entre os 9 tipos
      const score = parseInt(responses[i].answer)
      typeScores[enneagramType] += score
    }
    
    // Encontrar o tipo dominante
    const dominantType = Object.entries(typeScores)
      .reduce((a, b) => typeScores[a[0]] > typeScores[b[0]] ? a : b)[0]
    
    console.log('📊 Pontuações por tipo:')
    Object.entries(typeScores).forEach(([type, score]) => {
      console.log(`   Tipo ${type}: ${score} pontos ${type === dominantType ? '👑' : ''}`)
    })
    
    // Criar resultado do teste
    const testResult = await prisma.testResult.create({
      data: {
        sessionId: session.id,
        userId: session.userId,
        testId: session.testId,
        companyId: session.companyId,
        results: {
          dominantType: parseInt(dominantType),
          typeScores: typeScores,
          totalScore: Object.values(typeScores).reduce((a, b) => a + b, 0),
          completionTime: responses.reduce((total, r) => total + r.timeSpent, 0)
        },
        completedAt: new Date()
      }
    })
    
    // Atualizar sessão para COMPLETED
    await prisma.testSession.update({
      where: { id: session.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        timeSpent: responses.reduce((total, r) => total + r.timeSpent, 0)
      }
    })
    
    console.log('🎉 Teste completado com sucesso!')
    console.log(`📋 ID do resultado: ${testResult.id}`)
    console.log(`👑 Tipo dominante: ${dominantType}`)
    console.log(`⏱️ Tempo total: ${testResult.results.completionTime} segundos`)
    console.log(`📅 Completado em: ${testResult.completedAt}`)
    
    return testResult
    
  } catch (error) {
    console.error('❌ Erro ao completar teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

completeTestSession()