const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkTestResultDetails() {
  try {
    console.log('🔍 Verificando dados detalhados de um resultado de teste...')
    
    // Buscar um resultado específico com todos os dados
    const result = await prisma.testResult.findFirst({
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

    if (!result) {
      console.log('❌ Nenhum resultado encontrado')
      return
    }

    console.log('\n📊 DADOS DO RESULTADO:')
    console.log('ID:', result.id)
    console.log('Teste:', result.test.name)
    console.log('Categoria:', result.test.category.name)
    console.log('Tipo de Teste:', result.test.testType)
    console.log('Usuário:', result.user.email)
    console.log('Data de Conclusão:', result.completedAt)
    console.log('Status:', result.status)
    
    console.log('\n🎯 PONTUAÇÕES:')
    console.log('Pontuação Geral:', result.overallScore)
    console.log('Pontuações por Dimensão:')
    if (result.dimensionScores) {
      console.log(JSON.stringify(result.dimensionScores, null, 2))
    } else {
      console.log('❌ Nenhuma pontuação por dimensão encontrada')
    }
    
    console.log('\n📈 ESTATÍSTICAS:')
    console.log('❌ Campo statistics não disponível no modelo')
    
    console.log('\n🤖 ANÁLISE DE IA:')
    if (result.aiAnalysis) {
      console.log('Status da Análise:', result.aiAnalysis.status || 'N/A')
      console.log('Confiança:', result.aiAnalysis.confidence || 'N/A')
      console.log('Resumo:', result.aiAnalysis.summary ? result.aiAnalysis.summary.substring(0, 200) + '...' : 'N/A')
      console.log('Recomendações:', result.aiAnalysis.recommendations ? 'Presentes' : 'Ausentes')
    } else {
      console.log('❌ Nenhuma análise de IA encontrada')
    }
    
    console.log('\n📋 DADOS BRUTOS PARA CHART:')
    if (result.dimensionScores) {
      const chartData = Object.entries(result.dimensionScores).map(([key, value]) => ({
        name: key,
        value: value,
        fullMark: 100
      }))
      console.log('Chart Data:', JSON.stringify(chartData, null, 2))
    }
    
    console.log('\n✅ Verificação concluída!')
    
  } catch (error) {
    console.error('❌ Erro ao verificar dados do resultado:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTestResultDetails()