const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { notificationSystem } = require('./notification-system');

const prisma = new PrismaClient();

class TestResultMonitor {
  constructor() {
    this.isMonitoring = false;
    this.lastCounts = {
      testResults: 0,
      testSessions: 0,
      answers: 0,
      aiAnalysis: 0
    };
    this.logFile = path.join(__dirname, 'monitoring-log.txt');
    this.resultsDir = path.join(__dirname, 'archives', 'results');
    this.startTime = new Date();
    this.notifications = notificationSystem;
    
    // Inicializar arquivo de log
    this.log('=== SISTEMA DE MONITORAMENTO INICIADO ===');
    this.log(`Horário de início: ${this.startTime.toLocaleString('pt-BR')}`);
    this.log('Aguardando teste HumaniQ Flex...');
  }

  log(message) {
    const timestamp = new Date().toLocaleString('pt-BR');
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    
    // Salvar no arquivo de log
    fs.appendFileSync(this.logFile, logEntry + '\n');
  }

  async getCurrentCounts() {
    try {
      const [testResults, testSessions, answers, aiAnalysis] = await Promise.all([
        prisma.testResult.count(),
        prisma.testSession.count(),
        prisma.answer.count(),
        prisma.aIAnalysis.count()
      ]);

      return {
        testResults,
        testSessions,
        answers,
        aiAnalysis
      };
    } catch (error) {
      this.log(`ERRO ao consultar banco de dados: ${error.message}`);
      return null;
    }
  }

  async checkForNewResults() {
    const currentCounts = await this.getCurrentCounts();
    
    if (!currentCounts) return;

    let hasNewData = false;
    const changes = [];

    // Verificar mudanças em cada tabela
    Object.keys(currentCounts).forEach(table => {
      const current = currentCounts[table];
      const previous = this.lastCounts[table];
      
      if (current > previous) {
        const newRecords = current - previous;
        changes.push(`${table}: +${newRecords} (${previous} → ${current})`);
        hasNewData = true;
      }
    });

    if (hasNewData) {
      this.log('🚨 NOVOS RESULTADOS DETECTADOS NO BANCO DE DADOS!');
      changes.forEach(change => this.log(`  - ${change}`));
      
      // Enviar notificações específicas para cada mudança
      Object.keys(currentCounts).forEach(table => {
        const current = currentCounts[table];
        const previous = this.lastCounts[table];
        
        if (current > previous) {
          const difference = current - previous;
          this.notifications.notifyDatabaseChange(
            table,
            'INSERT/UPDATE',
            { 
              previousCount: previous,
              currentCount: current,
              difference: difference
            }
          );
        }
      });
      
      // Notificação geral de mudanças
      this.notifications.notify(
        'success',
        '🚨 Mudanças Detectadas!',
        `${changes.length} mudança(s) encontrada(s)`,
        { changesCount: changes.length, timestamp: new Date().toISOString() }
      );
      
      // Buscar detalhes dos novos registros
      await this.getLatestRecordDetails();
      
      this.lastCounts = currentCounts;
    }
  }

