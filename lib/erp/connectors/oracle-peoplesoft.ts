
import { BaseERPConnector } from '../base-connector'
import { ERPConfig, ERPTestResult, ERPSyncResult, ERPEmployee } from '../types'

export class OraclePeopleSoftConnector extends BaseERPConnector {
  constructor() {
    super('ORACLE_PEOPLESOFT')
  }

  async testConnection(config: ERPConfig): Promise<ERPTestResult> {
    try {
      const headers = {
        ...this.buildAuthHeaders(config),
        'Authorization': `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`
      }
      
      const response = await this.makeHttpRequest(
        `${config.apiUrl}/PSIGW/RESTListeningConnector/PSFT_HR/EMPLOYEE.v1/`,
        {
          method: 'GET',
          headers
        }
      )

      if (!response.ok) {
        return {
          success: false,
          message: 'Falha na conexão com Oracle PeopleSoft',
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        message: 'Conexão com Oracle PeopleSoft estabelecida com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar com Oracle PeopleSoft',
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
        `${config.apiUrl}/PSIGW/RESTListeningConnector/PSFT_HR/EMPLOYEE.v1/`,
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

      for (const rawEmployee of data.EMPLOYEE || []) {
        employees.push({
          id: rawEmployee.EMPLID,
          email: rawEmployee.EMAIL_ADDR,
          firstName: rawEmployee.FIRST_NAME,
          lastName: rawEmployee.LAST_NAME,
          department: rawEmployee.DEPTNAME,
          position: rawEmployee.JOBTITLE,
          phone: rawEmployee.PHONE,
          status: rawEmployee.EMPL_STATUS === 'A' ? 'Active' : 'Inactive',
          hireDate: rawEmployee.HIRE_DT ? new Date(rawEmployee.HIRE_DT) : undefined,
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
      'jobs',
      'basic_auth',
      'rest_api'
    ]
  }

  getDefaultFieldMapping(): Record<string, string> {
    return {
      employeeId: 'EMPLID',
      email: 'EMAIL_ADDR',
      firstName: 'FIRST_NAME',
      lastName: 'LAST_NAME',
      department: 'DEPTNAME',
      position: 'JOBTITLE',
      phone: 'PHONE',
      status: 'EMPL_STATUS',
      hireDate: 'HIRE_DT'
    }
  }
}
