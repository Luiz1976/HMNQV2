// Debug endpoint para testar sessão e cookies
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug Session Endpoint Called')
    
    // Get cookies from headers
    const cookieHeader = request.headers.get('cookie')
    console.log('🍪 Raw cookie header:', cookieHeader)
    
    // Get cookies using Next.js cookies() function
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('next-auth.session-token')
    const csrfToken = cookieStore.get('next-auth.csrf-token')
    const callbackUrl = cookieStore.get('next-auth.callback-url')
    
    console.log('🍪 Session token from cookies():', sessionToken?.value)
    console.log('🍪 CSRF token from cookies():', csrfToken?.value)
    console.log('🍪 Callback URL from cookies():', callbackUrl?.value)
    
    // Try to get session
    const session = await getServerSession(authOptions)
    console.log('👤 Session found:', !!session)
    console.log('👤 Session user:', session?.user)
    
    // Parse all cookies manually
    const parsedCookies: { [key: string]: string } = {}
    if (cookieHeader) {
      cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=')
        if (name && value) {
          parsedCookies[name] = value
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      debug: {
        hasSession: !!session,
        sessionUser: session?.user || null,
        rawCookieHeader: cookieHeader,
        parsedCookies,
        nextAuthCookies: {
          sessionToken: sessionToken?.value || null,
          csrfToken: csrfToken?.value || null,
          callbackUrl: callbackUrl?.value || null
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          nextAuthUrl: process.env.NEXTAUTH_URL,
          hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET
        },
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('❌ Debug session error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}