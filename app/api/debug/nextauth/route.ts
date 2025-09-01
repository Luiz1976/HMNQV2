import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 NextAuth Debug Endpoint Called')
    
    // Get all cookies
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()
    
    console.log('🍪 All cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })))
    
    // Try to get session
    const session = await getServerSession(authOptions)
    console.log('👤 Session found:', !!session)
    console.log('👤 Session details:', session)
    
    // Check NextAuth specific cookies
    const nextAuthCookies = allCookies.filter(c => c.name.startsWith('next-auth'))
    console.log('🔐 NextAuth cookies:', nextAuthCookies)
    
    return NextResponse.json({
      success: true,
      debug: {
        hasSession: !!session,
        sessionUser: session?.user || null,
        allCookiesCount: allCookies.length,
        nextAuthCookiesCount: nextAuthCookies.length,
        nextAuthCookies: nextAuthCookies.map(c => ({
          name: c.name,
          hasValue: !!c.value,
          valueLength: c.value?.length || 0
        })),
        environment: {
          nodeEnv: process.env.NODE_ENV,
          nextAuthUrl: process.env.NEXTAUTH_URL,
          hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
          nextjsVersion: process.env.npm_package_dependencies_next || 'unknown'
        },
        authOptions: {
          sessionStrategy: authOptions.session?.strategy,
          hasSecret: !!authOptions.secret,
          providersCount: authOptions.providers?.length || 0
        },
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('❌ NextAuth debug error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}