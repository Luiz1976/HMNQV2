
import { BaseERPConnector } from '../base-connector'
import { ERPConfig, ERPTestResult, ERPSyncResult, ERPEmployee } from '../types'

export class SolidesRHConnector extends BaseERPConnector {
  constructor() {
    super('SOLIDES_RH')  
  }

  async testConnection(config: ERPConfig): Promise<ERPTestResult> {
    try {
      const headers = this.buildAuthHeaders(config)
      
      const response = await this.makeHttpRequest(
        `${config.apiUrl}/api/v2/colaboradores?limit=1`,
        {
          method: 'GET',
          headers
        }
      )

      if (!response.ok) {
        return {
          success: false,
          message: 'Falha na conexão com Sólides RH',
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        message: 'Conexão com Sólides RH estabelecida com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar com Sólides RH',
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
        `${config.apiUrl}/api/v2/colaboradores?page=${page}&limit=${limit}`,
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

      for (const rawEmployee of data.colaboradores || []) {
        employees.push({
          id: rawEmployee.id.toString(),
          email: rawEmployee.email,
          firstName: rawEmployee.nomeCompleto?.split(' ')[0] || '',
          lastName: rawEmployee.nomeCompleto?.split(' ').slice(1).join(' ') || '',
          department: rawEmployee.setor?.nome,
          position: rawEmployee.cargo?.nome,
          phone: rawEmployee.telefone,
          status: rawEmployee.situacao === 'ATIVO' ? 'Active' : 'Inactive',
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
      'colaboradores',
      'setores',
      'cargos',
      'authentication',
      'pagination'
    ]
  }

  getDefaultFieldMapping(): Record<string, string> {
    return {
      employeeId: 'id',
      email: 'email',
      firstName: 'nomeCompleto',
      lastName: 'nomeCompleto',
      department: 'setor.nome',
      position: 'cargo.nome',
      phone: 'telefone',
      status: 'situacao',
      hireDate: 'dataAdmissao'
    }
  }
}
