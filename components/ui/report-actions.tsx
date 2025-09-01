'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Share2, Printer, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReportActionsProps {
  userName: string
  testDate: string
  className?: string
}

export function ReportActions({ userName, testDate, className }: ReportActionsProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('space-y-4', className)}
    >
      <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200/50 shadow-lg">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
                <Share2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  Imprimir relatório
                </h3>
                <p className="text-sm text-gray-600">
                  Baixe ou imprima este relatório grafológico
                </p>
              </div>
            </div>

            <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Relatório Completo
            </Badge>
          </div>

          {/* Single action */}
          <div className="grid grid-cols-1 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handlePrint}
                className="w-full h-auto p-4 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-2"
              >
                <Printer className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">Imprimir</div>
                  <div className="text-xs opacity-90">Versão física</div>
                </div>
              </Button>
            </motion.div>
          </div>

          {/* Informações adicionais */}
          <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Printer className="h-4 w-4" />
              <span>
                <strong>Relatório gerado em:</strong> {testDate} •{' '}
                <strong>Colaborador:</strong> {userName}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}