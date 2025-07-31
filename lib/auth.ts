
// HumaniQ AI - NextAuth Configuration
// JWT-based authentication with RBAC

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { db } from './db'
import { AuthUser } from './types'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔐 Authorization attempt:', credentials)
        console.log('🔐 Credentials type:', typeof credentials)
        console.log('🔐 Credentials keys:', credentials ? Object.keys(credentials) : 'null')
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        try {
          // Find user in database with company and permissions
          const user = await db.user.findUnique({
            where: { 
              email: credentials.email.toLowerCase(),
              isActive: true
            },
            include: {
              company: true,
              permissions: true
            }
          })

          console.log('👤 User found:', user ? 'Yes' : 'No')
          
          if (!user) {
            console.log('❌ User not found or inactive')
            return null
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password, 
            user.password
          )

          console.log('🔑 Password valid:', isValidPassword)
          
          if (!isValidPassword) {
            console.log('❌ Invalid password')
            return null
          }

          // Update last login
          await db.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          })

          // Return user data for JWT
          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userType: user.userType,
            avatarUrl: user.avatarUrl,
            company: user.company ? {
              id: user.company.id,
              name: user.company.name,
              role: 'member' // Could be enhanced with specific roles
            } : null,
            permissions: user.permissions.map(p => p.permission),
            lastLoginAt: user.lastLoginAt?.toISOString(),
            createdAt: user.createdAt.toISOString()
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw new Error('Erro interno do servidor')
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.user = user as AuthUser
      }

      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token?.user) {
        session.user = token.user as AuthUser
      }
      return session
    }
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User ${user.email} signed in`)
    },
    async signOut({ session, token }) {
      console.log(`User signed out`)
    }
  },
  debug: process.env.NODE_ENV === 'development'
}

// User permissions constants
export const USER_PERMISSIONS = {
  // Admin permissions
  ADMIN_ALL: 'admin:all',
  ADMIN_USERS: 'admin:users',
  ADMIN_COMPANIES: 'admin:companies',
  ADMIN_TESTS: 'admin:tests',
  ADMIN_ANALYTICS: 'admin:analytics',
  
  // Company permissions
  COMPANY_MANAGE: 'company:manage',
  COMPANY_EMPLOYEES: 'company:employees',
  COMPANY_TESTS: 'company:tests',
  COMPANY_ANALYTICS: 'company:analytics',
  COMPANY_INVITATIONS: 'company:invitations',
  
  // Test permissions
  TESTS_READ: 'tests:read',
  TESTS_WRITE: 'tests:write',
  TESTS_TAKE: 'tests:take',
  TESTS_RESULTS: 'tests:results',
  
  // Analytics permissions
  ANALYTICS_READ: 'analytics:read',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // ERP permissions
  ERP_CONFIGURE: 'erp:configure',
  ERP_SYNC: 'erp:sync'
} as const

// Helper functions for permission checking
export function hasPermission(
  userPermissions: string[], 
  requiredPermission: string
): boolean {
  return userPermissions.includes(requiredPermission) ||
         userPermissions.includes(USER_PERMISSIONS.ADMIN_ALL)
}

export function hasAnyPermission(
  userPermissions: string[], 
  permissions: string[]
): boolean {
  return permissions.some(p => hasPermission(userPermissions, p))
}

export function hasAllPermissions(
  userPermissions: string[], 
  permissions: string[]
): boolean {
  return permissions.every(p => hasPermission(userPermissions, p))
}

// Get default permissions for user types
export function getDefaultPermissions(userType: string): string[] {
  switch (userType) {
    case 'ADMIN':
      return [USER_PERMISSIONS.ADMIN_ALL]
    
    case 'COMPANY':
      return [
        USER_PERMISSIONS.COMPANY_MANAGE,
        USER_PERMISSIONS.COMPANY_EMPLOYEES,
        USER_PERMISSIONS.COMPANY_TESTS,
        USER_PERMISSIONS.COMPANY_ANALYTICS,
        USER_PERMISSIONS.COMPANY_INVITATIONS,
        USER_PERMISSIONS.TESTS_READ,
        USER_PERMISSIONS.TESTS_WRITE,
        USER_PERMISSIONS.ANALYTICS_READ,
        USER_PERMISSIONS.ANALYTICS_EXPORT
      ]
    
    case 'EMPLOYEE':
      return [
        USER_PERMISSIONS.TESTS_READ,
        USER_PERMISSIONS.TESTS_TAKE,
        USER_PERMISSIONS.TESTS_RESULTS
      ]
    
    case 'CANDIDATE':
      return [
        USER_PERMISSIONS.TESTS_TAKE
      ]
    
    default:
      return []
  }
}
