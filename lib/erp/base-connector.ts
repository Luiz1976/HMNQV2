
import { ERPConnector, ERPConfig, ERPCredentials, ERPTestResult, ERPSyncResult, ERPAuthResult } from './types'

export abstract class BaseERPConnector implements ERPConnector {
  protected erpType: string

  constructor(erpType: string) {
    this.erpType = erpType
  }

  // Default authentication implementation
  async authenticate(credentials: ERPCredentials): Promise<ERPAuthResult> {
    try {
      // Default implementation for basic API key auth
      if (credentials.apiKey) {
        return {
          success: true,
          accessToken: credentials.apiKey
        }
      }
      
      return {
        success: false,
        error: 'No authentication method available'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      }
    }
  }

  // Default token refresh (override for OAuth systems)
  async refreshToken(refreshToken: string): Promise<ERPAuthResult> {
    return {
      success: false,
      error: 'Token refresh not implemented for this ERP'
    }
  }

  // Abstract methods that must be implemented by specific connectors
  abstract testConnection(config: ERPConfig): Promise<ERPTestResult>
  abstract getEmployees(config: ERPConfig, options?: any): Promise<ERPSyncResult>
  abstract getCapabilities(): string[]
  abstract getDefaultFieldMapping(): Record<string, string>

  // Helper methods
  protected async makeHttpRequest(
    url: string, 
    options: RequestInit = {},
    timeout: number = 30000
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  protected buildAuthHeaders(config: ERPConfig): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (config.accessToken) {
      headers['Authorization'] = `Bearer ${config.accessToken}`
    } else if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`
    }

    return headers
  }

  protected handleHttpError(response: Response, context: string): Error {
    return new Error(
      `${context} failed: ${response.status} ${response.statusText}`
    )
  }

  protected mapEmployeeFields(rawEmployee: any, fieldMapping: Record<string, string>): any {
    const mapped: any = {}
    
    for (const [localField, erpField] of Object.entries(fieldMapping)) {
      if (rawEmployee[erpField] !== undefined) {
        mapped[localField] = rawEmployee[erpField]
      }
    }

    return mapped
  }
}
