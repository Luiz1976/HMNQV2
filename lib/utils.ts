
// HumaniQ AI - Utility Functions
// Common utilities for the application

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { AuthUser, CompanySize, UserType } from "./types"

// Tailwind CSS class utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===== FORMAT UTILITIES =====

export function formatCurrency(
  amount: number,
  currency: string = 'BRL',
  locale: string = 'pt-BR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(
  number: number,
  locale: string = 'pt-BR'
): string {
  return new Intl.NumberFormat(locale).format(number)
}

export function formatPercent(
  number: number,
  locale: string = 'pt-BR',
  decimals: number = 1
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number / 100)
}

export function formatDate(
  date: string | Date,
  locale: string = 'pt-BR',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(dateObj)
}

export function formatDateTime(
  date: string | Date,
  locale: string = 'pt-BR'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export function formatRelativeTime(
  date: string | Date,
  locale: string = 'pt-BR'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second')
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year')
  }
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes === 0) {
    return `${remainingSeconds}s`
  } else if (minutes < 60) {
    return `${minutes}min ${remainingSeconds}s`
  } else {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}min`
  }
}

// ===== VALIDATION UTILITIES =====

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '')
  
  if (cleanCNPJ.length !== 14) return false
  
  // Check for known invalid CNPJs
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false
  
  // Validate CNPJ algorithm
  let sum = 0
  let pos = 5
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * pos--
    if (pos < 2) pos = 9
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(cleanCNPJ.charAt(12))) return false
  
  sum = 0
  pos = 6
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * pos--
    if (pos < 2) pos = 9
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  return result === parseInt(cleanCNPJ.charAt(13))
}

export function isValidPassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// ===== TEXT UTILITIES =====

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// ===== USER UTILITIES =====

export function getUserDisplayName(user: AuthUser | null): string {
  if (!user) return 'Usuário'
  return `${user.firstName} ${user.lastName}`
}

export function getUserTypeLabel(userType: UserType): string {
  const labels = {
    ADMIN: 'Administrador',
    COMPANY: 'Empresa',
    EMPLOYEE: 'Funcionário',
    CANDIDATE: 'Candidato'
  }
  return labels[userType] || userType
}

export function getCompanySizeLabel(size: CompanySize): string {
  const labels = {
    STARTUP: 'Startup (1-10)',
    SMALL: 'Pequena (11-50)',
    MEDIUM: 'Média (51-200)',
    LARGE: 'Grande (201-1000)',
    ENTERPRISE: 'Corporação (1000+)'
  }
  return labels[size] || size
}

// ===== COLOR UTILITIES =====

export function getRiskLevelColor(level: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    high: 'text-red-600 bg-red-50 border-red-200'
  }
  return colors[level]
}

export function getStatusColor(status: string): string {
  const normalizedStatus = status.toLowerCase()
  
  if (['active', 'completed', 'success'].includes(normalizedStatus)) {
    return 'text-green-600 bg-green-50 border-green-200'
  } else if (['pending', 'in_progress', 'warning'].includes(normalizedStatus)) {
    return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  } else if (['inactive', 'cancelled', 'error', 'expired'].includes(normalizedStatus)) {
    return 'text-red-600 bg-red-50 border-red-200'
  } else {
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

// ===== ARRAY UTILITIES =====

export function groupBy<T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export function uniqueBy<T, K extends keyof T>(array: T[], key: K): T[] {
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

// ===== OBJECT UTILITIES =====

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

export function omit<T, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach(key => {
    delete result[key]
  })
  return result
}

export function isEmpty(value: any): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

// ===== URL UTILITIES =====

export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

export function parseQueryString(search: string): Record<string, string> {
  const params = new URLSearchParams(search)
  const result: Record<string, string> = {}
  
  params.forEach((value, key) => {
    result[key] = value
  })
  
  return result
}

// ===== LOCAL STORAGE UTILITIES =====

export function setLocalStorage(key: string, value: any): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }
}

export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
    }
  }
  return defaultValue
}

export function removeLocalStorage(key: string): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  }
}

// ===== ERROR UTILITIES =====

export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error?.message) return error.error.message
  return 'Ocorreu um erro inesperado'
}

export function isNetworkError(error: any): boolean {
  return error?.code === 'NETWORK_ERROR' || 
         error?.message?.includes('fetch') ||
         error?.message?.includes('Network')
}

// ===== CONSTANTS =====

export const APP_CONFIG = {
  name: 'HumaniQ AI',
  description: 'Plataforma SaaS de Avaliações Psicossociais',
  version: '1.0.0',
  supportEmail: 'suporte@humaniq-ai.com',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  apiTimeout: 30000, // 30 seconds
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  COMPANY: '/company',
  EMPLOYEE: '/employee',
  TESTS: '/tests',
  ANALYTICS: '/analytics',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const
