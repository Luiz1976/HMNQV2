// Script para analisar mecanismos de isolamento de dados entre usuários
// Verifica se há vazamentos de dados ou problemas de associação de usuários

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function analyzeUserIsolation() {
  try {
    console.log('🔍 ANÁLISE DE ISOLAMENTO DE DADOS ENTRE USUÁRIOS')
    console.log('=' .repeat(60))
    
    // 1. Verificar todos os usuários do sistema
    console.log('\n1. 👥 USUÁRIOS DO SISTEMA:')
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        _count: {
          select: {
            testResults: true,
            testSessions: true,
            answers: true
          }
        }
      }
    })
    
    console.log(`Total de usuários: ${allUsers.length}`)
    allUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.firstName} ${user.lastName}):`)
      console.log(`    ID: ${user.id}`)
      console.log(`    Resultados: ${user._count.testResults}`)
      console.log(`    Sessões: ${user._count.testSessions}`)
      console.log(`    Respostas: ${user._count.answers}`)
    })
    
    // 2. Verificar todas as sessões de teste e sua associação com usuários
    console.log('\n2. 🔍 VERIFICAÇÃO DE SESSÕES DE TESTE:')
    const allSessions = await prisma.testSession.findMany({
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })
    
    console.log(`Total de sessões: ${allSessions.length}`)
    
    const sessionsWithoutUser = allSessions.filter(s => !s.user)
    console.log(`Sessões sem usuário válido: ${sessionsWithoutUser.length}`)
    
    // 3. Verificar todos os resultados de teste e sua associação com usuários
    console.log('\n3. 🔍 VERIFICAÇÃO DE RESULTADOS DE TESTE:')
    const allResults = await prisma.testResult.findMany({
      include: {
        user: {
          select: {
            email: true
          }
        },
        test: {
          select: {
            name: true,
            testType: true
          }
        }
      }
    })
    
    console.log(`Total de resultados: ${allResults.length}`)
    
    const resultsWithoutUser = allResults.filter(r => !r.user)
    console.log(`Resultados sem usuário válido: ${resultsWithoutUser.length}`)
    
    // 4. Verificar todas as respostas e sua associação com usuários
    console.log('\n4. 🔍 VERIFICAÇÃO DE RESPOSTAS:')
    const allAnswers = await prisma.answer.findMany({
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })
    
    console.log(`Total de respostas: ${allAnswers.length}`)
    
    const answersWithoutUser = allAnswers.filter(a => !a.user)
    console.log(`Respostas sem usuário válido: ${answersWithoutUser.length}`)
    
    // 5. Verificar consistência entre sessões, resultados e respostas
    console.log('\n5. 🔍 VERIFICAÇÃO DE CONSISTÊNCIA:')
    
    for (const user of allUsers) {
      console.log(`\n  Usuário: ${user.email}`)
      
      // Verificar se todas as sessões do usuário têm o userId correto
      const userSessions = await prisma.testSession.findMany({
        where: { userId: user.id },
        include: {
          results: true,
          answers: true
        }
      })
      
      console.log(`    Sessões: ${userSessions.length}`)
      
      let inconsistentSessions = 0
      let inconsistentResults = 0
      let inconsistentAnswers = 0
      
      for (const session of userSessions) {
        // Verificar se os resultados da sessão pertencem ao mesmo usuário
        const sessionResults = session.results.filter(r => r.userId !== user.id)
        if (sessionResults.length > 0) {
          inconsistentResults += sessionResults.length
          console.log(`    ⚠️  Sessão ${session.id} tem ${sessionResults.length} resultados com userId diferente`)
        }
        
        // Verificar se as respostas da sessão pertencem ao mesmo usuário
        const sessionAnswers = session.answers.filter(a => a.userId !== user.id)
        if (sessionAnswers.length > 0) {
          inconsistentAnswers += sessionAnswers.length
          console.log(`    ⚠️  Sessão ${session.id} tem ${sessionAnswers.length} respostas com userId diferente`)
        }
      }
      
      console.log(`    Resultados inconsistentes: ${inconsistentResults}`)
      console.log(`    Respostas inconsistentes: ${inconsistentAnswers}`)
    }
    
    // 6. Verificar se há vazamento de dados entre colaborador@demo.com e outros usuários
    console.log('\n6. 🔍 VERIFICAÇÃO ESPECÍFICA - COLABORADOR@DEMO.COM:')
    
    const demoUser = allUsers.find(u => u.email === 'colaborador@demo.com')
    if (demoUser) {
      console.log(`  ID do colaborador@demo.com: ${demoUser.id}`)
      
      // Usar os resultados já carregados anteriormente
      
      console.log(`  Total de resultados no sistema: ${allResults.length}`)
      
      const demoUserResults = allResults.filter(r => r.userId === demoUser.id)
      const otherUsersResults = allResults.filter(r => r.userId !== demoUser.id)
      
      console.log(`  Resultados do colaborador@demo.com: ${demoUserResults.length}`)
      console.log(`  Resultados de outros usuários: ${otherUsersResults.length}`)
      
      // Listar resultados de outros usuários para verificar se há vazamento
      if (otherUsersResults.length > 0) {
        console.log('\n  📋 RESULTADOS DE OUTROS USUÁRIOS:')
        otherUsersResults.forEach(result => {
          console.log(`    - ${result.test.name} (${result.test.testType})`)
          console.log(`      Usuário: ${result.user.email}`)
          console.log(`      ID do resultado: ${result.id}`)
          console.log(`      Data: ${result.completedAt}`)
        })
      }
    }
    
    // 7. Resumo da análise
    console.log('\n7. 📊 RESUMO DA ANÁLISE:')
    console.log(`  Total de usuários: ${allUsers.length}`)
    console.log(`  Sessões sem usuário válido: ${sessionsWithoutUser.length}`)
    console.log(`  Resultados sem usuário válido: ${resultsWithoutUser.length}`)
    console.log(`  Respostas sem usuário válido: ${answersWithoutUser.length}`)
    
    const hasIssues = sessionsWithoutUser.length > 0 || resultsWithoutUser.length > 0 || 
                     answersWithoutUser.length > 0
    
    if (hasIssues) {
      console.log('\n  ⚠️  PROBLEMAS DETECTADOS - Há questões de isolamento de dados!')
    } else {
      console.log('\n  ✅ ISOLAMENTO OK - Não foram detectados problemas de isolamento de dados.')
    }
    
  } catch (error) {
    console.error('❌ Erro na análise:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar análise
analyzeUserIsolation()
  .then(() => {
    console.log('\n🏁 Análise concluída!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })