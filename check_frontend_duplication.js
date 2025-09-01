const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function checkFrontendDuplication() {
  try {
    console.log('🔍 Investigando possível duplicação no frontend...')
    
    // 1. Verificar o que realmente está sendo retornado pela API
    console.log('\n📡 Simulando resposta da API...')
    
    const user = await db.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado')
      return
    }
    
    const userId = user.id
    console.log(`👤 Usuário: ${user.email} (ID: ${userId})`)
    
    // Simular exatamente o que a API faz
    const where = { userId: userId }
    
    const testResults = await db.testResult.findMany({
      where,
      include: {
        test: {
          include: {
            category: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })
    
    console.log(`\n📊 Resultados do banco: ${testResults.length}`)
    
    // 2. Simular formatação dos resultados (como na API)
    const formattedDbResults = testResults.map(result => ({
      id: result.id,
      testName: result.test.name,
      userId: result.userId,
      status: result.completedAt ? 'Concluído' : 'Em Processamento',
      test: {
        id: result.test.id,
        name: result.test.name,
        description: result.test.description,
        testType: result.test.testType,
        category: result.test.category
      },
      completedAt: result.completedAt,
      duration: result.duration,
      overallScore: result.overallScore,
      isArchived: false
    }))
    
    console.log(`📊 Resultados formatados: ${formattedDbResults.length}`)
    
    // 3. Verificar se há IDs duplicados
    const ids = formattedDbResults.map(r => r.id)
    const uniqueIds = [...new Set(ids)]
    
    console.log(`\n🔍 Verificando IDs únicos:`)
    console.log(`  - Total de IDs: ${ids.length}`)
    console.log(`  - IDs únicos: ${uniqueIds.length}`)
    
    if (ids.length !== uniqueIds.length) {
      console.log('⚠️ PROBLEMA: IDs duplicados encontrados!')
      
      // Encontrar quais IDs estão duplicados
      const duplicatedIds = ids.filter((id, index) => ids.indexOf(id) !== index)
      console.log('🔍 IDs duplicados:', [...new Set(duplicatedIds)])
    } else {
      console.log('✅ Todos os IDs são únicos')
    }
    
    // 4. Simular separação por status (como no frontend)
    const completedResults = formattedDbResults.filter(r => r.status === 'Concluído')
    const processingResults = formattedDbResults.filter(r => r.status === 'Em Processamento')
    
    console.log(`\n📋 Separação por status:`)
    console.log(`  - Concluídos: ${completedResults.length}`)
    console.log(`  - Em Processamento: ${processingResults.length}`)
    console.log(`  - Total: ${completedResults.length + processingResults.length}`)
    
    // 5. Verificar se há resultados sendo contados duas vezes
    console.log('\n🔍 Detalhes dos resultados:')
    
    console.log('\n📝 Resultados Concluídos:')
    completedResults.forEach((result, index) => {
      console.log(`  ${index + 1}. ID: ${result.id} | Teste: ${result.testName} | Score: ${result.overallScore} | Data: ${result.completedAt}`)
    })
    
    console.log('\n📝 Resultados Em Processamento:')
    processingResults.forEach((result, index) => {
      console.log(`  ${index + 1}. ID: ${result.id} | Teste: ${result.testName} | Score: ${result.overallScore} | Data: ${result.completedAt}`)
    })
    
    // 6. Verificar se há algum padrão nas duplicatas
    console.log('\n🔍 Análise de padrões:')
    
    const testNames = formattedDbResults.map(r => r.testName)
    const uniqueTestNames = [...new Set(testNames)]
    
    console.log(`  - Nomes de testes únicos: ${uniqueTestNames.length}`)
    console.log(`  - Total de resultados: ${testNames.length}`)
    
    uniqueTestNames.forEach(testName => {
      const count = testNames.filter(name => name === testName).length
      if (count > 1) {
        console.log(`    ⚠️ "${testName}": ${count} resultados`)
      } else {
        console.log(`    ✅ "${testName}": ${count} resultado`)
      }
    })
    
    // 7. Simular o que aconteceria se houvesse duplicação no frontend
    console.log('\n🎭 Simulando possíveis cenários de duplicação no frontend:')
    
    // Cenário 1: Renderização dupla
    const doubleRendered = [...formattedDbResults, ...formattedDbResults]
    console.log(`  Cenário 1 - Renderização dupla: ${doubleRendered.length} resultados`)
    
    // Cenário 2: Problema de estado/re-render
    const withDuplicateState = formattedDbResults.concat(formattedDbResults)
    console.log(`  Cenário 2 - Estado duplicado: ${withDuplicateState.length} resultados`)
    
    // 8. Verificar se 16 = 8 * 2
    if (formattedDbResults.length * 2 === 16) {
      console.log('\n🎯 DESCOBERTA IMPORTANTE:')
      console.log('  ✅ 16 resultados = 8 resultados × 2')
      console.log('  🔍 Isso sugere que o frontend está renderizando cada resultado DUAS VEZES!')
      console.log('  💡 Possíveis causas:')
      console.log('    - useEffect executando duas vezes')
      console.log('    - Componente sendo montado duas vezes')
      console.log('    - Estado sendo duplicado')
      console.log('    - Problema de React.StrictMode')
      console.log('    - Array sendo concatenado incorretamente')
    }
    
    // 9. Conclusão
    console.log('\n📋 CONCLUSÃO DA INVESTIGAÇÃO:')
    console.log(`  📊 Banco de dados: ${testResults.length} resultados (com ${testResults.length - 2} duplicatas)`)
    console.log(`  📊 API deveria retornar: ${formattedDbResults.length} resultados`)
    console.log(`  📊 Interface mostra: 16 resultados`)
    console.log(`  📊 Proporção: ${16 / formattedDbResults.length}x`)
    
    if (16 === formattedDbResults.length * 2) {
      console.log('  🎯 PROBLEMA IDENTIFICADO: Frontend está duplicando a renderização!')
    } else {
      console.log('  ⚠️ Problema mais complexo - não é uma simples duplicação')
    }
    
  } catch (error) {
    console.error('❌ Erro durante a verificação:', error)
  } finally {
    await db.$disconnect()
  }
}

checkFrontendDuplication()