'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { 
  Download, 
  RefreshCw,
  CheckCircle,
  X
} from 'lucide-react'


interface MatrizRiscoAvancadaProps {
  sharedData?: {
    value: number
    level: string
    color: string
    selectedArea: string
    selectedPeriod: string
    lastUpdate: string
  }
  onDataChange?: (data: any) => void
}

export default function MatrizRiscoAvancada({ sharedData, onDataChange }: MatrizRiscoAvancadaProps) {
  const [selectedArea, setSelectedArea] = useState(sharedData?.selectedArea || 'todas')
  const [selectedPeriod, setSelectedPeriod] = useState(sharedData?.selectedPeriod || 'ultimo-ano')
  const [lastUpdate, setLastUpdate] = useState(sharedData?.lastUpdate || '01/08/2025, 07:52:36')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<any>(null)
  const [showRiskDetails, setShowRiskDetails] = useState(false)
  const [showExpandedIndicator, setShowExpandedIndicator] = useState(false)
  const [riskIntensity, setRiskIntensity] = useState(sharedData?.value || 3.2)
  const { toast } = useToast()

  // Sincronizar com dados compartilhados
  useEffect(() => {
    if (sharedData) {
      setSelectedArea(sharedData.selectedArea)
      setSelectedPeriod(sharedData.selectedPeriod)
      setLastUpdate(sharedData.lastUpdate)
      setRiskIntensity(sharedData.value)
    }
  }, [sharedData])

  // Labels conforme a nova matriz
  const probabilityLabels = ['Sem Impacto', 'Leve', 'Médio', 'Grave', 'Gravíssimo']
  const impactLabels = ['Raro', 'Baixa', 'Média', 'Alta', 'Quase certo']

  // Dados consolidados das avaliações psicossociais aplicadas na empresa
  // Representa o estado geral da saúde psicossocial organizacional
  const consolidatedPsychosocialData = {
    totalEmployeesEvaluated: 156,
    evaluationsApplied: ['HumaniQ RPO', 'Assédio Moral e Sexual', 'Clima Organizacional', 'Burnout Assessment'],
    lastConsolidation: '2024-01-15',
    organizationalRiskLevel: 'Moderado a Alto',
    
    // Riscos psicossociais predominantes identificados na organização
    identifiedInstitutionalRisks: [
      {
        riskType: 'Assédio Institucional',
        category: 'Assédio e Violência',
        probability: 1, // Baixa probabilidade
        impact: 4,      // Gravíssimo impacto
        severity: 'Crítico',
        prevalence: '12%', // Percentual da organização afetada
        affectedDepartments: ['Vendas', 'Operações'],
        consolidatedFrom: ['Avaliação Assédio Moral e Sexual', 'Clima Organizacional'],
        description: 'Identificado padrão de comportamento abusivo sistemático em setores específicos',
        interventionPriority: 'Urgente',
        recommendations: [
          'Implementação imediata de política anti-assédio',
          'Treinamento obrigatório para lideranças',
          'Canal de denúncia anônimo e seguro',
          'Auditoria comportamental nos setores afetados'
        ]
      },
      {
        riskType: 'Falta de Apoio da Liderança',
        category: 'Relacionamento',
        probability: 3, // Alta probabilidade
        impact: 2,      // Médio impacto
        severity: 'Alto',
        prevalence: '34%',
        affectedDepartments: ['TI', 'Financeiro', 'RH'],
        consolidatedFrom: ['HumaniQ RPO', 'Clima Organizacional'],
        description: 'Déficit significativo no suporte e orientação gerencial',
        interventionPriority: 'Alta',
        recommendations: [
          'Programa de desenvolvimento de lideranças',
          'Implementar reuniões 1:1 regulares',
          'Treinamento em comunicação empática',
          'Sistema de feedback 360°'
        ]
      },
      {
        riskType: 'Ambiente Tóxico',
        category: 'Ambiente',
        probability: 2, // Média probabilidade
        impact: 3,      // Alto impacto
        severity: 'Alto',
        prevalence: '28%',
        affectedDepartments: ['Vendas', 'Atendimento'],
        consolidatedFrom: ['Clima Organizacional', 'Burnout Assessment'],
        description: 'Clima organizacional deteriorado com alta competitividade destrutiva',
        interventionPriority: 'Alta',
        recommendations: [
          'Reestruturação da cultura organizacional',
          'Workshops de colaboração e trabalho em equipe',
          'Revisão de metas e indicadores de performance',
          'Programa de reconhecimento e valorização'
        ]
      },
      {
        riskType: 'Sobrecarga Sistemática',
        category: 'Sobrecarga',
        probability: 4, // Quase certa probabilidade
        impact: 2,      // Médio impacto
        severity: 'Alto',
        prevalence: '45%',
        affectedDepartments: ['Operações', 'TI', 'Vendas'],
        consolidatedFrom: ['HumaniQ RPO', 'Burnout Assessment'],
        description: 'Excesso crônico de demandas em relação aos recursos disponíveis',
        interventionPriority: 'Alta',
        recommendations: [
          'Análise e redistribuição de cargas de trabalho',
          'Contratação estratégica de pessoal',
          'Implementação de ferramentas de automação',
          'Política de horas extras e descanso'
        ]
      },
      {
        riskType: 'Falta de Reconhecimento',
        category: 'Reconhecimento',
        probability: 3, // Alta probabilidade
        impact: 1,      // Baixo impacto
        severity: 'Moderado',
        prevalence: '52%',
        affectedDepartments: ['Todas as áreas'],
        consolidatedFrom: ['HumaniQ RPO', 'Clima Organizacional'],
        description: 'Ausência de sistema estruturado de reconhecimento e valorização',
        interventionPriority: 'Média',
        recommendations: [
          'Criação de programa de reconhecimento',
          'Sistema de feedback positivo regular',
          'Plano de carreira transparente',
          'Celebração de conquistas e marcos'
        ]
      }
    ]
  }

  // Matriz base de classificação de riscos
  const baseRiskMatrix = [
    ['Risco Baixo', 'Risco Baixo', 'Risco Moderado', 'Risco Elevado', 'Risco Elevado'],
    ['Risco Baixo', 'Risco Baixo', 'Risco Moderado', 'Risco Elevado', 'Risco Extremo'],
    ['Risco Baixo', 'Risco Moderado', 'Risco Elevado', 'Risco Extremo', 'Risco Extremo'],
    ['Risco Moderado', 'Risco Elevado', 'Risco Elevado', 'Risco Extremo', 'Risco Extremo'],
    ['Risco Elevado', 'Risco Elevado', 'Risco Extremo', 'Risco Extremo', 'Risco Extremo']
  ]

  // Função para verificar se uma célula tem risco psicossocial institucional identificado
  const hasIdentifiedRisk = (row: number, col: number) => {
    return consolidatedPsychosocialData.identifiedInstitutionalRisks.some(risk => 
      risk.impact === row && risk.probability === col
    );
  };

  // Função para obter detalhes do risco institucional identificado
  const getRiskDetails = (row: number, col: number) => {
    return consolidatedPsychosocialData.identifiedInstitutionalRisks.find(risk => 
      risk.impact === row && risk.probability === col
    );
  };

  // Função para calcular o score geral de risco psicossocial
  const calculatePsychosocialRiskScore = () => {
    const risks = consolidatedPsychosocialData.identifiedInstitutionalRisks
    if (risks.length === 0) return 8.5 // Score padrão se não houver riscos
    
    // Pesos por severidade
    const severityWeights = {
      'Crítico': 1.0,
      'Alto': 0.8,
      'Moderado': 0.5,
      'Baixo': 0.2
    }
    
    // Calcular score baseado na prevalência e severidade
    let totalWeightedRisk = 0
    let totalWeight = 0
    
    risks.forEach(risk => {
      const weight = severityWeights[risk.severity as keyof typeof severityWeights] || 0.5
      const prevalenceValue = parseFloat(risk.prevalence.replace('%', '')) / 100 // Converter percentual para decimal
      const riskImpact = (risk.probability * risk.impact) / 25 // Normalizar para 0-1
      
      totalWeightedRisk += weight * prevalenceValue * riskImpact
      totalWeight += weight
    })
    
    // Calcular score final (invertido: quanto maior o risco, menor o score)
    const averageRisk = totalWeight > 0 ? totalWeightedRisk / totalWeight : 0
    const score = Math.max(0, 10 - (averageRisk * 10))
    
    return Math.round(score * 10) / 10 // Arredondar para 1 casa decimal
  }

  // Função para obter a cor da célula baseada no nível de risco
  const getCellColor = (riskLevel: string) => {
    // Aplicar intensidade baseada nos dados compartilhados do indicador
    const intensity = sharedData?.value ? Math.min(sharedData.value / 10, 1) : 0.5
    const opacityClass = intensity > 0.8 ? 'opacity-100' : intensity > 0.6 ? 'opacity-90' : intensity > 0.4 ? 'opacity-80' : 'opacity-70'
    
    switch (riskLevel) {
      case 'Risco Baixo':
        return `bg-gray-300 text-gray-800 ${opacityClass}`
      case 'Risco Moderado':
        return `bg-green-500 ${opacityClass}`
      case 'Risco Elevado':
        return `bg-yellow-500 ${opacityClass}`
      case 'Risco Extremo':
        return `bg-red-500 ${opacityClass}`
      default:
        return `bg-gray-300 ${opacityClass}`
    }
  }

  // Função para atualizar dados
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Atualizar timestamp
      setLastUpdate(new Date().toLocaleString('pt-BR'))
      
      toast({
         title: "Dados atualizados",
         description: "A matriz de riscos foi atualizada com sucesso.",
         duration: 3000,
       })
    } catch (error) {
      toast({
         title: "Erro na atualização",
         description: "Não foi possível atualizar os dados. Tente novamente.",
         variant: "destructive",
         duration: 3000,
       })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleCellClick = (impactIndex: number, probIndex: number) => {
    const riskDetails = getRiskDetails(impactIndex, probIndex)
    if (riskDetails) {
      setSelectedRisk(riskDetails)
      setShowRiskDetails(true)
    }
  }

  const closeRiskDetails = () => {
    setShowRiskDetails(false)
    setSelectedRisk(null)
  }

  // Função para exportar dados
  const exportData = async () => {
    setIsExporting(true)
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Preparar dados para exportação
      const exportData = {
        matriz: baseRiskMatrix,
        probabilityLabels,
        impactLabels,
        area: selectedArea,
        periodo: selectedPeriod,
        ultimaAtualizacao: lastUpdate,
        dadosConsolidados: consolidatedPsychosocialData,
        timestamp: new Date().toISOString()
      }
      
      // Criar e baixar arquivo
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `matriz-risco-${selectedArea}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
         title: "Exportação concluída",
         description: `Arquivo matriz-risco-${selectedArea}-${new Date().toISOString().split('T')[0]}.json baixado com sucesso.`,
         duration: 4000,
       })
    } catch (error) {
      toast({
         title: "Erro na exportação",
         description: "Não foi possível exportar os dados. Tente novamente.",
         variant: "destructive",
         duration: 3000,
       })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">

      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl font-bold">MATRIZ DE RISCOS PSICOSSOCIAIS</CardTitle>
                {sharedData && (
                  <Badge 
                    variant="outline" 
                    className={`animate-pulse border-2 ${
                      sharedData.value > 7 ? 'border-red-500 text-red-600' :
                      sharedData.value > 5 ? 'border-yellow-500 text-yellow-600' :
                      'border-green-500 text-green-600'
                    }`}
                  >
                    🔄 Sincronizado com Indicador ({sharedData.value.toFixed(1)})
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Análise baseada na consolidação dos testes psicossociais realizados pela empresa
                {sharedData && (
                  <span className="ml-2 text-blue-600 font-medium">
                    • Intensidade aplicada: {sharedData.level}
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                {isRefreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isRefreshing ? 'Atualizando...' : 'Atualizar'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportData}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                {isExporting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isExporting ? 'Exportando...' : 'Exportar'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Legenda de Categorias de Riscos Psicossociais */}
        <div className="mx-6 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Categorias de Riscos Psicossociais
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-2 rounded border border-blue-300">
              <div className="font-medium text-red-700 mb-1">🚨 Assédio e Violência</div>
              <div className="text-gray-600">Assédio Moral, Discriminação, Bullying</div>
            </div>
            <div className="bg-white p-2 rounded border border-blue-300">
              <div className="font-medium text-orange-700 mb-1">⚡ Sobrecarga</div>
              <div className="text-gray-600">Excesso de Trabalho, Pressão Temporal</div>
            </div>
            <div className="bg-white p-2 rounded border border-blue-300">
              <div className="font-medium text-yellow-700 mb-1">🔄 Organização</div>
              <div className="text-gray-600">Falta de Autonomia, Conflito de Papéis</div>
            </div>
            <div className="bg-white p-2 rounded border border-blue-300">
              <div className="font-medium text-purple-700 mb-1">🤝 Relacionamento</div>
              <div className="text-gray-600">Isolamento, Falta de Apoio Social</div>
            </div>
            <div className="bg-white p-2 rounded border border-blue-300">
              <div className="font-medium text-green-700 mb-1">🎯 Reconhecimento</div>
              <div className="text-gray-600">Falta de Valorização, Injustiça</div>
            </div>
            <div className="bg-white p-2 rounded border border-blue-300">
              <div className="font-medium text-blue-700 mb-1">🌡️ Ambiente</div>
              <div className="text-gray-600">Condições Físicas, Clima Tóxico</div>
            </div>
            <div className="bg-white p-2 rounded border border-blue-300">
              <div className="font-medium text-indigo-700 mb-1">📈 Desenvolvimento</div>
              <div className="text-gray-600">Falta de Crescimento, Estagnação</div>
            </div>
            <div className="bg-white p-2 rounded border border-blue-300">
              <div className="font-medium text-pink-700 mb-1">⚖️ Equilíbrio</div>
              <div className="text-gray-600">Work-Life Balance, Burnout</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Colaboradores Avaliados</h3>
              <p className="text-2xl font-bold text-blue-600">{consolidatedPsychosocialData.totalEmployeesEvaluated}</p>
              <p className="text-sm text-blue-600">Base de dados consolidada</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">Avaliações Aplicadas</h3>
              <p className="text-lg font-bold text-purple-600">{consolidatedPsychosocialData.evaluationsApplied.length}</p>
              <p className="text-sm text-purple-600">Instrumentos utilizados</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">Nível Organizacional</h3>
              <p className="text-lg font-bold text-yellow-600">{consolidatedPsychosocialData.organizationalRiskLevel}</p>
              <p className="text-sm text-yellow-600">Estado geral da empresa</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Última Consolidação</h3>
              <p className="text-lg font-bold text-green-600">{consolidatedPsychosocialData.lastConsolidation}</p>
              <p className="text-sm text-green-600">Dados atualizados</p>
            </div>
          </div>
          
          {/* Informações sobre os testes aplicados */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Instrumentos de Avaliação Utilizados</h3>
            <div className="flex flex-wrap gap-2">
              {consolidatedPsychosocialData.evaluationsApplied.map((evaluation, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {evaluation}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Esta matriz representa a consolidação dos resultados de {consolidatedPsychosocialData.totalEmployeesEvaluated} colaboradores 
              avaliados através de {consolidatedPsychosocialData.evaluationsApplied.length} instrumentos psicossociais diferentes.
            </p>
          </div>
        </div>

        {/* Informações sobre riscos institucionais identificados */}
        {consolidatedPsychosocialData.identifiedInstitutionalRisks.length > 0 && (
          <div className="mx-6 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2 animate-pulse" />
              <h3 className="font-semibold text-yellow-800">Riscos Psicossociais Institucionais Identificados</h3>
            </div>
            <p className="text-sm text-yellow-700 mb-3">
              {consolidatedPsychosocialData.identifiedInstitutionalRisks.length} risco(s) predominante(s) foram identificados através da consolidação e análise de IA dos {consolidatedPsychosocialData.evaluationsApplied.length} instrumentos psicossociais aplicados na organização.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {consolidatedPsychosocialData.identifiedInstitutionalRisks.map((risk, index) => (
                <div key={index} className="bg-white p-3 rounded border border-yellow-300">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">{risk.riskType}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      risk.severity === 'Crítico' ? 'bg-red-100 text-red-800' :
                      risk.severity === 'Alto' ? 'bg-orange-100 text-orange-800' :
                      risk.severity === 'Moderado' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    {risk.prevalence} da organização afetada
                  </p>
                  <p className="text-xs text-gray-500">
                    Consolidado de: {risk.consolidatedFrom.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <CardContent>
          <div className="space-y-4">
            {/* Controles */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as áreas</SelectItem>
                    <SelectItem value="operacional">Operacional</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="estrategico">Estratégico</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ultimo-mes">Último mês</SelectItem>
                    <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
                    <SelectItem value="ultimo-semestre">Último semestre</SelectItem>
                    <SelectItem value="ultimo-ano">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                <span>Atualizado: {lastUpdate}</span>
              </div>
            </div>

            {/* Matriz Principal */}
            <div className="w-full">
              <div className="grid grid-cols-6 gap-2 bg-white rounded-lg p-4 shadow-sm border">
                {/* Headers de Probabilidade */}
                <div className="bg-blue-600 text-white p-3 rounded font-medium text-center text-sm h-20 w-full flex items-center justify-center">
                  Probabilidade /<br />Impacto
                </div>
                {probabilityLabels.map((label, index) => (
                  <div key={index} className="bg-blue-500 text-white p-3 rounded font-medium text-center text-sm h-20 w-full flex items-center justify-center">
                    {label}
                  </div>
                ))}

                {/* Linhas da Matriz */}
                {impactLabels.map((impactLabel, impactIndex) => (
                  <React.Fragment key={impactIndex}>
                    {/* Label do Impacto */}
                    <div className="bg-blue-500 text-white p-3 rounded font-medium text-center text-sm h-20 w-full flex items-center justify-center">
                      {impactLabel}
                    </div>
                    
                    {/* Células da Matriz */}
                    {probabilityLabels.map((_, probIndex) => {
                      const riskLevel = baseRiskMatrix[impactIndex][probIndex]
                      const cellColor = getCellColor(riskLevel)
                      const intensity = sharedData?.value ? Math.min(sharedData.value / 10, 1) : 0.5
                      const shouldPulse = intensity > 0.7 && (riskLevel === 'Risco Elevado' || riskLevel === 'Risco Extremo')
                      
                      return (
                        <div
                          key={`${impactIndex}-${probIndex}`}
                          className={`${cellColor} p-2 rounded text-center font-medium text-white cursor-pointer hover:opacity-80 transition-all duration-300 h-20 w-full flex flex-col items-center justify-center relative ${
                            hasIdentifiedRisk(impactIndex, probIndex) ? 'ring-4 ring-blue-500 ring-opacity-90 shadow-xl' : ''
                          } ${
                            shouldPulse ? 'animate-pulse ring-2 ring-white ring-opacity-50' : ''
                          }`}
                          title={(() => {
                            const riskDetails = getRiskDetails(impactIndex, probIndex);
                            if (riskDetails) {
                              return `🚨 RISCO PSICOSSOCIAL IDENTIFICADO\n` +
                                     `Tipo: ${riskDetails.riskType}\n` +
                                     `Categoria: ${riskDetails.category}\n` +
                                     `Severidade: ${riskDetails.severity}\n` +
                                     `Prevalência: ${riskDetails.prevalence}\n` +
                                     `Departamentos Afetados: ${riskDetails.affectedDepartments.join(', ')}\n` +
                                     `Consolidado de: ${riskDetails.consolidatedFrom.join(', ')}\n\nClique para mais detalhes`;
                            }
                            return `Impacto: ${impactLabel} | Probabilidade: ${probabilityLabels[probIndex]} | Nível: ${riskLevel}`;
                          })()} 
                          onClick={() => handleCellClick(impactIndex, probIndex)}
                        >
                          {hasIdentifiedRisk(impactIndex, probIndex) ? (
                            <>
                              {/* Ícone de alerta */}
                              <div className="absolute top-1 right-1 text-blue-300">
                                <svg className="w-4 h-4 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              
                              {/* Nome do risco na célula */}
                              <div className="text-center px-1 z-10 relative w-full">
                                <div className="font-bold text-white text-xs leading-tight mb-1 drop-shadow-lg">
                                  {getRiskDetails(impactIndex, probIndex)?.riskType}
                                </div>
                                <div className="text-blue-100 text-xs font-semibold drop-shadow">
                                  {getRiskDetails(impactIndex, probIndex)?.severity}
                                </div>
                                <div className="text-blue-200 text-[10px] mt-1 drop-shadow">
                                  {getRiskDetails(impactIndex, probIndex)?.prevalence} afetados
                                </div>
                              </div>
                              
                              {/* Barra lateral pulsante */}
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 animate-pulse" />
                              
                              {/* Efeito de brilho */}
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-transparent to-blue-200 opacity-20 animate-pulse" />
                            </>
                          ) : (
                            /* Célula normal sem risco */
                            <div className="text-center w-full">
                              <div className="text-sm font-medium">{riskLevel}</div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </React.Fragment>
                ))}
              </div>
              
              {/* Rodapé */}
              <div className="text-center mt-2">
                <span className="text-sm font-medium text-gray-600">CONSEQUÊNCIA</span>
              </div>
            </div>

            {/* Legenda */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span className="text-sm">Baixo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Moderado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm">Elevado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Extremo</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes do Risco */}
      {showRiskDetails && selectedRisk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Detalhes do Risco Psicossocial Institucional
                </h2>
                <button
                  onClick={closeRiskDetails}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Informações Principais */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-yellow-800 mb-2">Tipo de Risco</h3>
                      <p className="text-yellow-700">{selectedRisk.riskType}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-800 mb-2">Severidade</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedRisk.severity === 'Alto' ? 'bg-red-100 text-red-800' :
                        selectedRisk.severity === 'Moderado' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedRisk.severity}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-800 mb-2">Prevalência</h3>
                      <p className="text-yellow-700 text-lg font-bold">{selectedRisk.prevalence}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-800 mb-2">Categoria</h3>
                      <p className="text-yellow-700">{selectedRisk.category}</p>
                    </div>
                  </div>
                </div>

                {/* Análise de IA */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Análise Institucional Consolidada
                  </h3>
                  <p className="text-blue-700 mb-3">{selectedRisk.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-blue-800">Probabilidade:</span>
                      <span className="ml-2 text-blue-700">{probabilityLabels[selectedRisk.probability]}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Impacto:</span>
                      <span className="ml-2 text-blue-700">{impactLabels[selectedRisk.impact]}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Departamentos Afetados:</span>
                      <span className="ml-2 text-blue-700">{selectedRisk.affectedDepartments.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Consolidado de:</span>
                      <span className="ml-2 text-blue-700">{selectedRisk.consolidatedFrom.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Prioridade de Intervenção:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        selectedRisk.interventionPriority === 'Urgente' ? 'bg-red-100 text-red-800' :
                        selectedRisk.interventionPriority === 'Alta' ? 'bg-orange-100 text-orange-800' :
                        selectedRisk.interventionPriority === 'Média' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedRisk.interventionPriority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recomendações */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Recomendações de Ação
                  </h3>
                  <ul className="space-y-2">
                    {selectedRisk.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ações */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={closeRiskDetails}>
                    Fechar
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Criar Plano de Ação
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Expandido do Indicador */}
      {showExpandedIndicator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  Análise Detalhada - Risco Psicossocial Institucional
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExpandedIndicator(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Indicador Principal removido */}
                
                {/* Distribuição por Severidade */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Distribuição por Severidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['Crítico', 'Alto', 'Moderado', 'Baixo'].map(severity => {
                        const count = consolidatedPsychosocialData.identifiedInstitutionalRisks.filter(risk => risk.severity === severity).length
                        const percentage = consolidatedPsychosocialData.identifiedInstitutionalRisks.length > 0 
                          ? Math.round((count / consolidatedPsychosocialData.identifiedInstitutionalRisks.length) * 100) 
                          : 0
                        return (
                          <div key={severity} className="flex justify-between items-center">
                            <span className="font-medium">{severity}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">{count} riscos</span>
                              <Badge className={`${
                                severity === 'Crítico' ? 'bg-red-500' :
                                severity === 'Alto' ? 'bg-orange-500' :
                                severity === 'Moderado' ? 'bg-yellow-500' :
                                'bg-green-500'
                              } text-white`}>{percentage}%</Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Departamentos Mais Afetados */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Departamentos Mais Afetados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {(() => {
                        const deptCount: { [key: string]: number } = {}
                        consolidatedPsychosocialData.identifiedInstitutionalRisks.forEach(risk => {
                          risk.affectedDepartments.forEach(dept => {
                            deptCount[dept] = (deptCount[dept] || 0) + 1
                          })
                        })
                        return Object.entries(deptCount)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 5)
                          .map(([dept, count]) => (
                            <div key={dept} className="flex justify-between items-center">
                              <span className="text-sm">{dept}</span>
                              <Badge variant="outline">{count} riscos</Badge>
                            </div>
                          ))
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Lista Detalhada de Riscos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Riscos Identificados - Detalhamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {consolidatedPsychosocialData.identifiedInstitutionalRisks.map((risk, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800">{risk.riskType}</h4>
                          <Badge className={`${
                            risk.severity === 'Crítico' ? 'bg-red-500' :
                            risk.severity === 'Alto' ? 'bg-orange-500' :
                            risk.severity === 'Moderado' ? 'bg-yellow-500' :
                            'bg-green-500'
                          } text-white`}>{risk.severity}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-500">Prevalência:</span>
                            <div className="font-semibold">{risk.prevalence}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Probabilidade:</span>
                            <div className="font-semibold">{risk.probability}/5</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Impacto:</span>
                            <div className="font-semibold">{risk.impact}/5</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Prioridade:</span>
                            <div className="font-semibold">{risk.interventionPriority}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}