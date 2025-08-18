'use client'

// HumaniQ - Página de Documentos
// Permite visualizar e baixar documentos em PDF

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Document {
  name: string
  title: string
  description: string
}

const documents: Document[] = [
  {
    name: 'mood-journal-architecture',
    title: 'Mood Journal App - Arquitetura Técnica',
    description: 'Documento completo da arquitetura técnica do aplicativo de diário de humor, incluindo design de sistema, modelos de dados e APIs.'
  }
]

export default function DocumentsPage() {
  const [loadingPdf, setLoadingPdf] = useState<string | null>(null)

  const downloadPDF = async (documentName: string, title: string) => {
    try {
      setLoadingPdf(documentName)
      
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
      setLoadingPdf(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 Documentos
          </h1>
          <p className="text-lg text-gray-600">
            Acesse e baixe documentos técnicos em formato PDF
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-6">
          {documents.map((doc) => (
            <Card key={doc.name} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  {doc.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  {doc.description}
                </p>
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => downloadPDF(doc.name, doc.title)}
                    disabled={loadingPdf === doc.name}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {loadingPdf === doc.name ? (
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Sobre os PDFs
                </h3>
                <p className="text-blue-700 text-sm">
                  Os documentos são convertidos automaticamente de Markdown para PDF, 
                  preservando a formatação, tabelas, diagramas e código. 
                  Ideal para compartilhamento e arquivamento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}