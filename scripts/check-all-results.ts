// Script completo para verificar resultados armazenados em todo o projeto
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const prisma = new PrismaClient()
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

interface ResultCount {
  location: string
  type: string
  count: number
  details?: any
}

class ProjectResultsChecker {
  private results: ResultCount[] = []

  // Verificar banco de dados SQLite
  async checkDatabase() {
    console.log('🔍 Verificando banco de dados SQLite...')
    
    try {
      // Verificar tabelas principais
      const testResults = await prisma.testResult.count()
      const testSessions = await prisma.testSession.count()
      const answers = await prisma.answer.count()
      const aiAnalyses = await prisma.aIAnalysis.count()
      const users = await prisma.user.count()
      const companies = await prisma.company.count()
      const invites = await prisma.invite.count()
      
      // Adicionar contagens aos resultados
      this.results.push(
        { location: 'Database', type: 'TestResult', count: testResults },
        { location: 'Database', type: 'TestSession', count: testSessions },
        { location: 'Database', type: 'Answer', count: answers },
        { location: 'Database', type: 'AIAnalysis', count: aiAnalyses },
        { location: 'Database', type: 'User', count: users },
        { location: 'Database', type: 'Company', count: companies },
        { location: 'Database', type: 'Invite', count: invites }
      )
      
      console.log(`✅ Database - TestResult: ${testResults}`)
      console.log(`✅ Database - TestSession: ${testSessions}`)
      console.log(`✅ Database - Answer: ${answers}`)
      console.log(`✅ Database - AIAnalysis: ${aiAnalyses}`)
      console.log(`✅ Database - User: ${users}`)
      console.log(`✅ Database - Company: ${companies}`)
      console.log(`✅ Database - Invite: ${invites}`)
      
    } catch (error) {
      console.error('❌ Erro ao verificar banco de dados:', error)
      this.results.push({ location: 'Database', type: 'Error', count: 0, details: error })
    }
  }

  // Verificar arquivos JSON
  async checkJSONArchives() {
    console.log('\n🔍 Verificando arquivos JSON...')
    
    const archivesPath = path.join(process.cwd(), 'archives', 'results')
    
    try {
      if (fs.existsSync(archivesPath)) {
        const jsonFiles = await this.countFilesRecursively(archivesPath, '.json')
        this.results.push({ location: 'JSON Archives', type: 'JSON Files', count: jsonFiles.count, details: jsonFiles.details })
        console.log(`✅ JSON Archives: ${jsonFiles.count} arquivos encontrados`)
        
        // Detalhar por subdiretórios
        for (const [dir, count] of Object.entries(jsonFiles.details)) {
          console.log(`   📁 ${dir}: ${count} arquivos`)
        }
      } else {
        console.log('⚠️ Diretório de arquivos JSON não encontrado')
        this.results.push({ location: 'JSON Archives', type: 'Directory', count: 0, details: 'Directory not found' })
      }
    } catch (error) {
      console.error('❌ Erro ao verificar arquivos JSON:', error)
      this.results.push({ location: 'JSON Archives', type: 'Error', count: 0, details: error })
    }
  }

  // Verificar cache Redis
  async checkRedisCache() {
    console.log('\n🔍 Verificando cache Redis...')
    
    try {
      // Verificar se há configuração Redis
      const redisConfigPath = path.join(process.cwd(), 'lib', 'redis', 'config.ts')
      
      if (fs.existsSync(redisConfigPath)) {
        console.log('✅ Configuração Redis encontrada')
        this.results.push({ location: 'Redis', type: 'Config', count: 1, details: 'Redis config exists' })
        
        // Nota: Para verificar chaves Redis reais, seria necessário conectar ao Redis
        console.log('ℹ️ Para verificar chaves Redis ativas, seria necessário conectar ao servidor Redis')
      } else {
        console.log('⚠️ Configuração Redis não encontrada')
        this.results.push({ location: 'Redis', type: 'Config', count: 0, details: 'No Redis config' })
      }
    } catch (error) {
      console.error('❌ Erro ao verificar Redis:', error)
      this.results.push({ location: 'Redis', type: 'Error', count: 0, details: error })
    }
  }

