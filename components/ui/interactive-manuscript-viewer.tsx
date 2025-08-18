'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, RotateCcw, Eye, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VisualHighlight {
  x: number
  y: number
  width: number
  height: number
  type: 'pressure' | 'spacing' | 'inclination' | 'size' | 'margin' | 'rhythm'
  interpretation: string

  technicalDetails?: string
}

interface InteractiveManuscriptViewerProps {
  imageUrl: string
  highlights: VisualHighlight[]
  className?: string
}

const highlightColors = {
  pressure: 'border-red-500 bg-red-100/40 shadow-red-200',
  spacing: 'border-blue-500 bg-blue-100/40 shadow-blue-200',
  inclination: 'border-green-500 bg-green-100/40 shadow-green-200',
  size: 'border-yellow-500 bg-yellow-100/40 shadow-yellow-200',
  margin: 'border-purple-500 bg-purple-100/40 shadow-purple-200',
  rhythm: 'border-orange-500 bg-orange-100/40 shadow-orange-200'
}

const highlightGlowColors = {
  pressure: 'shadow-lg shadow-red-300/50',
  spacing: 'shadow-lg shadow-blue-300/50',
  inclination: 'shadow-lg shadow-green-300/50',
  size: 'shadow-lg shadow-yellow-300/50',
  margin: 'shadow-lg shadow-purple-300/50',
  rhythm: 'shadow-lg shadow-orange-300/50'
}

const highlightLabels = {
  pressure: 'Pressão',
  spacing: 'Espaçamento',
  inclination: 'Inclinação',
  size: 'Tamanho',
  margin: 'Margem',
  rhythm: 'Ritmo'
}

export function InteractiveManuscriptViewer({ 
  imageUrl, 
  highlights, 
  className 
}: InteractiveManuscriptViewerProps) {
  const [zoom, setZoom] = useState(1)
  const [selectedHighlight, setSelectedHighlight] = useState<number | null>(null)
  const [showAllHighlights, setShowAllHighlights] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleResetZoom = () => setZoom(1)

  const getHighlightStyle = (highlight: VisualHighlight) => ({
    left: `${highlight.x}%`,
    top: `${highlight.y}%`,
    width: `${highlight.width}%`,
    height: `${highlight.height}%`,
  })

  

  return (
    <div className={cn('space-y-4', className)}>
      {/* Cabeçalho com controles */}
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Análise Visual do Manuscrito</h3>
          <Badge variant="outline" className="text-xs">
            {highlights.length} pontos identificados
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAllHighlights(!showAllHighlights)}
            className="text-xs"
          >
            <Info className="h-3 w-3 mr-1" />
            {showAllHighlights ? 'Ocultar' : 'Mostrar'} Destaques
          </Button>
          
          <div className="flex items-center gap-1 border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            
            <span className="text-xs px-2 py-1 bg-gray-50 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetZoom}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Legenda dos tipos de destaque */}
      {showAllHighlights && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
          {Object.entries(highlightLabels).map(([type, label]) => {
            const count = highlights.filter(h => h.type === type).length
            if (count === 0) return null
            
            return (
              <Badge
                key={type}
                variant="outline"
                className={cn(
                  'text-xs cursor-pointer transition-all hover:scale-105',
                  highlightColors[type as keyof typeof highlightColors].replace('bg-', 'hover:bg-')
                )}
                onClick={() => {
                  const firstHighlight = highlights.findIndex(h => h.type === type)
                  setSelectedHighlight(firstHighlight)
                }}
              >
                <div className={cn(
                  'w-2 h-2 rounded-full mr-1',
                  highlightColors[type as keyof typeof highlightColors].split(' ')[0].replace('border-', 'bg-')
                )} />
                {label} ({count})
              </Badge>
            )
          })}
        </div>
      )}

      {/* Container da imagem */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div 
            ref={containerRef}
            className="relative overflow-auto max-h-[600px] bg-gray-50"
            style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
          >
            <motion.div
              className="relative inline-block"
              animate={{ scale: zoom }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Manuscrito para análise"
                className="max-w-none block"
                onLoad={() => setImageLoaded(true)}
                style={{
                  filter: imageLoaded ? 'none' : 'blur(4px)',
                  transition: 'filter 0.3s ease'
                }}
              />
              
              {/* Overlay com destaques */}
              {imageLoaded && showAllHighlights && (
                <div className="absolute inset-0">
                  {highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      className={cn(
                        'absolute border-2 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm',
                        highlightColors[highlight.type],
                        selectedHighlight === index 
                          ? cn('border-4 z-20 ring-2 ring-white/50', highlightGlowColors[highlight.type])
                          : 'hover:border-4 hover:shadow-lg hover:backdrop-blur-none'
                      )}
                      style={getHighlightStyle(highlight)}
                      onClick={() => setSelectedHighlight(
                        selectedHighlight === index ? null : index
                      )}
                      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                      animate={{ 
                        opacity: 1, 
                        scale: selectedHighlight === index ? 1.02 : 1, 
                        rotate: 0
                      }}
                      transition={{ 
                        delay: index * 0.1,
                        type: 'spring',
                        stiffness: 300,
                        damping: 25
                      }}
                      whileHover={{ 
                        scale: 1.03,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Número do destaque com animação */}
                      <motion.div 
                        className="absolute -top-3 -left-3 w-6 h-6 bg-gradient-to-br from-white to-gray-100 border-2 border-current rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {index + 1}
                      </motion.div>
                      
                      {/* Efeito de pulso para destaque selecionado */}
                      {selectedHighlight === index && (
                        <motion.div
                          className="absolute inset-0 border-2 border-current rounded-lg"
                          animate={{ 
                            scale: [1, 1.05, 1],
                            opacity: [0.5, 0.8, 0.5]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de interpretação aprimorado */}
      <AnimatePresence>
        {selectedHighlight !== null && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-4 left-4 right-4 z-50 md:relative md:bottom-auto md:left-auto md:right-auto"
          >
            <Card className="border-2 border-purple-200 shadow-2xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-3 h-3 rounded-full',
                      highlightColors[highlights[selectedHighlight].type].split(' ')[0].replace('border-', 'bg-')
                    )} />
                    <div className="space-y-1">
                      <Badge className={cn(
                        'text-sm font-medium',
                        highlightColors[highlights[selectedHighlight].type]
                      )}>
                        {highlightLabels[highlights[selectedHighlight].type]}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Ponto {selectedHighlight + 1} de {highlights.length}</span>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Análise disponível
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedHighlight(null)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                  >
                    ×
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white/60 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Interpretação</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {highlights[selectedHighlight].interpretation}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {highlights.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedHighlight(index)}
                          className={cn(
                            'w-2 h-2 rounded-full transition-all duration-200',
                            index === selectedHighlight 
                              ? 'bg-purple-600 scale-125' 
                              : 'bg-gray-300 hover:bg-gray-400'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {selectedHighlight + 1} de {highlights.length}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedHighlight(
                        selectedHighlight > 0 ? selectedHighlight - 1 : highlights.length - 1
                      )}
                      className="h-8 px-3 text-xs hover:bg-purple-50"
                      disabled={highlights.length <= 1}
                    >
                      ← Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedHighlight(
                        selectedHighlight < highlights.length - 1 ? selectedHighlight + 1 : 0
                      )}
                      className="h-8 px-3 text-xs hover:bg-purple-50"
                      disabled={highlights.length <= 1}
                    >
                      Próximo →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}