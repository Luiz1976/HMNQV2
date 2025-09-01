const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function investigateBolieCompletion() {
  try {
    console.log('🔍 INVESTIGAÇÃO DETALHADA DO TESTE BOLIE')
    console.log('=' .repeat(60))
    
    const userEmail = 'colaborador@demo.com'
    console.log(`👤 Usuário: ${userEmail}`)
    
    // 1. Verificar usuário
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado!')
      return
    }
    
    console.log(`✅ Usuário encontrado: ID ${user.id}`)
    
    // 2. Buscar teste BOLIE
    const bolieTest = await prisma.test.findFirst({
      where: {
        OR: [
          { name: { contains: 'BOLIE' } },
          { name: { contains: 'HumaniQ BOLIE' } },
          { description: { contains: 'BOLIE' } }
        ]
      }
    })
    
    if (!bolieTest) {
      console.log('❌ Teste BOLIE não encontrado!')
      return
    }
    
    console.log(`✅ Teste BOLIE encontrado: ${bolieTest.name} (ID: ${bolieTest.id})`)
    
    // 3. Verificar TODAS as sessões do usuário para este teste
    console.log('\n📋 VERIFICANDO SESSÕES...')
    const allSessions = await prisma.testSession.findMany({
      where: {
        userId: user.id,
        testId: bolieTest.id
      },
      orderBy: { createdAt: 'desc' },
      include: {
        answers: true
      }
    })
    
    console.log(`📊 Total de sessões encontradas: ${allSessions.length}`)
    
    for (let i = 0; i < allSessions.length; i++) {
      const session = allSessions[i]
      console.log(`\n🔸 Sessão ${i + 1}:`)
      console.log(`   ID: ${session.id}`)
      console.log(`   Status: ${session.status}`)
      console.log(`   Criada em: ${session.createdAt}`)
      console.log(`   Atualizada em: ${session.updatedAt}`)
      console.log(`   Finalizada em: ${session.completedAt || 'Não finalizada'}`)
      console.log(`   Questão atual: ${session.currentQuestion}/${session.totalQuestions}`)
      console.log(`   Tempo gasto: ${session.timeSpent}s`)
      console.log(`   Respostas: ${session.answers.length}`)
      
      if (session.answers.length > 0) {
        console.log(`   Primeira resposta: ${session.answers[0].createdAt}`)
        console.log(`   Última resposta: ${session.answers[session.answers.length - 1].createdAt}`)
      }
    }
    
    // 4. Verificar resultados de teste
    console.log('\n📈 VERIFICANDO RESULTADOS...')
    const testResults = await prisma.testResult.findMany({
      where: {
        userId: user.id,
        testId: bolieTest.id
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`📊 Total de resultados encontrados: ${testResults.length}`)
    
    for (let i = 0; i < testResults.length; i++) {
      const result = testResults[i]
      console.log(`\n🔸 Resultado ${i + 1}:`)
      console.log(`   ID: ${result.id}`)
      console.log(`   Status: ${result.status}`)
      console.log(`   Score: ${result.score}`)
      console.log(`   Criado em: ${result.createdAt}`)
      console.log(`   Sessão ID: ${result.sessionId}`)
    }
    
    // 5. Verificar arquivos arquivados
    console.log('\n📁 VERIFICANDO ARQUIVOS ARQUIVADOS...')
    const archivesPath = path.join(process.cwd(), 'archives', 'results')
    
    function searchBolieFiles(dir, results = []) {
      if (!fs.existsSync(dir)) return results
      
      const items = fs.readdirSync(dir)
      
      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
          searchBolieFiles(fullPath, results)
        } else if (item.endsWith('.json')) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8')
            const data = JSON.parse(content)
            
            if (data.userId === user.id && 
                (data.testName?.includes('BOLIE') || data.testType?.includes('BOLIE'))) {
              results.push({
                file: fullPath,
                data: data
              })
            }
          } catch (error) {
            // Ignorar arquivos com erro de parsing
          }
        }
      }
      
      return results
    }
    
    const archivedFiles = searchBolieFiles(archivesPath)
    console.log(`📊 Arquivos arquivados encontrados: ${archivedFiles.length}`)
    
    for (let i = 0; i < archivedFiles.length; i++) {
      const file = archivedFiles[i]
      console.log(`\n🔸 Arquivo ${i + 1}:`)
      console.log(`   Caminho: ${file.file}`)
      console.log(`   Teste: ${file.data.testName}`)
      console.log(`   Concluído em: ${file.data.completedAt}`)
      console.log(`   Score: ${file.data.overallScore}`)
    }
    
    // 6. Resumo da investigação
    console.log('\n🎯 RESUMO DA INVESTIGAÇÃO:')
    console.log(`   Sessões criadas: ${allSessions.length}`)
    console.log(`   Sessões completas: ${allSessions.filter(s => s.status === 'completed').length}`)
    console.log(`   Resultados salvos: ${testResults.length}`)
    console.log(`   Arquivos arquivados: ${archivedFiles.length}`)
    
    // Identificar o problema
    const completedSessions = allSessions.filter(s => s.status === 'COMPLETED')
    const sessionsWithResponses = allSessions.filter(s => s.answers.length > 0)
    
    console.log('\n🔍 DIAGNÓSTICO:')
    
    if (allSessions.length === 0) {
      console.log('❌ PROBLEMA: Nenhuma sessão foi criada para o teste BOLIE')
    } else if (sessionsWithResponses.length === 0) {
      console.log('❌ PROBLEMA: Sessões foram criadas mas nenhuma resposta foi registrada')
    } else if (completedSessions.length === 0) {
      console.log('❌ PROBLEMA: Respostas foram registradas mas nenhuma sessão foi marcada como completa')
    } else if (testResults.length === 0) {
      console.log('❌ PROBLEMA: Sessões foram completadas mas nenhum resultado foi salvo')
    } else if (archivedFiles.length === 0) {
      console.log('❌ PROBLEMA: Resultados foram salvos mas não foram arquivados')
    } else {
      console.log('✅ SUCESSO: Teste foi completado e arquivado corretamente')
    }
    
  } catch (error) {
    console.error('❌ Erro na investigação:', error)
  } finally {
    await prisma.$disconnect()
  }
}

investigateBolieCompletion()