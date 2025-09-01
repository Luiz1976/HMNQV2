
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ColaboradorSidebar } from './_components/colaborador-sidebar'

export default function ColaboradorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {

  }, [status, session, router])





  return (
    <div className="flex min-h-screen bg-gray-50">
      <ColaboradorSidebar />
      <main className="flex-1">
        <div className="container mx-auto p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
