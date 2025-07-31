
import { BaseERPConnector } from '../base-connector'
import { ERPConfig, ERPTestResult, ERPSyncResult, ERPEmployee } from '../types'

export class OracleFusionConnector extends BaseERPConnector {
  constructor() {
    super('ORACLE_FUSION_HCM')
  }

  async testConnection(config: ERPConfig): Promise<ERPTestResult> {
    try {
      const headers = {
        ...this.buildAuthHeaders(config),
        'Authorization': `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`
      }
      
      const response = await this.makeHttpRequest(
        `${config.apiUrl}/hcmRestApi/resources/11.13.18.05/workers?limit=1`,
        {
          method: 'GET',
          headers
        }
      )

      if (!response.ok) {
        return {
          success: false,
          message: 'Falha na conexão com Oracle Fusion HCM',
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        message: 'Conexão com Oracle Fusion HCM estabelecida com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar com Oracle Fusion HCM',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getEmployees(config: ERPConfig, options: any = {}): Promise<ERPSyncResult> {
    try {
      const headers = {
        ...this.buildAuthHeaders(config),
        'Authorization': `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`
      }

      const response = await this.makeHttpRequest(
        `${config.apiUrl}/hcmRestApi/resources/11.13.18.05/workers`,
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

      for (const rawEmployee of data.items || []) {
        employees.push({
          id: rawEmployee.WorkerNumber,
          email: rawEmployee.WorkEmail,
          firstName: rawEmployee.FirstName,
          lastName: rawEmployee.LastName,
          department: rawEmployee.DepartmentName,
          position: rawEmployee.JobName,
          phone: rawEmployee.WorkPhoneNumber,
          status: rawEmployee.WorkerStatus,
          hireDate: rawEmployee.DateOfBirth ? new Date(rawEmployee.DateOfBirth) : undefined,
          rawData: rawEmployee
        })
      }

      return {
        success: true,
        totalRecords: data.count || employees.length,
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
      'workers',
      'departments',
      'jobs',
      'basic_auth',
      'rest_api'
    ]
  }

  getDefaultFieldMapping(): Record<string, string> {
    return {
      employeeId: 'WorkerNumber',
      email: 'WorkEmail',
      firstName: 'FirstName',
      lastName: 'LastName',
      department: 'DepartmentName',
      position: 'JobName',
      phone: 'WorkPhoneNumber',
      status: 'WorkerStatus',
      hireDate: 'StartDate'
    }
  }
}
