const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Função para ler resultados arquivados
function readArchivedResults(userId) {
  try {
    const archiveBasePath = path.join(process.cwd(), 'archives', 'results')
    let allArchivedResults = []
    
    // Percorrer estrutura de diretórios por ano/mês/tipo
    const years = fs.readdirSync(archiveBasePath).filter(item => {
      const fullPath = path.join(archiveBasePath, item)
      return fs.statSync(fullPath).isDirectory()
    })
    
    for (const year of years) {
      const yearPath = path.join(archiveBasePath, year)
      const months = fs.readdirSync(yearPath).filter(item => {
        const fullPath = path.join(yearPath, item)
        return fs.statSync(fullPath).isDirectory()
      })
      
      for (const month of months) {
        const monthPath = path.join(yearPath, month)
        const testTypes = fs.readdirSync(monthPath).filter(item => {
          const fullPath = path.join(monthPath, item)
          return fs.statSync(fullPath).isDirectory()
        })
        
        for (const testType of testTypes) {
          const testTypePath = path.join(monthPath, testType)
          const files = fs.readdirSync(testTypePath).filter(file => 
            file.includes(userId) && file.endsWith('.json')
          )
          
          for (const file of files) {
            try {
              const filePath = path.join(testTypePath, file)
              const data = fs.readFileSync(filePath, 'utf8')
              const archivedResult = JSON.parse(data)
              allArchivedResults.push(archivedResult)
            } catch (fileError) {
              console.error(`❌ Erro ao ler arquivo ${file}:`, fileError.message)
            }
          }
        }
      }
    }
    
    return allArchivedResults
  } catch (error) {
    console.error('❌ Erro ao ler resultados arquivados:', error)
    return []
  }
}

async function verifyArchivedResults() {
  try {
    console.log('🔍 Verificando resultados arquivados para colaborador@demo.com')
    console.log('=' .repeat(60))
    
    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado')
      return
    }
    
    console.log(`👤 Usuário encontrado: ${user.email} (ID: ${user.id})`)
    
    // Ler resultados arquivados
    const archivedResults = readArchivedResults(user.id)
    console.log(`📁 Resultados arquivados encontrados: ${archivedResults.length}`)
    
    if (archivedResults.length > 0) {
      console.log('\n📋 Detalhes dos resultados arquivados:')
      archivedResults.forEach((result, index) => {
        console.log(`  ${index + 1}. ID: ${result.id}`)
        console.log(`     Teste: ${result.testName || 'N/A'}`)
        console.log(`     Tipo: ${result.testType || 'N/A'}`)
        console.log(`     Score: ${result.overallScore || 'N/A'}`)
        console.log(`     Completado em: ${result.completedAt || 'N/A'}`)
        console.log(`     Arquivado em: ${result.archivedAt || 'N/A'}`)
        console.log('     ---')
      })
    }
    
    // Verificar se há duplicatas entre banco e arquivo
    const dbResults = await prisma.testResult.findMany({
      where: { userId: user.id },
      select: { id: true }
    })
    
    const dbResultIds = new Set(dbResults.map(r => r.id))
    const archivedResultIds = archivedResults.map(r => r.id)
    
    const duplicates = archivedResultIds.filter(id => dbResultIds.has(id))
    
    console.log(`\n🔄 Verificação de duplicatas:`)
    console.log(`   Resultados no banco: ${dbResults.length}`)
    console.log(`   Resultados arquivados: ${archivedResults.length}`)
    console.log(`   Duplicatas encontradas: ${duplicates.length}`)
    
    if (duplicates.length > 0) {
      console.log(`   IDs duplicados: ${duplicates.join(', ')}`)
    }
    
    // Total combinado (sem duplicatas)
    const uniqueArchivedResults = archivedResults.filter(r => !dbResultIds.has(r.id))
    const totalCombined = dbResults.length + uniqueArchivedResults.length
    
    console.log(`\n📊 Resumo final:`)
    console.log(`   Resultados únicos no banco: ${dbResults.length}`)
    console.log(`   Resultados únicos arquivados: ${uniqueArchivedResults.length}`)
    console.log(`   Total combinado (sem duplicatas): ${totalCombined}`)
    
    // Verificar estrutura de diretórios
    const archiveDir = path.join(process.cwd(), 'archives', 'results')
    console.log(`\n📂 Verificação de diretórios:`)
    console.log(`   Diretório de arquivos: ${archiveDir}`)
    console.log(`   Diretório existe: ${fs.existsSync(archiveDir)}`)
    
    if (fs.existsSync(archiveDir)) {
      const files = fs.readdirSync(archiveDir)
      console.log(`   Arquivos no diretório: ${files.length}`)
      files.forEach(file => {
        console.log(`     - ${file}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyArchivedResults()
  .then(() => {
    console.log('\n✅ Verificação concluída')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })