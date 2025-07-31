
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth
    const { pathname } = req.nextUrl

    console.log('Middleware path:', pathname)
    console.log('Middleware token:', token)

    // Allow access to auth pages without authentication
    if (pathname.startsWith('/auth/')) {
      return NextResponse.next()
    }

    // Redirect unauthenticated users to login
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // Role-based routing
    const userType = token.user?.userType

    // Root dashboard redirect based on user type
    if (pathname === '/dashboard' || pathname === '/') {
      console.log('Redirecting based on user type:', userType)
      switch (userType) {
        case 'ADMIN':
          return NextResponse.redirect(new URL('/admin/convites', req.url))
        case 'COMPANY':
          return NextResponse.redirect(new URL('/empresa', req.url))
        case 'EMPLOYEE':
        case 'CANDIDATE':
          return NextResponse.redirect(
            new URL('/colaborador/psicossociais', req.url),
          )
        default:
          return NextResponse.redirect(new URL('/auth/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (req.nextUrl.pathname.startsWith('/auth/') || 
            req.nextUrl.pathname.startsWith('/api/auth/') ||
            req.nextUrl.pathname.startsWith('/invite/')) {
          return true
        }
        
        // Require token for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - @vite (Vite development server)
     * - __nextjs (Next.js internal)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public|@vite|__nextjs).*)',
  ],
}
