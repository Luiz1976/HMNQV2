
import { BaseERPConnector } from '../base-connector'
import { ERPConfig, ERPTestResult, ERPSyncResult, ERPEmployee } from '../types'

export class GenericERPConnector extends BaseERPConnector {
  constructor() {
    super('OTHER')
  }

  async testConnection(config: ERPConfig): Promise<ERPTestResult> {
    try {
      const headers = this.buildAuthHeaders(config)
      
      // Try to connect to a generic endpoint
      const response = await this.makeHttpRequest(config.apiUrl, {
        method: 'GET',
        headers
      })

      if (!response.ok) {
        return {
          success: false,
          message: 'Falha na conexão com ERP genérico',
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        message: 'Conexão com ERP genérico estabelecida com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar com ERP genérico',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getEmployees(config: ERPConfig, options: any = {}): Promise<ERPSyncResult> {
    try {
      const headers = this.buildAuthHeaders(config)
      
      // Use configured endpoint or fallback to default
      const endpoint = config.config?.employeesEndpoint || '/employees'
      const url = `${config.apiUrl}${endpoint}`

      const response = await this.makeHttpRequest(url, {
        method: 'GET',
        headers
      })

      if (!response.ok) {
        throw this.handleHttpError(response, 'Employee fetch')
      }

      const data = await response.json()
      const employees: ERPEmployee[] = []
      
      // Use configured data path or fallback to default
      const dataPath = config.config?.dataPath || 'data'
      const employeesData = this.getNestedValue(data, dataPath) || []

      // Get field mapping
      const fieldMapping = config.fieldMappings || this.getDefaultFieldMapping()

      for (const rawEmployee of employeesData) {
        try {
          const mapped = this.mapEmployeeFields(rawEmployee, fieldMapping)
          
          employees.push({
            id: mapped.employeeId || rawEmployee.id,
            email: mapped.email,
            firstName: mapped.firstName,
            lastName: mapped.lastName,
            department: mapped.department,
            position: mapped.position,
            phone: mapped.phone,
            status: mapped.status,
            hireDate: mapped.hireDate ? new Date(mapped.hireDate) : undefined,
            rawData: rawEmployee
          })
        } catch (error) {
          console.error('Error processing employee:', error)
        }
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

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  getCapabilities(): string[] {
    return [
      'employees',
      'custom_endpoints',
      'field_mapping',
      'authentication'
    ]
  }

  getDefaultFieldMapping(): Record<string, string> {
    return {
      employeeId: 'id',
      email: 'email',
      firstName: 'first_name',
      lastName: 'last_name',
      department: 'department',
      position: 'position',
      phone: 'phone',
      status: 'status',
      hireDate: 'hire_date'
    }
  }
}
