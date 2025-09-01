const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function investigateDuplicates() {
  try {
    console.log('🔍 Investigando duplicatas no banco de dados...')
    
    const user = await db.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado')
      return
    }
    
    console.log(`👤 Analisando usuário: ${user.email} (ID: ${user.id})`)
    
    // 1. Buscar todas as duplicatas
    console.log('\n🔍 Buscando duplicatas por testId e userId...')
    
    const duplicates = await db.testResult.groupBy({
      by: ['testId', 'userId'],
      where: {
        userId: user.id
      },
      _count: {
        id: true
      },
      having: {
        id: {
          _count: {
            gt: 1
          }
        }
      }
    })
    
    console.log(`📊 Grupos de duplicatas encontrados: ${duplicates.length}`)
    
    for (const duplicate of duplicates) {
      console.log(`\n🔍 Analisando grupo: TestId ${duplicate.testId} - ${duplicate._count.id} resultados`)
      
      // Buscar todos os resultados deste grupo
      const results = await db.testResult.findMany({
        where: {
          testId: duplicate.testId,
          userId: duplicate.userId
        },
        include: {
          test: {
            select: {
              name: true,
              testType: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      })
      
      console.log(`  📝 Teste: ${results[0].test.name}`)
      console.log(`  📝 Tipo: ${results[0].test.testType}`)
      console.log(`  📝 Resultados duplicados:`)
      
      results.forEach((result, index) => {
        console.log(`    ${index + 1}. ID: ${result.id}`)
        console.log(`       - Criado: ${result.createdAt}`)
        console.log(`       - Completado: ${result.completedAt}`)
        console.log(`       - Score: ${result.overallScore}`)
        console.log(`       - Duração: ${result.duration}s`)
        console.log(`       - SessionId: ${result.sessionId}`)
      })
      
      // Verificar se as sessões são diferentes
      const sessionIds = results.map(r => r.sessionId).filter(Boolean)
      const uniqueSessions = [...new Set(sessionIds)]
      
      console.log(`  🔗 Sessões únicas: ${uniqueSessions.length} de ${sessionIds.length}`)
      
      if (uniqueSessions.length < sessionIds.length) {
        console.log(`  ⚠️ PROBLEMA: Múltiplos resultados para a mesma sessão!`)
      }
      
      // Verificar diferenças nos dados
      const scores = results.map(r => r.overallScore).filter(s => s !== null)
      const durations = results.map(r => r.duration).filter(d => d !== null)
      
      const uniqueScores = [...new Set(scores)]
      const uniqueDurations = [...new Set(durations)]
      
      console.log(`  📊 Scores únicos: ${uniqueScores.join(', ')}`)
      console.log(`  ⏱️ Durações únicas: ${uniqueDurations.join(', ')}s`)
      
      if (uniqueScores.length > 1 || uniqueDurations.length > 1) {
        console.log(`  ⚠️ ATENÇÃO: Dados diferentes entre duplicatas!`)
      }
    }
    
    // 2. Verificar se há sessões duplicadas
    console.log('\n🔍 Verificando sessões de teste...')
    
    const testSessions = await db.testSession.findMany({
      where: {
        userId: user.id
      },
      include: {
        test: {
          select: {
            name: true
          }
        },
        results: {
          select: {
            id: true,
            overallScore: true,
            completedAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`📊 Total de sessões: ${testSessions.length}`)
    
    // Agrupar sessões por teste
    const sessionsByTest = {}
    testSessions.forEach(session => {
      const testId = session.testId
      if (!sessionsByTest[testId]) {
        sessionsByTest[testId] = []
      }
      sessionsByTest[testId].push(session)
    })
    
    console.log('\n📋 Sessões por teste:')
    Object.entries(sessionsByTest).forEach(([testId, sessions]) => {
      const testName = sessions[0].test.name
      console.log(`  📝 ${testName} (${testId}): ${sessions.length} sessões`)
      
      sessions.forEach((session, index) => {
        const resultCount = session.results.length
        console.log(`    ${index + 1}. Sessão ${session.id} - ${resultCount} resultado(s) - Status: ${session.status}`)
        
        if (resultCount > 1) {
          console.log(`      ⚠️ PROBLEMA: Sessão com múltiplos resultados!`)
        }
      })
    })
    
    // 3. Contar total real vs esperado
    console.log('\n📊 ANÁLISE FINAL:')
    
    const totalResults = await db.testResult.count({
      where: { userId: user.id }
    })
    
    const uniqueTests = await db.testResult.groupBy({
      by: ['testId'],
      where: { userId: user.id },
      _count: { id: true }
    })
    
    const totalDuplicates = duplicates.reduce((sum, dup) => sum + (dup._count.id - 1), 0)
    
    console.log(`  📊 Total de resultados no banco: ${totalResults}`)
    console.log(`  📊 Testes únicos: ${uniqueTests.length}`)
    console.log(`  📊 Resultados duplicados: ${totalDuplicates}`)
    console.log(`  📊 Resultados únicos esperados: ${totalResults - totalDuplicates}`)
    console.log(`  📊 Interface mostra: 16 resultados`)
    
    if (totalResults === 16) {
      console.log('  ✅ O banco tem exatamente 16 resultados - problema está nas duplicatas!')
    } else {
      console.log(`  ⚠️ Diferença: banco tem ${totalResults}, interface mostra 16`)
    }
    
    // 4. Sugestão de correção
    console.log('\n💡 SUGESTÕES DE CORREÇÃO:')
    
    if (totalDuplicates > 0) {
      console.log('  1. Remover resultados duplicados do banco de dados')
      console.log('  2. Implementar constraint UNIQUE(testId, userId) para prevenir futuras duplicatas')
      console.log('  3. Verificar lógica de criação de resultados na API')
    }
    
    if (totalResults === 16 && totalDuplicates === 8) {
      console.log('  4. A interface está mostrando TODOS os resultados (incluindo duplicatas)')
      console.log('  5. A API deveria filtrar duplicatas ou usar DISTINCT na query')
    }
    
  } catch (error) {
    console.error('❌ Erro durante a investigação:', error)
  } finally {
    await db.$disconnect()
  }
}

investigateDuplicates()