
import { ERPType } from '@prisma/client'

export interface ERPCredentials {
  apiUrl: string
  apiKey?: string
  username?: string
  password?: string
  clientId?: string
  clientSecret?: string
  accessToken?: string
  refreshToken?: string
}

export interface ERPConfig {
  id?: string
  name: string
  erpType: ERPType
  apiUrl: string
  apiKey?: string
  username?: string
  password?: string
  clientId?: string
  clientSecret?: string
  accessToken?: string
  refreshToken?: string
  config?: any
  fieldMappings?: any
}

export interface ERPEmployee {
  id: string
  email: string
  firstName: string
  lastName: string
  department?: string
  position?: string
  phone?: string
  status?: string
  hireDate?: Date
  rawData?: any
}

export interface ERPTestResult {
  success: boolean
  message: string
  error?: string
  details?: any
}

export interface ERPSyncResult {
  success: boolean
  totalRecords: number
  newRecords: number
  updatedRecords: number
  errorRecords: number
  errors?: string[]
  employees?: ERPEmployee[]
}

export interface ERPAuthResult {
  success: boolean
  accessToken?: string
  refreshToken?: string
  expiresAt?: Date
  error?: string
}

export interface ERPConnector {
  // Authentication
  authenticate(credentials: ERPCredentials): Promise<ERPAuthResult>
  refreshToken(refreshToken: string): Promise<ERPAuthResult>
  
  // Connection testing
  testConnection(config: ERPConfig): Promise<ERPTestResult>
  
  // Employee data operations
  getEmployees(config: ERPConfig, options?: {
    page?: number
    limit?: number
    lastSync?: Date
  }): Promise<ERPSyncResult>
  
  // Department data operations
  getDepartments?(config: ERPConfig): Promise<any[]>
  
  // Specific ERP capabilities
  getCapabilities(): string[]
  
  // Field mapping
  getDefaultFieldMapping(): Record<string, string>
}

export interface ERPSyncOptions {
  page?: number
  limit?: number
  lastSync?: Date
  syncType?: 'FULL' | 'INCREMENTAL'
}

export interface ERPFieldMapping {
  employeeId: string
  email: string
  firstName: string
  lastName: string
  department?: string
  position?: string
  phone?: string
  status?: string
  hireDate?: string
}
