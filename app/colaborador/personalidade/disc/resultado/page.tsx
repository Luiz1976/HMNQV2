'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Download, Share2, Printer, Target, Users, Shield, CheckCircle } from 'lucide-react'
import GraphologyRadarChart from '@/components/graphology/RadarChart'

interface DISCResults {
  D: number // Dominância
  I: number // Influência
  S: number // Estabilidade
  C: number // Conformidade
  profile: string // Perfil predominante (ex: "DI", "SC", "C puro")
  secondary?: string // Perfil secundário se aplicável
}

interface Dimension {
  name: string
  key: keyof Omit<DISCResults, 'profile' | 'secondary'>
  score: number
  color: string
  icon: React.ComponentType<any>
  description: string
  interpretation: string
  workStyle: string
  communication: string
  idealEnvironment: string
}

export default function DISCResultadoPage() {
  const router = useRouter()
  const [results, setResults] = useState<DISCResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Recuperar resultados do localStorage
    // Recuperar resultados do localStorage (usa discResults, fallback discTestResults)
    const savedResults =
      localStorage.getItem('discResults') ||
      localStorage.getItem('discTestResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults))
    } else {
      // Se não há resultados, redirecionar para o teste
      router.push('/colaborador/personalidade/disc')
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando resultados...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Nenhum resultado encontrado</p>
          <Button onClick={() => router.push('/colaborador/personalidade/disc')}>
            Fazer Teste
          </Button>
        </div>
      </div>
    )
  }

  const dimensions: Dimension[] = [
    {
      name: 'Impulsionador',
      key: 'D',
      score: results.D,
      color: 'bg-red-500',
      icon: Target,
      description: 'Orientação para resultados, assertividade e tomada de decisões rápidas',
      interpretation: results.D >= 80 ? 'Muito Alto - Líder natural, decisivo e orientado para resultados' : 
                     results.D >= 60 ? 'Alto - Assertivo, gosta de desafios e assume responsabilidades' : 
                     results.D >= 40 ? 'Moderado - Equilibrado entre liderança e colaboração' :
                     'Baixo - Prefere seguir orientações e evita confrontos',
      workStyle: results.D >= 60 ? 'Assume liderança, toma decisões rápidas, foca em resultados' : 'Colaborativo, busca consenso, evita conflitos',
      communication: results.D >= 60 ? 'Direto, objetivo, vai direto ao ponto' : 'Diplomático, cuidadoso, busca harmonia',
      idealEnvironment: results.D >= 60 ? 'Ambientes desafiadores, com autonomia e metas claras' : 'Ambientes estáveis, com diretrizes claras e suporte'
    },
    {
      name: 'Conector',
      key: 'I',
      score: results.I,
      color: 'bg-yellow-500',
      icon: Users,
      description: 'Habilidades sociais, entusiasmo e capacidade de influenciar pessoas',
      interpretation: results.I >= 80 ? 'Muito Alto - Extremamente sociável, carismático e persuasivo' : 
                     results.I >= 60 ? 'Alto - Comunicativo, otimista e bom em relacionamentos' : 
                     results.I >= 40 ? 'Moderado - Equilibrado entre interação social e trabalho individual' :
                     'Baixo - Prefere trabalhar sozinho, mais reservado socialmente',
      workStyle: results.I >= 60 ? 'Trabalha bem em equipe, motiva outros, gera ideias criativas' : 'Prefere tarefas individuais, foco na qualidade',
      communication: results.I >= 60 ? 'Expressivo, entusiástico, usa histórias e exemplos' : 'Conciso, factual, prefere comunicação escrita',
      idealEnvironment: results.I >= 60 ? 'Ambientes sociais, dinâmicos, com interação frequente' : 'Ambientes calmos, com pouca pressão social'
    },
    {
      name: 'Harmônico',
      key: 'S',
      score: results.S,
      color: 'bg-green-500',
      icon: Shield,
      description: 'Paciência, lealdade e preferência por estabilidade e rotina',
      interpretation: results.S >= 80 ? 'Muito Alto - Extremamente paciente, leal e resistente a mudanças' : 
                     results.S >= 60 ? 'Alto - Confiável, paciente e prefere estabilidade' : 
                     results.S >= 40 ? 'Moderado - Equilibrado entre estabilidade e adaptação' :
                     'Baixo - Gosta de mudanças, impaciente com rotina',
      workStyle: results.S >= 60 ? 'Consistente, confiável, trabalha bem em equipes estáveis' : 'Adaptável, gosta de variedade, aceita mudanças facilmente',
      communication: results.S >= 60 ? 'Calmo, paciente, ouve atentamente antes de responder' : 'Rápido, direto, gosta de novidades',
      idealEnvironment: results.S >= 60 ? 'Ambientes previsíveis, com rotinas estabelecidas e segurança' : 'Ambientes dinâmicos, com mudanças e novos desafios'
    },
    {
      name: 'Estrategista',
      key: 'C',
      score: results.C,
      color: 'bg-blue-500',
      icon: CheckCircle,
      description: 'Atenção aos detalhes, precisão e seguimento de padrões e procedimentos',
      interpretation: results.C >= 80 ? 'Muito Alto - Extremamente detalhista, preciso e sistemático' : 
                     results.C >= 60 ? 'Alto - Organizado, segue procedimentos, atento à qualidade' : 
                     results.C >= 40 ? 'Moderado - Equilibrado entre precisão e flexibilidade' :
                     'Baixo - Flexível, prefere visão geral a detalhes',
      workStyle: results.C >= 60 ? 'Metódico, preciso, segue procedimentos rigorosamente' : 'Flexível, foca no panorama geral, aceita imperfeições',
      communication: results.C >= 60 ? 'Preciso, detalhado, baseado em fatos e dados' : 'Geral, conceitual, foca nas ideias principais',
      idealEnvironment: results.C >= 60 ? 'Ambientes estruturados, com regras claras e padrões definidos' : 'Ambientes flexíveis, com liberdade criativa'
    }
  ]

  const getProfileInterpretation = (profile: string) => {
    const profiles: Record<string, { name: string, description: string, leadership: string, recommendation: string }> = {
      'D': {
        name: 'Dominante Puro',
        description: 'Líder nato, orientado para resultados, decisivo e assertivo',
        leadership: 'Estilo de liderança direta, focada em resultados e eficiência',
        recommendation: 'Desenvolva habilidades de escuta ativa e empatia para melhorar relacionamentos'
      },
      'I': {
        name: 'Influenciador Puro',
        description: 'Comunicador natural, entusiástico, sociável e persuasivo',
        leadership: 'Estilo de liderança inspiracional, motiva através do carisma',
        recommendation: 'Foque em desenvolver habilidades de organização e atenção aos detalhes'
      },
      'S': {
        name: 'Estável Puro',
        description: 'Confiável, paciente, leal e orientado para o trabalho em equipe',
        leadership: 'Estilo de liderança colaborativa, constrói consenso e harmonia',
        recommendation: 'Desenvolva assertividade e confiança para tomar decisões mais rápidas'
      },
      'C': {
        name: 'Conformista Puro',
        description: 'Analítico, preciso, sistemático e orientado para a qualidade',
        leadership: 'Estilo de liderança técnica, baseada em competência e precisão',
        recommendation: 'Trabalhe flexibilidade e habilidades interpessoais'
      },
      'DI': {
        name: 'Dominante-Influenciador',
        description: 'Líder carismático, combina assertividade com habilidades sociais',
        leadership: 'Liderança inspiracional e diretiva, motiva e direciona equipes',
        recommendation: 'Balance a velocidade das decisões com a consideração pelos outros'
      },
      'DC': {
        name: 'Dominante-Conformista',
        description: 'Líder técnico, combina orientação para resultados com precisão',
        leadership: 'Liderança baseada em competência, foca em padrões elevados',
        recommendation: 'Desenvolva habilidades interpessoais e flexibilidade'
      },
      'IS': {
        name: 'Influenciador-Estável',
        description: 'Comunicador empático, combina sociabilidade com lealdade',
        leadership: 'Liderança colaborativa e inspiracional, constrói relacionamentos',
        recommendation: 'Desenvolva assertividade e foco em resultados'
      },
      'IC': {
        name: 'Influenciador-Conformista',
        description: 'Comunicador preciso, combina sociabilidade com atenção aos detalhes',
        leadership: 'Liderança técnica e inspiracional, comunica com precisão',
        recommendation: 'Balance a atenção aos detalhes com a visão do panorama geral'
      },
      'SC': {
        name: 'Estável-Conformista',
        description: 'Especialista confiável, combina estabilidade com precisão',
        leadership: 'Liderança técnica e colaborativa, constrói processos sólidos',
        recommendation: 'Desenvolva assertividade e habilidades de comunicação'
      }
    }
    
    return profiles[profile] || {
      name: 'Perfil Misto',
      description: 'Combinação equilibrada de características comportamentais',
      leadership: 'Estilo de liderança adaptativo, ajusta-se às situações',
      recommendation: 'Continue desenvolvendo suas forças naturais'
    }
  }

  const profileInfo = getProfileInterpretation(results.profile)

  // Dados para o gráfico Radar DISC
  const discChartData = [
    { name: 'Impulsionador', value: results.D },
    { name: 'Conector', value: results.I },
    { name: 'Harmônico', value: results.S },
    { name: 'Estrategista', value: results.C },
  ]

  const handleDownload = async () => {
    const { jsPDF } = await import('jspdf');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;
    
    // Função para adicionar nova página se necessário
    const checkPageBreak = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        // Adicionar cabeçalho em nova página
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text('HumaniQ AI - Relatório DISC', margin, yPosition);
        yPosition += 15;
      }
    };
    
    // Cabeçalho com logo e identidade visual
    pdf.setFillColor(147, 51, 234); // Purple-600
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // Logo e título
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('HumaniQ AI', margin, 20);
    
    pdf.setFontSize(16);
    pdf.text('Relatório de Análise DISC', margin, 30);
    
    yPosition = 50;
    
    // Informações do usuário
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Informações do Participante', margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString('pt-BR');
    pdf.text(`Data do Relatório: ${currentDate}`, margin, yPosition);
    yPosition += 6;
    pdf.text('Tipo de Avaliação: Análise Comportamental DISC', margin, yPosition);
    yPosition += 15;
    
    // Perfil Principal
    checkPageBreak(40);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Seu Perfil DISC', margin, yPosition);
    yPosition += 10;
    
    // Caixa do perfil
    pdf.setFillColor(243, 244, 246); // Gray-100
    pdf.rect(margin, yPosition, contentWidth, 30, 'F');
    pdf.setDrawColor(147, 51, 234);
    pdf.rect(margin, yPosition, contentWidth, 30, 'S');
    
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(147, 51, 234);
    pdf.text(results.profile, margin + 10, yPosition + 15);
    
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(profileInfo.name, margin + 10, yPosition + 25);
    yPosition += 40;
    
    // Descrição do perfil
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const descriptionLines = pdf.splitTextToSize(profileInfo.description, contentWidth - 20);
    pdf.text(descriptionLines, margin + 10, yPosition);
    yPosition += descriptionLines.length * 5 + 10;
    
    // Estilo de liderança
    pdf.setFillColor(237, 233, 254); // Purple-50
    pdf.rect(margin, yPosition, contentWidth, 15, 'F');
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Estilo de Liderança:', margin + 5, yPosition + 6);
    pdf.setFont('helvetica', 'normal');
    const leadershipText = pdf.splitTextToSize(profileInfo.leadership, contentWidth - 80);
    pdf.text(leadershipText, margin + 80, yPosition + 6);
    yPosition += 25;
    
    // Pontuações DISC com barras de progresso
    checkPageBreak(80);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Pontuações por Dimensão', margin, yPosition);
    yPosition += 15;
    
    dimensions.forEach((dimension, index) => {
      checkPageBreak(20);
      
      // Nome da dimensão e pontuação
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${dimension.name} (${dimension.key}): ${dimension.score}/100`, margin, yPosition);
      yPosition += 8;
      
      // Barra de progresso
      const barWidth = contentWidth - 40;
      const barHeight = 6;
      const fillWidth = (barWidth * dimension.score) / 100;
      
      // Fundo da barra (branco com contorno)
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(0, 0, 0);
      pdf.rect(margin, yPosition, barWidth, barHeight, 'FD');
      
      // Preenchimento da barra (verde escuro)
      pdf.setFillColor(22, 101, 52); // Green-800
      pdf.rect(margin, yPosition, fillWidth, barHeight, 'F');
      
      yPosition += 12;
      
      // Descrição
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const interpretationLines = pdf.splitTextToSize(dimension.interpretation, contentWidth - 20);
      pdf.text(interpretationLines, margin + 10, yPosition);
      yPosition += interpretationLines.length * 4 + 8;
    });
    
    // Nova página para análise detalhada
    pdf.addPage();
    yPosition = margin;
    
    // Cabeçalho da nova página
    pdf.setFillColor(147, 51, 234);
    pdf.rect(0, 0, pageWidth, 25, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('HumaniQ AI - Análise Detalhada DISC', margin, 15);
    
    yPosition = 35;
    
    // Análise Detalhada das Dimensões
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Análise Detalhada das Dimensões DISC', margin, yPosition);
    yPosition += 15;
    
    dimensions.forEach((dimension, index) => {
      checkPageBreak(60);
      
      // Título da dimensão
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${dimension.name} (${dimension.key}) - ${dimension.score}%`, margin, yPosition);
      yPosition += 8;
      
      // Interpretação Psicológica
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Interpretação Psicológica:', margin + 5, yPosition);
      yPosition += 5;
      pdf.setFont('helvetica', 'normal');
      const interpretationLines = pdf.splitTextToSize(dimension.interpretation, contentWidth - 10);
      pdf.text(interpretationLines, margin + 5, yPosition);
      yPosition += interpretationLines.length * 4 + 3;
      
      // Estilo de Trabalho
      pdf.setFont('helvetica', 'bold');
      pdf.text('Estilo de Trabalho:', margin + 5, yPosition);
      yPosition += 5;
      pdf.setFont('helvetica', 'normal');
      const workStyleLines = pdf.splitTextToSize(dimension.workStyle, contentWidth - 10);
      pdf.text(workStyleLines, margin + 5, yPosition);
      yPosition += workStyleLines.length * 4 + 3;
      
      // Padrão de Comunicação
      pdf.setFont('helvetica', 'bold');
      pdf.text('Padrão de Comunicação:', margin + 5, yPosition);
      yPosition += 5;
      pdf.setFont('helvetica', 'normal');
      const communicationLines = pdf.splitTextToSize(dimension.communication, contentWidth - 10);
      pdf.text(communicationLines, margin + 5, yPosition);
      yPosition += communicationLines.length * 4 + 3;
      
      // Ambiente Ideal
      pdf.setFont('helvetica', 'bold');
      pdf.text('Ambiente Ideal:', margin + 5, yPosition);
      yPosition += 5;
      pdf.setFont('helvetica', 'normal');
      const environmentLines = pdf.splitTextToSize(dimension.idealEnvironment, contentWidth - 10);
      pdf.text(environmentLines, margin + 5, yPosition);
      yPosition += environmentLines.length * 4 + 10;
    });
    
    // Recomendações de Desenvolvimento
    checkPageBreak(40);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Recomendações de Desenvolvimento', margin, yPosition);
    yPosition += 15;
    
    // Desenvolvimento Principal
    pdf.setFillColor(237, 233, 254); // Purple-50
    pdf.rect(margin, yPosition, contentWidth, 20, 'F');
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Desenvolvimento Principal:', margin + 5, yPosition + 8);
    yPosition += 12;
    pdf.setFont('helvetica', 'normal');
    const recommendationLines = pdf.splitTextToSize(profileInfo.recommendation, contentWidth - 10);
    pdf.text(recommendationLines, margin + 5, yPosition);
    yPosition += recommendationLines.length * 4 + 15;
    
    // Recomendações específicas por dimensão baixa
    const lowDimensions = [
      { condition: results.D < 40, title: 'Desenvolver Impulsionador', text: 'Pratique tomar decisões mais rápidas, assuma mais responsabilidades e desenvolva assertividade.', color: [254, 242, 242] },
      { condition: results.I < 40, title: 'Desenvolver Conector', text: 'Trabalhe habilidades de comunicação, networking e apresentações públicas.', color: [254, 252, 232] },
      { condition: results.S < 40, title: 'Desenvolver Harmônico', text: 'Pratique paciência, trabalho em equipe e construção de relacionamentos duradouros.', color: [240, 253, 244] },
      { condition: results.C < 40, title: 'Desenvolver Estrategista', text: 'Melhore atenção aos detalhes, organização e seguimento de procedimentos.', color: [239, 246, 255] }
    ];
    
    lowDimensions.forEach(rec => {
      if (rec.condition) {
        checkPageBreak(20);
        pdf.setFillColor(rec.color[0], rec.color[1], rec.color[2]);
        pdf.rect(margin, yPosition, contentWidth, 15, 'F');
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text(rec.title + ':', margin + 5, yPosition + 6);
        yPosition += 10;
        pdf.setFont('helvetica', 'normal');
        const recLines = pdf.splitTextToSize(rec.text, contentWidth - 10);
        pdf.text(recLines, margin + 5, yPosition);
        yPosition += recLines.length * 4 + 8;
      }
    });
    
    // Rodapé
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('HumaniQ AI - Plataforma de Avaliação Comportamental', margin, pageHeight - 10);
      pdf.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 30, pageHeight - 10);
    }
    
    pdf.save('relatorio-disc-completo.pdf');
  }

  const handlePrint = () => {
    window.print();
  }

  const handleShare = () => {
    console.log('Compartilhar resultados DISC')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/colaborador/personalidade')}
              className="text-white hover:bg-purple-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Resultados do Teste DISC</h1>
            <p className="text-purple-100 text-lg">Análise do seu perfil comportamental profissional</p>
          </div>
        </div>
      </div>

      <div id="disc-results" className="max-w-4xl mx-auto px-4 py-8">
        {/* Perfil Principal */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Seu Perfil DISC</CardTitle>
            <div className="text-6xl font-bold text-purple-600 mb-2">
              {results.profile}
            </div>
            <div className="text-xl font-semibold text-gray-800 mb-2">
              {profileInfo.name}
            </div>
            <p className="text-gray-600 mb-4">{profileInfo.description}</p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>Estilo de Liderança:</strong> {profileInfo.leadership}
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Gráfico Radar DISC */}
        <div className="mb-8">
          <GraphologyRadarChart data={discChartData} />
        </div>

        {/* Dimensões DISC */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {dimensions.map((dimension, index) => {
            const IconComponent = dimension.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    {dimension.name} ({dimension.key})
                  </CardTitle>
                  <p className="text-sm text-gray-600">{dimension.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{dimension.score}</span>
                      <span className="text-sm text-gray-500">/100</span>
                    </div>
                    <Progress 
                      value={dimension.score} 
                      className="h-3"
                    />
                    <p className="text-sm text-gray-700 font-medium">{dimension.interpretation}</p>
                    <div className="space-y-2 text-xs text-gray-600">
                      <p><strong>Estilo de Trabalho:</strong> {dimension.workStyle}</p>
                      <p><strong>Comunicação:</strong> {dimension.communication}</p>
                      <p><strong>Ambiente Ideal:</strong> {dimension.idealEnvironment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Análise Profissional Detalhada */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl mb-4">Análise Profissional Detalhada</CardTitle>
            <p className="text-gray-700 text-sm">
              {profileInfo.name}: {profileInfo.description}. Este perfil sugere um estilo de trabalho caracterizado por {profileInfo.leadership.toLowerCase()}.
              Abaixo, aplicamos cada dimensão do seu resultado ao contexto organizacional:
            </p>
            <ul className="text-gray-700 text-sm list-disc ml-6 space-y-1 mt-4">
              <li><strong>Impulsionador (D):</strong> {dimensions[0].interpretation}. {dimensions[0].workStyle}.</li>
              <li><strong>Conector (I):</strong> {dimensions[1].interpretation}. {dimensions[1].workStyle}.</li>
              <li><strong>Harmônico (S):</strong> {dimensions[2].interpretation}. {dimensions[2].workStyle}.</li>
              <li><strong>Estrategista (C):</strong> {dimensions[3].interpretation}. {dimensions[3].workStyle}.</li>
            </ul>
            <p className="text-gray-700 text-sm mt-4">
              <strong>Recomendações Profissionais:</strong> Utilize estas informações para alinhar seus objetivos de carreira, colaborar de forma estratégica com colegas de perfis complementares e buscar oportunidades que valorizem suas forças comportamentais.
            </p>
          </CardHeader>
        </Card>

        {/* Recomendações de Desenvolvimento */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl mb-4">Recomendações de Desenvolvimento</CardTitle>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Desenvolvimento Principal:</h4>
                <p className="text-purple-700 text-sm">{profileInfo.recommendation}</p>
              </div>
              
              {results.D < 40 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Desenvolver Impulsionador:</h4>
                  <p className="text-red-700 text-sm">Pratique tomar decisões mais rápidas, assuma mais responsabilidades e desenvolva assertividade.</p>
                </div>
              )}
              
              {results.I < 40 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Desenvolver Conector:</h4>
                  <p className="text-yellow-700 text-sm">Trabalhe habilidades de comunicação, networking e apresentações públicas.</p>
                </div>
              )}
              
              {results.S < 40 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Desenvolver Harmônico:</h4>
                  <p className="text-green-700 text-sm">Pratique paciência, trabalho em equipe e construção de relacionamentos duradouros.</p>
                </div>
              )}
              
              {results.C < 40 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Desenvolver Estrategista:</h4>
                  <p className="text-blue-700 text-sm">Melhore atenção aos detalhes, organização e seguimento de procedimentos.</p>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Fundamentação Científica */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl mb-4">Fundamentação Científica</CardTitle>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Base Teórica:</h4>
                <p className="text-gray-700 text-sm mb-2">
                  O teste DISC é baseado na teoria de William Moulton Marston (1928), que identificou 
                  quatro dimensões comportamentais fundamentais:
                </p>
                <ul className="text-gray-700 text-sm space-y-1 ml-4">
                  <li>• <strong>Impulsionador (D):</strong> Como você responde a problemas e desafios</li>
                  <li>• <strong>Conector (I):</strong> Como você influencia e se relaciona com pessoas</li>
                  <li>• <strong>Harmônico (S):</strong> Como você responde ao ritmo e mudanças</li>
                  <li>• <strong>Estrategista (C):</strong> Como você responde a regras e procedimentos</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Aplicação Profissional:</h4>
                <p className="text-blue-700 text-sm">
                  O DISC é amplamente utilizado em contextos organizacionais para desenvolvimento de liderança, 
                  formação de equipes, comunicação eficaz e seleção de pessoal. É uma das ferramentas de 
                  avaliação comportamental mais utilizadas no mundo corporativo.
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Importante:</h4>
                <p className="text-yellow-700 text-sm">
                  Este perfil representa suas tendências comportamentais naturais. Lembre-se de que todos 
                  possuem características de todas as dimensões, e o comportamento pode variar conforme 
                  o contexto e situação.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={handleDownload} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/colaborador/personalidade/disc')}
          >
            Refazer Teste
          </Button>
        </div>
      </div>
    </div>
  )
}