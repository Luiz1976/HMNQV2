'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PenTool, Upload, ArrowLeft, Camera, AlertCircle, CheckCircle, Loader2, FileText, Shield, Eye, Users, BarChart3, Target, Lightbulb, Award, Info } from 'lucide-react'
import { toast } from 'sonner'

export default function AssinaturaAnalysisPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState<string>('')
  const [showUploadModal, setShowUploadModal] = useState(false)

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

  const openUploadModal = () => {
    setShowUploadModal(true)
  }

  const closeUploadModal = () => {
    setShowUploadModal(false)
  }

  return (
    <div className="min-h-screen bg-slate-800 relative overflow-hidden">
      {/* Floating Silver Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Particle Layer 1 - Slow */}
        <div className="absolute w-2 h-2 bg-slate-300 rounded-full opacity-30 animate-float-slow" style={{top: '10%', left: '15%'}}></div>
        <div className="absolute w-3 h-3 bg-slate-300 rounded-full opacity-40 animate-float-slow" style={{top: '25%', left: '80%', animationDelay: '2s'}}></div>
        <div className="absolute w-2 h-2 bg-slate-300 rounded-full opacity-25 animate-float-slow" style={{top: '60%', left: '10%', animationDelay: '4s'}}></div>
        <div className="absolute w-4 h-4 bg-slate-300 rounded-full opacity-35 animate-float-slow" style={{top: '80%', left: '70%', animationDelay: '1s'}}></div>
        <div className="absolute w-2 h-2 bg-slate-300 rounded-full opacity-30 animate-float-slow" style={{top: '40%', left: '90%', animationDelay: '3s'}}></div>
        <div className="absolute w-3 h-3 bg-slate-300 rounded-full opacity-35 animate-float-slow" style={{top: '12%', left: '45%', animationDelay: '6s'}}></div>
        <div className="absolute w-2 h-2 bg-slate-300 rounded-full opacity-25 animate-float-slow" style={{top: '72%', left: '25%', animationDelay: '7s'}}></div>
        <div className="absolute w-4 h-4 bg-slate-300 rounded-full opacity-30 animate-float-slow" style={{top: '35%', left: '8%', animationDelay: '8s'}}></div>
        <div className="absolute w-2 h-2 bg-slate-300 rounded-full opacity-40 animate-float-slow" style={{top: '88%', left: '85%', animationDelay: '9s'}}></div>
        <div className="absolute w-3 h-3 bg-slate-300 rounded-full opacity-20 animate-float-slow" style={{top: '18%', left: '65%', animationDelay: '10s'}}></div>
        
        {/* Animated Comet */}
        <div className="comet-container">
          <div className="comet">
            <div className="comet-head"></div>
            <div className="comet-tail"></div>
          </div>
        </div>
        
        {/* Particle Layer 2 - Medium */}
        <div className="absolute w-3 h-3 bg-slate-400 rounded-full opacity-20 animate-float-medium" style={{top: '20%', left: '40%'}}></div>
        <div className="absolute w-2 h-2 bg-slate-400 rounded-full opacity-35 animate-float-medium" style={{top: '50%', left: '60%', animationDelay: '1.5s'}}></div>
        <div className="absolute w-4 h-4 bg-slate-400 rounded-full opacity-25 animate-float-medium" style={{top: '70%', left: '20%', animationDelay: '3.5s'}}></div>
        <div className="absolute w-2 h-2 bg-slate-400 rounded-full opacity-40 animate-float-medium" style={{top: '15%', left: '75%', animationDelay: '2.5s'}}></div>
        <div className="absolute w-3 h-3 bg-slate-400 rounded-full opacity-30 animate-float-medium" style={{top: '85%', left: '45%', animationDelay: '0.5s'}}></div>
        <div className="absolute w-2 h-2 bg-slate-400 rounded-full opacity-25 animate-float-medium" style={{top: '32%', left: '12%', animationDelay: '4.5s'}}></div>
        <div className="absolute w-4 h-4 bg-slate-400 rounded-full opacity-30 animate-float-medium" style={{top: '78%', left: '88%', animationDelay: '5.5s'}}></div>
        <div className="absolute w-3 h-3 bg-slate-400 rounded-full opacity-35 animate-float-medium" style={{top: '42%', left: '78%', animationDelay: '6.5s'}}></div>
        <div className="absolute w-2 h-2 bg-slate-400 rounded-full opacity-20 animate-float-medium" style={{top: '8%', left: '28%', animationDelay: '7.5s'}}></div>
        <div className="absolute w-3 h-3 bg-slate-400 rounded-full opacity-40 animate-float-medium" style={{top: '92%', left: '58%', animationDelay: '8.5s'}}></div>
        
        {/* Particle Layer 3 - Fast */}
        <div className="absolute w-2 h-2 bg-slate-200 rounded-full opacity-50 animate-float-fast" style={{top: '35%', left: '25%'}}></div>
        <div className="absolute w-3 h-3 bg-slate-200 rounded-full opacity-35 animate-float-fast" style={{top: '55%', left: '85%', animationDelay: '1s'}}></div>
        <div className="absolute w-2 h-2 bg-slate-200 rounded-full opacity-45 animate-float-fast" style={{top: '75%', left: '35%', animationDelay: '2s'}}></div>
        <div className="absolute w-4 h-4 bg-slate-200 rounded-full opacity-25 animate-float-fast" style={{top: '5%', left: '55%', animationDelay: '3s'}}></div>
        <div className="absolute w-2 h-2 bg-slate-200 rounded-full opacity-40 animate-float-fast" style={{top: '90%', left: '15%', animationDelay: '1.5s'}}></div>
        <div className="absolute w-3 h-3 bg-slate-200 rounded-full opacity-30 animate-float-fast" style={{top: '22%', left: '68%', animationDelay: '4s'}}></div>
        <div className="absolute w-2 h-2 bg-slate-200 rounded-full opacity-35 animate-float-fast" style={{top: '68%', left: '8%', animationDelay: '5s'}}></div>
        <div className="absolute w-4 h-4 bg-slate-200 rounded-full opacity-20 animate-float-fast" style={{top: '48%', left: '92%', animationDelay: '6s'}}></div>
        <div className="absolute w-2 h-2 bg-slate-200 rounded-full opacity-45 animate-float-fast" style={{top: '82%', left: '42%', animationDelay: '7s'}}></div>
        <div className="absolute w-3 h-3 bg-slate-200 rounded-full opacity-25 animate-float-fast" style={{top: '28%', left: '18%', animationDelay: '8s'}}></div>
        
        {/* Additional scattered particles */}
        <div className="absolute w-2 h-2 bg-slate-300 rounded-full opacity-20 animate-float-slow" style={{top: '30%', left: '5%', animationDelay: '5s'}}></div>
        <div className="absolute w-3 h-3 bg-slate-400 rounded-full opacity-15 animate-float-medium" style={{top: '65%', left: '95%', animationDelay: '4s'}}></div>
        <div className="absolute w-2 h-2 bg-slate-200 rounded-full opacity-30 animate-float-fast" style={{top: '45%', left: '50%', animationDelay: '2.5s'}}></div>
        <div className="absolute w-4 h-4 bg-slate-300 rounded-full opacity-25 animate-float-slow" style={{top: '58%', left: '72%', animationDelay: '11s'}}></div>
        <div className="absolute w-2 h-2 bg-slate-400 rounded-full opacity-30 animate-float-medium" style={{top: '14%', left: '38%', animationDelay: '9.5s'}}></div>
        <div className="absolute w-3 h-3 bg-slate-200 rounded-full opacity-40 animate-float-fast" style={{top: '76%', left: '62%', animationDelay: '9s'}}></div>
        <div className="absolute w-2 h-2 bg-slate-300 rounded-full opacity-35 animate-float-slow" style={{top: '95%', left: '32%', animationDelay: '12s'}}></div>
        <div className="absolute w-4 h-4 bg-slate-400 rounded-full opacity-20 animate-float-medium" style={{top: '38%', left: '82%', animationDelay: '10.5s'}}></div>
        <div className="absolute w-2 h-2 bg-slate-200 rounded-full opacity-50 animate-float-fast" style={{top: '52%', left: '22%', animationDelay: '10s'}}></div>
        <div className="absolute w-3 h-3 bg-slate-300 rounded-full opacity-30 animate-float-slow" style={{top: '2%', left: '88%', animationDelay: '13s'}}></div>
      </div>
      
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-15px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }
        
        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-25px) translateX(15px);
          }
          66% {
            transform: translateY(-15px) translateX(-10px);
          }
        }
        
        @keyframes float-fast {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-35px) translateX(20px);
          }
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        
        /* Comet Animation Styles */
        .comet-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .comet {
          position: absolute;
          top: 80%;
          left: 0%;
          width: 200px;
          height: 8px;
          transform: rotate(-35deg);
          animation: cometMove 12.5s linear infinite;
        }
        
        .comet-head {
          position: absolute;
          right: 0;
          top: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff 0%, #a855f7 30%, #3b82f6 70%, transparent 100%);
          box-shadow: 
            0 0 10px #ffffff,
            0 0 20px #a855f7,
            0 0 30px #3b82f6;
          animation: cometGlow 2s ease-in-out infinite alternate;
        }
        
        .comet-tail {
          position: absolute;
          right: 8px;
          top: 2px;
          width: 180px;
          height: 4px;
          background: linear-gradient(
            to left,
            rgba(168, 85, 247, 0.8) 0%,
            rgba(59, 130, 246, 0.6) 20%,
            rgba(147, 51, 234, 0.4) 40%,
            rgba(79, 70, 229, 0.2) 60%,
            rgba(99, 102, 241, 0.1) 80%,
            transparent 100%
          );
          border-radius: 2px;
          filter: blur(1px);
        }
        

        
        @keyframes cometMove {
          0% {
            transform: translate(0%, 0%) rotate(-35deg);
          }
          100% {
            transform: translate(100vw, -80vh) rotate(-35deg);
          }
        }
        
        @keyframes cometGlow {
          0% {
            opacity: 0.8;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="mr-4 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center">
              <Info className="h-6 w-6 text-blue-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Análise de Assinatura
                </h1>
                <p className="text-slate-300 text-sm">
                  Descubra sua personalidade através da sua escrita
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-slate-800/30 rounded-2xl p-12 border border-slate-700">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-500/20 p-4 rounded-full">
                <FileText className="h-12 w-12 text-blue-400" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Resultados Científicos Precisos
            </h2>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto mb-8">
              A grafologia é uma ciência que estuda a personalidade através da análise da escrita. Nossa análise utiliza
              algoritmos avançados para identificar padrões únicos em sua assinatura e revelar aspectos profundos da sua
              personalidade.
            </p>
            
            {/* Three pillars */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-slate-700/50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Precisão</h3>
                <p className="text-slate-400 text-sm">Algoritmos de última geração</p>
              </div>
              <div className="text-center">
                <div className="bg-slate-700/50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Eye className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Análise</h3>
                <p className="text-slate-400 text-sm">Detecção avançada de padrões</p>
              </div>
              <div className="text-center">
                <div className="bg-slate-700/50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Insights</h3>
                <p className="text-slate-400 text-sm">Revelações sobre sua personalidade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Fundamentação Científica */}
          <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700">
            <div className="flex items-center mb-6">
              <Info className="h-6 w-6 text-blue-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Fundamentação Científica</h3>
            </div>
            <p className="text-slate-300 mb-6">
              A grafologia baseia-se em décadas de pesquisa científica que estabeleceu correlações entre características da escrita e traços de personalidade.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Pressão do traço revela energia emocional</span>
              </div>
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Inclinação indica atitude social</span>
              </div>
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Tamanho da escrita mostra autoestima</span>
              </div>
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Velocidade revela ritmo mental</span>
              </div>
            </div>
          </div>

          {/* Dimensões Comportamentais */}
          <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700">
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-purple-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Dimensões Comportamentais</h3>
            </div>
            <p className="text-slate-300 mb-6">
              Nossa análise avalia 12 dimensões fundamentais da personalidade:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-slate-300 text-sm">• Liderança</div>
                <div className="text-slate-300 text-sm">• Criatividade</div>
                <div className="text-slate-300 text-sm">• Sociabilidade</div>
                <div className="text-slate-300 text-sm">• Determinação</div>
                <div className="text-slate-300 text-sm">• Organização</div>
                <div className="text-slate-300 text-sm">• Intuição</div>
              </div>
              <div className="space-y-2">
                <div className="text-slate-300 text-sm">• Autoconfiança</div>
                <div className="text-slate-300 text-sm">• Adaptabilidade</div>
                <div className="text-slate-300 text-sm">• Perseverança</div>
                <div className="text-slate-300 text-sm">• Comunicação</div>
                <div className="text-slate-300 text-sm">• Estabilidade</div>
                <div className="text-slate-300 text-sm">• Inovação</div>
              </div>
            </div>
          </div>
        </div>

        {/* Como Funciona a Análise */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Como Funciona a Análise
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-white font-semibold mb-2">Upload</h4>
              <p className="text-slate-400 text-sm">
                Envie uma foto clara da sua assinatura
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-white font-semibold mb-2">Análise</h4>
              <p className="text-slate-400 text-sm">
                IA processa características da escrita
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-white font-semibold mb-2">Avaliação</h4>
              <p className="text-slate-400 text-sm">
                Algoritmos identificam padrões únicos
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="text-white font-semibold mb-2">Resultado</h4>
              <p className="text-slate-400 text-sm">
                Relatório detalhado da sua personalidade
              </p>
            </div>
          </div>
        </div>

        {/* Benefícios e Aplicações */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-6 w-6 text-green-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Desenvolvimento Pessoal</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span>Autoconhecimento profundo</span>
              </div>
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span>Identificação de pontos fortes</span>
              </div>
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <span>Áreas de melhoria</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700">
            <div className="flex items-center mb-6">
              <Award className="h-6 w-6 text-yellow-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Aplicações Profissionais</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <span>Orientação de carreira</span>
              </div>
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <span>Desenvolvimento de liderança</span>
              </div>
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <span>Coaching e mentoria</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-slate-800 rounded-2xl p-12 border border-slate-700">
            <h3 className="text-3xl font-bold text-white mb-4">
              Pronto para Descobrir sua Personalidade?
            </h3>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Faça o upload da sua assinatura e descubra insights únicos sobre sua personalidade através da análise grafológica avançada.
            </p>
            <Button
              onClick={openUploadModal}
              className="bg-white text-slate-800 hover:bg-slate-100 font-semibold px-8 py-3 rounded-xl text-lg"
            >
              <Upload className="h-5 w-5 mr-2" />
              Iniciar Análise
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Upload da Assinatura</h3>
              <Button
                variant="ghost"
                onClick={closeUploadModal}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer mb-6"
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
                  <PenTool className="h-16 w-16 text-slate-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-slate-300">
                      Clique para selecionar ou arraste a imagem
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
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
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl mb-4"
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
              <div className="bg-blue-900/50 rounded-lg p-4">
                <div className="flex items-center text-blue-300">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span className="text-sm font-medium">{analysisStep}</span>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-slate-700/50 rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">Dicas para melhor análise:</h4>
              <div className="text-sm text-slate-300 space-y-1">
                <div>• Use sua assinatura habitual e completa</div>
                <div>• Certifique-se de que a imagem esteja nítida</div>
                <div>• Use fundo claro para melhor contraste</div>
                <div>• Evite sombras ou reflexos na imagem</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}