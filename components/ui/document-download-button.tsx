'use client'

// HumaniQ - Componente de Download de Documentos
// Botão reutilizável para download de documentos em PDF

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface DocumentDownloadButtonProps {
  documentName: string
  title: string
  className?: string
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'sm' | 'default' | 'lg'
}

export function DocumentDownloadButton({
  documentName,
  title,
  className = '',
  variant = 'default',
  size = 'default'
}: DocumentDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const downloadPDF = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/documents/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentName,
          title
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao gerar PDF')
      }

      // Criar blob do PDF
      const blob = await response.blob()
      
      // Criar URL temporária e fazer download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${documentName}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      
      // Limpar recursos
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('PDF baixado com sucesso!')
      
    } catch (error) {
      console.error('Erro ao baixar PDF:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao baixar PDF')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={downloadPDF}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Gerando PDF...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Baixar PDF
        </>
      )}
    </Button>
  )
}