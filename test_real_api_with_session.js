const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function testRealAPIWithSession() {
  try {
    console.log('🔍 Testando API real de resultados...')
    
    // 1. Primeiro, vamos verificar se o servidor está rodando
    const serverUrl = 'http://localhost:3000'
    
    try {
      const response = await fetch(`${serverUrl}/api/colaborador/resultados`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Test-Script/1.0'
        }
      })
      
      console.log(`📡 Status da resposta: ${response.status}`)
      console.log(`📡 Headers da resposta:`, Object.fromEntries(response.headers.entries()))
      
      if (response.status === 401) {
        console.log('🔐 API retornou 401 - Não autorizado (esperado sem autenticação)')
        
        // Vamos tentar obter mais informações sobre a resposta
        const responseText = await response.text()
        console.log('📄 Corpo da resposta:', responseText)
        
      } else if (response.status === 200) {
        const data = await response.json()
        console.log('✅ API respondeu com sucesso!')
        console.log('📊 Dados retornados:')
        console.log(`  - Total de resultados: ${data.data?.results?.length || 0}`)
        console.log(`  - Total na paginação: ${data.data?.pagination?.totalCount || 0}`)
        
        if (data.data?.results) {
          console.log('\n📝 Primeiros resultados:')
          data.data.results.slice(0, 5).forEach((result, index) => {
            console.log(`  ${index + 1}. ID: ${result.id} | Teste: ${result.testName} | Status: ${result.status}`)
          })
        }
        
      } else {
        console.log(`⚠️ API retornou status inesperado: ${response.status}`)
        const responseText = await response.text()
        console.log('📄 Corpo da resposta:', responseText)
      }
      
    } catch (fetchError) {
      console.log('❌ Erro ao fazer requisição para a API:', fetchError.message)
      console.log('💡 Isso pode indicar que o servidor não está rodando ou não está acessível')
    }
    
    // 2. Vamos verificar se há logs no servidor que possam nos ajudar
    console.log('\n🔍 Verificando dados diretamente no banco...')
    
    const user = await db.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado')
      return
    }
    
    // 3. Verificar se há sessões ativas para este usuário
    console.log('\n🔐 Verificando sessões de autenticação...')
    
    // Verificar tabela de sessões (se existir)
    try {
      const sessions = await db.session.findMany({
        where: {
          userId: user.id
        },
        orderBy: {
          expires: 'desc'
        }
      })
      
      console.log(`🔐 Sessões encontradas: ${sessions.length}`)
      
      if (sessions.length > 0) {
        sessions.forEach((session, index) => {
          const isExpired = new Date(session.expires) < new Date()
          console.log(`  ${index + 1}. Token: ${session.sessionToken.substring(0, 20)}... | Expira: ${session.expires} | ${isExpired ? 'EXPIRADA' : 'ATIVA'}`)
        })
      }
      
    } catch (sessionError) {
      console.log('⚠️ Não foi possível verificar sessões:', sessionError.message)
    }
    
    // 4. Verificar contas (accounts) do usuário
    try {
      const accounts = await db.account.findMany({
        where: {
          userId: user.id
        }
      })
      
      console.log(`\n👤 Contas vinculadas: ${accounts.length}`)
      
      if (accounts.length > 0) {
        accounts.forEach((account, index) => {
          console.log(`  ${index + 1}. Provider: ${account.provider} | Type: ${account.type}`)
        })
      }
      
    } catch (accountError) {
      console.log('⚠️ Não foi possível verificar contas:', accountError.message)
    }
    
    // 5. Simular o que a API deveria retornar
    console.log('\n🎯 Simulando resposta esperada da API...')
    
    const testResults = await db.testResult.findMany({
      where: {
        userId: user.id
      },
      include: {
        test: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })
    
    console.log(`📊 A API deveria retornar ${testResults.length} resultados para ${user.email}`)
    
    // 6. Verificar se há algum problema de cache ou estado
    console.log('\n🔄 Verificando possíveis problemas...')
    
    // Verificar se há resultados duplicados no banco
    const duplicateCheck = await db.testResult.groupBy({
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
    
    if (duplicateCheck.length > 0) {
      console.log(`⚠️ Encontradas ${duplicateCheck.length} possíveis duplicatas no banco`)
      duplicateCheck.forEach(dup => {
        console.log(`  - TestId: ${dup.testId} | UserId: ${dup.userId} | Count: ${dup._count.id}`)
      })
    } else {
      console.log('✅ Não há duplicatas no banco de dados')
    }
    
    console.log('\n📋 CONCLUSÃO:')
    console.log(`  - Usuário: ${user.email} (ID: ${user.id})`)
    console.log(`  - Resultados no banco: ${testResults.length}`)
    console.log(`  - API deveria retornar: ${testResults.length} resultados`)
    console.log(`  - Interface mostra: 16 resultados (PROBLEMA IDENTIFICADO)`)
    console.log(`  - Diferença: ${16 - testResults.length} resultados extras`)
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
  } finally {
    await db.$disconnect()
  }
}

// Usar fetch nativo do Node.js (versão 18+)
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch')
}

testRealAPIWithSession()