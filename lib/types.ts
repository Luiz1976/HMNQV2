
// Centralized type definitions for the HumaniQ AI platform

export type UserType = 'ADMIN' | 'COMPANY' | 'EMPLOYEE' | 'CANDIDATE'
export type CompanySize = 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE'

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  userType: UserType
  avatarUrl?: string
  company?: {
    id: string
    name: string
    role: string
  } | null
  permissions: string[]
  lastLoginAt?: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  name?: string
  userType: UserType
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Company {
  id: string
  name: string
  cnpj?: string
  industry?: string
  size: CompanySize
  subscriptionPlan: 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE'
  subscriptionStatus: 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED'
  createdAt: Date
  updatedAt: Date
}

export interface Test {
  id: string
  name: string
  description?: string
  category: 'PSYCHOSOCIAL' | 'PERSONALITY' | 'GRAPHOLOGY' | 'CORPORATE'
  estimatedDuration: number
  totalQuestions: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TestResult {
  id: string
  testId: string
  userId: string
  overallScore?: number
  dimensionScores?: Record<string, number>
  aiAnalysis?: string
  completedAt: Date
  duration: number
}

export interface Invitation {
  id: string
  email: string
  status: 'PENDING' | 'SENT' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED'
  token: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Session user type extension
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      userType: 'ADMIN' | 'COMPANY' | 'EMPLOYEE' | 'CANDIDATE'
      image?: string
    }
  }

  interface User {
    userType: 'ADMIN' | 'COMPANY' | 'EMPLOYEE' | 'CANDIDATE'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userType: 'ADMIN' | 'COMPANY' | 'EMPLOYEE' | 'CANDIDATE'
  }
}
