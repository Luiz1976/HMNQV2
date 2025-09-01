// Script para debugar duplicação de renderização React
// Verifica se componentes estão sendo montados/renderizados múltiplas vezes

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function debugReactRendering() {
  console.log('🔍 DEBUGGING REACT RENDERING DUPLICATION')
  console.log('=' .repeat(60))
  
  try {
    // 1. Verificar dados reais do usuário
    const userId = 'cm4rvqhqz0000uxqhqhqhqhqh' // ID do colaborador@demo.com
    
    console.log('\n1. DADOS REAIS DO BANCO:')
    const dbResults = await prisma.testResult.findMany({
      where: { userId },
      select: {
        id: true,
        testId: true,
        completedAt: true,
        overallScore: true,
        test: {
          select: {
            name: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    })
    
    console.log(`   - Resultados no banco: ${dbResults.length}`)
    dbResults.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.test?.name || 'N/A'} (${result.id.slice(-8)}) - Score: ${result.overallScore}`)
    })
    
    // 2. Simular chamada da API
    console.log('\n2. SIMULAÇÃO DA API:')
    const apiUrl = 'http://localhost:3000/api/colaborador/resultados?page=1&limit=20'
    
    try {
      const response = await fetch(apiUrl)
      const apiData = await response.json()
      
      console.log(`   - Status da resposta: ${response.status}`)
      console.log(`   - Resultados retornados pela API: ${apiData.results?.length || 0}`)
      
      if (apiData.results) {
        console.log('   - IDs dos resultados da API:')
        apiData.results.forEach((result, index) => {
          console.log(`     ${index + 1}. ${result.test?.name || result.testName || 'N/A'} (${result.id.slice(-8)})`)
        })
        
        // Verificar duplicatas na resposta da API
        const apiIds = apiData.results.map(r => r.id)
        const uniqueApiIds = [...new Set(apiIds)]
        
        if (apiIds.length !== uniqueApiIds.length) {
          console.log('   ⚠️  DUPLICATAS ENCONTRADAS NA RESPOSTA DA API!')
          const duplicates = apiIds.filter((id, index) => apiIds.indexOf(id) !== index)
          console.log(`   - IDs duplicados: ${duplicates.join(', ')}`)
        } else {
          console.log('   ✅ Nenhuma duplicata na resposta da API')
        }
      }
      
    } catch (fetchError) {
      console.log(`   ❌ Erro ao chamar API: ${fetchError.message}`)
      console.log('   (Isso é esperado se o servidor não estiver rodando)')
    }
    
    // 3. Verificar possíveis causas de duplicação no frontend
    console.log('\n3. POSSÍVEIS CAUSAS DE DUPLICAÇÃO NO FRONTEND:')
    
    console.log('   a) React StrictMode:')
    console.log('      - Não encontrado React.StrictMode no código')
    console.log('      - ✅ Não é a causa da duplicação')
    
    console.log('\n   b) useEffect duplo:')
    console.log('      - useEffect na página todos-resultados tem dependências:')
    console.log('      - [session, currentPage, searchTerm, filterType, filterStatus, filterCategory, sortBy, sortOrder, pageSize]')
    console.log('      - ⚠️  Possível causa: mudanças rápidas nas dependências')
    
    console.log('\n   c) DiagnosticPanel:')
    console.log('      - Faz chamada separada para /api/colaborador/resultados')
    console.log('      - ⚠️  Possível interferência, mas não deveria duplicar a lista principal')
    
    console.log('\n   d) Estado do componente:')
    console.log('      - Componente usa useState para armazenar resultados')
    console.log('      - ⚠️  Possível problema: estado não sendo limpo entre atualizações')
    
    // 4. Recomendações
    console.log('\n4. RECOMENDAÇÕES PARA CORREÇÃO:')
    console.log('   1. Adicionar console.log no useEffect para rastrear execuções')
    console.log('   2. Verificar se fetchResults está sendo chamado múltiplas vezes')
    console.log('   3. Adicionar loading state para prevenir chamadas simultâneas')
    console.log('   4. Verificar se setData está sendo chamado corretamente')
    console.log('   5. Temporariamente remover DiagnosticPanel para testar')
    
    console.log('\n5. PRÓXIMOS PASSOS:')
    console.log('   - Adicionar logs de debug no componente React')
    console.log('   - Verificar Network tab no DevTools')
    console.log('   - Testar com DiagnosticPanel removido')
    console.log('   - Verificar se há re-renders desnecessários')
    
  } catch (error) {
    console.error('❌ Erro durante debug:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar debug
debugReactRendering().catch(console.error)