  // Verificar arquivos de backup
  async checkBackupFiles() {
    console.log('\n🔍 Verificando arquivos de backup...')
    
    const backupPaths = [
      path.join(process.cwd(), 'backups'),
      path.join(process.cwd(), 'lib', 'backup'),
      path.join(process.cwd(), '.backup')
    ]
    
    let totalBackups = 0
    
    for (const backupPath of backupPaths) {
      try {
        if (fs.existsSync(backupPath)) {
          const backupFiles = await this.countFilesRecursively(backupPath)
          totalBackups += backupFiles.count
          console.log(`✅ Backup em ${backupPath}: ${backupFiles.count} arquivos`)
          this.results.push({ location: 'Backup', type: path.basename(backupPath), count: backupFiles.count, details: backupFiles.details })
        }
      } catch (error) {
        console.error(`❌ Erro ao verificar backup em ${backupPath}:`, error)
      }
    }
    
    if (totalBackups === 0) {
      console.log('⚠️ Nenhum arquivo de backup encontrado')
      this.results.push({ location: 'Backup', type: 'Files', count: 0, details: 'No backup files found' })
    }
  }

  // Verificar logs do sistema
  async checkLogFiles() {
    console.log('\n🔍 Verificando logs do sistema...')
    
    const logPaths = [
      path.join(process.cwd(), 'logs'),
      path.join(process.cwd(), '.logs'),
      path.join(process.cwd(), 'lib', 'utils', 'logger.ts')
    ]
    
    let totalLogs = 0
    
    for (const logPath of logPaths) {
      try {
        if (fs.existsSync(logPath)) {
          if (fs.statSync(logPath).isDirectory()) {
            const logFiles = await this.countFilesRecursively(logPath, '.log')
            totalLogs += logFiles.count
            console.log(`✅ Logs em ${logPath}: ${logFiles.count} arquivos`)
            this.results.push({ location: 'Logs', type: path.basename(logPath), count: logFiles.count, details: logFiles.details })
          } else {
            console.log(`✅ Arquivo de log encontrado: ${logPath}`)
            this.results.push({ location: 'Logs', type: 'Logger Config', count: 1, details: logPath })
          }
        }
      } catch (error) {
        console.error(`❌ Erro ao verificar logs em ${logPath}:`, error)
      }
    }
    
    if (totalLogs === 0) {
      console.log('⚠️ Nenhum arquivo de log encontrado')
      this.results.push({ location: 'Logs', type: 'Files', count: 0, details: 'No log files found' })
    }
  }

  // Verificar arquivos temporários
  async checkTempFiles() {
    console.log('\n🔍 Verificando arquivos temporários...')
    
    const tempPaths = [
      path.join(process.cwd(), 'temp'),
      path.join(process.cwd(), 'tmp'),
      path.join(process.cwd(), '.temp'),
      path.join(process.cwd(), 'uploads')
    ]
    
    let totalTemp = 0
    
    for (const tempPath of tempPaths) {
      try {
        if (fs.existsSync(tempPath)) {
          const tempFiles = await this.countFilesRecursively(tempPath)
          totalTemp += tempFiles.count
          console.log(`✅ Arquivos temporários em ${tempPath}: ${tempFiles.count} arquivos`)
          this.results.push({ location: 'Temp', type: path.basename(tempPath), count: tempFiles.count, details: tempFiles.details })
        }
      } catch (error) {
        console.error(`❌ Erro ao verificar arquivos temporários em ${tempPath}:`, error)
      }
    }
    
    if (totalTemp === 0) {
      console.log('⚠️ Nenhum arquivo temporário encontrado')
      this.results.push({ location: 'Temp', type: 'Files', count: 0, details: 'No temp files found' })
    }
  }

