
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { DocumentDownloadButton } from '@/components/ui/document-download-button'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showDocuments, setShowDocuments] = useState(false)
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (status === 'loading' || hasRedirected.current) return

    if (!session) {
      hasRedirected.current = true
      window.location.replace('/auth/login')
      return
    }

    // Show documents option for 3 seconds before redirecting
    setShowDocuments(true)
    const timer = setTimeout(() => {
      if (hasRedirected.current) return
      
      hasRedirected.current = true
      // Use window.location.replace to prevent multiple tabs
      switch (session.user?.userType) {
        case 'ADMIN':
          window.location.replace('/admin/convites')
          break
        case 'COMPANY':
          window.location.replace('/empresa/saude')
          break
        case 'EMPLOYEE':
        case 'CANDIDATE':
          window.location.replace('/colaborador/psicossociais')
          break
        default:
          window.location.replace('/auth/login')
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (showDocuments && session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              📄 Download de Documento
            </h1>
            <p className="text-gray-600">
              Baixe o documento de arquitetura técnica do Mood Journal App
            </p>
          </div>
          
          <div className="space-y-4">
            <DocumentDownloadButton
              documentName="mood-journal-architecture"
              title="Mood Journal App - Arquitetura Técnica"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              size="lg"
            />
            
            <Link href="/documents">
              <Button variant="outline" className="w-full">
                Ver Todos os Documentos
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            Redirecionando automaticamente em alguns segundos...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}
