const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testBolieWithRealIds() {
  try {
    console.log('🔍 Testando BOLIE com IDs reais das questões...')
    
    // 1. Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado')
      return
    }
    
    console.log('✅ Usuário encontrado:', user.email)
    
    // 2. Buscar o teste BOLIE
    const test = await prisma.test.findFirst({
      where: { id: 'cmehdpsox000o8wc0yuai0swa' }
    })
    
    if (!test) {
      console.log('❌ Teste BOLIE não encontrado')
      return
    }
    
    console.log('✅ Teste encontrado:', test.name)
    
    // 3. Buscar as questões do teste BOLIE
    const questions = await prisma.question.findMany({
      where: { testId: test.id },
      orderBy: { createdAt: 'asc' }
    })
    
    console.log(`✅ ${questions.length} questões encontradas`)
    
    // 4. Criar uma nova sessão de teste
    const session = await prisma.testSession.create({
      data: {
        testId: test.id,
        userId: user.id,
        companyId: user.companyId,
        startedAt: new Date(),
        totalQuestions: questions.length
      }
    })
    
    console.log('✅ Sessão criada:', session.id)
    
    // 5. Simular respostas com IDs reais
    const answers = questions.map((question, index) => ({
      sessionId: session.id,
      questionId: question.id,
      userId: user.id,
      answerValue: Math.floor(Math.random() * 5) + 1, // Resposta aleatória de 1-5
      timeSpent: Math.floor(Math.random() * 30) + 10 // Tempo aleatório entre 10-40 segundos
    }))
    
    console.log('📝 Salvando', answers.length, 'respostas...')
    
    // 6. Salvar as respostas
    await prisma.answer.createMany({
      data: answers
    })
    
    console.log('✅ Respostas salvas com sucesso!')
    
    // 7. Simular cálculo de resultados
    const testResults = {
      overall: Math.random() * 5,
      testScores: {
        'Autoconhecimento': Math.random() * 5,
        'Autorregulação': Math.random() * 5,
        'Motivação': Math.random() * 5,
        'Empatia': Math.random() * 5,
        'Habilidades Sociais': Math.random() * 5
      },
      dimensionScores: {
        'Consciência Emocional': Math.random() * 5,
        'Autoavaliação Precisa': Math.random() * 5,
        'Autoconfiança': Math.random() * 5
      }
    }
    
    // 8. Criar resultado do teste
    const testResult = await prisma.testResult.create({
      data: {
        sessionId: session.id,
        userId: user.id,
        testId: test.id,
        overallScore: testResults.overall,
        dimensionScores: testResults.dimensionScores,
        completedAt: new Date(),
        duration: 30 * 60 // 30 minutos em segundos
      }
    })
    
    console.log('✅ Resultado criado:', testResult.id)
    
    // 9. Atualizar status da sessão
    await prisma.testSession.update({
      where: { id: session.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    })
    
    console.log('✅ Sessão marcada como COMPLETED')
    
    // 10. Verificar se tudo foi salvo corretamente
    const finalSession = await prisma.testSession.findUnique({
      where: { id: session.id },
      include: {
        answers: true,
        results: true
      }
    })
    
    console.log('\n📊 RESULTADO FINAL:')
    console.log('- Status da sessão:', finalSession.status)
    console.log('- Número de respostas:', finalSession.answers.length)
    console.log('- Número de resultados:', finalSession.results.length)
    console.log('- Score geral:', finalSession.results[0]?.overallScore)
    
    if (finalSession.status === 'COMPLETED' && finalSession.answers.length === questions.length) {
      console.log('\n🎉 TESTE BOLIE SIMULADO COM SUCESSO!')
      console.log('✅ Todas as respostas foram salvas')
      console.log('✅ Resultado foi calculado e salvo')
      console.log('✅ Sessão foi marcada como concluída')
    } else {
      console.log('\n❌ Algo deu errado na simulação')
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testBolieWithRealIds()