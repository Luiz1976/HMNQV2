// HumaniQ AI - Inicialização do Sistema de Backup
// Configuração e inicialização automática do sistema de backup

import { startBackupScheduler } from './backup-scheduler'

// Flag para evitar múltiplas inicializações
let backupInitialized = false

/**
 * Inicializa o sistema de backup de forma segura
 * Evita múltiplas inicializações e trata erros graciosamente
 */
export function initializeBackupSystem(): void {
  // Evitar múltiplas inicializações
  if (backupInitialized) {
    console.log('[BACKUP-INIT] Sistema de backup já foi inicializado')
    return
  }

  try {
    console.log('[BACKUP-INIT] Inicializando sistema de backup...')
    
    // Verificar se estamos no ambiente servidor
    if (typeof window !== 'undefined') {
      console.log('[BACKUP-INIT] Executando no cliente - backup não será inicializado')
      return
    }

    // Aguardar um pouco para garantir que o banco esteja pronto
    setTimeout(() => {
      try {
        // Inicializar o agendador de backup apenas em produção
        if (process.env.NODE_ENV === 'production') {
          startBackupScheduler()
          console.log('[BACKUP-INIT] Agendador de backup iniciado em produção')
        } else {
          console.log('[BACKUP-INIT] Agendador de backup desabilitado em desenvolvimento')
        }
        
        backupInitialized = true
        console.log('[BACKUP-INIT] Sistema de backup inicializado com sucesso')
        
      } catch (error) {
        console.error('[BACKUP-INIT] Erro ao inicializar agendador de backup:', error)
      }
    }, 5000) // 5 segundos de delay
    
  } catch (error) {
    console.error('[BACKUP-INIT] Erro na inicialização do sistema de backup:', error)
  }
}

/**
 * Verifica se o sistema de backup foi inicializado
 */
export function isBackupSystemInitialized(): boolean {
  return backupInitialized
}

/**
 * Força a reinicialização do sistema de backup
 * Use apenas em casos especiais
 */
export function forceReinitializeBackupSystem(): void {
  console.log('[BACKUP-INIT] Forçando reinicialização do sistema de backup')
  backupInitialized = false
  initializeBackupSystem()
}

// Auto-inicialização quando o módulo for carregado
if (process.env.NODE_ENV === 'production') {
  // Aguardar um pouco antes de inicializar para garantir que tudo esteja pronto
  setTimeout(() => {
    initializeBackupSystem()
  }, 10000) // 10 segundos
}

// Register cleanup with process manager
import { registerCleanup } from './process-manager'

// Cleanup function for backup system
const backupCleanup = () => {
  console.log('[BACKUP-INIT] Sistema de backup sendo finalizado')
  // Adicionar lógica de cleanup específica do backup se necessário
}

registerCleanup(backupCleanup)

export default {
  initialize: initializeBackupSystem,
  isInitialized: isBackupSystemInitialized,
  forceReinitialize: forceReinitializeBackupSystem
}