
import { BaseERPConnector } from '../base-connector'
import { ERPConfig, ERPTestResult, ERPSyncResult, ERPEmployee, ERPAuthResult, ERPCredentials } from '../types'

export class TOTVSProtheusConnector extends BaseERPConnector {
  constructor() {
    super('TOTVS_PROTHEUS')
  }

  async authenticate(credentials: ERPCredentials): Promise<ERPAuthResult> {
    try {
      const response = await this.makeHttpRequest(`${credentials.apiUrl}/api/framework/v1/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      })

      if (!response.ok) {
        return {
          success: false,
          error: `Authentication failed: ${response.status} ${response.statusText}`
        }
      }

      const data = await response.json()
      return {
        success: true,
        accessToken: data.access_token,
        expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      }
    }
  }

  async testConnection(config: ERPConfig): Promise<ERPTestResult> {
    try {
      const headers = this.buildAuthHeaders(config)
      
      const response = await this.makeHttpRequest(
        `${config.apiUrl}/api/hcm/v1/employees?$top=1`,
        {
          method: 'GET',
          headers
        }
      )

      if (!response.ok) {
        return {
          success: false,
          message: 'Falha na conexão com TOTVS Protheus',
          error: `HTTP ${response.status}: ${response.statusText}`,
          details: { status: response.status, statusText: response.statusText }
        }
      }

      const data = await response.json()
      
      return {
        success: true,
        message: 'Conexão com TOTVS Protheus estabelecida com sucesso',
        details: {
          status: response.status,
          employeesPreview: data?.items?.length || 0
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar com TOTVS Protheus',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: { error: error instanceof Error ? error.stack : error }
      }
    }
  }

  async getEmployees(config: ERPConfig, options: any = {}): Promise<ERPSyncResult> {
    try {
      const headers = this.buildAuthHeaders(config)
      const page = options.page || 1
      const limit = options.limit || 100
      const skip = (page - 1) * limit

      let url = `${config.apiUrl}/api/hcm/v1/employees?$top=${limit}&$skip=${skip}`
      
      // Add filter for incremental sync
      if (options.lastSync) {
        const lastSyncISO = options.lastSync.toISOString()
        url += `&$filter=ModifiedDate gt datetime'${lastSyncISO}'`
      }

      const response = await this.makeHttpRequest(url, {
        method: 'GET',
        headers
      })

      if (!response.ok) {
        throw this.handleHttpError(response, 'Employee fetch')
      }

      const data = await response.json()
      const employees: ERPEmployee[] = []
      const errors: string[] = []

      // Process employees with field mapping
      const fieldMapping = config.fieldMappings || this.getDefaultFieldMapping()

      for (const rawEmployee of data.items || []) {
        try {
          const mapped = this.mapEmployeeFields(rawEmployee, fieldMapping)
          
          employees.push({
            id: rawEmployee.Code || rawEmployee.Id,
            email: mapped.email || rawEmployee.Email,
            firstName: mapped.firstName || rawEmployee.FirstName || rawEmployee.Name?.split(' ')[0] || '',
            lastName: mapped.lastName || rawEmployee.LastName || rawEmployee.Name?.split(' ').slice(1).join(' ') || '',
            department: mapped.department || rawEmployee.DepartmentDescription,
            position: mapped.position || rawEmployee.PositionDescription,
            phone: mapped.phone || rawEmployee.Phone,
            status: mapped.status || (rawEmployee.Active ? 'Active' : 'Inactive'),
            hireDate: rawEmployee.AdmissionDate ? new Date(rawEmployee.AdmissionDate) : undefined,
            rawData: rawEmployee
          })
        } catch (error) {
          errors.push(`Error processing employee ${rawEmployee.Code}: ${error instanceof Error ? error.message : error}`)
        }
      }

      return {
        success: true,
        totalRecords: data.count || employees.length,
        newRecords: employees.length,
        updatedRecords: 0,
        errorRecords: errors.length,
        errors: errors.length > 0 ? errors : undefined,
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
      'authentication',
      'incremental_sync',
      'pagination'
    ]
  }

  getDefaultFieldMapping(): Record<string, string> {
    return {
      employeeId: 'Code',
      email: 'Email',
      firstName: 'FirstName',
      lastName: 'LastName',
      department: 'DepartmentDescription',
      position: 'PositionDescription',
      phone: 'Phone',
      status: 'Active',
      hireDate: 'AdmissionDate'
    }
  }
}
