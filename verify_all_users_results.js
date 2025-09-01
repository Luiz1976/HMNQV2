const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Função para ler resultados arquivados para um usuário específico
function readArchivedResults(userId) {
  try {
    const archiveBasePath = path.join(process.cwd(), 'archives', 'results')
    let allArchivedResults = []
    
    if (!fs.existsSync(archiveBasePath)) {
      return []
    }
    
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
    console.error(`❌ Erro ao ler resultados arquivados para usuário ${userId}:`, error)
    return []
  }
}

// Função para obter informações do usuário
async function getUserInfo(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })
    return user
  } catch (error) {
    console.error(`❌ Erro ao buscar informações do usuário ${userId}:`, error)
    return null
  }
}

// Função principal para verificar todos os usuários
async function verifyAllUsersResults() {
  try {
    console.log('🔍 VERIFICAÇÃO COMPLETA DE RESULTADOS DE TODOS OS USUÁRIOS')
    console.log('=' .repeat(80))
    
    // 1. Buscar todos os usuários que têm resultados no banco
    console.log('\n1️⃣ BUSCANDO USUÁRIOS COM RESULTADOS NO BANCO DE DADOS')
    const usersWithResults = await prisma.testResult.findMany({
      select: {
        userId: true
      },
      distinct: ['userId']
    })
    
    console.log(`   Total de usuários com resultados: ${usersWithResults.length}`)
    
    const report = {
      totalUsers: usersWithResults.length,
      users: [],
      summary: {
        totalDbResults: 0,
        totalArchivedResults: 0,
        totalDuplicates: 0,
        usersWithDuplicates: 0,
        usersWithOnlyDbResults: 0,
        usersWithOnlyArchivedResults: 0,
        usersWithBothTypes: 0
      },
      issues: []
    }
    
    // 2. Para cada usuário, verificar resultados no banco vs arquivos
    console.log('\n2️⃣ ANALISANDO CADA USUÁRIO')
    console.log('-' .repeat(80))
    
    for (let i = 0; i < usersWithResults.length; i++) {
      const { userId } = usersWithResults[i]
      console.log(`\n👤 Usuário ${i + 1}/${usersWithResults.length}: ${userId}`)
      
      // Buscar informações do usuário
      const userInfo = await getUserInfo(userId)
      const userEmail = userInfo ? userInfo.email : 'Email não encontrado'
      const userName = userInfo ? userInfo.name : 'Nome não encontrado'
      
      console.log(`   Email: ${userEmail}`)
      console.log(`   Nome: ${userName}`)
      
      // Buscar resultados no banco
      const dbResults = await prisma.testResult.findMany({
        where: { userId },
        select: {
          id: true,
          testId: true,
          createdAt: true,
          completedAt: true
        }
      })
      
      // Buscar resultados arquivados
      const archivedResults = readArchivedResults(userId)
      
      console.log(`   Resultados no banco: ${dbResults.length}`)
      console.log(`   Resultados arquivados: ${archivedResults.length}`)
      
      // Verificar duplicatas
      const dbResultIds = new Set(dbResults.map(r => r.id))
      const archivedResultIds = archivedResults.map(r => r.id)
      const duplicates = archivedResultIds.filter(id => dbResultIds.has(id))
      
      console.log(`   Duplicatas encontradas: ${duplicates.length}`)
      
      // Calcular totais únicos
      const uniqueArchivedResults = archivedResults.filter(r => !dbResultIds.has(r.id))
      const totalUniqueResults = dbResults.length + uniqueArchivedResults.length
      
      console.log(`   Total único (sem duplicatas): ${totalUniqueResults}`)
      
      // Classificar o usuário
      let userType = 'unknown'
      if (dbResults.length > 0 && archivedResults.length > 0) {
        userType = 'both'
        report.summary.usersWithBothTypes++
      } else if (dbResults.length > 0) {
        userType = 'db_only'
        report.summary.usersWithOnlyDbResults++
      } else if (archivedResults.length > 0) {
        userType = 'archived_only'
        report.summary.usersWithOnlyArchivedResults++
      }
      
      // Identificar possíveis problemas
      const issues = []
      
      if (duplicates.length > 0) {
        issues.push(`${duplicates.length} resultados duplicados entre banco e arquivos`)
        report.summary.usersWithDuplicates++
      }
      
      if (archivedResults.length > 0 && dbResults.length === 0) {
        issues.push('Usuário tem apenas resultados arquivados (possível problema de migração)')
      }
      
      if (dbResults.length > 20) {
        issues.push(`Usuário tem muitos resultados no banco (${dbResults.length}) - possível spam ou teste`)
      }
      
      if (issues.length > 0) {
        console.log(`   ⚠️  Problemas identificados: ${issues.join(', ')}`)
      } else {
        console.log(`   ✅ Nenhum problema identificado`)
      }
      
      // Adicionar ao relatório
      const userReport = {
        userId,
        email: userEmail,
        name: userName,
        dbResults: dbResults.length,
        archivedResults: archivedResults.length,
        duplicates: duplicates.length,
        uniqueTotal: totalUniqueResults,
        type: userType,
        issues: issues,
        duplicateIds: duplicates
      }
      
      report.users.push(userReport)
      
      // Atualizar totais do resumo
      report.summary.totalDbResults += dbResults.length
      report.summary.totalArchivedResults += archivedResults.length
      report.summary.totalDuplicates += duplicates.length
      
      // Adicionar problemas ao relatório geral
      if (issues.length > 0) {
        report.issues.push({
          userId,
          email: userEmail,
          issues
        })
      }
    }
    
    // 3. Gerar relatório final
    console.log('\n' + '=' .repeat(80))
    console.log('📊 RELATÓRIO FINAL')
    console.log('=' .repeat(80))
    
    console.log(`\n📈 ESTATÍSTICAS GERAIS:`)
    console.log(`   Total de usuários analisados: ${report.totalUsers}`)
    console.log(`   Total de resultados no banco: ${report.summary.totalDbResults}`)
    console.log(`   Total de resultados arquivados: ${report.summary.totalArchivedResults}`)
    console.log(`   Total de duplicatas: ${report.summary.totalDuplicates}`)
    
    console.log(`\n👥 DISTRIBUIÇÃO DE USUÁRIOS:`)
    console.log(`   Usuários com apenas resultados no banco: ${report.summary.usersWithOnlyDbResults}`)
    console.log(`   Usuários com apenas resultados arquivados: ${report.summary.usersWithOnlyArchivedResults}`)
    console.log(`   Usuários com ambos os tipos: ${report.summary.usersWithBothTypes}`)
    console.log(`   Usuários com duplicatas: ${report.summary.usersWithDuplicates}`)
    
    console.log(`\n⚠️  PROBLEMAS IDENTIFICADOS:`)
    if (report.issues.length === 0) {
      console.log(`   ✅ Nenhum problema crítico identificado!`)
    } else {
      console.log(`   Total de usuários com problemas: ${report.issues.length}`)
      report.issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.email} (${issue.userId}):`)
        issue.issues.forEach(problem => {
          console.log(`      - ${problem}`)
        })
      })
    }
    
    // 4. Salvar relatório em arquivo JSON
    const reportPath = path.join(process.cwd(), 'all_users_results_report.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n💾 Relatório detalhado salvo em: ${reportPath}`)
    
    console.log('\n' + '=' .repeat(80))
    console.log('✅ Verificação completa de todos os usuários concluída')
    
  } catch (error) {
    console.error('❌ Erro na verificação:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyAllUsersResults()