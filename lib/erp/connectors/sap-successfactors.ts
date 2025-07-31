
import { BaseERPConnector } from '../base-connector'
import { ERPConfig, ERPTestResult, ERPSyncResult, ERPEmployee, ERPCredentials, ERPAuthResult } from '../types'

export class SAPSuccessFactorsConnector extends BaseERPConnector {
  constructor() {
    super('SAP_SUCCESSFACTORS')
  }

  async authenticate(credentials: ERPCredentials): Promise<ERPAuthResult> {
    try {
      const response = await this.makeHttpRequest(`${credentials.apiUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64')}`
        },
        body: 'grant_type=client_credentials'
      })

      if (!response.ok) {
        return {
          success: false,
          error: `OAuth authentication failed: ${response.status} ${response.statusText}`
        }
      }

      const data = await response.json()
      return {
        success: true,
        accessToken: data.access_token,
        expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      }
    }
  }

  async testConnection(config: ERPConfig): Promise<ERPTestResult> {
    try {
      const headers = this.buildAuthHeaders(config)
      
      const response = await this.makeHttpRequest(
        `${config.apiUrl}/odata/v2/User?$top=1`,
        {
          method: 'GET',
          headers
        }
      )

      if (!response.ok) {
        return {
          success: false,
          message: 'Falha na conexão com SAP SuccessFactors',
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        message: 'Conexão com SAP SuccessFactors estabelecida com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar com SAP SuccessFactors',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getEmployees(config: ERPConfig, options: any = {}): Promise<ERPSyncResult> {
    try {
      const headers = this.buildAuthHeaders(config)
      const page = options.page || 1
      const limit = options.limit || 100
      const skip = (page - 1) * limit

      const response = await this.makeHttpRequest(
        `${config.apiUrl}/odata/v2/User?$top=${limit}&$skip=${skip}&$expand=personKeyNav`,
        {
          method: 'GET',
          headers
        }
      )

      if (!response.ok) {
        throw this.handleHttpError(response, 'Employee fetch')
      }

      const data = await response.json()
      const employees: ERPEmployee[] = []

      for (const rawEmployee of data.d?.results || []) {
        employees.push({
          id: rawEmployee.userId,
          email: rawEmployee.email,
          firstName: rawEmployee.firstName,
          lastName: rawEmployee.lastName,
          department: rawEmployee.department,
          position: rawEmployee.title,
          phone: rawEmployee.phone,
          status: rawEmployee.status === 'ACTIVE' ? 'Active' : 'Inactive',
          hireDate: rawEmployee.startDate ? new Date(rawEmployee.startDate) : undefined,
          rawData: rawEmployee
        })
      }

      return {
        success: true,
        totalRecords: data.d?.__count || employees.length,
        newRecords: employees.length,
        updatedRecords: 0,
        errorRecords: 0,
        employees
      }
    } catch (error) {
      return {
        success: false,
        totalRecords: 0,
        newRecords: 0,
        updatedRecords: 0,
        errorRecords: 1,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  getCapabilities(): string[] {
    return [
      'employees',
      'users',
      'departments',
      'positions',
      'oauth',
      'odata',
      'pagination'
    ]
  }

  getDefaultFieldMapping(): Record<string, string> {
    return {
      employeeId: 'userId',
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      department: 'department',
      position: 'title',
      phone: 'phone',
      status: 'status',
      hireDate: 'startDate'
    }
  }
}
