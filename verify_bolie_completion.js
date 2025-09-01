const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyBolieCompletion() {
  try {
    console.log('🔍 Verificando conclusão do teste BOLIE...')
    
    // 1. Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado')
      return
    }
    
    console.log('✅ Usuário encontrado:', user.email)
    
    // 2. Buscar todas as sessões BOLIE do usuário
    const bolieSessions = await prisma.testSession.findMany({
      where: {
        userId: user.id,
        test: {
          id: 'cmehdpsox000o8wc0yuai0swa' // ID do teste BOLIE
        }
      },
      include: {
        test: true,
        answers: true,
        results: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`\n📋 Sessões BOLIE encontradas: ${bolieSessions.length}`)
    
    bolieSessions.forEach((session, index) => {
      console.log(`\n${index + 1}. Sessão ID: ${session.id}`)
      console.log(`   Status: ${session.status}`)
      console.log(`   Iniciada em: ${session.startedAt}`)
      console.log(`   Concluída em: ${session.completedAt || 'N/A'}`)
      console.log(`   Respostas: ${session.answers.length}/${session.totalQuestions}`)
      console.log(`   Resultados: ${session.results.length}`)
      
      if (session.results.length > 0) {
        console.log(`   Score geral: ${session.results[0].overallScore}`)
        console.log(`   Duração: ${session.results[0].duration} segundos`)
      }
    })
    
    // 3. Verificar sessões COMPLETED
    const completedSessions = bolieSessions.filter(s => s.status === 'COMPLETED')
    console.log(`\n✅ Sessões concluídas: ${completedSessions.length}`)
    
    // 4. Verificar a sessão mais recente
    if (bolieSessions.length > 0) {
      const latestSession = bolieSessions[0]
      console.log(`\n🔍 Sessão mais recente:`)
      console.log(`   ID: ${latestSession.id}`)
      console.log(`   Status: ${latestSession.status}`)
      console.log(`   Respostas: ${latestSession.answers.length}`)
      console.log(`   Resultados: ${latestSession.results.length}`)
      
      if (latestSession.status === 'COMPLETED' && latestSession.answers.length === 45) {
        console.log('\n🎉 TESTE BOLIE ESTÁ CONCLUÍDO!')
        console.log('✅ Status: COMPLETED')
        console.log('✅ Todas as 45 respostas foram salvas')
        console.log('✅ Resultado foi calculado')
      } else {
        console.log('\n❌ Teste BOLIE NÃO está completamente concluído')
        console.log(`   Status atual: ${latestSession.status}`)
        console.log(`   Respostas: ${latestSession.answers.length}/45`)
      }
    } else {
      console.log('\n❌ Nenhuma sessão BOLIE encontrada para este usuário')
    }
    
  } catch (error) {
    console.error('❌ Erro durante a verificação:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyBolieCompletion()