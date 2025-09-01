const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// Implementação simplificada da função readArchivedResults
async function readArchivedResults(userId) {
  const archivesPath = path.join(process.cwd(), 'archives', 'results')
  const results = []

  try {
    if (!fs.existsSync(archivesPath)) {
      console.log('Diretório de arquivos não encontrado:', archivesPath)
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

async function debugArchivedResults() {
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
    
    console.log('👤 Usuário encontrado:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log()
    
    // Verificar resultados no banco de dados
    const dbResults = await prisma.testResult.findMany({
      where: { userId: user.id }
    })
    
    console.log(`📊 Resultados no banco de dados: ${dbResults.length}`)
    
    // Verificar resultados arquivados
    const archivedResults = await readArchivedResults(user.id)
    console.log(`📁 Resultados arquivados para este usuário: ${archivedResults.length}`)
    
    // Verificar todos os resultados arquivados (sem filtro)
    const allArchivedResults = await readArchivedResults()
    console.log(`📁 Total de resultados arquivados no sistema: ${allArchivedResults.length}`)
    
    // Mostrar detalhes dos resultados arquivados deste usuário
    if (archivedResults.length > 0) {
      console.log('\n📋 Detalhes dos resultados arquivados deste usuário:')
      archivedResults.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.testName} - ${result.completedAt}`)
        console.log(`      ID: ${result.id}, UserID: ${result.userId}`)
      })
    }
    
    // Verificar se há resultados arquivados de outros usuários
    const otherUsersArchived = allArchivedResults.filter(r => r.userId !== user.id)
    console.log(`\n👥 Resultados arquivados de outros usuários: ${otherUsersArchived.length}`)
    
    if (otherUsersArchived.length > 0) {
      console.log('\n📋 Detalhes dos resultados arquivados de outros usuários:')
      otherUsersArchived.slice(0, 5).forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.testName} - UserID: ${result.userId}`)
      })
    }
    
    // Total combinado
    const totalCombined = dbResults.length + archivedResults.length
    console.log(`\n🔢 Total combinado (DB + Arquivados) para este usuário: ${totalCombined}`)
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugArchivedResults()