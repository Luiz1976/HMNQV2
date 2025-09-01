'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { ZoomIn, ZoomOut, RotateCcw, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface VisualHighlight {
  x: number
  y: number
  width: number
  height: number
  type: string
  interpretation: string
  technicalDetails: string
  snippet?: string
}

interface ManuscriptViewerProps {
  manuscriptUrl?: string
  highlights: VisualHighlight[]
}



export default function ManuscriptViewer({ manuscriptUrl, highlights }: ManuscriptViewerProps) {
  // Debug logs
  console.log('ManuscriptViewer - manuscriptUrl:', manuscriptUrl);
  console.log('ManuscriptViewer - highlights:', highlights);
  
  const [zoom, setZoom] = useState(1)
  const [imageError, setImageError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleResetZoom = () => {
    setZoom(1)
  }



  // Mock manuscript image if none provided
  const defaultManuscriptUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23f8fafc'/%3E%3Ctext x='300' y='200' text-anchor='middle' fill='%236b7280' font-family='serif' font-size='24'%3EManuscrito de Análise%3C/text%3E%3Cpath d='M50 100 Q150 80 250 100 T450 100' stroke='%23374151' stroke-width='2' fill='none'/%3E%3Cpath d='M50 150 Q200 130 350 150 T550 150' stroke='%23374151' stroke-width='2' fill='none'/%3E%3Cpath d='M50 200 Q180 180 300 200 T500 200' stroke='%23374151' stroke-width='2' fill='none'/%3E%3Cpath d='M50 250 Q220 230 400 250 T580 250' stroke='%23374151' stroke-width='2' fill='none'/%3E%3Cpath d='M50 300 Q160 280 280 300 T480 300' stroke='%23374151' stroke-width='2' fill='none'/%3E%3C/svg%3E"

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Manuscrito
          </CardTitle>
          {imageError && (
            <div className="text-red-600 text-sm">
              Erro ao carregar imagem. URL: {manuscriptUrl || 'não fornecida'}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Zoom Controls */}
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.5}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 3}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetZoom}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Manuscript Viewer */}
        <div 
          ref={containerRef}
          className="relative overflow-auto border-2 border-gray-200 rounded-lg bg-gray-50 max-h-96"
        >
          <div 
            className="relative inline-block"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          >
            <img
              ref={imageRef}
              src={manuscriptUrl || defaultManuscriptUrl}
              alt="Manuscrito para análise"
              className="block max-w-none"
              draggable={false}
              onLoad={() => {
                console.log('Imagem carregada com sucesso:', manuscriptUrl);
                setImageError(false);
              }}
              onError={(e) => {
                console.error('Erro ao carregar imagem:', manuscriptUrl, e);
                setImageError(true);
              }}
            />
            
            {/* Visual Highlights Overlays - REMOVIDAS */}
          </div>
        </div>

        {/* Tooltip - REMOVIDO */}

        {/* Legend - REMOVIDA */}

        {/* Selected Highlight Details - REMOVIDO */}
      </CardContent>
    </Card>
  )
}