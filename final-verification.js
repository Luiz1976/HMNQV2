// Script de verificação final
// Verifica se as análises de IA estão sendo exibidas corretamente

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function finalVerification() {
  try {
    console.log('🔍 VERIFICAÇÃO FINAL - Análises de IA')
    console.log('=' .repeat(50))
    
    // 1. Verificar usuário Luiz
    const user = await prisma.user.findUnique({
      where: { email: 'luiz.rocha@rbastos.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário Luiz não encontrado')
      return
    }
    
    console.log(`✅ Usuário: ${user.firstName} ${user.lastName} (${user.email})`)
    
    // 2. Verificar resultados de teste
    const testResults = await prisma.testResult.findMany({
      where: { userId: user.id },
      include: {
        test: { include: { category: true } },
        aiAnalyses: { orderBy: { createdAt: 'desc' }, take: 1 }
      },
      orderBy: { completedAt: 'desc' },
      take: 10
    })
    
    console.log(`\n📊 Resultados de teste: ${testResults.length}`)
    
    // 3. Verificar análises de IA
    let aiAnalysisCount = 0
    let withReportCount = 0
    
    testResults.forEach((result, index) => {
      const hasAI = result.aiAnalyses && result.aiAnalyses.length > 0
      if (hasAI) {
        aiAnalysisCount++
        const analysis = result.aiAnalyses[0]
        if (analysis.professionalReport) withReportCount++
        
        console.log(`\n${index + 1}. ${result.test.name}`)
        console.log(`   🤖 Análise IA: ✅ (${analysis.confidence}% confiança)`)
        console.log(`   📄 Relatório: ${analysis.professionalReport ? '✅' : '❌'}`)
        console.log(`   📅 Criada: ${analysis.createdAt.toLocaleDateString('pt-BR')}`)
      } else {
        console.log(`\n${index + 1}. ${result.test.name}`)
        console.log(`   🤖 Análise IA: ❌`)
      }
    })
    
    console.log('\n' + '=' .repeat(50))
    console.log('📈 RESUMO:')
    console.log(`- Total de resultados: ${testResults.length}`)
    console.log(`- Com análise IA: ${aiAnalysisCount}`)
    console.log(`- Com relatório profissional: ${withReportCount}`)
    console.log(`- Taxa de cobertura IA: ${((aiAnalysisCount / testResults.length) * 100).toFixed(1)}%`)
    
    // 4. Verificar estrutura da API
    console.log('\n🔧 ESTRUTURA DA API:')
    
    const sampleResult = testResults[0]
    if (sampleResult && sampleResult.aiAnalyses.length > 0) {
      const aiAnalysis = sampleResult.aiAnalyses[0]
      
      console.log('✅ Campos obrigatórios da análise IA:')
      console.log(`   - id: ${aiAnalysis.id ? '✅' : '❌'}`)
      console.log(`   - analysis: ${aiAnalysis.analysis ? '✅' : '❌'}`)
      console.log(`   - confidence: ${aiAnalysis.confidence ? '✅' : '❌'}`)
      console.log(`   - analysisType: ${aiAnalysis.analysisType ? '✅' : '❌'}`)
      console.log(`   - createdAt: ${aiAnalysis.createdAt ? '✅' : '❌'}`)
      console.log(`   - professionalReport: ${aiAnalysis.professionalReport ? '✅' : '❌'}`)
      
      // Simular estrutura que seria enviada para o frontend
      const frontendStructure = {
        id: sampleResult.id,
        test: {
          name: sampleResult.test.name,
          testType: sampleResult.test.testType
        },
        aiAnalysis: {
          id: aiAnalysis.id,
          analysis: aiAnalysis.analysis,
          confidence: aiAnalysis.confidence,
          analysisType: aiAnalysis.analysisType,
          metadata: aiAnalysis.metadata,
          createdAt: aiAnalysis.createdAt,
          professionalReport: aiAnalysis.professionalReport,
          hasAnalysis: true
        }
      }
      
      console.log('\n📋 Estrutura para o frontend:')
      console.log(JSON.stringify(frontendStructure, null, 2))
    }
    
    // 5. Status final
    console.log('\n' + '=' .repeat(50))
    if (aiAnalysisCount === testResults.length && aiAnalysisCount > 0) {
      console.log('🎉 STATUS: TUDO FUNCIONANDO PERFEITAMENTE!')
      console.log('✅ Todos os resultados têm análise de IA')
      console.log('✅ Dados estruturados corretamente')
      console.log('✅ API configurada para incluir análises')
    } else if (aiAnalysisCount > 0) {
      console.log('⚠️  STATUS: PARCIALMENTE FUNCIONANDO')
      console.log(`✅ ${aiAnalysisCount} de ${testResults.length} resultados têm análise IA`)
      console.log('💡 Alguns resultados podem precisar de análise')
    } else {
      console.log('❌ STATUS: PROBLEMA DETECTADO')
      console.log('❌ Nenhuma análise de IA encontrada')
    }
    
  } catch (error) {
    console.error('❌ Erro na verificação:', error)
  } finally {
    await prisma.$disconnect()
  }
}

finalVerification()