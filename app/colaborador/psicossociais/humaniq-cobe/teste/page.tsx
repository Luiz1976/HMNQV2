'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HumaniqCobeTestePage() {
  const router = useRouter()

  useEffect(() => {
    // Redireciona para a página principal do teste HumaniQ Pesquisa de Clima
    router.replace('/colaborador/psicossociais/humaniq-cobe?start=true')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Redirecionando para o teste HumaniQ Pesquisa de Clima...</p>
      </div>
    </div>
  )
}