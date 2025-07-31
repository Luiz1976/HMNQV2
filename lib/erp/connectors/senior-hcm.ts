
import { BaseERPConnector } from '../base-connector'
import { ERPConfig, ERPTestResult, ERPSyncResult, ERPEmployee } from '../types'

export class SeniorHCMConnector extends BaseERPConnector {
  constructor() {
    super('SENIOR_HCM')
  }

  async testConnection(config: ERPConfig): Promise<ERPTestResult> {
    try {
      const headers = this.buildAuthHeaders(config)
      
      const response = await this.makeHttpRequest(
        `${config.apiUrl}/api/hcm/funcionarios?take=1`,
        {
          method: 'GET',
          headers
        }
      )

      if (!response.ok) {
        return {
          success: false,
          message: 'Falha na conexão com Senior HCM',
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        message: 'Conexão com Senior HCM estabelecida com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar com Senior HCM',
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
        `${config.apiUrl}/api/hcm/funcionarios?skip=${(page - 1) * limit}&take=${limit}`,
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

      for (const rawEmployee of data.dados || []) {
        employees.push({
          id: rawEmployee.numCad.toString(),
          email: rawEmployee.email,
          firstName: rawEmployee.nomFun?.split(' ')[0] || '',
          lastName: rawEmployee.nomFun?.split(' ').slice(1).join(' ') || '',
          department: rawEmployee.desSec,
          position: rawEmployee.desCar,
          phone: rawEmployee.telefone,
          status: rawEmployee.sitAfa === 'A' ? 'Active' : 'Inactive',
          hireDate: rawEmployee.datAdm ? new Date(rawEmployee.datAdm) : undefined,
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
      'funcionarios',
      'setores',
      'cargos',
      'authentication',
      'pagination'
    ]
  }

  getDefaultFieldMapping(): Record<string, string> {
    return {
      employeeId: 'numCad',
      email: 'email',
      firstName: 'nomFun',
      lastName: 'nomFun',
      department: 'desSec',
      position: 'desCar',
      phone: 'telefone',
      status: 'sitAfa',
      hireDate: 'datAdm'
    }
  }
}
