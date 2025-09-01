const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyCorrections() {
  try {
    console.log('🔍 Verificando se as correções foram aplicadas...')
    
    // Buscar todos os resultados do usuário
    const results = await prisma.testResult.findMany({
      where: {
        user: {
          email: 'colaborador@demo.com'
        }
      },
      include: {
        test: {
          include: {
            category: true
          }
        },
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })

    console.log(`\n📊 Total de resultados encontrados: ${results.length}`)
    
    let correctedCount = 0
    let stillProblematicCount = 0
    
    for (const result of results) {
      const hasValidScore = result.overallScore > 0
      const hasValidDimensions = Object.keys(result.dimensionScores).length > 1 || 
                                (Object.keys(result.dimensionScores).length === 1 && 
                                 !result.dimensionScores.hasOwnProperty('Pontuação Geral'))
      
      if (hasValidScore && hasValidDimensions) {
        correctedCount++
        console.log(`\n✅ CORRIGIDO - ${result.test.name}`)
        console.log(`   Pontuação: ${result.overallScore}%`)
        console.log(`   Dimensões: ${Object.keys(result.dimensionScores).join(', ')}`)
      } else {
        stillProblematicCount++
        console.log(`\n❌ AINDA PROBLEMÁTICO - ${result.test.name}`)
        console.log(`   Pontuação: ${result.overallScore}%`)
        console.log(`   Dimensões: ${JSON.stringify(result.dimensionScores)}`)
      }
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('📋 RESUMO FINAL:')
    console.log(`✅ Resultados corrigidos: ${correctedCount}`)
    console.log(`❌ Ainda problemáticos: ${stillProblematicCount}`)
    console.log(`📊 Total: ${results.length}`)
    
    if (correctedCount === results.length) {
      console.log('\n🎉 SUCESSO! Todos os resultados foram corrigidos!')
      console.log('   Os cards na página de resultados agora devem exibir:')
      console.log('   - Pontuações reais (não mais 0.0%)')
      console.log('   - Gráficos com dados das dimensões')
      console.log('   - Classificações adequadas (não mais "Baixa Compatibilidade")')
    } else {
      console.log('\n⚠️  Alguns resultados ainda precisam de correção.')
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar correções:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyCorrections()