'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  FileText, 
  Brain, 
  Target, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Heart, 
  Crown, 
  Zap,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Loader2,
  Eye,
  BookOpen
} from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

// Import new interactive components
import RadarChart from '@/components/graphology/RadarChart'
import BarChart from '@/components/graphology/BarChart'
import ManuscriptViewer from '@/components/graphology/ManuscriptViewer'

import ExportFeatures from '@/components/graphology/ExportFeatures'

// Mapeamento das cores usadas para bordas de citações e destaques no viewer
const highlightBorderColors: Record<string, string> = {
  pressure: 'border-red-500',
  spacing: 'border-blue-500',
  inclination: 'border-green-500',
  size: 'border-yellow-500',
  margin: 'border-purple-500',
  rhythm: 'border-orange-500'
}

interface ManuscriptAnalysisData {
  detailedAnalysis: {
    technicalObservations: {
      pressure: string
      size: string
      inclination: string
      spacing: string
      rhythm: string
      regularity: string
    }
    psychologicalInterpretation: string
  }
  behavioralSummary: string
  workplaceTrends: {
    communication: { score: number; description: string }
    organization: { score: number; description: string }
    emotionalStability: { score: number; description: string }
    leadership: { score: number; description: string }
    adaptability: { score: number; description: string }
  }
  practicalSuggestions: string[]
  visualHighlights: {
    x: number
    y: number
    width: number
    height: number
    type: string
    interpretation: string
    technicalDetails: string
    snippet?: string
  }[]
  professionalInsights: {
    strengths: string[]
    developmentAreas: string[]
    workStyle: string
    communicationStyle: string
  }
  confidence: number
  scientificBasis: string
  manuscriptUrl?: string
}

export default function ResultadoPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [data, setData] = useState<ManuscriptAnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    if (status === 'loading') return // Still loading session
    
    if (status === 'unauthenticated') {
      setError('Você precisa estar logado para acessar esta análise')
      setLoading(false)
      return
    }
    
    if (params.id && session) {
      fetchAnalysisResults()
    }
  }, [params.id, session, status])

  const fetchAnalysisResults = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/ai/graphology/manuscript?analysisId=${params.id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Você precisa estar logado para acessar esta análise')
        } else if (response.status === 404) {
          throw new Error('Análise não encontrada')
        } else {
          throw new Error('Erro ao carregar resultados')
        }
      }

      const responseData = await response.json()
      console.log('Resposta completa da API:', responseData)
      console.log('manuscriptUrl da API:', responseData.manuscriptUrl)
      
      // Incluir manuscriptUrl nos dados da análise
      const analysisWithImage = {
        ...responseData.analysis,
        manuscriptUrl: responseData.manuscriptUrl
      }
      console.log('Dados finais com manuscriptUrl:', analysisWithImage)
      setData(analysisWithImage)
    } catch (error) {
      console.error('Erro ao carregar análise:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar os resultados da análise'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Helper functions for export and sharing
  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      // Import jsPDF dynamically to avoid SSR issues
      const { jsPDF } = await import('jspdf')
      const html2canvas = (await import('html2canvas')).default

      // Get the main content element
      const element = document.getElementById('report-content')
      if (!element) {
        throw new Error('Elemento do relatório não encontrado')
      }

      // Generate canvas from HTML
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      // Calculate image dimensions to fit page
      const imgWidth = pageWidth - 20 // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      let heightLeft = imgHeight
      let position = 10 // 10mm top margin
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight - 20 // Account for margins
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
        heightLeft -= pageHeight - 20
      }
      
      // Save the PDF
      pdf.save(`relatorio-grafologico-${params.id}.pdf`)
      toast.success('PDF exportado com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      toast.error('Erro ao exportar PDF')
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async (options: { email?: string; message?: string; expiresIn?: number; accessLevel: 'view' | 'download' | 'full' }): Promise<string> => {
    // Implementar lógica de compartilhamento
    console.log('Compartilhando com:', options)
    
    // Gerar URL de compartilhamento temporária
    const shareUrl = `${window.location.origin}/shared/graphology/manuscript/${params.id}?expires=${Date.now() + (options.expiresIn || 24) * 3600000}&access=${options.accessLevel}`
    
    return shareUrl
  }

  // Transform data for chart components
  const getChartData = () => {
    if (!data?.workplaceTrends) return []
    
    return [
      { name: 'Comunicação', value: data.workplaceTrends.communication?.score || 0 },
      { name: 'Organização', value: data.workplaceTrends.organization?.score || 0 },
      { name: 'Estabilidade Emocional', value: data.workplaceTrends.emotionalStability?.score || 0 },
      { name: 'Liderança', value: data.workplaceTrends.leadership?.score || 0 },
      { name: 'Adaptabilidade', value: data.workplaceTrends.adaptability?.score || 0 }
    ]
  }

  const getConfidenceData = () => {
    if (!data) return { overall: 0, technical: 0, behavioral: 0, reliability: 0 }
    
    return {
      overall: data.confidence || 0,
      technical: Math.min(100, (data.confidence || 0) + 5),
      behavioral: Math.max(0, (data.confidence || 0) - 3),
      reliability: data.confidence || 0
    }
  }

  const handleGoBack = () => {
    router.push('/colaborador/grafologia')
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-blue-100'
    if (score >= 40) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Carregando resultados da análise...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-md shadow-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{error ? 'Erro ao carregar' : 'Análise não encontrada'}</h3>
                <p className="text-gray-600 mb-6">{error || 'Não foi possível encontrar os dados da análise grafológica.'}</p>
                <Button onClick={handleGoBack} variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  const chartData = getChartData()
  const confidenceData = getConfidenceData()

  /* ============================
  Seções consolidadas
  ============================ */
  
  const DashboardSection = () => (
       <motion.div
         key="dashboard"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.3 }}
         className="space-y-6"
       >
         {/* Overview Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
             
           <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
             <CardContent className="p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-green-600 font-medium">Pontos Fortes</p>
                   <p className="text-3xl font-bold text-green-800">{data?.professionalInsights?.strengths?.length || 0}</p>
                 </div>
                 <TrendingUp className="h-12 w-12 text-green-600" />
               </div>
             </CardContent>
           </Card>
           
           <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
             <CardContent className="p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-purple-600 font-medium">Competências</p>
                   <p className="text-3xl font-bold text-purple-800">{chartData.length}</p>
                 </div>
                 <Target className="h-12 w-12 text-purple-600" />
               </div>
             </CardContent>
           </Card>
         </div>



         {/* Detalhes Pontos Fortes e Competências */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Pontos Fortes Detalhes */}
           <Card className="border-0 bg-green-50 backdrop-blur-sm">
             <CardHeader>
               <CardTitle className="flex items-center gap-2 text-green-700">
                 <TrendingUp className="h-5 w-5" />
                 Detalhes dos Pontos Fortes
               </CardTitle>
             </CardHeader>
             <CardContent>
               <ul className="list-disc pl-5 space-y-2">
                 {Array.from(new Set(data?.professionalInsights?.strengths || [])).slice(0,5).map((item, idx) => (
                   <li key={idx} className="text-sm text-gray-700">{item}</li>
                 ))}
               </ul>
             </CardContent>
           </Card>

           {/* Competências Detalhes */}
           <Card className="border-0 bg-purple-50 backdrop-blur-sm">
             <CardHeader>
               <CardTitle className="flex items-center gap-2 text-purple-700">
                 <Target className="h-5 w-5" />
                 Detalhes das Competências
               </CardTitle>
             </CardHeader>
             <CardContent>
               <ul className="list-disc pl-5 space-y-2">
                 {chartData.slice(0,5).map((item, idx) => (
                   <li key={idx} className="text-sm text-gray-700">{item.name}: {item.value}%</li>
                 ))}
               </ul>
             </CardContent>
           </Card>
         </div>
       </motion.div>
  )
  
  const VisualizationSection = () => {
       const highlightKeywords = (text: unknown, keywords: unknown[] = []) => {
         const str = typeof text === "string" ? text : String(text ?? "");
         if (!str) return null;

         // Normaliza e filtra palavras-chave para um array de strings únicas não vazias
         const kwArray = Array.isArray(keywords)
           ? Array.from(
               new Set(
                 keywords
                   .map((k) =>
                     typeof k === "string"
                       ? k
                       : String(
                           (k as any)?.snippet ??
                             (k as any)?.interpretation ??
                             (k as any)?.technicalDetails ??
                             ""
                       )
                   )
                   .filter((s) => typeof s === "string" && s.trim().length > 0)
               )
             )
           : [];

         if (kwArray.length === 0) return str;

         // Escapa caracteres especiais de regex
         const escaped = kwArray.map((k) =>
           k.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")
         );
         const regex = new RegExp(`(${escaped.join("|")})`, "gi");

         return str.split(regex).map((part, i) =>
           kwArray.some((k) => k.toLowerCase() === part.toLowerCase()) ? (
             <span key={i} className="text-teal-600 font-semibold">
               {part}
             </span>
           ) : (
             part
           )
         );
       };
       
       return (
       <motion.div
         key="visualization"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.3 }}
         className="space-y-6"
       >
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
           <Card className="xl:col-span-2">
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <TrendingUp className="h-5 w-5 text-blue-600" />
                 Visualização Completa das Competências
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div>
                   <h3 className="text-lg font-semibold mb-4">Gráfico Radial</h3>
                   <RadarChart data={chartData} />
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold mb-4">Gráfico de Barras</h3>
                   <BarChart data={chartData} />
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>
         


       </motion.div>
       );
  }
  
  const ProfessionalSummarySection = () => {
    // Função para extrair citações específicas do manuscrito
    const getManuscriptCitations = () => {
      const citations = data?.visualHighlights?.map(highlight => ({
        text: highlight.snippet || `Elemento gráfico identificado na região ${highlight.type}`,
        type: highlight.type,
        interpretation: highlight.interpretation,
        technicalDetails: highlight.technicalDetails
      })) || []
      return citations.slice(0, 3) // Limitar a 3 citações principais
    }

    const manuscriptCitations = getManuscriptCitations()

    return (
       <motion.div
         key="summary"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.3 }}
       >
         <Card className="border-2 border-blue-100 shadow-lg">
           <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
             <CardTitle className="flex items-center gap-2 text-xl">
               <BookOpen className="h-6 w-6 text-blue-700" />
               Relatório de Análise Grafológica Profissional
             </CardTitle>
             <CardDescription className="text-base mt-2">
               Avaliação científica detalhada baseada em metodologia grafológica moderna e análise neuromotora da escrita manuscrita
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-8 p-8">
             {/* Resumo Executivo */}
             <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
               <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                 <Crown className="h-5 w-5 text-blue-700" />
                 Resumo Executivo da Análise
               </h4>
               <p className="text-gray-800 leading-relaxed text-base font-medium">
                 {(data?.detailedAnalysis?.psychologicalInterpretation || data?.behavioralSummary)?.replace(/\*\*/g, '') || 
                 'Análise grafológica completa revelando padrões comportamentais e traços de personalidade através da interpretação científica da escrita manuscrita.'}
               </p>
             </div>



             {/* Disclaimer Profissional */}
             <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-500">
               <h5 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                 <AlertCircle className="h-4 w-4" />
                 Nota Técnica Importante
               </h5>
               <p className="text-amber-700 text-sm leading-relaxed">
                 Esta análise grafológica constitui uma ferramenta de apoio para compreensão de traços comportamentais e deve ser interpretada por profissionais qualificados. 
                 Os resultados apresentados baseiam-se em metodologia científica reconhecida, porém não substituem avaliações psicológicas formais ou decisões de recursos humanos.
               </p>
             </div>
           </CardContent>
         </Card>
       </motion.div>
    )
  }
  
  const ManuscriptSection = () => (
        <motion.div
          key="manuscript"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ManuscriptViewer 
            manuscriptUrl={data?.manuscriptUrl || ''}
            highlights={data?.visualHighlights || []}
          />
        </motion.div>
   )
  
  const InsightsSection = () => {
       const strengths = Array.from(new Set(data?.professionalInsights?.strengths || []));
       const devAreas = Array.from(new Set(data?.professionalInsights?.developmentAreas || []));
       const suggestions = Array.from(new Set(data?.practicalSuggestions || []));
       return (
       <motion.div
         key="insights"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.3 }}
         className="space-y-6"
       >
         {/* Professional Insights */}
         <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2 text-blue-700">
                 <Target className="h-5 w-5" />
                 Áreas de Desenvolvimento
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-3">
                 {devAreas.map((area, index) => (
                   <motion.div 
                     key={index}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: index * 0.1 }}
                     className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                   >
                     <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                     <p className="text-gray-700">{area}</p>
                   </motion.div>
                 ))}
               </div>
             </CardContent>
           </Card>
         </div>
         
         {/* Work and Communication Style */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Users className="h-5 w-5 text-purple-600" />
                 Estilo de Trabalho
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-gray-700 leading-relaxed">{data?.professionalInsights?.workStyle}</p>
             </CardContent>
           </Card>
           
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Brain className="h-5 w-5 text-indigo-600" />
                 Estilo de Comunicação
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-gray-700 leading-relaxed">{data?.professionalInsights?.communicationStyle}</p>
             </CardContent>
           </Card>
         </div>
         
         {/* Practical Suggestions */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Target className="h-5 w-5 text-orange-600" />
               Sugestões Práticas
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {suggestions.map((suggestion, index) => (
                 <motion.div 
                   key={index}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.1 }}
                   className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100"
                 >
                   <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                     {index + 1}
                   </div>
                   <p className="text-gray-700">{suggestion}</p>
                 </motion.div>
               ))}
             </div>
           </CardContent>
         </Card>
       </motion.div>
  )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Relatório Grafológico Interativo</h1>
                <p className="text-sm text-gray-500">Análise Comportamental Completa</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ExportFeatures
                analysisId={Array.isArray(params.id) ? params.id[0] : params.id}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Conteúdo consolidado */}
        <section id="dashboard" className="mt-8"><DashboardSection /></section>
        <Separator className="my-12" />
        <section id="insights"><InsightsSection /></section>
        <Separator className="my-12" />
        <section id="visualization"><VisualizationSection /></section>
        <Separator className="my-12" />
        <section id="manuscript"><ManuscriptSection /></section>
        <Separator className="my-12" />
        <section id="summary"><ProfessionalSummarySection /></section>
      </div>
    </div>
  )
}