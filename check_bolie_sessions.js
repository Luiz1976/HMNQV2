// Verificar sessões BOLIE em status STARTED
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkBolieSessions() {
  try {
    console.log('🔍 VERIFICANDO SESSÕES BOLIE EM STATUS STARTED')
    console.log('=' .repeat(60))
    
    const bolieTestId = 'cmehdpsox000o8wc0yuai0swa'
    
    // 1. Buscar todas as sessões STARTED para o teste BOLIE
    const startedSessions = await prisma.testSession.findMany({
      where: {
        testId: bolieTestId,
        status: 'STARTED'
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`📊 Total de sessões STARTED: ${startedSessions.length}`)
    
    if (startedSessions.length === 0) {
      console.log('✅ Não há sessões em status STARTED')
      return
    }
    
    // 2. Mostrar detalhes das sessões
    startedSessions.forEach((session, index) => {
      console.log(`\n${index + 1}. Sessão ID: ${session.id}`)
      console.log(`   Usuário: ${session.user.firstName} ${session.user.lastName} (${session.user.email})`)
      console.log(`   Status: ${session.status}`)
      console.log(`   Criada em: ${session.createdAt}`)
      console.log(`   Iniciada em: ${session.startedAt}`)
      console.log(`   Tempo decorrido: ${Math.round((new Date() - new Date(session.startedAt)) / (1000 * 60))} minutos`)
    })
    
    // 3. Verificar se há resultados para essas sessões
    console.log('\n🔍 VERIFICANDO RESULTADOS PARA ESSAS SESSÕES...')
    
    for (const session of startedSessions) {
      const result = await prisma.testResult.findFirst({
        where: {
          sessionId: session.id
        }
      })
      
      if (result) {
        console.log(`\n⚠️  PROBLEMA ENCONTRADO!`)
        console.log(`   Sessão ${session.id} tem status STARTED mas já possui resultado!`)
        console.log(`   Resultado ID: ${result.id}`)
        console.log(`   Pontuação: ${result.overallScore}`)
        console.log(`   Criado em: ${result.createdAt}`)
        
        // Corrigir o status da sessão
        console.log(`\n🔧 CORRIGINDO STATUS DA SESSÃO...`)
        
        const updatedSession = await prisma.testSession.update({
          where: { id: session.id },
          data: {
            status: 'COMPLETED',
            completedAt: result.createdAt
          }
        })
        
        console.log(`✅ Sessão ${session.id} corrigida para status COMPLETED`)
      } else {
        console.log(`\n✅ Sessão ${session.id} não possui resultado (status correto)`)
      }
    }
    
    // 4. Verificar sessões muito antigas (mais de 2 horas) sem resultado
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    const oldSessions = startedSessions.filter(session => 
      new Date(session.startedAt) < twoHoursAgo
    )
    
    if (oldSessions.length > 0) {
      console.log(`\n⚠️  SESSÕES ANTIGAS ENCONTRADAS (mais de 2 horas): ${oldSessions.length}`)
      
      for (const session of oldSessions) {
        const hasResult = await prisma.testResult.findFirst({
          where: { sessionId: session.id }
        })
        
        if (!hasResult) {
          console.log(`\n🗑️  Marcando sessão antiga como ABANDONED: ${session.id}`)
          
          await prisma.testSession.update({
            where: { id: session.id },
            data: {
              status: 'ABANDONED',
              completedAt: new Date()
            }
          })
          
          console.log(`✅ Sessão ${session.id} marcada como ABANDONED`)
        }
      }
    }
    
    console.log('\n🎉 VERIFICAÇÃO CONCLUÍDA!')
    
  } catch (error) {
    console.error('❌ Erro na verificação:', error)
    console.error('Stack trace:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar a verificação
checkBolieSessions()