'use client'

// HumaniQ - Componente de Visualização Interativa de Imagem Grafológica
// Exibe imagem com destaques visuais e tooltips informativos

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Interface para destaques na imagem
interface ImageHighlight {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: 'pressure' | 'size' | 'inclination' | 'spacing' | 'organization' | 'regularity'
  description: string
  interpretation: string
  confidence: number
}

// Props do componente
interface InteractiveImageViewerProps {
  imageUrl: string
  highlights: ImageHighlight[]
  title?: string
  className?: string
  showControls?: boolean
  onHighlightClick?: (highlight: ImageHighlight) => void
}

// Cores para diferentes tipos de destaque
const highlightColors = {
  pressure: 'rgba(139, 69, 19, 0.3)', // Marrom
  size: 'rgba(34, 139, 34, 0.3)', // Verde
  inclination: 'rgba(30, 144, 255, 0.3)', // Azul
  spacing: 'rgba(255, 165, 0, 0.3)', // Laranja
  organization: 'rgba(128, 0, 128, 0.3)', // Roxo
  regularity: 'rgba(220, 20, 60, 0.3)' // Vermelho
}

// Ícones para tipos de destaque
const highlightIcons = {
  pressure: '💪',
  size: '📏',
  inclination: '📐',
  spacing: '📊',
  organization: '🗂️',
  regularity: '⚖️'
}

export function InteractiveImageViewer({
  imageUrl,
  highlights,
  title = "Análise Grafológica",
  className = "",
  showControls = true,
  onHighlightClick
}: InteractiveImageViewerProps) {
  const [zoom, setZoom] = useState(1)
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null)
  const [showAllHighlights, setShowAllHighlights] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Resetar zoom quando imagem mudar
  useEffect(() => {
    setZoom(1)
    setSelectedHighlight(null)
    setImageLoaded(false)
  }, [imageUrl])

  // Funções de controle
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleResetZoom = () => setZoom(1)

  // Função para lidar com clique no destaque
  const handleHighlightClick = (highlight: ImageHighlight) => {
    setSelectedHighlight(highlight.id)
    onHighlightClick?.(highlight)
  }

  // Função para obter cor do destaque
  const getHighlightColor = (type: ImageHighlight['type']) => {
    return highlightColors[type] || 'rgba(0, 0, 0, 0.2)'
  }

  // Função para obter cor da borda
  const getBorderColor = (type: ImageHighlight['type']) => {
    return highlightColors[type]?.replace('0.3', '0.8') || 'rgba(0, 0, 0, 0.8)'
  }

  return (
    <TooltipProvider>
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-0">
          {/* Header com título e controles */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <h3 className="font-semibold">{title}</h3>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {highlights.length} destaques
                </Badge>
              </div>
              
              {showControls && (
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllHighlights(!showAllHighlights)}
                        className="text-white hover:bg-white/20"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {showAllHighlights ? 'Ocultar destaques' : 'Mostrar destaques'}
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleZoomOut}
                        disabled={zoom <= 0.5}
                        className="text-white hover:bg-white/20"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Diminuir zoom</TooltipContent>
                  </Tooltip>
                  
                  <span className="text-sm font-medium px-2">
                    {Math.round(zoom * 100)}%
                  </span>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleZoomIn}
                        disabled={zoom >= 3}
                        className="text-white hover:bg-white/20"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Aumentar zoom</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetZoom}
                        className="text-white hover:bg-white/20"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Resetar zoom</TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>

          {/* Container da imagem */}
          <div 
            ref={containerRef}
            className="relative overflow-auto bg-gray-50 min-h-[400px] max-h-[600px]"
            style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
          >
            {/* Imagem principal */}
            <div className="relative inline-block">
              <motion.img
                ref={imageRef}
                src={imageUrl}
                alt="Análise Grafológica"
                className="max-w-none transition-all duration-300"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left'
                }}
                onLoad={() => setImageLoaded(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />

              {/* Destaques interativos */}
              <AnimatePresence>
                {imageLoaded && showAllHighlights && highlights.map((highlight) => (
                  <Tooltip key={highlight.id}>
                    <TooltipTrigger asChild>
                      <motion.div
                        className="absolute cursor-pointer transition-all duration-200 hover:scale-105"
                        style={{
                          left: `${highlight.x}%`,
                          top: `${highlight.y}%`,
                          width: `${highlight.width}%`,
                          height: `${highlight.height}%`,
                          backgroundColor: getHighlightColor(highlight.type),
                          border: `2px solid ${getBorderColor(highlight.type)}`,
                          borderRadius: '4px',
                          transform: `scale(${zoom})`,
                          transformOrigin: 'top left',
                          zIndex: selectedHighlight === highlight.id ? 20 : 10
                        }}
                        onClick={() => handleHighlightClick(highlight)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          scale: selectedHighlight === highlight.id ? 1.1 : 1,
                          boxShadow: selectedHighlight === highlight.id 
                            ? '0 0 20px rgba(139, 69, 19, 0.6)' 
                            : '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        {/* Ícone do tipo de destaque */}
                        <div className="absolute -top-6 -left-1 bg-white rounded-full p-1 shadow-md text-xs">
                          {highlightIcons[highlight.type]}
                        </div>
                        
                        {/* Badge de confiança */}
                        <div className="absolute -bottom-6 -right-1">
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-white shadow-md"
                          >
                            {highlight.confidence}%
                          </Badge>
                        </div>
                      </motion.div>
                    </TooltipTrigger>
                    
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{highlightIcons[highlight.type]}</span>
                          <span className="font-semibold capitalize">{highlight.type}</span>
                        </div>
                        <p className="text-sm font-medium">{highlight.description}</p>
                        <p className="text-xs text-muted-foreground">{highlight.interpretation}</p>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-xs text-muted-foreground">Confiança:</span>
                          <Badge variant="outline" className="text-xs">
                            {highlight.confidence}%
                          </Badge>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </AnimatePresence>
            </div>

            {/* Loading overlay */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-sm text-gray-600">Carregando análise...</p>
                </div>
              </div>
            )}
          </div>

          {/* Legenda dos tipos de destaque */}
          <div className="p-4 bg-gray-50 border-t">
            <h4 className="text-sm font-semibold mb-3 text-gray-700">Legenda dos Destaques</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(highlightIcons).map(([type, icon]) => (
                <div key={type} className="flex items-center gap-2 text-sm">
                  <span className="text-base">{icon}</span>
                  <div 
                    className="w-3 h-3 rounded border"
                    style={{ 
                      backgroundColor: highlightColors[type as keyof typeof highlightColors],
                      borderColor: getBorderColor(type as ImageHighlight['type'])
                    }}
                  ></div>
                  <span className="capitalize text-gray-600">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

export default InteractiveImageViewer