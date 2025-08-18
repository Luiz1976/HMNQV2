// HumaniQ AI - Process Event Manager
// Gerenciador centralizado de eventos do processo para evitar MaxListenersExceededWarning

type CleanupFunction = () => Promise<void> | void

class ProcessManager {
  private cleanupFunctions: Set<CleanupFunction> = new Set()
  private listenersRegistered = false

  /**
   * Registra uma função de cleanup que será executada no shutdown
   */
  public registerCleanup(cleanupFn: CleanupFunction): void {
    this.cleanupFunctions.add(cleanupFn)
    this.ensureListenersRegistered()
  }

  /**
   * Remove uma função de cleanup
   */
  public unregisterCleanup(cleanupFn: CleanupFunction): void {
    this.cleanupFunctions.delete(cleanupFn)
  }

  /**
   * Garante que os listeners do processo sejam registrados apenas uma vez
   */
  private ensureListenersRegistered(): void {
    if (this.listenersRegistered || typeof process === 'undefined') {
      return
    }

    // Aumentar o limite de listeners para evitar warnings
    process.setMaxListeners(20)

    // Registrar handlers de shutdown
    process.on('SIGTERM', this.handleShutdown.bind(this))
    process.on('SIGINT', this.handleShutdown.bind(this))
    process.on('beforeExit', this.handleShutdown.bind(this))
    process.on('exit', this.handleExit.bind(this))

    this.listenersRegistered = true
    console.log('[PROCESS-MANAGER] Process listeners registrados com sucesso')
  }

  /**
   * Executa todas as funções de cleanup registradas
   */
  private async handleShutdown(signal?: string): Promise<void> {
    if (signal) {
      console.log(`[PROCESS-MANAGER] Recebido sinal ${signal}, executando cleanup...`)
    }

    const cleanupPromises = Array.from(this.cleanupFunctions).map(async (cleanupFn) => {
      try {
        await cleanupFn()
      } catch (error) {
        console.error('[PROCESS-MANAGER] Erro durante cleanup:', error)
      }
    })

    await Promise.allSettled(cleanupPromises)
    console.log('[PROCESS-MANAGER] Cleanup concluído')
  }

  /**
   * Handler para o evento 'exit' (síncrono)
   */
  private handleExit(): void {
    console.log('[PROCESS-MANAGER] Processo finalizando')
  }

  /**
   * Força o shutdown do processo
   */
  public async forceShutdown(exitCode: number = 0): Promise<void> {
    await this.handleShutdown('FORCE')
    process.exit(exitCode)
  }

  /**
   * Retorna informações sobre o gerenciador
   */
  public getInfo(): { cleanupCount: number; listenersRegistered: boolean } {
    return {
      cleanupCount: this.cleanupFunctions.size,
      listenersRegistered: this.listenersRegistered
    }
  }
}

// Instância singleton
export const processManager = new ProcessManager()

// Funções de conveniência
export function registerCleanup(cleanupFn: CleanupFunction): void {
  processManager.registerCleanup(cleanupFn)
}

export function unregisterCleanup(cleanupFn: CleanupFunction): void {
  processManager.unregisterCleanup(cleanupFn)
}

export function getProcessManagerInfo(): { cleanupCount: number; listenersRegistered: boolean } {
  return processManager.getInfo()
}

export default processManager