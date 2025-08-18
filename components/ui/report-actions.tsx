'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Share2, 
  Mail, 
  Link, 
  FileText,
  Printer,
  CheckCircle,
  Copy,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ReportActionsProps {
  testId: string;
  userName: string;
  testDate: string;
  className?: string;
}

export function ReportActions({
  testId,
  userName,
  testDate,
  className
}: ReportActionsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const response = await fetch(`/api/reports/${testId}/pdf`);
      
      if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `relatorio-grafologico-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Relatório PDF gerado com sucesso!', {
        description: 'O download será iniciado automaticamente.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      toast.error('Erro ao gerar PDF', {
        description: 'Tente novamente em alguns instantes.',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShareLink = async () => {
    const shareUrl = `${window.location.origin}/colaborador/resultados/${testId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      toast.success('Link copiado!', {
        description: 'O link do relatório foi copiado para a área de transferência.',
      });
      
      setTimeout(() => setLinkCopied(false), 3000);
    } catch (error) {
      toast.error('Erro ao copiar link', {
        description: 'Tente novamente.',
      });
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Relatório Grafológico - ${userName}`);
    const body = encodeURIComponent(
      `Olá,\n\nCompartilho com você o relatório grafológico de ${userName}, realizado em ${testDate}.\n\nAcesse o relatório completo através do link: ${window.location.href}\n\nAtenciosamente`
    );
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('space-y-4', className)}
    >
      <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200/50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
                <Share2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  Compartilhar Relatório
                </h3>
                <p className="text-sm text-gray-600">
                  Baixe ou compartilhe este relatório grafológico
                </p>
              </div>
            </div>
            
            <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Relatório Completo
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Download PDF */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="w-full h-auto p-4 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-2"
              >
                {isGeneratingPDF ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <FileText className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <Download className="h-6 w-6" />
                )}
                <div className="text-center">
                  <div className="font-semibold">
                    {isGeneratingPDF ? 'Gerando...' : 'Download PDF'}
                  </div>
                  <div className="text-xs opacity-90">
                    Relatório completo
                  </div>
                </div>
              </Button>
            </motion.div>

            {/* Copiar Link */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleShareLink}
                className="w-full h-auto p-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-2"
              >
                {linkCopied ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <Copy className="h-6 w-6" />
                )}
                <div className="text-center">
                  <div className="font-semibold">
                    {linkCopied ? 'Copiado!' : 'Copiar Link'}
                  </div>
                  <div className="text-xs opacity-90">
                    Compartilhar URL
                  </div>
                </div>
              </Button>
            </motion.div>

            {/* Compartilhar por Email */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleEmailShare}
                className="w-full h-auto p-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-2"
              >
                <Mail className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">Email</div>
                  <div className="text-xs opacity-90">
                    Enviar por email
                  </div>
                </div>
              </Button>
            </motion.div>

            {/* Imprimir */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handlePrint}
                className="w-full h-auto p-4 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-2"
              >
                <Printer className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">Imprimir</div>
                  <div className="text-xs opacity-90">
                    Versão física
                  </div>
                </div>
              </Button>
            </motion.div>
          </div>

          {/* Informações adicionais */}
          <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>
                <strong>Relatório gerado em:</strong> {testDate} • 
                <strong>Colaborador:</strong> {userName}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}