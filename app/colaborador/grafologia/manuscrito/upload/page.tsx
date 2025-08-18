'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Upload, ArrowLeft, Camera, AlertCircle, CheckCircle, Loader2, X, RotateCcw, Zap } from 'lucide-react'
import { toast } from 'sonner'

export default function ManuscritoUploadPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState<string>('')
  
  // Camera states
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [isCameraSupported, setIsCameraSupported] = useState(true)
  const [isCapturing, setIsCapturing] = useState(false)

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

  // Camera functions
  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsCameraSupported(false)
        toast.error('Câmera não suportada neste dispositivo')
        return
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      setIsCameraActive(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      
      toast.success('Câmera ativada com sucesso!')
    } catch (error) {
      console.error('Erro ao acessar câmera:', error)
      setIsCameraSupported(false)
      toast.error('Erro ao acessar a câmera. Verifique as permissões.')
    }
  }, [facingMode])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraActive(false)
    toast.success('Câmera desativada')
  }, [stream])

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob and create file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `manuscrito-${Date.now()}.jpg`, { type: 'image/jpeg' })
        setSelectedFile(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        stopCamera()
        toast.success('Foto capturada com sucesso!')
      }
      setIsCapturing(false)
    }, 'image/jpeg', 0.9)
  }, [stopCamera])

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  // Restart camera when facing mode changes
  useEffect(() => {
    if (isCameraActive) {
      stopCamera()
      setTimeout(() => startCamera(), 100)
    }
  }, [facingMode])

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
      const response = await fetch('/api/ai/graphology/manuscript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64,
          analysisType: 'manuscript',
          userId: session?.user?.id
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.error || 'Ocorreu um erro inesperado no servidor.',
        )
      }

      setAnalysisStep('Processando resultados...')
      const result = await response.json()

      // Redirect to results page
      router.push(`/colaborador/grafologia/manuscrito/resultado/${result.analysisId}`)
    } catch (error) {
      console.error('Erro na análise:', error)
      toast.error(error.message || 'Erro ao processar a análise. Tente novamente.')
    } finally {
      setIsAnalyzing(false)
      setAnalysisStep('')
    }
  }

  const handleGoBack = () => {
    router.push('/colaborador/grafologia/manuscrito')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 relative overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
        {[...Array(15)].map((_, i) => (
          <div
            key={`float-${i}`}
            className="absolute w-2 h-2 bg-gray-500 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Animated Comet */}
        <div className="comet-container">
          <div className="comet">
            <div className="comet-head"></div>
            <div className="comet-tail"></div>
            {/* Comet Trail Particles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={`trail-${i}`}
                className="comet-trail-particle"
                style={{
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
            {/* Sparkle Stars */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="comet-sparkle"
                style={{
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="mr-4 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Upload - Análise de Manuscrito
              </h1>
              <p className="text-gray-300 mt-1">
                Envie uma imagem da sua escrita manuscrita para análise
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="bg-gray-800/50 border-gray-600/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Upload className="h-5 w-5 text-gray-300" />
                  Upload da Imagem
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Selecione ou arraste uma imagem do seu texto manuscrito
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Camera Interface */}
                {isCameraActive ? (
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-xl overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-64 object-cover"
                      />
                      <canvas
                        ref={canvasRef}
                        className="hidden"
                      />
                      
                      {/* Camera Controls Overlay */}
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <Button
                          onClick={switchCamera}
                          size="sm"
                          variant="secondary"
                          className="bg-black/50 hover:bg-black/70 text-white border-0"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={stopCamera}
                          size="sm"
                          variant="secondary"
                          className="bg-black/50 hover:bg-black/70 text-white border-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Capture Button */}
                    <Button
                      onClick={capturePhoto}
                      disabled={isCapturing}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                    >
                      {isCapturing ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Capturando...
                        </>
                      ) : (
                        <>
                          <Zap className="h-5 w-5 mr-2" />
                          Capturar Foto
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* File Upload Area */}
                    <div
                      className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-gray-500 transition-colors cursor-pointer bg-gray-700/20"
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
                          <div className="flex items-center justify-center text-green-400">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span className="font-medium">Imagem carregada</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="h-16 w-16 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-lg font-medium text-gray-300">
                              Clique para selecionar ou arraste a imagem
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              Formatos aceitos: JPG, PNG, GIF (máx. 10MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Camera Button */}
                    {isCameraSupported && (
                      <Button
                        onClick={startCamera}
                        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Usar Câmera
                      </Button>
                    )}
                  </>
                )}

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
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5 mr-2" />
                      Iniciar Análise
                    </>
                  )}
                </Button>

                {/* Analysis Progress */}
                {isAnalyzing && analysisStep && (
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/30">
                    <div className="flex items-center text-gray-300">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span className="text-sm font-medium">{analysisStep}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions Section */}
            <Card className="bg-gray-800/50 border-gray-600/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertCircle className="h-5 w-5 text-gray-300" />
                  Dicas para Melhor Análise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-white">Iluminação Adequada</h4>
                      <p className="text-sm text-gray-400">Use boa iluminação natural ou artificial para evitar sombras</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-white">Texto Legível</h4>
                      <p className="text-sm text-gray-400">Certifique-se de que o texto esteja claro e legível na imagem</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-white">Enquadramento</h4>
                      <p className="text-sm text-gray-400">Inclua pelo menos 3-4 linhas de texto para uma análise mais precisa</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-white">Escrita Natural</h4>
                      <p className="text-sm text-gray-400">Use sua escrita habitual, sem forçar mudanças no estilo</p>
                    </div>
                  </div>
                </div>

                {/* What will be analyzed */}
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                  <h4 className="font-semibold text-white mb-3">O que será analisado:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                    <div>• Pressão da escrita</div>
                    <div>• Inclinação das letras</div>
                    <div>• Tamanho das letras</div>
                    <div>• Espaçamento</div>
                    <div>• Velocidade da escrita</div>
                    <div>• Regularidade</div>
                    <div>• Margens</div>
                    <div>• Conectividade</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        @keyframes cometMove {
          0% {
            transform: translate(-150px, 100vh) rotate(-45deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(100vw + 150px), -150px) rotate(-45deg);
            opacity: 0;
          }
        }
        
        @keyframes cometGlow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(156, 163, 175, 0.9), 0 0 30px rgba(156, 163, 175, 0.7), 0 0 45px rgba(156, 163, 175, 0.5);
          }
          50% {
            box-shadow: 0 0 25px rgba(229, 231, 235, 1), 0 0 50px rgba(209, 213, 219, 0.8), 0 0 75px rgba(209, 213, 219, 0.6);
          }
        }
        
        @keyframes trailFade {
          0% {
            opacity: 0.8;
            transform: scale(1) translateX(0);
          }
          100% {
            opacity: 0;
            transform: scale(0.3) translateX(-20px);
          }
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }
        
        .comet-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        
        .comet {
          position: absolute;
          animation: cometMove 30s linear infinite;
        }
        
        .comet-head {
          width: 12px;
          height: 12px;
          background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(229, 231, 235, 0.9) 30%, rgba(156, 163, 175, 0.7) 70%, rgba(107, 114, 128, 0.3) 100%);
          border-radius: 50%;
          position: relative;
          z-index: 3;
          animation: cometGlow 2.5s ease-in-out infinite;
          filter: blur(0.3px);
        }
        
        .comet-tail {
          position: absolute;
          top: 50%;
          right: 12px;
          width: 200px;
          height: 8px;
          background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0.9) 0%,
            rgba(229, 231, 235, 0.8) 15%, 
            rgba(156, 163, 175, 0.6) 35%, 
            rgba(107, 114, 128, 0.4) 55%, 
            rgba(75, 85, 99, 0.25) 75%, 
            rgba(55, 65, 81, 0.1) 90%,
            transparent 100%
          );
          transform: translateY(-50%);
          border-radius: 4px;
          filter: blur(1.5px);
          opacity: 0.8;
        }
        
        .comet-tail::before {
          content: '';
          position: absolute;
          top: -2px;
          left: 0;
          right: 0;
          bottom: -2px;
          background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0.4) 0%,
            rgba(229, 231, 235, 0.3) 20%, 
            rgba(156, 163, 175, 0.2) 40%, 
            rgba(107, 114, 128, 0.1) 60%, 
            transparent 80%
          );
          border-radius: 6px;
          filter: blur(2px);
        }
        
        .comet-trail-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: radial-gradient(circle, rgba(229, 231, 235, 0.8) 0%, rgba(156, 163, 175, 0.4) 100%);
          border-radius: 50%;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          animation: trailFade 2s ease-out infinite;
          filter: blur(0.5px);
        }
        
        .comet-trail-particle:nth-child(odd) {
          right: 40px;
          animation-duration: 2.5s;
        }
        
        .comet-trail-particle:nth-child(3n) {
          right: 60px;
          animation-duration: 3s;
        }
        
        .comet-trail-particle:nth-child(4n) {
          right: 80px;
          animation-duration: 3.5s;
        }
        
        .comet-sparkle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          right: 30px;
          top: 50%;
          transform: translateY(-50%);
          animation: sparkle 1.5s ease-in-out infinite;
          filter: blur(0.2px);
        }
        
        .comet-sparkle:nth-child(odd) {
          right: 50px;
          top: 40%;
          animation-delay: 0.3s;
        }
        
        .comet-sparkle:nth-child(3n) {
          right: 70px;
          top: 60%;
          animation-delay: 0.6s;
        }
        
        .comet-sparkle:nth-child(4n) {
          right: 90px;
          top: 35%;
          animation-delay: 0.9s;
        }
        
        .comet-sparkle:nth-child(5n) {
          right: 110px;
          top: 65%;
          animation-delay: 1.2s;
        }
      `}</style>
    </div>
  )
}