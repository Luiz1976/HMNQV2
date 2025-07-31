
import { BaseERPConnector } from '../base-connector'
import { ERPConfig, ERPTestResult, ERPSyncResult, ERPEmployee } from '../types'

export class BennerConnector extends BaseERPConnector {
  constructor() {
    super('BENNER')
  }

  async testConnection(config: ERPConfig): Promise<ERPTestResult> {
    try {
      const headers = this.buildAuthHeaders(config)
      
      const response = await this.makeHttpRequest(
        `${config.apiUrl}/api/rh/funcionarios?take=1`,
        {
          method: 'GET',
          headers
        }
      )

      if (!response.ok) {
        return {
          success: false,
          message: 'Falha na conexão com Benner',
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        message: 'Conexão com Benner estabelecida com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar com Benner',
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
        `${config.apiUrl}/api/rh/funcionarios?skip=${skip}&take=${limit}`,
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

      for (const rawEmployee of data.funcionarios || []) {
        employees.push({
          id: rawEmployee.handle.toString(),
          email: rawEmployee.email,
          firstName: rawEmployee.nome?.split(' ')[0] || '',
          lastName: rawEmployee.nome?.split(' ').slice(1).join(' ') || '',
          department: rawEmployee.centroCusto?.descricao,
          position: rawEmployee.cargo?.descricao,
          phone: rawEmployee.telefone,
          status: rawEmployee.situacao === 'A' ? 'Active' : 'Inactive',
          hireDate: rawEmployee.dataAdmissao ? new Date(rawEmployee.dataAdmissao) : undefined,
          rawData: rawEmployee
        })
      }

      return {
        success: true,
        totalRecords: data.totalRegistros || employees.length,
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
      'centros_custo',
      'cargos',
      'authentication',
      'pagination'
    ]
  }

  getDefaultFieldMapping(): Record<string, string> {
    return {
      employeeId: 'handle',
      email: 'email',
      firstName: 'nome',
      lastName: 'nome',
      department: 'centroCusto.descricao',
      position: 'cargo.descricao',
      phone: 'telefone',
      status: 'situacao',
      hireDate: 'dataAdmissao'
    }
  }
}
