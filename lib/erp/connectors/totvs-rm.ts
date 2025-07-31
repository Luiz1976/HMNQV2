
import { BaseERPConnector } from '../base-connector'
import { ERPConfig, ERPTestResult, ERPSyncResult, ERPEmployee } from '../types'

export class TOTVSRMConnector extends BaseERPConnector {
  constructor() {
    super('TOTVS_RM')
  }

  async testConnection(config: ERPConfig): Promise<ERPTestResult> {
    try {
      const headers = this.buildAuthHeaders(config)
      
      const response = await this.makeHttpRequest(
        `${config.apiUrl}/api/educational/v1/students?$top=1`,
        {
          method: 'GET',
          headers
        }
      )

      if (!response.ok) {
        return {
          success: false,
          message: 'Falha na conexão com TOTVS RM',
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        message: 'Conexão com TOTVS RM estabelecida com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar com TOTVS RM',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getEmployees(config: ERPConfig, options: any = {}): Promise<ERPSyncResult> {
    try {
      const headers = this.buildAuthHeaders(config)
      const page = options.page || 1
      const limit = options.limit || 100

      const response = await this.makeHttpRequest(
        `${config.apiUrl}/api/hr/v1/employees?page=${page}&limit=${limit}`,
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

      for (const rawEmployee of data.data || []) {
        employees.push({
          id: rawEmployee.CHAPA || rawEmployee.CODIGO,
          email: rawEmployee.EMAIL,
          firstName: rawEmployee.NOME?.split(' ')[0] || '',
          lastName: rawEmployee.NOME?.split(' ').slice(1).join(' ') || '',
          department: rawEmployee.SECAO,
          position: rawEmployee.FUNCAO,
          phone: rawEmployee.TELEFONE,
          status: rawEmployee.SITUACAO === 'A' ? 'Active' : 'Inactive',
          hireDate: rawEmployee.DATAADMISSAO ? new Date(rawEmployee.DATAADMISSAO) : undefined,
          rawData: rawEmployee
        })
      }

      return {
        success: true,
        totalRecords: data.total || employees.length,
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
      'students',
      'departments',
      'authentication',
      'pagination'
    ]
  }

  getDefaultFieldMapping(): Record<string, string> {
    return {
      employeeId: 'CHAPA',
      email: 'EMAIL',
      firstName: 'NOME',
      lastName: 'NOME',
      department: 'SECAO',
      position: 'FUNCAO',
      phone: 'TELEFONE',
      status: 'SITUACAO',
      hireDate: 'DATAADMISSAO'
    }
  }
}