  // Verificar outros locais possíveis
  async checkOtherLocations() {
    console.log('\n🔍 Verificando outros locais...')
    
    const otherPaths = [
      { path: path.join(process.cwd(), 'public'), name: 'Public' },
      { path: path.join(process.cwd(), 'data'), name: 'Data' },
      { path: path.join(process.cwd(), 'storage'), name: 'Storage' },
      { path: path.join(process.cwd(), 'cache'), name: 'Cache' },
      { path: path.join(process.cwd(), 'queue'), name: 'Queue' }
    ]
    
    for (const location of otherPaths) {
      try {
        if (fs.existsSync(location.path)) {
          const files = await this.countFilesRecursively(location.path)
          console.log(`✅ ${location.name}: ${files.count} arquivos`)
          this.results.push({ location: 'Other', type: location.name, count: files.count, details: files.details })
        }
      } catch (error) {
        console.error(`❌ Erro ao verificar ${location.name}:`, error)
      }
    }
  }

  // Função auxiliar para contar arquivos recursivamente
  async countFilesRecursively(dirPath: string, extension?: string): Promise<{ count: number, details: Record<string, number> }> {
    const details: Record<string, number> = {}
    let totalCount = 0

    async function countInDir(currentPath: string, relativePath: string = '') {
      try {
        const items = await readdir(currentPath)
        let dirCount = 0

        for (const item of items) {
          const fullPath = path.join(currentPath, item)
          const itemStat = await stat(fullPath)

          if (itemStat.isDirectory()) {
            await countInDir(fullPath, path.join(relativePath, item))
          } else if (itemStat.isFile()) {
            if (!extension || item.endsWith(extension)) {
              dirCount++
              totalCount++
            }
          }
        }

        if (dirCount > 0) {
          details[relativePath || 'root'] = dirCount
        }
      } catch (error) {
        console.error(`Erro ao ler diretório ${currentPath}:`, error)
      }
    }

    await countInDir(dirPath)
    return { count: totalCount, details }
  }

  // Gerar relatório final
  generateReport() {
    console.log('\n📊 RELATÓRIO FINAL - RESULTADOS ARMAZENADOS NO PROJETO')
    console.log('=' .repeat(60))
    
    // Agrupar por localização
    const groupedResults = this.results.reduce((acc, result) => {
      if (!acc[result.location]) {
        acc[result.location] = []
      }
      acc[result.location].push(result)
      return acc
    }, {} as Record<string, ResultCount[]>)
    
    let grandTotal = 0
    
    for (const [location, results] of Object.entries(groupedResults)) {
      console.log(`\n📍 ${location.toUpperCase()}:`)
      let locationTotal = 0
      
      for (const result of results) {
        console.log(`   ${result.type}: ${result.count}`)
        locationTotal += result.count
        grandTotal += result.count
      }
      
      console.log(`   Subtotal ${location}: ${locationTotal}`)
    }
    
    console.log('\n' + '='.repeat(60))
    console.log(`🎯 TOTAL GERAL: ${grandTotal} itens encontrados`)
    console.log('='.repeat(60))
    
    // Salvar relatório em arquivo
    const reportPath = path.join(process.cwd(), 'relatorio-resultados-projeto.json')
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        totalItems: grandTotal,
        locations: Object.keys(groupedResults).length,
        details: groupedResults
      },
      rawResults: this.results
    }, null, 2))
    
    console.log(`\n💾 Relatório detalhado salvo em: ${reportPath}`)
    
    return {
      totalItems: grandTotal,
      locations: Object.keys(groupedResults).length,
      details: groupedResults
    }
  }

  // Executar todas as verificações
  async runAllChecks() {
    console.log('🚀 Iniciando verificação completa de resultados no projeto...')
    console.log('Timestamp:', new Date().toISOString())
    
    await this.checkDatabase()
    await this.checkJSONArchives()
    await this.checkRedisCache()
    await this.checkBackupFiles()
    await this.checkLogFiles()
    await this.checkTempFiles()
    await this.checkOtherLocations()
    
    return this.generateReport()
  }
}

// Executar verificação
async function main() {
  const checker = new ProjectResultsChecker()
  
  try {
    const summary = await checker.runAllChecks()
    
    console.log('\n✅ Verificação concluída com sucesso!')
    console.log(`Total de itens encontrados: ${summary.totalItems}`)
    console.log(`Localizações verificadas: ${summary.locations}`)
    
  } catch (error) {
    console.error('❌ Erro durante a verificação:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main()
}

export { ProjectResultsChecker }