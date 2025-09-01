const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function verifyBolieInDatabase() {
  try {
    console.log('🔍 VERIFICANDO RESULTADOS DO TESTE HUMANIQ BOLIE NO BANCO DE DADOS')
    console.log('=' .repeat(70))
    
    // 1. Verificar se o banco de dados existe
    const dbPath = 'C:\\Users\\ALICEBELLA\\Desktop\\HMNQV2\\app\\prisma\\dev.db'
    console.log(`📁 Verificando banco de dados: ${dbPath}`)
    
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath)
      console.log(`✅ Banco encontrado! Tamanho: ${(stats.size / 1024).toFixed(2)} KB`)
      console.log(`📅 Última modificação: ${stats.mtime.toLocaleString('pt-BR')}`)
    } else {
      console.log('❌ Banco de dados não encontrado!')
      return
    }
    
    console.log('\n' + '=' .repeat(70))
    
    // 2. Buscar todos os resultados do teste BOLIE
    console.log('🔍 Buscando resultados do teste HumaniQ BOLIE...')
    
    const bolieResults = await prisma.testResult.findMany({
      where: {
        test: {
          name: {
            contains: 'BOLIE'
          }
        }
      },
      include: {
        test: true,
        user: true
      },
      orderBy: {
        completedAt: 'desc'
      }
    })
    
    console.log(`📊 Total de resultados BOLIE encontrados: ${bolieResults.length}`)
    
    if (bolieResults.length === 0) {
      console.log('❌ Nenhum resultado do teste BOLIE encontrado no banco!')
      return
    }
    
    console.log('\n' + '=' .repeat(70))
    console.log('📋 DETALHES DOS RESULTADOS ENCONTRADOS:')
    console.log('=' .repeat(70))
    
    bolieResults.forEach((result, index) => {
      console.log(`\n${index + 1}. RESULTADO ID: ${result.id}`)
      console.log(`   📧 Usuário: ${result.user.email}`)
      console.log(`   🧪 Teste: ${result.test.name}`)
      console.log(`   📊 Pontuação Geral: ${result.overallScore || 'N/A'}`)
      console.log(`   📅 Concluído em: ${result.completedAt ? new Date(result.completedAt).toLocaleString('pt-BR') : 'N/A'}`)
      console.log(`   🕐 Criado em: ${new Date(result.createdAt).toLocaleString('pt-BR')}`)
      
      // Verificar se há dados de dimensões
      if (result.dimensionScores) {
        console.log(`   📈 Dimensões:`, JSON.stringify(result.dimensionScores, null, 2))
      }
      
      // Verificar se há dados de respostas
      if (result.responses) {
        console.log(`   📝 Respostas: ${Object.keys(result.responses).length} questões respondidas`)
      }
      
      console.log('   ' + '-'.repeat(50))
    })
    
    // 3. Verificar o resultado mais recente
    const latestResult = bolieResults[0]
    console.log('\n' + '=' .repeat(70))
    console.log('🎯 ANÁLISE DO RESULTADO MAIS RECENTE:')
    console.log('=' .repeat(70))
    
    console.log(`✅ ID: ${latestResult.id}`)
    console.log(`✅ Usuário: ${latestResult.user.email}`)
    console.log(`✅ Teste: ${latestResult.test.name}`)
    console.log(`✅ Status: ${latestResult.completedAt ? 'CONCLUÍDO' : 'EM ANDAMENTO'}`)
    console.log(`✅ Pontuação: ${latestResult.overallScore || 'N/A'}`)
    console.log(`✅ Data: ${latestResult.completedAt ? new Date(latestResult.completedAt).toLocaleString('pt-BR') : 'N/A'}`)
    
    // 4. Verificar integridade dos dados
    console.log('\n' + '=' .repeat(70))
    console.log('🔧 VERIFICAÇÃO DE INTEGRIDADE:')
    console.log('=' .repeat(70))
    
    const checks = {
      'Resultado possui ID': !!latestResult.id,
      'Resultado possui usuário': !!latestResult.user,
      'Resultado possui teste': !!latestResult.test,
      'Resultado foi concluído': !!latestResult.completedAt,
      'Resultado possui pontuação': latestResult.overallScore !== null && latestResult.overallScore !== undefined,
      'Resultado possui dimensões': !!latestResult.dimensionScores,
      'Resultado possui respostas': !!latestResult.responses
    }
    
    Object.entries(checks).forEach(([check, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${check}`)
    })
    
    console.log('\n' + '=' .repeat(70))
    console.log('📊 RESUMO FINAL:')
    console.log('=' .repeat(70))
    
    const allPassed = Object.values(checks).every(check => check)
    
    if (allPassed) {
      console.log('🎉 SUCESSO! O teste HumaniQ BOLIE foi salvo corretamente no banco de dados!')
      console.log('✅ Todos os dados estão íntegros e acessíveis.')
      console.log(`✅ Localização: ${dbPath}`)
    } else {
      console.log('⚠️  ATENÇÃO! Alguns dados podem estar incompletos.')
      console.log('🔧 Recomenda-se verificar a implementação do teste.')
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar o banco de dados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyBolieInDatabase()