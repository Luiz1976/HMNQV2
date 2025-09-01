// Teste das APIs usadas pelo teste BOLIE
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testBolieAPIs() {
  try {
    console.log('🔍 TESTANDO FLUXO COMPLETO DO TESTE BOLIE')
    console.log('=' .repeat(60))
    
    const bolieTestId = 'cmehdpsox000o8wc0yuai0swa'
    
    // 1. Buscar usuário
    console.log('\n1️⃣ BUSCANDO USUÁRIO...')
    
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@humaniq.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado')
      return
    }
    
    console.log('✅ Usuário encontrado:', user.name)
    
    // 2. Criar nova sessão
    console.log('\n2️⃣ CRIANDO NOVA SESSÃO...')
    
    const testSession = await prisma.testSession.create({
      data: {
        testId: bolieTestId,
        userId: user.id,
        startedAt: new Date(),
        totalQuestions: 50
      }
    })
    
    console.log('✅ Sessão criada:', testSession.id)
    console.log('   Status inicial:', testSession.status)
    
    // 3. Simular finalização do teste
    console.log('\n3️⃣ SIMULANDO FINALIZAÇÃO DO TESTE...')
    
    const submissionData = {
      testId: bolieTestId,
      sessionId: testSession.id,
      answers: [
        {
          questionId: '1',
          selectedOption: '4',
          dimension: 'Autoconsciência',
          test: 'Teste A'
        },
        {
          questionId: '2',
          selectedOption: '3',
          dimension: 'Autorregulação',
          test: 'Teste B'
        }
      ],
      results: {
        overallScore: 4.2,
        classification: 'Alto',
        dimensionScores: {
          "Autoconsciência": 4.5,
          "Autorregulação": 4.0,
          "Motivação": 4.3,
          "Empatia": 4.1,
          "Habilidades Sociais": 4.0
        },
        testScores: {
          "Teste A": 4.3,
          "Teste B": 4.1
        }
      },
      duration: 1800,
      metadata: {
        testName: 'HumaniQ BOLIE – Bateria de Orientação e Liderança para Inteligência Emocional',
        totalQuestions: 50,
        completedAt: new Date().toISOString()
      }
    }
    
    // Simular o que a API /api/tests/submit faria
    const testResult = await prisma.testResult.create({
      data: {
        sessionId: testSession.id,
        testId: bolieTestId,
        userId: user.id,
        duration: submissionData.duration,
        overallScore: submissionData.results.overallScore,
        dimensionScores: submissionData.results.dimensionScores,
        metadata: submissionData.metadata
      }
    })
    
    console.log('✅ Resultado criado:', testResult.id)
    
    // Atualizar status da sessão
    const updatedSession = await prisma.testSession.update({
      where: { id: testSession.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    })
    
    console.log('✅ Sessão atualizada para:', updatedSession.status)
    
    console.log('\n🎉 SIMULAÇÃO COMPLETA!')
    console.log('📊 RESUMO:')
    console.log(`- Sessão: ${testSession.id} (${updatedSession.status})`)
    console.log(`- Resultado: ${testResult.id} (${testResult.overallScore})`)
    
    // 4. Verificar estado final
    console.log('\n4️⃣ VERIFICANDO ESTADO FINAL...')
    
    const finalSessions = await prisma.testSession.findMany({
      where: {
        testId: bolieTestId,
        status: 'COMPLETED'
      },
      include: {
        results: true
      },
      orderBy: { createdAt: 'desc' },
      take: 3
    })
    
    console.log(`\n📊 Sessões COMPLETED encontradas: ${finalSessions.length}`)
    
    finalSessions.forEach((session, index) => {
      console.log(`\n${index + 1}. Sessão: ${session.id}`)
      console.log(`   Status: ${session.status}`)
      console.log(`   Completada em: ${session.completedAt}`)
      console.log(`   Resultados: ${session.results.length}`)
      
      if (session.results.length > 0) {
        const result = session.results[0]
        console.log(`   Pontuação: ${result.overallScore}`)
        console.log(`   Resultado ID: ${result.id}`)
      }
    })
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
    console.error('Stack trace:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar o teste
testBolieAPIs()