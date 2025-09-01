const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testApiResultados() {
  try {
    console.log('🔍 Testando API de resultados...')
    
    // Simular a lógica da API /api/colaborador/resultados
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado')
      return
    }
    
    console.log('✅ Usuário encontrado:', user.email)
    
    // Buscar resultados de testes concluídos
    const testResults = await prisma.testResult.findMany({
      where: {
        userId: user.id
      },
      include: {
        test: {
          select: {
            id: true,
            name: true,
            description: true,
            testType: true
          }
        },
        session: {
          select: {
            id: true,
            status: true,
            startedAt: true,
            completedAt: true,
            timeSpent: true
          }
        },
        aiAnalyses: {
          select: {
            id: true,
            analysisType: true,
            analysis: true,
            confidence: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 12
    })
    
    console.log(`\n📊 Resultados encontrados: ${testResults.length}`)
    
    testResults.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.test.name}`)
      console.log(`   ID do Resultado: ${result.id}`)
      console.log(`   Status da Sessão: ${result.session.status}`)
      console.log(`   Concluído em: ${result.completedAt}`)
      console.log(`   Score Geral: ${result.overallScore}`)
      console.log(`   Duração: ${result.duration} segundos`)
      console.log(`   Análises AI: ${result.aiAnalyses.length}`)
    })
    
    // Verificar especificamente o teste BOLIE
    const bolieResult = testResults.find(r => r.test.id === 'cmehdpsox000o8wc0yuai0swa')
    
    if (bolieResult) {
      console.log('\n🎯 TESTE BOLIE ENCONTRADO NOS RESULTADOS!')
      console.log(`   Nome: ${bolieResult.test.name}`)
      console.log(`   Status: ${bolieResult.session.status}`)
      console.log(`   Score: ${bolieResult.overallScore}`)
      console.log(`   Concluído em: ${bolieResult.completedAt}`)
      console.log('\n✅ O teste BOLIE está aparecendo corretamente na API de resultados!')
    } else {
      console.log('\n❌ Teste BOLIE NÃO encontrado nos resultados da API')
    }
    
    // Verificar se há sessões COMPLETED sem resultados
    const sessionsWithoutResults = await prisma.testSession.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED',
        results: {
          none: {}
        }
      },
      include: {
        test: true
      }
    })
    
    if (sessionsWithoutResults.length > 0) {
      console.log(`\n⚠️  Encontradas ${sessionsWithoutResults.length} sessões COMPLETED sem resultados:`)
      sessionsWithoutResults.forEach(session => {
        console.log(`   - ${session.test.name} (${session.id})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste da API:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testApiResultados()