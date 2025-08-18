import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkGraphologyResults() {
  console.log('🔍 Verificando resultados de testes grafológicos...')
  
  try {
    // Buscar todos os testes grafológicos
    const graphologyTests = await prisma.test.findMany({
      where: {
        testType: 'GRAPHOLOGY'
      }
    })
    
    console.log(`📋 Testes grafológicos encontrados: ${graphologyTests.length}`)
    graphologyTests.forEach(test => {
      console.log(`  - ${test.name} (ID: ${test.id})`)
    })
    
    // Buscar resultados de testes grafológicos
    const graphologyResults = await prisma.testResult.findMany({
      where: {
        test: {
          testType: 'GRAPHOLOGY'
        }
      },
      include: {
        test: true,
        user: true,
        aiAnalyses: true
      }
    })
    
    console.log(`\n📊 Resultados de testes grafológicos encontrados: ${graphologyResults.length}`)
    
    if (graphologyResults.length > 0) {
      graphologyResults.forEach((result, index) => {
        console.log(`\n${index + 1}. Resultado ID: ${result.id}`)
        console.log(`   Usuário: ${result.user.firstName} ${result.user.lastName} (${result.user.email})`)
        console.log(`   Teste: ${result.test.name}`)
        console.log(`   Score Geral: ${result.overallScore}`)
        console.log(`   Data: ${result.completedAt}`)
        console.log(`   Análises IA: ${result.aiAnalyses.length}`)
        
        if (result.dimensionScores) {
          console.log(`   Scores por Dimensão:`, result.dimensionScores)
        }
        
        if (result.aiAnalyses.length > 0) {
          result.aiAnalyses.forEach((analysis, aiIndex) => {
            console.log(`     Análise ${aiIndex + 1}: ${analysis.analysisType} (Confiança: ${analysis.confidence}%)`)
          })
        }
      })
    } else {
      console.log('❌ Nenhum resultado de teste grafológico encontrado.')
      console.log('💡 Sugestão: Execute um teste grafológico primeiro para gerar dados reais.')
    }
    
    // Buscar análises IA relacionadas a grafologia
    const aiAnalyses = await prisma.aIAnalysis.findMany({
      where: {
        analysisType: {
          contains: 'graphology'
        }
      },
      include: {
        test: true,
        user: true
      }
    })
    
    console.log(`\n🤖 Análises IA de grafologia encontradas: ${aiAnalyses.length}`)
    
  } catch (error) {
    console.error('❌ Erro ao verificar resultados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkGraphologyResults()
  .catch(console.error)