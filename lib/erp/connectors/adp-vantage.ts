
import { BaseERPConnector } from '../base-connector'
import { ERPConfig, ERPTestResult, ERPSyncResult, ERPEmployee, ERPCredentials, ERPAuthResult } from '../types'

export class ADPVantageConnector extends BaseERPConnector {
  constructor() {
    super('ADP_VANTAGE_HCM')
  }

  async authenticate(credentials: ERPCredentials): Promise<ERPAuthResult> {
    try {
      const response = await this.makeHttpRequest(`${credentials.apiUrl}/auth/oauth/v2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': credentials.clientId || '',
          'client_secret': credentials.clientSecret || ''
        }).toString()
      })

      if (!response.ok) {
        return {
          success: false,
          error: `OAuth authentication failed: ${response.status} ${response.statusText}`
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
        `${config.apiUrl}/events/hr/v1/worker.hire?$top=1`,
        {
          method: 'GET',
          headers
        }
      )

      if (!response.ok) {
        return {
          success: false,
          message: 'Falha na conexão com ADP Vantage HCM',
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return {
        success: true,
        message: 'Conexão com ADP Vantage HCM estabelecida com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar com ADP Vantage HCM',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getEmployees(config: ERPConfig, options: any = {}): Promise<ERPSyncResult> {
    try {
      const headers = this.buildAuthHeaders(config)

      const response = await this.makeHttpRequest(
        `${config.apiUrl}/hr/v2/workers`,
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

      for (const rawEmployee of data.workers || []) {
        employees.push({
          id: rawEmployee.associateOID,
          email: rawEmployee.businessCommunication?.emails?.[0]?.emailUri,
          firstName: rawEmployee.person?.legalName?.givenName,
          lastName: rawEmployee.person?.legalName?.familyName1,
          department: rawEmployee.workAssignments?.[0]?.assignedOrganizationalUnits?.[0]?.nameCode?.shortName,
          position: rawEmployee.workAssignments?.[0]?.jobTitle,
          phone: rawEmployee.businessCommunication?.landlines?.[0]?.formattedNumber,
          status: rawEmployee.workAssignments?.[0]?.assignmentStatus?.statusCode?.codeValue === 'A' ? 'Active' : 'Inactive',
          hireDate: rawEmployee.workAssignments?.[0]?.actualStartDate ? new Date(rawEmployee.workAssignments[0].actualStartDate) : undefined,
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
      'workers',
      'assignments',
      'events',
      'oauth',
      'realtime'
    ]
  }

  getDefaultFieldMapping(): Record<string, string> {
    return {
      employeeId: 'associateOID',
      email: 'businessCommunication.emails[0].emailUri',
      firstName: 'person.legalName.givenName',
      lastName: 'person.legalName.familyName1',
      department: 'workAssignments[0].assignedOrganizationalUnits[0].nameCode.shortName',
      position: 'workAssignments[0].jobTitle',
      phone: 'businessCommunication.landlines[0].formattedNumber',
      status: 'workAssignments[0].assignmentStatus.statusCode.codeValue',
      hireDate: 'workAssignments[0].actualStartDate'
    }
  }
}
