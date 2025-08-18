'use client'

import { useSession } from 'next-auth/react'
import { AuthUser } from '@/lib/types'

export interface UseAuthReturn {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession()
  
  return {
    user: session?.user as AuthUser || null,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user
  }
}