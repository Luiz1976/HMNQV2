'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface VisualHighlight {
  x: number
  y: number
  width: number
  height: number
  type: string
  interpretation: string
  technicalDetails: string
}

interface ManuscriptViewerProps {
  manuscriptUrl?: string
  highlights: VisualHighlight[]
}

interface TooltipData {
  x: number
  y: number
  highlight: VisualHighlight
}

export default function ManuscriptViewer({ manuscriptUrl, highlights }: ManuscriptViewerProps) {
  // Debug logs
  console.log('ManuscriptViewer - manuscriptUrl:', manuscriptUrl);
  console.log('ManuscriptViewer - highlights:', highlights);
  
  const [zoom, setZoom] = useState(1)
  const [showOverlays, setShowOverlays] = useState(true)
  const [selectedHighlight, setSelectedHighlight] = useState<VisualHighlight | null>(null)
  const [imageError, setImageError] = useState(false)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
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

  const toggleOverlays = () => {
    setShowOverlays(prev => !prev)
  }

  const getHighlightColor = (type: string) => {
    const colors = {
      'pressure': '#EF4444', // red
      'size': '#3B82F6', // blue
      'inclination': '#10B981', // green
      'spacing': '#F59E0B', // yellow
      'rhythm': '#8B5CF6', // purple
      'regularity': '#EC4899', // pink
      'default': '#6B7280' // gray
    }
    return colors[type as keyof typeof colors] || colors.default
  }

  const handleHighlightClick = (highlight: VisualHighlight, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedHighlight(highlight)
  }

  const handleHighlightHover = (highlight: VisualHighlight, event: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setTooltip({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        highlight
      })
    }
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  // Mock manuscript image if none provided
  const defaultManuscriptUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23f8fafc'/%3E%3Ctext x='300' y='200' text-anchor='middle' fill='%236b7280' font-family='serif' font-size='24'%3EManuscrito de Análise%3C/text%3E%3Cpath d='M50 100 Q150 80 250 100 T450 100' stroke='%23374151' stroke-width='2' fill='none'/%3E%3Cpath d='M50 150 Q200 130 350 150 T550 150' stroke='%23374151' stroke-width='2' fill='none'/%3E%3Cpath d='M50 200 Q180 180 300 200 T500 200' stroke='%23374151' stroke-width='2' fill='none'/%3E%3Cpath d='M50 250 Q220 230 400 250 T580 250' stroke='%23374151' stroke-width='2' fill='none'/%3E%3Cpath d='M50 300 Q160 280 280 300 T480 300' stroke='%23374151' stroke-width='2' fill='none'/%3E%3C/svg%3E"

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Manuscrito Anotado
          </CardTitle>
          {imageError && (
            <div className="text-red-600 text-sm">
              Erro ao carregar imagem. URL: {manuscriptUrl || 'não fornecida'}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleOverlays}
              className={showOverlays ? 'bg-blue-50 border-blue-200' : ''}
            >
              {showOverlays ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showOverlays ? 'Ocultar' : 'Mostrar'} Anotações
            </Button>
          </div>
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
          onMouseLeave={handleMouseLeave}
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
            
            {/* Visual Highlights Overlays */}
            <AnimatePresence>
              {showOverlays && highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${highlight.x}%`,
                    top: `${highlight.y}%`,
                    width: `${highlight.width}%`,
                    height: `${highlight.height}%`,
                  }}
                  onClick={(e) => handleHighlightClick(highlight, e)}
                  onMouseEnter={(e) => handleHighlightHover(highlight, e)}
                >
                  <div 
                    className="w-full h-full border-2 border-dashed rounded transition-all duration-200 group-hover:bg-opacity-20"
                    style={{
                      borderColor: getHighlightColor(highlight.type),
                      backgroundColor: `${getHighlightColor(highlight.type)}20`
                    }}
                  >
                    <div 
                      className="absolute -top-6 left-0 px-2 py-1 text-xs font-medium text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: getHighlightColor(highlight.type) }}
                    >
                      {highlight.type}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs"
              style={{
                left: tooltip.x + 10,
                top: tooltip.y - 10,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getHighlightColor(tooltip.highlight.type) }}
                ></div>
                <Badge variant="secondary" className="text-xs">
                  {tooltip.highlight.type}
                </Badge>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {tooltip.highlight.interpretation}
              </p>
              <p className="text-xs text-gray-600">
                {tooltip.highlight.technicalDetails}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Legenda das Anotações</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from(new Set(highlights.map(h => h.type))).map((type, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 border-2 border-dashed rounded"
                  style={{ 
                    borderColor: getHighlightColor(type),
                    backgroundColor: `${getHighlightColor(type)}20`
                  }}
                ></div>
                <span className="text-sm text-gray-700 capitalize">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Highlight Details */}
        <AnimatePresence>
          {selectedHighlight && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getHighlightColor(selectedHighlight.type) }}
                  ></div>
                  <h4 className="font-medium text-gray-900 capitalize">
                    Análise: {selectedHighlight.type}
                  </h4>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedHighlight(null)}
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Interpretação:</span>
                  <p className="text-sm text-gray-600 mt-1">{selectedHighlight.interpretation}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Detalhes Técnicos:</span>
                  <p className="text-sm text-gray-600 mt-1">{selectedHighlight.technicalDetails}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}