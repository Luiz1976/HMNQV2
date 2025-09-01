
// HumaniQ AI - NextAuth Configuration
// JWT-based authentication with RBAC

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from './db'
import { AuthUser } from './types'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔐 Authorization attempt:', credentials?.email)
        
        const email = credentials?.email?.trim()
        const password = credentials?.password
        
        if (!email || !password) {
          console.log('❌ Missing email or password')
          return null
        }

        try {
          const user = await db.user.findUnique({
            where: { 
              email: email.toLowerCase(),
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

          const isValidPassword = await bcrypt.compare(password, user.password)
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

          console.log('✅ User authorized successfully:', user.email)
          
          // Return simplified user data
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
              role: 'member'
            } : null,
            permissions: user.permissions.map(p => p.permission),
            lastLoginAt: user.lastLoginAt?.toISOString(),
            createdAt: user.createdAt.toISOString()
          }
        } catch (error) {
          console.error('❌ Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('🔐 JWT Callback - User present:', !!user)
      console.log('🔐 JWT Callback - Token before:', JSON.stringify(token, null, 2))
      
      if (user) {
        console.log('🔐 JWT - Adding user to token:', user.email)
        token.user = user as AuthUser
      }
      
      console.log('🔐 JWT Callback - Token after:', JSON.stringify(token, null, 2))
      return token
    },
    async session({ session, token }) {
      console.log('🔐 Session Callback - Called!')
      console.log('🔐 Session Callback - Token:', JSON.stringify(token, null, 2))
      console.log('🔐 Session Callback - Session before:', JSON.stringify(session, null, 2))
      
      if (token?.user) {
        console.log('🔐 Session - Setting user from token')
        session.user = token.user as AuthUser
      } else {
        console.log('🔐 Session - No user in token!')
      }
      
      console.log('🔐 Session Callback - Session after:', JSON.stringify(session, null, 2))
      return session
    }
  },
  events: {
    async signIn({ user }) {
      console.log(`✅ User ${user.email} signed in`)
    },
    async signOut() {
      console.log(`👋 User signed out`)
    }
  },
  debug: true
}

// User permissions constants
export const USER_PERMISSIONS = {
  // Admin permissions
  ADMIN_ALL: 'admin:all',
  ADMIN_USERS: 'admin:users',
  ADMIN_COMPANIES: 'admin:companies',
  ADMIN_TESTS: 'admin:tests',
  ADMIN_REPORTS: 'admin:reports',
  ADMIN_SETTINGS: 'admin:settings',
  
  // Company permissions
  COMPANY_VIEW: 'company:view',
  COMPANY_EDIT: 'company:edit',
  COMPANY_USERS: 'company:users',
  COMPANY_TESTS: 'company:tests',
  COMPANY_REPORTS: 'company:reports',
  
  // User permissions
  USER_VIEW: 'user:view',
  USER_EDIT: 'user:edit',
  USER_TESTS: 'user:tests',
  USER_RESULTS: 'user:results',
  
  // Test permissions
  TEST_TAKE: 'test:take',
  TEST_VIEW: 'test:view',
  TEST_RESULTS: 'test:results',
  TEST_MANAGE: 'test:manage'
} as const

export type UserPermission = typeof USER_PERMISSIONS[keyof typeof USER_PERMISSIONS]

// Helper functions for permission checking
export function hasPermission(userPermissions: string[], requiredPermission: UserPermission): boolean {
  return userPermissions.includes(requiredPermission) || userPermissions.includes(USER_PERMISSIONS.ADMIN_ALL)
}

export function hasAnyPermission(userPermissions: string[], requiredPermissions: UserPermission[]): boolean {
  return requiredPermissions.some(permission => hasPermission(userPermissions, permission))
}

export function hasAllPermissions(userPermissions: string[], requiredPermissions: UserPermission[]): boolean {
  return requiredPermissions.every(permission => hasPermission(userPermissions, permission))
}

// Role-based permission sets
export const ROLE_PERMISSIONS = {
  ADMIN: [
    USER_PERMISSIONS.ADMIN_ALL
  ],
  COMPANY_ADMIN: [
    USER_PERMISSIONS.COMPANY_VIEW,
    USER_PERMISSIONS.COMPANY_EDIT,
    USER_PERMISSIONS.COMPANY_USERS,
    USER_PERMISSIONS.COMPANY_TESTS,
    USER_PERMISSIONS.COMPANY_REPORTS,
    USER_PERMISSIONS.USER_VIEW,
    USER_PERMISSIONS.USER_EDIT,
    USER_PERMISSIONS.TEST_MANAGE
  ],
  COMPANY_USER: [
    USER_PERMISSIONS.COMPANY_VIEW,
    USER_PERMISSIONS.USER_VIEW,
    USER_PERMISSIONS.USER_EDIT,
    USER_PERMISSIONS.USER_TESTS,
    USER_PERMISSIONS.USER_RESULTS,
    USER_PERMISSIONS.TEST_TAKE,
    USER_PERMISSIONS.TEST_VIEW,
    USER_PERMISSIONS.TEST_RESULTS
  ],
  USER: [
    USER_PERMISSIONS.USER_VIEW,
    USER_PERMISSIONS.USER_EDIT,
    USER_PERMISSIONS.USER_TESTS,
    USER_PERMISSIONS.USER_RESULTS,
    USER_PERMISSIONS.TEST_TAKE,
    USER_PERMISSIONS.TEST_VIEW,
    USER_PERMISSIONS.TEST_RESULTS
  ]
} as const

export type UserRole = keyof typeof ROLE_PERMISSIONS

export function getRolePermissions(role: UserRole): UserPermission[] {
  return [...(ROLE_PERMISSIONS[role] || [])]
}

// Get default permissions for user type
export function getDefaultPermissions(userType: string): string[] {
  switch (userType) {
    case 'ADMIN':
      return [...ROLE_PERMISSIONS.ADMIN]
    case 'COMPANY_ADMIN':
      return [...ROLE_PERMISSIONS.COMPANY_ADMIN]
    case 'COMPANY_USER':
      return [...ROLE_PERMISSIONS.COMPANY_USER]
    case 'EMPLOYEE':
    case 'USER':
    default:
      return [...ROLE_PERMISSIONS.USER]
  }
}
