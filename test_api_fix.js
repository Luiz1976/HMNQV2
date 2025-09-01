const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Função para ler resultados arquivados (mesma lógica da API)
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

async function testAPILogicFixed() {
  try {
    console.log('🔍 TESTANDO LÓGICA DA API CORRIGIDA')
    console.log('=' .repeat(50))
    
    const userId = 'cmehdprxt00068wc0rz0enici' // colaborador@demo.com
    
    // 1. Buscar resultados do banco de dados
    console.log('\n1️⃣ BUSCANDO RESULTADOS DO BANCO DE DADOS')
    const testResults = await prisma.testResult.findMany({
      where: {
        userId: userId
      },
      include: {
        test: {
          include: {
            category: true
          }
        }
      }
    })
    
    console.log(`   Resultados no banco: ${testResults.length}`)
    
    // 2. Buscar resultados arquivados
    console.log('\n2️⃣ BUSCANDO RESULTADOS ARQUIVADOS')
    const archivedResults = readArchivedResults(userId)
    console.log(`   Resultados arquivados: ${archivedResults.length}`)
    
    // 3. Aplicar lógica de deduplicação (mesma da API corrigida)
    console.log('\n3️⃣ APLICANDO LÓGICA DE DEDUPLICAÇÃO')
    
    // Criar um Set com os IDs dos resultados do banco de dados
    const dbResultIds = new Set(testResults.map(result => result.id))
    console.log(`   IDs no banco: ${Array.from(dbResultIds).join(', ')}`)
    
    // Filtrar resultados arquivados (apenas os que NÃO estão no banco)
    const uniqueArchivedResults = archivedResults.filter(archivedResult => {
      const isUnique = !dbResultIds.has(archivedResult.id)
      if (!isUnique) {
        console.log(`   🔄 Removendo duplicata arquivada: ${archivedResult.id}`)
      }
      return isUnique
    })
    
    console.log(`   Resultados arquivados únicos: ${uniqueArchivedResults.length}`)
    
    // 4. Combinar resultados
    console.log('\n4️⃣ COMBINANDO RESULTADOS')
    const totalCombined = testResults.length + uniqueArchivedResults.length
    console.log(`   Total no banco: ${testResults.length}`)
    console.log(`   Total arquivados únicos: ${uniqueArchivedResults.length}`)
    console.log(`   Total combinado: ${totalCombined}`)
    
    // 5. Verificar se a correção funcionou
    console.log('\n5️⃣ VERIFICAÇÃO DA CORREÇÃO')
    if (totalCombined === 8) {
      console.log('   ✅ CORREÇÃO FUNCIONOU! Total de resultados: 8 (sem duplicatas)')
    } else {
      console.log(`   ❌ AINDA HÁ PROBLEMA! Total de resultados: ${totalCombined}`)
    }
    
    console.log('\n' + '=' .repeat(50))
    console.log('✅ Teste da lógica da API concluído')
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAPILogicFixed()