'use client'

// HumaniQ - Componente de Geração de PDF para Resultados Grafológicos
// Permite download de relatório completo em PDF com design profissional

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  FileText, 
  Share2, 
  Mail, 
  Link, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

// Interface para dados do PDF
interface PDFData {
  testResult: {
    id: string
    testType: string
    userName: string
    userEmail: string
    companyName: string
    completedAt: string
    scores: Record<string, number>
    interpretation: string
    recommendations: string[]
  }
  imageAnalysis?: {
    imageUrl: string
    highlights: any[]
    analysis: string
    behavioralAnalysis: any
    confidence: number
  }
  aiAnalysis?: {
    summary: string
    insights: string[]
    recommendations: string[]
  }
}

// Props do componente
interface PDFGeneratorProps {
  data: PDFData
  className?: string
  showShareOptions?: boolean
  onShareSuccess?: () => void
}

export function PDFGenerator({
  data,
  className = "",
  showShareOptions = true,
  onShareSuccess
}: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareMethod, setShareMethod] = useState<string | null>(null)

  // Função para gerar PDF
  const generatePDF = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testResultId: data.testResult.id,
          includeImage: true,
          includeAnalysis: true,
          format: 'professional'
        })
      })

      if (!response.ok) {
        throw new Error('Falha na geração do PDF')
      }

      // Download do arquivo
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `relatorio-grafologico-${data.testResult.userName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('PDF gerado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast.error('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Função para compartilhar por email
  const shareByEmail = async () => {
    setIsSharing(true)
    setShareMethod('email')
    
    try {
      const response = await fetch('/api/share/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testResultId: data.testResult.id,
          recipientEmail: data.testResult.userEmail,
          includeAttachment: true
        })
      })

      if (!response.ok) {
        throw new Error('Falha no envio por email')
      }

      toast.success('Relatório enviado por email!')
      onShareSuccess?.()
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      toast.error('Erro ao enviar email. Tente novamente.')
    } finally {
      setIsSharing(false)
      setShareMethod(null)
    }
  }

  // Função para gerar link de compartilhamento
  const generateShareLink = async () => {
    setIsSharing(true)
    setShareMethod('link')
    
    try {
      const response = await fetch('/api/share/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testResultId: data.testResult.id,
          expiresIn: '7d' // Link expira em 7 dias
        })
      })

      if (!response.ok) {
        throw new Error('Falha na geração do link')
      }

      const { shareUrl } = await response.json()
      
      // Copiar para clipboard
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copiado para a área de transferência!')
      onShareSuccess?.()
    } catch (error) {
      console.error('Erro ao gerar link:', error)
      toast.error('Erro ao gerar link. Tente novamente.')
    } finally {
      setIsSharing(false)
      setShareMethod(null)
    }
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-semibold">Relatório Completo</h3>
            </div>
            <p className="text-gray-600">
              Baixe ou compartilhe seu relatório grafológico completo
            </p>
          </div>

          {/* Informações do relatório */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Participante:</span>
              <span className="text-sm text-gray-900">{data.testResult.userName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Tipo de Teste:</span>
              <Badge variant="secondary">{data.testResult.testType}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Data:</span>
              <span className="text-sm text-gray-900">
                {new Date(data.testResult.completedAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            {data.imageAnalysis && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Confiança da Análise:</span>
                <Badge variant="outline">{data.imageAnalysis.confidence}%</Badge>
              </div>
            )}
          </div>

          {/* Conteúdo incluído */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Conteúdo Incluído:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Resultados e pontuações
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Interpretação detalhada
              </div>
              {data.imageAnalysis && (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Imagem com destaques
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Análise comportamental IA
                  </div>
                </>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Recomendações personalizadas
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Design profissional
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="space-y-4">
            {/* Download PDF */}
            <Button
              onClick={generatePDF}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Relatório PDF
                </>
              )}
            </Button>

            {/* Opções de compartilhamento */}
            {showShareOptions && (
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">ou compartilhar</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={shareByEmail}
                    disabled={isSharing}
                    className="flex items-center gap-2"
                  >
                    {isSharing && shareMethod === 'email' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    Por Email
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={generateShareLink}
                    disabled={isSharing}
                    className="flex items-center gap-2"
                  >
                    {isSharing && shareMethod === 'link' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Link className="h-4 w-4" />
                    )}
                    Gerar Link
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Aviso de privacidade */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Privacidade e Segurança</p>
                <p>
                  Seus dados são protegidos e o compartilhamento segue as políticas de privacidade da empresa. 
                  Links de compartilhamento expiram automaticamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PDFGenerator