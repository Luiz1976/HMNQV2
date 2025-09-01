// Script para listar testes arquivados no banco SQLite organizados por data de realização
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface TestResultWithDetails {
  id: string
  completedAt: Date | null
  createdAt: Date
  test: {
    id: string
    name: string
    testType: string
    category: {
      name: string
    } | null
  }
  user: {
    id: string
    name: string | null
    email: string
  } | null
  session: {
    id: string
    status: string
    createdAt: Date
  } | null
}

interface GroupedResults {
  [year: string]: {
    [month: string]: TestResultWithDetails[]
  }
}

async function listArchivedTestsByDate() {
  try {
    console.log('🔍 Buscando testes arquivados no banco SQLite...')
    
    // Buscar todos os TestResult com suas relações
    const testResults = await prisma.testResult.findMany({
      include: {
        test: {
          include: {
            category: true
          }
        },
        user: true,
        session: true
      },
      orderBy: [
        { completedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    console.log(`📊 Total de resultados encontrados: ${testResults.length}`)
    
    if (testResults.length === 0) {
      console.log('❌ Nenhum resultado de teste encontrado no banco de dados.')
      return
    }

    // Agrupar por ano e mês
    const groupedResults: GroupedResults = {}
    
    testResults.forEach((result) => {
      // Usar completedAt se disponível, senão usar createdAt
      const date = result.completedAt || result.createdAt
      const year = date.getFullYear().toString()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date)
      const monthKey = `${month}-${monthName}`
      
      if (!groupedResults[year]) {
        groupedResults[year] = {}
      }
      
      if (!groupedResults[year][monthKey]) {
        groupedResults[year][monthKey] = []
      }
      
      groupedResults[year][monthKey].push(result as TestResultWithDetails)
    })

    // Exibir resultados organizados
    console.log('\n📅 TESTES ARQUIVADOS POR DATA DE REALIZAÇÃO')
    console.log('=' .repeat(60))
    
    const years = Object.keys(groupedResults).sort((a, b) => parseInt(b) - parseInt(a))
    
    for (const year of years) {
      console.log(`\n🗓️  ANO ${year}`)
      console.log('-'.repeat(40))
      
      const months = Object.keys(groupedResults[year]).sort((a, b) => {
        const monthA = parseInt(a.split('-')[0])
        const monthB = parseInt(b.split('-')[0])
        return monthB - monthA
      })
      
      for (const monthKey of months) {
        const monthResults = groupedResults[year][monthKey]
        const monthName = monthKey.split('-')[1]
        
        console.log(`\n  📆 ${monthName.toUpperCase()} (${monthResults.length} testes)`)
        console.log('  ' + '·'.repeat(35))
        
        monthResults.forEach((result, index) => {
          const date = result.completedAt || result.createdAt
          const formattedDate = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }).format(date)
          
          const userName = result.user?.name || result.user?.email || 'Usuário não identificado'
          const testCategory = result.test.category?.name || 'Sem categoria'
          const sessionStatus = result.session?.status || 'N/A'
          
          console.log(`  ${index + 1}. 📋 ${result.test.name}`)
          console.log(`     🆔 ID: ${result.id}`)
          console.log(`     👤 Usuário: ${userName}`)
          console.log(`     📊 Tipo: ${result.test.testType}`)
          console.log(`     🏷️  Categoria: ${testCategory}`)
          console.log(`     ⏰ Data: ${formattedDate}`)
          console.log(`     🔄 Status da Sessão: ${sessionStatus}`)
          
          if (result.session) {
            console.log(`     🔗 ID da Sessão: ${result.session.id}`)
          }
          
          console.log('')
        })
      }
    }

    // Estatísticas resumidas
    console.log('\n📈 ESTATÍSTICAS RESUMIDAS')
    console.log('=' .repeat(40))
    
    const totalTests = testResults.length
    const testTypes = new Map<string, number>()
    const categories = new Map<string, number>()
    const usersCount = new Set<string>()
    
    testResults.forEach((result) => {
      // Contar tipos de teste
      const type = result.test.testType
      testTypes.set(type, (testTypes.get(type) || 0) + 1)
      
      // Contar categorias
      const category = result.test.category?.name || 'Sem categoria'
      categories.set(category, (categories.get(category) || 0) + 1)
      
      // Contar usuários únicos
      if (result.user?.id) {
        usersCount.add(result.user.id)
      }
    })
    
    console.log(`📊 Total de testes: ${totalTests}`)
    console.log(`👥 Usuários únicos: ${usersCount.size}`)
    console.log(`📅 Período: ${years[years.length - 1]} - ${years[0]}`)
    
    console.log('\n🏷️  Por Tipo de Teste:')
    Array.from(testTypes.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`   • ${type}: ${count} testes`)
      })
    
    console.log('\n📂 Por Categoria:')
    Array.from(categories.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`   • ${category}: ${count} testes`)
      })
    
    console.log('\n✅ Listagem concluída com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao listar testes arquivados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar o script
if (require.main === module) {
  listArchivedTestsByDate()
    .then(() => {
      console.log('\n🎯 Script executado com sucesso!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error)
      process.exit(1)
    })
}

export { listArchivedTestsByDate }