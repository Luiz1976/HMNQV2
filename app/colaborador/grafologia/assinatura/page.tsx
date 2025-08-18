'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PenTool, Upload, ArrowLeft, Camera, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AssinaturaAnalysisPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState<string>('')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem')
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('O arquivo deve ter no máximo 10MB')
        return
      }

      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      toast.success('Imagem carregada com sucesso!')
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecione uma imagem primeiro')
      return
    }

    setIsAnalyzing(true)
    setAnalysisStep('Preparando análise...')

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(selectedFile)
      })

      setAnalysisStep('Enviando imagem para análise...')

      // Call API for analysis
      const response = await fetch('/api/ai/graphology/signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64,
          analysisType: 'signature',
          userId: session?.user?.id
        })
      })

      if (!response.ok) {
        throw new Error('Erro na análise')
      }

      setAnalysisStep('Processando resultados...')
      const result = await response.json()

      // Redirect to results page
      router.push(`/colaborador/grafologia/assinatura/resultado/${result.analysisId}`)
    } catch (error) {
      console.error('Erro na análise:', error)
      toast.error('Erro ao processar a análise. Tente novamente.')
    } finally {
      setIsAnalyzing(false)
      setAnalysisStep('')
    }
  }

  const handleGoBack = () => {
    router.push('/colaborador/grafologia')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="mr-4 hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Análise de Assinatura
            </h1>
            <p className="text-gray-600 mt-1">
              Envie uma imagem da sua assinatura para análise grafológica
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-pink-600" />
                Upload da Imagem
              </CardTitle>
              <CardDescription>
                Selecione ou arraste uma imagem da sua assinatura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-pink-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <div className="flex items-center justify-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Imagem carregada</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <PenTool className="h-16 w-16 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Clique para selecionar ou arraste a imagem
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Formatos aceitos: JPG, PNG, GIF (máx. 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Analysis Button */}
              <Button
                onClick={handleAnalyze}
                disabled={!selectedFile || isAnalyzing}
                className="w-full bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white font-semibold py-3 rounded-xl"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <PenTool className="h-5 w-5 mr-2" />
                    Iniciar Análise
                  </>
                )}
              </Button>

              {/* Analysis Progress */}
              {isAnalyzing && analysisStep && (
                <div className="bg-pink-50 rounded-lg p-4">
                  <div className="flex items-center text-pink-700">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span className="text-sm font-medium">{analysisStep}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions Section */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Dicas para Melhor Análise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Assinatura Completa</h4>
                    <p className="text-sm text-gray-600">Use sua assinatura habitual, completa e natural</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Fundo Limpo</h4>
                    <p className="text-sm text-gray-600">Use papel branco ou fundo claro para melhor contraste</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Boa Resolução</h4>
                    <p className="text-sm text-gray-600">Certifique-se de que a imagem esteja nítida e bem focada</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Caneta Adequada</h4>
                    <p className="text-sm text-gray-600">Use caneta ou instrumento de escrita habitual</p>
                  </div>
                </div>
              </div>

              {/* What will be analyzed */}
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">O que será analisado:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>• Pressão do traço</div>
                  <div>• Direção da escrita</div>
                  <div>• Tamanho relativo</div>
                  <div>• Legibilidade</div>
                  <div>• Ornamentação</div>
                  <div>• Velocidade</div>
                  <div>• Estilo pessoal</div>
                  <div>• Consistência</div>
                </div>
              </div>

              {/* Signature Focus */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Foco da Análise:</h4>
                <p className="text-sm text-gray-600">
                  A análise de assinatura foca especialmente em características de liderança, 
                  tomada de decisão, autoconfiança e como você se apresenta profissionalmente.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}