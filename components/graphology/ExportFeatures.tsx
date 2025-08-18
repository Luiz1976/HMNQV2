'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Download, 
  Share2, 
  FileText, 
  Printer, 
  Users, 
  Link, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Lock, 
  Eye,
  MoreVertical
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface ExportFeaturesProps {
  analysisId: string
  analysisData?: any
  onExportPDF?: () => Promise<void>
  onShare?: (options: ShareOptions) => Promise<string>
}

interface ShareOptions {
  email?: string
  message?: string
  expiresIn?: number // hours
  accessLevel: 'view' | 'download' | 'full'
}

export default function ExportFeatures({ 
  analysisId, 
  analysisData, 
  onExportPDF,
  onShare 
}: ExportFeaturesProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareEmail, setShareEmail] = useState('')
  const [shareMessage, setShareMessage] = useState('')
  const [shareExpiry, setShareExpiry] = useState(24)
  const [accessLevel, setAccessLevel] = useState<'view' | 'download' | 'full'>('view')
  const [shareUrl, setShareUrl] = useState('')

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      if (onExportPDF) {
        await onExportPDF()
        toast.success('PDF exportado com sucesso!')
      } else {
        // Fallback PDF generation
        await generatePDFReport()
      }
    } catch (error) {
      toast.error('Erro ao exportar PDF')
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const generatePDFReport = async () => {
    // Import jsPDF dynamically to avoid SSR issues
    const { jsPDF } = await import('jspdf')
    const html2canvas = (await import('html2canvas')).default

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Add header
    pdf.setFontSize(20)
    pdf.setTextColor(59, 130, 246) // blue-600
    pdf.text('Relatório de Análise Grafológica', pageWidth / 2, 20, { align: 'center' })
    
    // Add analysis ID
    pdf.setFontSize(10)
    pdf.setTextColor(107, 114, 128) // gray-500
    pdf.text(`ID da Análise: ${analysisId}`, pageWidth / 2, 30, { align: 'center' })
    
    // Add timestamp
    pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, 35, { align: 'center' })
    
    let yPosition = 50
    
    // Add content sections
    if (analysisData) {
      // Technical observations
      if (analysisData.technicalObservations) {
        pdf.setFontSize(14)
        pdf.setTextColor(0, 0, 0)
        pdf.text('Observações Técnicas', 20, yPosition)
        yPosition += 10
        
        pdf.setFontSize(10)
        const splitText = pdf.splitTextToSize(analysisData.technicalObservations, pageWidth - 40)
        pdf.text(splitText, 20, yPosition)
        yPosition += splitText.length * 4 + 10
      }
      
      // Behavioral summary
      if (analysisData.behavioralSummary) {
        pdf.setFontSize(14)
        pdf.text('Resumo Comportamental', 20, yPosition)
        yPosition += 10
        
        pdf.setFontSize(10)
        const splitText = pdf.splitTextToSize(analysisData.behavioralSummary, pageWidth - 40)
        pdf.text(splitText, 20, yPosition)
        yPosition += splitText.length * 4 + 10
      }
      
      // Professional trends
      if (analysisData.professionalTrends) {
        pdf.setFontSize(14)
        pdf.text('Tendências Profissionais', 20, yPosition)
        yPosition += 10
        
        Object.entries(analysisData.professionalTrends).forEach(([key, value]) => {
          pdf.setFontSize(10)
          pdf.text(`${key}: ${value}%`, 25, yPosition)
          yPosition += 6
        })
        yPosition += 10
      }
    }
    
    // Add footer
    pdf.setFontSize(8)
    pdf.setTextColor(107, 114, 128)
    pdf.text('Este relatório é confidencial e destinado apenas ao uso autorizado.', pageWidth / 2, pageHeight - 10, { align: 'center' })
    
    // Save the PDF
    pdf.save(`relatorio-grafologico-${analysisId}.pdf`)
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const shareOptions: ShareOptions = {
        email: shareEmail,
        message: shareMessage,
        expiresIn: shareExpiry,
        accessLevel
      }
      
      if (onShare) {
        const url = await onShare(shareOptions)
        setShareUrl(url)
        toast.success('Link de compartilhamento gerado!')
      } else {
        // Fallback share URL generation
        const url = `${window.location.origin}/shared/graphology/${analysisId}?expires=${Date.now() + shareExpiry * 3600000}`
        setShareUrl(url)
        toast.success('Link de compartilhamento gerado!')
      }
    } catch (error) {
      toast.error('Erro ao gerar link de compartilhamento')
      console.error('Share error:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Link copiado para a área de transferência!')
    } catch (error) {
      toast.error('Erro ao copiar link')
    }
  }

  const sendByEmail = () => {
    const subject = 'Relatório de Análise Grafológica'
    const body = `Olá,\n\nCompartilho com você o relatório de análise grafológica.\n\nAcesse através do link: ${shareUrl}\n\n${shareMessage}\n\nAtenciosamente`
    const mailtoUrl = `mailto:${shareEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Compact Export/Share Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar Relatório
            <MoreVertical className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleExportPDF} disabled={isExporting}>
            {isExporting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 mr-2"
              >
                <Clock className="h-4 w-4" />
              </motion.div>
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            {isExporting ? 'Gerando PDF...' : 'Exportar PDF'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Users className="h-4 w-4 mr-2" />
                Gerar Link de Compartilhamento
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-purple-600" />
                  Compartilhar Relatório
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Email do destinatário (opcional)
                  </label>
                  <Input
                    type="email"
                    placeholder="exemplo@email.com"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Mensagem personalizada (opcional)
                  </label>
                  <Textarea
                    placeholder="Adicione uma mensagem personalizada..."
                    value={shareMessage}
                    onChange={(e) => setShareMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Access Level */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Nível de acesso
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: 'view', label: 'Ver', icon: <Eye className="h-4 w-4" /> },
                      { value: 'download', label: 'Baixar', icon: <Download className="h-4 w-4" /> },
                      { value: 'full', label: 'Completo', icon: <Lock className="h-4 w-4" /> }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={accessLevel === option.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAccessLevel(option.value as any)}
                      >
                        {option.icon}
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Expiry */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Expiração do link (horas)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="168"
                    value={shareExpiry}
                    onChange={(e) => setShareExpiry(Number(e.target.value))}
                  />
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={handleShare}
                  disabled={isSharing}
                  className="w-full"
                >
                  {isSharing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 mr-2"
                    >
                      <Clock className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Link className="h-4 w-4 mr-2" />
                  )}
                  {isSharing ? 'Gerando...' : 'Gerar Link'}
                </Button>

                {/* Share URL Result */}
                <AnimatePresence>
                  {shareUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">Link gerado!</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Input 
                            value={shareUrl} 
                            readOnly 
                            className="flex-1 text-sm"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => copyToClipboard(shareUrl)}
                          >
                            <Link className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {shareEmail && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={sendByEmail}
                            className="w-full"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar por Email
                          </Button>
                        )}
                      </div>
                      
                      <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
                        <AlertCircle className="h-4 w-4" />
                        <span>Expira em {shareExpiry}h</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}