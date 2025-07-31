
import { BaseERPConnector } from '../base-connector'
import { ERPConfig, ERPTestResult, ERPSyncResult, ERPEmployee } from '../types'

export class TOTVSDatasulConnector extends BaseERPConnector {
  constructor() {
    super('TOTVS_DATASUL')
  }

  async testConnection(config: ERPConfig): Promise<ERPTestResult> {
    try {
      const headers = this.buildAuthHeaders(config)
      
      const response = await this.makeHttpRequest(
        `${config.apiUrl}/dts/datasul-rest/resources/prg/hr/v1/employees`,
        {
          method: 'GET',
          headers
        }
      )

      if (!response.ok) {
        return {
          success: false,
          message: 'Falha na conexão com TOTVS Datasul',
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        message: 'Conexão com TOTVS Datasul estabelecida com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar com TOTVS Datasul',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getEmployees(config: ERPConfig, options: any = {}): Promise<ERPSyncResult> {
    try {
      const headers = this.buildAuthHeaders(config)

      const response = await this.makeHttpRequest(
        `${config.apiUrl}/dts/datasul-rest/resources/prg/hr/v1/employees`,
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

      for (const rawEmployee of data.employees || []) {
        employees.push({
          id: rawEmployee.cdn_funcionario,
          email: rawEmployee.des_e_mail,
          firstName: rawEmployee.nom_pessoa?.split(' ')[0] || '',
          lastName: rawEmployee.nom_pessoa?.split(' ').slice(1).join(' ') || '',
          department: rawEmployee.des_setor,
          position: rawEmployee.des_cargo,
          phone: rawEmployee.des_telefone,
          status: rawEmployee.ind_situacao === 1 ? 'Active' : 'Inactive',
          hireDate: rawEmployee.dat_admis_func ? new Date(rawEmployee.dat_admis_func) : undefined,
          rawData: rawEmployee
        })
      }

      return {
        success: true,
        totalRecords: employees.length,
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
      'departments',
      'positions',
      'authentication'
    ]
  }

  getDefaultFieldMapping(): Record<string, string> {
    return {
      employeeId: 'cdn_funcionario',
      email: 'des_e_mail',
      firstName: 'nom_pessoa',
      lastName: 'nom_pessoa',
      department: 'des_setor',
      position: 'des_cargo',
      phone: 'des_telefone',
      status: 'ind_situacao',
      hireDate: 'dat_admis_func'
    }
  }
}
