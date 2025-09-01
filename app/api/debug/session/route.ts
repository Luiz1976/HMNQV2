import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug Session - Starting...')
    
    // Get cookies from request
    const cookies = request.headers.get('cookie')
    console.log('🔍 Debug Session - Cookies:', cookies)
    
    // Get session using NextAuth
    const session = await getServerSession(authOptions)
    console.log('🔍 Debug Session - Session result:', JSON.stringify(session, null, 2))
    
    return NextResponse.json({
      success: true,
      session,
      cookies,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('🔍 Debug Session - Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}