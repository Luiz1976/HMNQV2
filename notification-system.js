// Sistema de Notificações em Tempo Real para Monitoramento de Resultados
const fs = require('fs')
const path = require('path')
const { EventEmitter } = require('events')

class NotificationSystem extends EventEmitter {
  constructor() {
    super()
    this.isActive = false
    this.lastNotificationTime = Date.now()
    this.notificationHistory = []
    this.soundEnabled = true
    
    // Configurações de notificação
    this.config = {
      minInterval: 1000, // Mínimo 1 segundo entre notificações
      maxHistorySize: 50,
      enableSound: true,
      enableDesktop: true,
      enableConsole: true
    }
  }

  // Iniciar sistema de notificações
  start() {
    this.isActive = true
    console.log('🔔 Sistema de Notificações ATIVADO')
    this.logNotification('Sistema de notificações iniciado', 'system')
  }

  // Parar sistema de notificações
  stop() {
    this.isActive = false
    console.log('🔕 Sistema de Notificações DESATIVADO')
  }

  // Enviar notificação
  notify(type, title, message, data = {}) {
    if (!this.isActive) return

    const now = Date.now()
    if (now - this.lastNotificationTime < this.config.minInterval) {
      return // Evitar spam de notificações
    }

    const notification = {
      id: `notif_${now}`,
      type,
      title,
      message,
      data,
      timestamp: new Date().toLocaleString('pt-BR'),
      timestampMs: now
    }

    // Adicionar ao histórico
    this.addToHistory(notification)

    // Enviar notificações em diferentes canais
    if (this.config.enableConsole) {
      this.sendConsoleNotification(notification)
    }

    if (this.config.enableDesktop) {
      this.sendDesktopNotification(notification)
    }

    if (this.config.enableSound) {
      this.playNotificationSound(type)
    }

    // Emitir evento para o dashboard
    this.emit('notification', notification)

    // Salvar em arquivo para o dashboard web
    this.saveNotificationForDashboard(notification)

    this.lastNotificationTime = now
  }

  // Notificação no console com cores
  sendConsoleNotification(notification) {
    const colors = {
      database: '\x1b[36m', // Ciano
      json: '\x1b[33m',     // Amarelo
      error: '\x1b[31m',    // Vermelho
      success: '\x1b[32m',  // Verde
      system: '\x1b[35m',   // Magenta
      reset: '\x1b[0m'
    }

    const color = colors[notification.type] || colors.system
    const icon = this.getNotificationIcon(notification.type)
    
    console.log(`\n${color}${icon} [${notification.timestamp}] ${notification.title}${colors.reset}`)
    console.log(`${color}   ${notification.message}${colors.reset}`)
    
    if (Object.keys(notification.data).length > 0) {
      console.log(`${color}   Dados:${colors.reset}`, notification.data)
    }
    console.log('') // Linha em branco
  }

  // Notificação desktop (simulada)
  sendDesktopNotification(notification) {
    // Em um ambiente real, usaria bibliotecas como node-notifier
    // Por agora, simularemos com log especial
    const desktopMsg = `🖥️  DESKTOP: ${notification.title} - ${notification.message}`
    console.log(desktopMsg)
  }

  // Som de notificação (simulado)
  playNotificationSound(type) {
    const sounds = {
      database: '🔊 BEEP-BEEP (Database)',
      json: '🔊 DING-DONG (JSON)',
      error: '🔊 BUZZ-BUZZ (Error)',
      success: '🔊 TING-TING (Success)',
      system: '🔊 CLICK (System)'
    }
    
    console.log(sounds[type] || sounds.system)
  }

  // Ícones para diferentes tipos
  getNotificationIcon(type) {
    const icons = {
      database: '🗄️',
      json: '📄',
      error: '❌',
      success: '✅',
      system: '⚙️'
    }
    
    return icons[type] || '🔔'
  }

  // Adicionar ao histórico
  addToHistory(notification) {
    this.notificationHistory.unshift(notification)
    
    // Manter apenas as últimas N notificações
    if (this.notificationHistory.length > this.config.maxHistorySize) {
      this.notificationHistory = this.notificationHistory.slice(0, this.config.maxHistorySize)
    }
  }

