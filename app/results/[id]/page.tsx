'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function ResultsRedirect() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    // Redireciona para a página de detalhes geral de resultados
    if (id) {
      toast.success('Abrindo seu resultado...')
      const current = new URLSearchParams(window.location.search)
      const suffix = current.get('saved') === '1' ? '?saved=1' : ''
      router.replace(`/colaborador/resultados/${id}${suffix}`)
    } else {
      // Fallback: ir para a listagem de resultados
      router.replace('/colaborador/resultados')
    }
  }, [id, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando...</p>
      </div>
    </div>
  )
}