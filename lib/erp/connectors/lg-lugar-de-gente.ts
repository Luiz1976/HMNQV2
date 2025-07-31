
import { BaseERPConnector } from '../base-connector'
import { ERPConfig, ERPTestResult, ERPSyncResult, ERPEmployee } from '../types'

export class LGLugarDeGenteConnector extends BaseERPConnector {
  constructor() {
    super('LG_LUGAR_DE_GENTE')
  }

  async testConnection(config: ERPConfig): Promise<ERPTestResult> {
    try {
      const headers = this.buildAuthHeaders(config)
      
      const response = await this.makeHttpRequest(
        `${config.apiUrl}/api/colaboradores?limit=1`,
        {
          method: 'GET',
          headers
        }
      )

      if (!response.ok) {
        return {
          success: false,
          message: 'Falha na conexão com LG Lugar de Gente',
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        message: 'Conexão com LG Lugar de Gente estabelecida com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar com LG Lugar de Gente',
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
        `${config.apiUrl}/api/colaboradores?page=${page}&limit=${limit}`,
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
          firstName: rawEmployee.nome?.split(' ')[0] || '',
          lastName: rawEmployee.nome?.split(' ').slice(1).join(' ') || '',
          department: rawEmployee.area,
          position: rawEmployee.cargo,
          phone: rawEmployee.telefone,
          status: rawEmployee.ativo ? 'Active' : 'Inactive',
          hireDate: rawEmployee.dataAdmissao ? new Date(rawEmployee.dataAdmissao) : undefined,
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
      'colaboradores',
      'areas',
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
      department: 'area',
      position: 'cargo',
      phone: 'telefone',
      status: 'ativo',
      hireDate: 'dataAdmissao'
    }
  }
}