  // Salvar notificação para o dashboard web
  saveNotificationForDashboard(notification) {
    try {
      const notificationsFile = path.join(process.cwd(), 'dashboard-notifications.json')
      
      let notifications = []
      if (fs.existsSync(notificationsFile)) {
        const content = fs.readFileSync(notificationsFile, 'utf8')
        notifications = JSON.parse(content)
      }
      
      notifications.unshift(notification)
      
      // Manter apenas as últimas 20 notificações no arquivo
      if (notifications.length > 20) {
        notifications = notifications.slice(0, 20)
      }
      
      fs.writeFileSync(notificationsFile, JSON.stringify(notifications, null, 2))
    } catch (error) {
      console.error('Erro ao salvar notificação para dashboard:', error)
    }
  }

  // Log de notificação interna
  logNotification(message, type = 'system') {
    const timestamp = new Date().toLocaleString('pt-BR')
    const logEntry = `[${timestamp}] 🔔 NOTIFICATION: ${message}\n`
    
    try {
      const logFile = path.join(process.cwd(), 'notifications-log.txt')
      fs.appendFileSync(logFile, logEntry)
    } catch (error) {
      console.error('Erro ao escrever log de notificação:', error)
    }
  }

  // Obter histórico de notificações
  getHistory(limit = 10) {
    return this.notificationHistory.slice(0, limit)
  }

  // Limpar histórico
  clearHistory() {
    this.notificationHistory = []
    this.logNotification('Histórico de notificações limpo')
  }

  // Configurar sistema
  configure(newConfig) {
    this.config = { ...this.config, ...newConfig }
    this.logNotification(`Configuração atualizada: ${JSON.stringify(newConfig)}`)
  }

  // Métodos específicos para diferentes tipos de eventos
  notifyDatabaseChange(table, action, data) {
    this.notify(
      'database',
      `🗄️ Mudança no Banco de Dados`,
      `Tabela ${table}: ${action}`,
      { table, action, ...data }
    )
  }

  notifyJsonArchive(filename, data) {
    this.notify(
      'json',
      `📄 Novo Arquivo JSON`,
      `Arquivo criado: ${filename}`,
      { filename, ...data }
    )
  }

  notifyTestResult(resultId, testType, location) {
    this.notify(
      'success',
      `🎯 Novo Resultado de Teste!`,
      `Teste ${testType} (ID: ${resultId}) salvo em ${location}`,
      { resultId, testType, location }
    )
  }

  notifyError(error, context) {
    this.notify(
      'error',
      `❌ Erro Detectado`,
      `${error}`,
      { context, timestamp: new Date().toISOString() }
    )
  }

  // Status do sistema
  getStatus() {
    return {
      active: this.isActive,
      totalNotifications: this.notificationHistory.length,
      lastNotification: this.notificationHistory[0] || null,
      config: this.config
    }
  }
}

// Instância global do sistema de notificações
const notificationSystem = new NotificationSystem()

// Exportar para uso em outros módulos
module.exports = {
  NotificationSystem,
  notificationSystem
}

// Se executado diretamente, iniciar sistema de teste
if (require.main === module) {
  console.log('🧪 Testando Sistema de Notificações...')
  
  notificationSystem.start()
  
  // Teste de diferentes tipos de notificação
  setTimeout(() => {
    notificationSystem.notifyDatabaseChange('TestResult', 'INSERT', { id: 'test-123' })
  }, 1000)
  
  setTimeout(() => {
    notificationSystem.notifyJsonArchive('result-2025-01-17.json', { size: '2.5KB' })
  }, 2000)
  
  setTimeout(() => {
    notificationSystem.notifyTestResult('result-456', 'HumaniQ Flex', 'SQLite + JSON')
  }, 3000)
  
  setTimeout(() => {
    notificationSystem.notifyError('Conexão perdida', 'Database monitoring')
  }, 4000)
  
  setTimeout(() => {
    console.log('\n📊 Status do Sistema:')
    console.log(notificationSystem.getStatus())
    
    console.log('\n📜 Histórico (últimas 3):')
    console.log(notificationSystem.getHistory(3))
    
    notificationSystem.stop()
  }, 5000)
}