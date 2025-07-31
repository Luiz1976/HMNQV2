
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { ColaboradorSidebar } from './_components/colaborador-sidebar'

export default function ColaboradorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  }

  if (!session || !['EMPLOYEE', 'CANDIDATE'].includes(session.user?.userType || '')) {
    redirect('/auth/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ColaboradorSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
