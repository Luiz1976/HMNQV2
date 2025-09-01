import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const prisma = new PrismaClient();

interface ResultCount {
  location: string;
  count: number;
  details?: any;
  error?: string;
}

class TestResultCounter {
  private results: ResultCount[] = [];

  async countDatabaseResults(): Promise<void> {
    console.log('🔍 Contando resultados no banco de dados SQLite...');
    
    try {
      // Contar TestResults
      const testResultsCount = await prisma.testResult.count();
      this.results.push({
        location: 'Banco SQLite - TestResult',
        count: testResultsCount,
        details: { table: 'TestResult' }
      });

      // Contar TestSessions
      const testSessionsCount = await prisma.testSession.count();
      this.results.push({
        location: 'Banco SQLite - TestSession',
        count: testSessionsCount,
        details: { table: 'TestSession' }
      });

      // Contar Answers
      const answersCount = await prisma.answer.count();
      this.results.push({
        location: 'Banco SQLite - Answer',
        count: answersCount,
        details: { table: 'Answer' }
      });

      // Contar AIAnalysis
      const aiAnalysisCount = await prisma.aIAnalysis.count();
      this.results.push({
        location: 'Banco SQLite - AIAnalysis',
        count: aiAnalysisCount,
        details: { table: 'AIAnalysis' }
      });

      console.log('✅ Contagem do banco de dados concluída');
    } catch (error) {
      console.error('❌ Erro ao contar no banco de dados:', error);
      this.results.push({
        location: 'Banco SQLite',
        count: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  async countJSONArchives(): Promise<void> {
    console.log('🔍 Contando arquivos JSON nos arquivos...');
    
    try {
      const archivesPath = path.join(process.cwd(), 'archives', 'results');
      
      if (!fs.existsSync(archivesPath)) {
        this.results.push({
          location: 'Arquivos JSON',
          count: 0,
          details: { message: 'Diretório de arquivos não encontrado' }
        });
        return;
      }

      let totalJsonFiles = 0;
      const yearDirs = fs.readdirSync(archivesPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      const details: any = {};

      for (const year of yearDirs) {
        const yearPath = path.join(archivesPath, year);
        const monthDirs = fs.readdirSync(yearPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        details[year] = {};

        for (const month of monthDirs) {
          const monthPath = path.join(yearPath, month);
          const testTypeDirs = fs.readdirSync(monthPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

          details[year][month] = {};

          for (const testType of testTypeDirs) {
            const testTypePath = path.join(monthPath, testType);
            const jsonFiles = fs.readdirSync(testTypePath)
              .filter(file => file.endsWith('.json'));
            
            details[year][month][testType] = jsonFiles.length;
            totalJsonFiles += jsonFiles.length;
          }
        }
      }

      this.results.push({
        location: 'Arquivos JSON',
        count: totalJsonFiles,
        details
      });

      console.log('✅ Contagem de arquivos JSON concluída');
    } catch (error) {
      console.error('❌ Erro ao contar arquivos JSON:', error);
      this.results.push({
        location: 'Arquivos JSON',
        count: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  async countRedisCache(): Promise<void> {
    console.log('🔍 Contando chaves no cache Redis...');
    
    let redisClient;
    try {
      // Tentar conectar ao Redis usando ioredis
      redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
      
      // Buscar chaves relacionadas a resultados
      const resultKeys = await redisClient.keys('*result*');
      const testKeys = await redisClient.keys('*test*');
      const analysisKeys = await redisClient.keys('*analysis*');
      const cacheKeys = await redisClient.keys('cache:*');
      
      const allKeys = [...new Set([...resultKeys, ...testKeys, ...analysisKeys, ...cacheKeys])];
      
      this.results.push({
        location: 'Cache Redis',
        count: allKeys.length,
        details: {
          resultKeys: resultKeys.length,
          testKeys: testKeys.length,
          analysisKeys: analysisKeys.length,
          cacheKeys: cacheKeys.length,
          totalUniqueKeys: allKeys.length
        }
      });

      console.log('✅ Contagem do Redis concluída');
    } catch (error) {
      console.error('❌ Erro ao conectar/contar no Redis:', error);
      this.results.push({
        location: 'Cache Redis',
        count: 0,
        error: error instanceof Error ? error.message : 'Erro de conexão Redis'
      });
    } finally {
      if (redisClient) {
        redisClient.disconnect();
      }
    }
  }

  async countBackupFiles(): Promise<void> {
    console.log('🔍 Contando arquivos de backup...');
    
    try {
      const backupPaths = [
        path.join(process.cwd(), 'backups'),
        path.join(process.cwd(), 'data', 'backups'),
        path.join(process.cwd(), 'storage', 'backups')
      ];

      let totalBackups = 0;
      const details: any = {};

      for (const backupPath of backupPaths) {
        if (fs.existsSync(backupPath)) {
          const files = fs.readdirSync(backupPath)
            .filter(file => file.includes('result') || file.includes('test'));
          
          details[path.basename(backupPath)] = files.length;
          totalBackups += files.length;
        }
      }

      this.results.push({
        location: 'Arquivos de Backup',
        count: totalBackups,
        details
      });

      console.log('✅ Contagem de backups concluída');
    } catch (error) {
      console.error('❌ Erro ao contar backups:', error);
      this.results.push({
        location: 'Arquivos de Backup',
        count: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  async countQueueJobs(): Promise<void> {
    console.log('🔍 Verificando filas de processamento...');
    
    try {
      // Verificar se existem arquivos de fila ou jobs pendentes
      const queuePaths = [
        path.join(process.cwd(), 'queue'),
        path.join(process.cwd(), 'jobs'),
        path.join(process.cwd(), 'lib', 'queue')
      ];

      let totalJobs = 0;
      const details: any = {};

      for (const queuePath of queuePaths) {
        if (fs.existsSync(queuePath)) {
          const files = fs.readdirSync(queuePath, { recursive: true })
            .filter(file => typeof file === 'string' && (file.includes('job') || file.includes('queue')));
          
          details[path.basename(queuePath)] = files.length;
          totalJobs += files.length;
        }
      }

      this.results.push({
        location: 'Filas de Processamento',
        count: totalJobs,
        details
      });

      console.log('✅ Contagem de filas concluída');
    } catch (error) {
      console.error('❌ Erro ao contar filas:', error);
      this.results.push({
        location: 'Filas de Processamento',
        count: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  async countLogEntries(): Promise<void> {
    console.log('🔍 Analisando logs...');
    
    try {
      const logPaths = [
        path.join(process.cwd(), 'logs'),
        path.join(process.cwd(), 'storage', 'logs'),
        path.join(process.cwd(), '.next', 'logs')
      ];

      let totalLogEntries = 0;
      const details: any = {};

      for (const logPath of logPaths) {
        if (fs.existsSync(logPath)) {
          const logFiles = fs.readdirSync(logPath)
            .filter(file => file.endsWith('.log') || file.endsWith('.txt'));
          
          let pathEntries = 0;
          for (const logFile of logFiles) {
            const logContent = fs.readFileSync(path.join(logPath, logFile), 'utf-8');
            const resultEntries = (logContent.match(/result|test|analysis/gi) || []).length;
            pathEntries += resultEntries;
          }
          
          details[path.basename(logPath)] = pathEntries;
          totalLogEntries += pathEntries;
        }
      }

      this.results.push({
        location: 'Entradas de Log',
        count: totalLogEntries,
        details
      });

      console.log('✅ Contagem de logs concluída');
    } catch (error) {
      console.error('❌ Erro ao contar logs:', error);
      this.results.push({
        location: 'Entradas de Log',
        count: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  generateReport(): void {
    console.log('\n' + '='.repeat(80));
    console.log('📊 RELATÓRIO DE CONTAGEM DE RESULTADOS DE TESTES');
    console.log('='.repeat(80));
    
    let totalResults = 0;
    
    this.results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.location}`);
      console.log(`   Quantidade: ${result.count.toLocaleString()}`);
      
      if (result.error) {
        console.log(`   ❌ Erro: ${result.error}`);
      } else {
        totalResults += result.count;
        if (result.details) {
          console.log(`   Detalhes: ${JSON.stringify(result.details, null, 2).substring(0, 200)}...`);
        }
      }
    });
    
    console.log('\n' + '-'.repeat(80));
    console.log(`📈 TOTAL GERAL: ${totalResults.toLocaleString()} resultados encontrados`);
    console.log('-'.repeat(80));
    
    // Salvar relatório em arquivo
    const reportData = {
      timestamp: new Date().toISOString(),
      totalResults,
      results: this.results
    };
    
    fs.writeFileSync(
      path.join(process.cwd(), 'test-results-count-report.json'),
      JSON.stringify(reportData, null, 2)
    );
    
    console.log('\n💾 Relatório salvo em: test-results-count-report.json');
  }

  async runFullCount(): Promise<void> {
    console.log('🚀 Iniciando contagem completa de resultados de testes...');
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    await this.countDatabaseResults();
    await this.countJSONArchives();
    await this.countRedisCache();
    await this.countBackupFiles();
    await this.countQueueJobs();
    await this.countLogEntries();
    
    this.generateReport();
    
    await prisma.$disconnect();
    console.log('\n✅ Contagem completa finalizada!');
  }
}

// Executar o script
if (require.main === module) {
  const counter = new TestResultCounter();
  counter.runFullCount().catch(console.error);
}

export default TestResultCounter;