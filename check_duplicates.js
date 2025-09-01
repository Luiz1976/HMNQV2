const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// Implementação simplificada da função readArchivedResults
async function readArchivedResults(userId) {
  const archivesPath = path.join(process.cwd(), 'archives', 'results')
  const results = []

  try {
    if (!fs.existsSync(archivesPath)) {
      return results
    }

    const readDirectory = async (dirPath) => {
      const items = fs.readdirSync(dirPath, { withFileTypes: true })

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name)

        if (item.isDirectory()) {
          await readDirectory(fullPath)
        } else if (item.isFile() && item.name.endsWith('.json') && !item.name.startsWith('.')) {
          try {
            const fileContent = fs.readFileSync(fullPath, 'utf-8')
            const testResult = JSON.parse(fileContent)

            if (!userId || testResult.userId === userId) {
              results.push(testResult)
            }
          } catch (error) {
            console.error(`Erro ao ler arquivo ${fullPath}:`, error)
          }
        }
      }
    }

    await readDirectory(archivesPath)
    results.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    return results

  } catch (error) {
    console.error('Erro ao ler resultados arquivados:', error)
    return results
  }
}

async function checkDuplicates() {
  const prisma = new PrismaClient()
  
  try {
    // Buscar o usuário colaborador@demo.com
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado')
      return
    }
    
    console.log('🔍 Verificando duplicação de resultados...')
    console.log()
    
    // Buscar resultados no banco de dados
    const dbResults = await prisma.testResult.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        completedAt: true,
        createdAt: true,
        test: {
          select: {
            name: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    })
    
    // Buscar resultados arquivados
    const archivedResults = await readArchivedResults(user.id)
    
    console.log(`📊 Resultados no banco de dados: ${dbResults.length}`)
    console.log(`📁 Resultados arquivados: ${archivedResults.length}`)
    console.log()
    
    // Verificar duplicação por ID
    const dbIds = new Set(dbResults.map(r => r.id))
    const archivedIds = new Set(archivedResults.map(r => r.id))
    
    const duplicateIds = [...dbIds].filter(id => archivedIds.has(id))
    
    console.log(`🔄 IDs duplicados: ${duplicateIds.length}`)
    if (duplicateIds.length > 0) {
      console.log('   Duplicados:', duplicateIds)
    }
    
    // Verificar duplicação por data de conclusão (aproximada)
    console.log('\n📅 Comparando por data de conclusão:')
    const dbDates = dbResults.map(r => ({
      id: r.id,
      testName: r.test?.name || 'Nome não disponível',
      completedAt: new Date(r.completedAt).toISOString()
    }))
    
    const archivedDates = archivedResults.map(r => ({
      id: r.id,
      testName: r.testName,
      completedAt: new Date(r.completedAt).toISOString()
    }))
    
    console.log('\n📊 Resultados do banco de dados:')
    dbDates.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.testName} - ${result.completedAt} (ID: ${result.id})`)
    })
    
    console.log('\n📁 Resultados arquivados:')
    archivedDates.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.testName} - ${result.completedAt} (ID: ${result.id})`)
    })
    
    // Verificar se são os mesmos testes por data
    let possibleDuplicates = 0
    for (const dbResult of dbDates) {
      for (const archivedResult of archivedDates) {
        const dbTime = new Date(dbResult.completedAt).getTime()
        const archivedTime = new Date(archivedResult.completedAt).getTime()
        const timeDiff = Math.abs(dbTime - archivedTime)
        
        // Se a diferença for menor que 1 minuto, pode ser duplicata
        if (timeDiff < 60000 && dbResult.testName.includes(archivedResult.testName.split(' ')[0])) {
          possibleDuplicates++
          console.log(`\n⚠️  Possível duplicata encontrada:`)
          console.log(`   DB: ${dbResult.testName} - ${dbResult.completedAt} (ID: ${dbResult.id})`)
          console.log(`   Arquivo: ${archivedResult.testName} - ${archivedResult.completedAt} (ID: ${archivedResult.id})`)
          console.log(`   Diferença de tempo: ${timeDiff}ms`)
        }
      }
    }
    
    console.log(`\n🔢 Total de possíveis duplicatas: ${possibleDuplicates}`)
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDuplicates()