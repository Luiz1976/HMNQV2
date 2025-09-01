'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LikertScaleProps {
  question?: string
  value?: number
  onChange: (value: number) => void
  disabled?: boolean
  className?: string
  hideQuestion?: boolean
  autoAdvance?: boolean
  onAutoAdvance?: () => void
  autoAdvanceDelay?: number
}

const scaleOptions = [
  {
    value: 1,
    label: 'Discordo totalmente',
    shortLabel: 'Discordo totalmente',
    color: 'bg-red-300 hover:bg-red-400 text-red-900',
    selectedColor: 'bg-red-400 text-red-900 shadow-lg ring-2 ring-red-500'
  },
  {
    value: 2,
    label: 'Discordo',
    shortLabel: 'Discordo',
    color: 'bg-orange-300 hover:bg-orange-400 text-orange-900',
    selectedColor: 'bg-orange-400 text-orange-900 shadow-lg ring-2 ring-orange-500'
  },
  {
    value: 3,
    label: 'Neutro',
    shortLabel: 'Neutro',
    color: 'bg-yellow-300 hover:bg-yellow-400 text-yellow-900',
    selectedColor: 'bg-yellow-400 text-yellow-900 shadow-lg ring-2 ring-yellow-500'
  },
  {
    value: 4,
    label: 'Concordo',
    shortLabel: 'Concordo',
    color: 'bg-green-300 hover:bg-green-400 text-green-900',
    selectedColor: 'bg-green-400 text-green-900 shadow-lg ring-2 ring-green-500'
  },
  {
    value: 5,
    label: 'Concordo totalmente',
    shortLabel: 'Concordo totalmente',
    color: 'bg-emerald-400 hover:bg-emerald-500 text-emerald-900',
    selectedColor: 'bg-emerald-500 text-emerald-900 shadow-lg ring-2 ring-emerald-600'
  }
]

export function LikertScale({ 
  question, 
  value, 
  onChange, 
  disabled = false, 
  className, 
  hideQuestion = false,
  autoAdvance = false,
  onAutoAdvance,
  autoAdvanceDelay = 600
}: LikertScaleProps) {
  
  const handleOptionClick = (value: number) => {
    console.log('✅ LikertScale - Clique registrado:', value)
    
    if (disabled) {
      console.log('⚠️ LikertScale - Componente desabilitado')
      return
    }
    
    onChange(value)
    
    if (autoAdvance && onAutoAdvance) {
      setTimeout(() => {
        onAutoAdvance()
      }, 500)
    }
  }
  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Question */}
      {!hideQuestion && question && (
        <div className="text-lg font-medium text-gray-900 leading-relaxed">
          {question}
        </div>
      )}

      {/* Top Labels and Gradient Bar */}
      <div className="space-y-4">
        {/* Labels */}
        <div className="flex justify-between text-sm font-medium text-gray-600">
          <span className="text-red-600">Discordo</span>
          <span className="text-yellow-600">Neutro</span>
          <span className="text-green-600">Concordo</span>
        </div>
        
        {/* Gradient Bar */}
        <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-300 via-orange-300 via-yellow-300 via-green-300 to-emerald-400 shadow-sm"></div>
      </div>

      {/* Scale Buttons */}
      <div className="flex justify-center gap-6">
        {scaleOptions.map((option) => {
          const isSelected = value === option.value
          
          return (
            <div key={option.value} className="flex flex-col items-center space-y-3">
              {/* Number Button */}
              <button
                type="button"
                onClick={() => handleOptionClick(option.value)}
                disabled={disabled}
                className={cn(
                  'w-16 h-16 rounded-2xl font-bold text-xl transition-all duration-200 transform hover:scale-105 focus:outline-none border-0 cursor-pointer',
                  disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
                  isSelected ? option.selectedColor : option.color
                )}
              >
                {option.value}
              </button>
              

            </div>
          )
        })}
      </div>


    </div>
  )
}

export default LikertScale