  async getLatestRecordDetails() {
    try {
      // Buscar o último TestResult
      const latestTestResult = await prisma.testResult.findFirst({
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          testSession: true
        }
      });

      if (latestTestResult) {
        this.log('📊 DETALHES DO ÚLTIMO RESULTADO:');
        this.log(`  - ID: ${latestTestResult.id}`);
        this.log(`  - Usuário: ${latestTestResult.user?.name || 'N/A'}`);
        this.log(`  - Tipo de Teste: ${latestTestResult.testType}`);
        this.log(`  - Status: ${latestTestResult.status}`);
        this.log(`  - Criado em: ${latestTestResult.createdAt.toLocaleString('pt-BR')}`);
        this.log(`  - Sessão ID: ${latestTestResult.testSessionId}`);
      }

      // Buscar a última sessão
      const latestSession = await prisma.testSession.findFirst({
        orderBy: { createdAt: 'desc' },
        include: {
          user: true
        }
      });

      if (latestSession) {
        this.log('🎯 DETALHES DA ÚLTIMA SESSÃO:');
        this.log(`  - ID: ${latestSession.id}`);
        this.log(`  - Usuário: ${latestSession.user?.name || 'N/A'}`);
        this.log(`  - Status: ${latestSession.status}`);
        this.log(`  - Iniciada em: ${latestSession.createdAt.toLocaleString('pt-BR')}`);
        this.log(`  - Atualizada em: ${latestSession.updatedAt.toLocaleString('pt-BR')}`);
      }

    } catch (error) {
      this.log(`ERRO ao buscar detalhes: ${error.message}`);
    }
  }

  startFileMonitoring() {
    this.log('📁 Iniciando monitoramento de arquivos JSON...');
    
    // Criar diretório se não existir
    if (!fs.existsSync(this.resultsDir)) {
      fs.mkdirSync(this.resultsDir, { recursive: true });
    }

    // Monitorar mudanças no diretório
    const watcher = chokidar.watch(this.resultsDir, {
      ignored: /^\./,
      persistent: true,
      ignoreInitial: true
    });

    watcher.on('add', (filePath) => {
      this.log(`🆕 NOVO ARQUIVO JSON DETECTADO: ${path.relative(__dirname, filePath)}`);
      this.analyzeJsonFile(filePath);
    });

    watcher.on('change', (filePath) => {
      this.log(`📝 ARQUIVO JSON MODIFICADO: ${path.relative(__dirname, filePath)}`);
      this.analyzeJsonFile(filePath);
    });

    this.log(`Monitorando diretório: ${this.resultsDir}`);
  }

  analyzeJsonFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      this.log('📄 ANÁLISE DO ARQUIVO JSON:');
      this.log(`  - Tamanho: ${content.length} caracteres`);
      this.log(`  - Tipo: ${data.testType || 'N/A'}`);
      this.log(`  - ID: ${data.id || 'N/A'}`);
      this.log(`  - Usuário: ${data.userId || 'N/A'}`);
      this.log(`  - Timestamp: ${data.createdAt || data.timestamp || 'N/A'}`);
      
      if (data.results) {
        this.log(`  - Número de respostas: ${Object.keys(data.results).length}`);
      }
      
    } catch (error) {
      this.log(`ERRO ao analisar arquivo JSON: ${error.message}`);
    }
  }

  async start() {
    if (this.isMonitoring) {
      this.log('Monitoramento já está ativo!');
      return;
    }

    this.isMonitoring = true;
    
    // Iniciar sistema de notificações
    this.notifications.start();
    
    this.log('🔍 Iniciando monitoramento contínuo...');
    
    // Obter contagem inicial
    this.lastCounts = await this.getCurrentCounts() || this.lastCounts;
    this.log(`Contagem inicial: TestResults=${this.lastCounts.testResults}, Sessions=${this.lastCounts.testSessions}, Answers=${this.lastCounts.answers}, AIAnalysis=${this.lastCounts.aiAnalysis}`);
    
    this.notifications.notify('system', '🚀 Monitoramento Iniciado', 'Verificando a cada 2000ms', { intervalMs: 2000 });
    
    // Iniciar monitoramento de arquivos
    this.startFileMonitoring();
    
    // Verificar banco de dados a cada 2 segundos
    const interval = setInterval(async () => {
      if (!this.isMonitoring) {
        clearInterval(interval);
        return;
      }
      
      await this.checkForNewResults();
    }, 2000);

    this.log('✅ Sistema de monitoramento ativo!');
    this.log('Aguardando o teste HumaniQ Flex...');
  }

  stop() {
    this.isMonitoring = false;
    
    // Parar sistema de notificações
    this.notifications.stop();
    
    this.log('🛑 Monitoramento interrompido.');
    this.notifications.notify('system', '🛑 Monitoramento Parado', 'Sistema de monitoramento foi interrompido');
  }

  getStatus() {
    const uptime = Math.floor((new Date() - this.startTime) / 1000);
    return {
      isMonitoring: this.isMonitoring,
      uptime: `${uptime}s`,
      lastCounts: this.lastCounts,
      logFile: this.logFile
    };
  }
}

// Inicializar e executar o monitor
const monitor = new TestResultMonitor();

// Capturar sinais para parar graciosamente
process.on('SIGINT', () => {
  monitor.log('Recebido sinal de interrupção...');
  monitor.stop();
  process.exit(0);
});

// Iniciar monitoramento
monitor.start().catch(error => {
  console.error('Erro ao iniciar monitoramento:', error);
  process.exit(1);
});

// Exportar para uso em outros módulos
module.exports = TestResultMonitor;