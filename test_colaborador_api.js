const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function testColaboradorAPI() {
  try {
    console.log('🔍 Testando API /api/colaborador/resultados')
    
    // 1. Buscar usuário colaborador
    const user = await db.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado')
      return
    }
    
    console.log(`✅ Usuário encontrado: ${user.email} (ID: ${user.id})`)
    
    // 2. Buscar resultados de teste do banco (mesma lógica da API)
    const testResults = await db.testResult.findMany({
      where: {
        userId: user.id
      },
      include: {
        test: {
          include: {
            category: true
          }
        },
        user: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })
    
    console.log(`\n📊 Resultados do banco de dados: ${testResults.length}`)
    
    // 3. Buscar resultados arquivados
    const fs = require('fs')
    const path = require('path')
    
    let archivedResults = []
    const archivePath = path.join(process.cwd(), 'archives', 'results', user.id)
    
    if (fs.existsSync(archivePath)) {
      const files = fs.readdirSync(archivePath)
      console.log(`📁 Arquivos encontrados: ${files.length}`)
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const filePath = path.join(archivePath, file)
            const content = fs.readFileSync(filePath, 'utf8')
            const data = JSON.parse(content)
            archivedResults.push(data)
          } catch (error) {
            console.log(`⚠️ Erro ao ler arquivo ${file}:`, error.message)
          }
        }
      }
    } else {
      console.log('📁 Pasta de arquivos não existe')
    }
    
    console.log(`📦 Resultados arquivados: ${archivedResults.length}`)
    
    // 4. Simular a lógica de deduplicação da API
    const dbResultIds = new Set(testResults.map(result => result.id))
    const uniqueArchivedResults = archivedResults.filter(archived => !dbResultIds.has(archived.id))
    
    console.log(`🔄 Resultados arquivados únicos (após deduplicação): ${uniqueArchivedResults.length}`)
    
    // 5. Total combinado
    const totalCombined = testResults.length + uniqueArchivedResults.length
    console.log(`📈 Total combinado: ${totalCombined}`)
    
    // 6. Verificar resultados BOLIE especificamente
    const bolieResults = testResults.filter(result => 
      result.test.name.includes('BOLIE') || 
      result.test.testType === 'personalidade'
    )
    
    console.log(`\n🧠 Resultados BOLIE no banco: ${bolieResults.length}`)
    
    bolieResults.forEach((result, index) => {
      console.log(`\n  BOLIE ${index + 1}:`)
      console.log(`    ID: ${result.id}`)
      console.log(`    Nome: ${result.test.name}`)
      console.log(`    Score: ${result.overallScore}`)
      console.log(`    Data: ${result.completedAt}`)
      console.log(`    Dimensões: ${Object.keys(result.dimensionScores || {}).length} dimensões`)
      
      if (result.dimensionScores) {
        Object.entries(result.dimensionScores).forEach(([key, value]) => {
          console.log(`      ${key}: ${value}`)
        })
      }
    })
    
    // 7. Verificar resultados BOLIE arquivados
    const archivedBolieResults = archivedResults.filter(result => 
      result.testName?.includes('BOLIE') || 
      result.testType === 'personalidade'
    )
    
    console.log(`\n🗄️ Resultados BOLIE arquivados: ${archivedBolieResults.length}`)
    
    archivedBolieResults.forEach((result, index) => {
      console.log(`\n  BOLIE Arquivado ${index + 1}:`)
      console.log(`    ID: ${result.id}`)
      console.log(`    Nome: ${result.testName}`)
      console.log(`    Score: ${result.overallScore}`)
      console.log(`    Data: ${result.completedAt}`)
      console.log(`    Dimensões: ${Object.keys(result.dimensionScores || {}).length} dimensões`)
    })
    
    // 8. Verificar se há duplicatas entre banco e arquivo
    const duplicateIds = testResults.filter(dbResult => 
      archivedResults.some(archived => archived.id === dbResult.id)
    )
    
    console.log(`\n🔍 Duplicatas encontradas: ${duplicateIds.length}`)
    
    if (duplicateIds.length > 0) {
      console.log('IDs duplicados:')
      duplicateIds.forEach(dup => {
        console.log(`  - ${dup.id} (${dup.test.name})`)
      })
    }
    
    console.log('\n✅ Teste da API colaborador concluído')
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  } finally {
    await db.$disconnect()
  }
}

testColaboradorAPI()