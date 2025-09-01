// Teste do fluxo completo de finalização do teste BOLIE
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testBolieCompletion() {
  try {
    console.log('🔍 TESTE DO FLUXO DE FINALIZAÇÃO DO BOLIE')
    console.log('=' .repeat(60))
    
    // 1. Verificar usuário colaborador@humaniq.com
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@humaniq.com' },
      select: { id: true, firstName: true, lastName: true, email: true, isActive: true }
    })
    
    if (!user) {
      console.log('❌ Usuário colaborador@humaniq.com não encontrado')
      return
    }
    
    console.log('✅ Usuário encontrado:', user)
    
    // 2. Verificar teste BOLIE
    const bolieTestId = 'cmehdpsox000o8wc0yuai0swa'
    const test = await prisma.test.findUnique({
      where: { id: bolieTestId },
      select: { id: true, name: true, isActive: true, testType: true }
    })
    
    if (!test) {
      console.log('❌ Teste BOLIE não encontrado')
      return
    }
    
    console.log('✅ Teste BOLIE encontrado:', test)
    
    // 3. Verificar sessões existentes do usuário para este teste
    const existingSessions = await prisma.testSession.findMany({
      where: {
        userId: user.id,
        testId: bolieTestId
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('\n📊 SESSÕES EXISTENTES:')
    console.log('Total de sessões:', existingSessions.length)
    
    existingSessions.forEach((session, index) => {
      console.log(`\n${index + 1}. Sessão ID: ${session.id}`)
      console.log(`   Status: ${session.status}`)
      console.log(`   Criada em: ${session.createdAt}`)
      console.log(`   Iniciada em: ${session.startedAt}`)
      console.log(`   Completada em: ${session.completedAt || 'Não completada'}`)
    })
    
    // 4. Verificar resultados existentes
    const existingResults = await prisma.testResult.findMany({
      where: {
        userId: user.id,
        testId: bolieTestId
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('\n📈 RESULTADOS EXISTENTES:')
    console.log('Total de resultados:', existingResults.length)
    
    existingResults.forEach((result, index) => {
      console.log(`\n${index + 1}. Resultado ID: ${result.id}`)
      console.log(`   Sessão ID: ${result.sessionId}`)
      console.log(`   Pontuação: ${result.overallScore}`)
      console.log(`   Duração: ${result.duration}s`)
      console.log(`   Criado em: ${result.createdAt}`)
    })
    
    // 5. Simular criação de uma nova sessão
    console.log('\n🆕 SIMULANDO CRIAÇÃO DE NOVA SESSÃO...')
    
    const newSession = await prisma.testSession.create({
      data: {
        testId: bolieTestId,
        userId: user.id,
        startedAt: new Date(),
        totalQuestions: 50
      }
    })
    
    console.log('✅ Nova sessão criada:', {
      id: newSession.id,
      status: newSession.status,
      startedAt: newSession.startedAt
    })
    
    // 6. Simular finalização da sessão
    console.log('\n🏁 SIMULANDO FINALIZAÇÃO DA SESSÃO...')
    
    // Criar resultado do teste
    const testResult = await prisma.testResult.create({
      data: {
        sessionId: newSession.id,
        testId: bolieTestId,
        userId: user.id,
        duration: 1800, // 30 minutos
        overallScore: 4.2,
        dimensionScores: {
          "Autoconsciência": 4.5,
          "Autorregulação": 4.0,
          "Motivação": 4.3,
          "Empatia": 4.1,
          "Habilidades Sociais": 4.0
        },
        metadata: {
          testName: 'HumaniQ BOLIE – Bateria de Orientação e Liderança para Inteligência Emocional',
          totalQuestions: 50,
          completedAt: new Date().toISOString()
        }
      }
    })
    
    console.log('✅ Resultado criado:', {
      id: testResult.id,
      overallScore: testResult.overallScore,
      createdAt: testResult.createdAt
    })
    
    // Atualizar status da sessão
    const updatedSession = await prisma.testSession.update({
      where: { id: newSession.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    })
    
    console.log('✅ Sessão atualizada:', {
      id: updatedSession.id,
      status: updatedSession.status,
      completedAt: updatedSession.completedAt
    })
    
    console.log('\n🎉 TESTE DE FINALIZAÇÃO CONCLUÍDO COM SUCESSO!')
    console.log('\n📊 RESUMO:')
    console.log(`- Sessão criada: ${newSession.id}`)
    console.log(`- Resultado criado: ${testResult.id}`)
    console.log(`- Status final: ${updatedSession.status}`)
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
    console.error('Stack trace:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar o teste
testBolieCompletion()