const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function testAPIWithAuth() {
  try {
    console.log('🔍 Testando API de resultados com autenticação simulada...')
    
    // 1. Buscar o usuário colaborador@demo.com
    const user = await db.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado')
      return
    }
    
    console.log('✅ Usuário encontrado:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    })
    
    const userId = user.id
    
    // 2. Simular os mesmos filtros que a API usa
    const where = {
      userId: userId
    }
    
    // 3. Buscar resultados do banco (simulando a consulta da API)
    console.log('\n🔍 Buscando resultados do banco de dados...')
    const testResults = await db.testResult.findMany({
      where,
      include: {
        test: {
          include: {
            category: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })
    
    console.log(`📊 Resultados do banco: ${testResults.length}`)
    
    if (testResults.length > 0) {
      console.log('\n📝 Detalhes dos resultados do banco:')
      testResults.forEach((result, index) => {
        console.log(`  ${index + 1}. ID: ${result.id} | Teste: ${result.test.name} | Usuário: ${result.user.email} | Data: ${result.completedAt}`)
      })
    }
    
    // 4. Simular leitura de resultados arquivados
    console.log('\n📁 Simulando busca de resultados arquivados...')
    const fs = require('fs')
    const path = require('path')
    
    const archivesDir = path.join(process.cwd(), 'archives', 'results')
    let archivedResults = []
    
    if (fs.existsSync(archivesDir)) {
      const files = fs.readdirSync(archivesDir)
      const userFiles = files.filter(file => file.includes(userId))
      
      console.log(`📁 Arquivos encontrados para o usuário: ${userFiles.length}`)
      
      for (const file of userFiles) {
        try {
          const filePath = path.join(archivesDir, file)
          const content = fs.readFileSync(filePath, 'utf8')
          const data = JSON.parse(content)
          
          if (data.userId === userId) {
            archivedResults.push(data)
          }
        } catch (error) {
          console.log(`⚠️ Erro ao ler arquivo ${file}:`, error.message)
        }
      }
    } else {
      console.log('📁 Diretório de arquivos não existe')
    }
    
    console.log(`📊 Resultados arquivados: ${archivedResults.length}`)
    
    if (archivedResults.length > 0) {
      console.log('\n📝 Detalhes dos resultados arquivados:')
      archivedResults.forEach((result, index) => {
        console.log(`  ${index + 1}. ID: ${result.id} | Teste: ${result.testName} | Usuário: ${result.userId} | Data: ${result.completedAt}`)
      })
    }
    
    // 5. Simular filtragem de duplicatas (como na API)
    const dbResultIds = new Set(testResults.map(result => result.id))
    const uniqueArchivedResults = archivedResults.filter(archivedResult => !dbResultIds.has(archivedResult.id))
    
    console.log(`\n🔄 Após filtragem de duplicatas:`)
    console.log(`  - Resultados do banco: ${testResults.length}`)
    console.log(`  - Resultados arquivados únicos: ${uniqueArchivedResults.length}`)
    console.log(`  - Total combinado: ${testResults.length + uniqueArchivedResults.length}`)
    
    // 6. Verificar se há resultados de outros usuários sendo incluídos
    console.log('\n🔍 Verificando se há contaminação de outros usuários...')
    
    // Verificar resultados do banco
    const wrongUserResults = testResults.filter(result => result.userId !== userId)
    if (wrongUserResults.length > 0) {
      console.log(`❌ PROBLEMA: ${wrongUserResults.length} resultados do banco pertencem a outros usuários!`)
      wrongUserResults.forEach(result => {
        console.log(`  - ID: ${result.id} | Usuário: ${result.user.email} | Esperado: ${user.email}`)
      })
    } else {
      console.log('✅ Todos os resultados do banco pertencem ao usuário correto')
    }
    
    // Verificar resultados arquivados
    const wrongUserArchived = archivedResults.filter(result => result.userId !== userId)
    if (wrongUserArchived.length > 0) {
      console.log(`❌ PROBLEMA: ${wrongUserArchived.length} resultados arquivados pertencem a outros usuários!`)
      wrongUserArchived.forEach(result => {
        console.log(`  - ID: ${result.id} | Usuário: ${result.userId} | Esperado: ${userId}`)
      })
    } else {
      console.log('✅ Todos os resultados arquivados pertencem ao usuário correto')
    }
    
    // 7. Verificar todos os usuários no sistema
    console.log('\n👥 Verificando todos os usuários no sistema...')
    const allUsers = await db.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        _count: {
          select: {
            testResults: true
          }
        }
      }
    })
    
    console.log(`👥 Total de usuários no sistema: ${allUsers.length}`)
    allUsers.forEach(u => {
      console.log(`  - ${u.email} (ID: ${u.id}) - ${u._count.testResults} resultados`)
    })
    
    // 8. Resumo final
    console.log('\n📋 RESUMO FINAL:')
    console.log(`  - Usuário analisado: ${user.email} (ID: ${userId})`)
    console.log(`  - Resultados no banco: ${testResults.length}`)
    console.log(`  - Resultados arquivados: ${archivedResults.length}`)
    console.log(`  - Resultados arquivados únicos: ${uniqueArchivedResults.length}`)
    console.log(`  - Total que deveria aparecer na API: ${testResults.length + uniqueArchivedResults.length}`)
    console.log(`  - Problemas de contaminação: ${wrongUserResults.length + wrongUserArchived.length > 0 ? 'SIM' : 'NÃO'}`)
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
  } finally {
    await db.$disconnect()
  }
}

testAPIWithAuth()