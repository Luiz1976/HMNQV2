
import { BaseERPConnector } from '../base-connector'
import { ERPConfig, ERPTestResult, ERPSyncResult, ERPEmployee } from '../types'

export class SolidesGestaoConnector extends BaseERPConnector {
  constructor() {
    super('SOLIDES_GESTAO')
  }

  async testConnection(config: ERPConfig): Promise<ERPTestResult> {
    try {
      const headers = this.buildAuthHeaders(config)
      
      const response = await this.makeHttpRequest(
        `${config.apiUrl}/api/v1/funcionarios?per_page=1`,
        {
          method: 'GET',
          headers
        }
      )

      if (!response.ok) {
        return {
          success: false,
          message: 'Falha na conexão com Sólides Gestão',
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        message: 'Conexão com Sólides Gestão estabelecida com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar com Sólides Gestão',
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
        `${config.apiUrl}/api/v1/funcionarios?page=${page}&per_page=${limit}`,
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
          id: rawEmployee.id.toString(),
          email: rawEmployee.email,
          firstName: rawEmployee.nome?.split(' ')[0] || '',
          lastName: rawEmployee.nome?.split(' ').slice(1).join(' ') || '',
          department: rawEmployee.departamento?.nome,
          position: rawEmployee.cargo?.nome,
          phone: rawEmployee.telefone,
          status: rawEmployee.status === 'ativo' ? 'Active' : 'Inactive',
          hireDate: rawEmployee.data_admissao ? new Date(rawEmployee.data_admissao) : undefined,
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
      'departamentos',
      'cargos',
      'authentication',
      'pagination'
    ]
  }

  getDefaultFieldMapping(): Record<string, string> {
    return {
      employeeId: 'id',
      email: 'email',
      firstName: 'nome',
      lastName: 'nome',
      department: 'departamento.nome',
      position: 'cargo.nome',
      phone: 'telefone',
      status: 'status',
      hireDate: 'data_admissao'
    }
  }
}
