'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Download, Share2, RotateCcw, Home, Printer } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BarChart3 } from 'lucide-react'
import { toast } from 'sonner'
import EnneagramMandala from '@/components/EnneagramMandala'
import SubtypeDetails from '@/components/SubtypeDetails'
import { EnneagramSubtype, getSubtypeByCode } from '@/data/enneagram-subtypes'

export default function EnneagramResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-800 to-green-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold">HumaniQ Eneagrama</h1>
                <p className="text-green-100">Resultados do Teste</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}