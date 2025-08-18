import { useState, useMemo } from 'react'
import { FiltrosSimples } from '@/app/empresa/saude/_components/filtros-simples'

export interface DadoRiscoSimples {
  id: string
  area: string
  tipo: string
  nivel: 'baixo' | 'medio' | 'alto' | 'critico'
  data: string
  descricao: string
  colaborador: string
}

export interface MetricasSimples {
  totalRiscos: number
  riscosAltos: number
  riscosCriticos: number
  riscosResolvidos: number
  confianca: number
  colaboradoresAfetados: number
}

// Dados mock para demonstração
const dadosMock: DadoRiscoSimples[] = [
  {
    id: '1',
    area: 'rh',
    tipo: 'Assédio Moral',
    nivel: 'critico',
    data: '2024-01-15',
    descricao: 'Relato de assédio moral na equipe de RH',
    colaborador: 'João Silva'
  },
  {
    id: '2',
    area: 'ti',
    tipo: 'Estresse Ocupacional',
    nivel: 'alto',
    data: '2024-01-14',
    descricao: 'Sobrecarga de trabalho e prazos apertados',
    colaborador: 'Maria Santos'
  },
  {
    id: '3',
    area: 'vendas',
    tipo: 'Pressão por Metas',
    nivel: 'alto',
    data: '2024-01-13',
    descricao: 'Pressão excessiva para atingir metas de vendas',
    colaborador: 'Pedro Costa'
  },
  {
    id: '4',
    area: 'marketing',
    tipo: 'Conflito Interpessoal',
    nivel: 'alto',
    data: '2024-01-12',
    descricao: 'Conflitos frequentes na equipe',
    colaborador: 'Ana Oliveira'
  },
  {
    id: '5',
    area: 'financeiro',
    tipo: 'Pressão por Resultados',
    nivel: 'medio',
    data: '2024-01-11',
    descricao: 'Pressão excessiva por metas',
    colaborador: 'Carlos Lima'
  },
  {
    id: '6',
    area: 'operacoes',
    tipo: 'Ambiente Insalubre',
    nivel: 'medio',
    data: '2024-01-10',
    descricao: 'Ruído excessivo no ambiente de trabalho',
    colaborador: 'Lucia Ferreira'
  },
  {
    id: '7',
    area: 'ti',
    tipo: 'Burnout',
    nivel: 'critico',
    data: '2024-01-09',
    descricao: 'Sinais de esgotamento profissional severo',
    colaborador: 'Carlos Oliveira'
  },
  {
    id: '8',
    area: 'marketing',
    tipo: 'Falta de Reconhecimento',
    nivel: 'medio',
    data: '2024-01-08',
    descricao: 'Ausência de feedback positivo e reconhecimento',
    colaborador: 'Ana Paula'
  },
  {
    id: '9',
    area: 'financeiro',
    tipo: 'Sobrecarga de Trabalho',
    nivel: 'alto',
    data: '2024-01-07',
    descricao: 'Excesso de horas extras e responsabilidades',
    colaborador: 'Roberto Lima'
  },
  {
    id: '10',
    area: 'rh',
    tipo: 'Conflito Interpessoal',
    nivel: 'medio',
    data: '2024-01-06',
    descricao: 'Desentendimentos frequentes entre colegas',
    colaborador: 'Fernanda Costa'
  }
]

export function useFiltrosSimples() {
  const [filtros, setFiltros] = useState<FiltrosSimples>({
    area: 'todos',
    periodo: '30d',
    busca: ''
  })

  // Função para filtrar dados baseado nos filtros aplicados
  const dadosFiltrados = useMemo(() => {
    let dados = [...dadosMock]

    // Filtro por área
    if (filtros.area !== 'todos') {
      dados = dados.filter(dado => dado.area === filtros.area)
    }

    // Filtro por busca
    if (filtros.busca) {
      const termoBusca = filtros.busca.toLowerCase()
      dados = dados.filter(dado => 
        dado.tipo.toLowerCase().includes(termoBusca) ||
        dado.descricao.toLowerCase().includes(termoBusca) ||
        dado.colaborador.toLowerCase().includes(termoBusca)
      )
    }

    // Filtro por período (simulado - na implementação real seria baseado na data)
    const diasPeriodo = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '6m': 180,
      '1a': 365
    }[filtros.periodo] || 30

    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() - diasPeriodo)
    
    dados = dados.filter(dado => new Date(dado.data) >= dataLimite)

    return dados
  }, [filtros])

  // Calcular métricas baseadas nos dados filtrados
  const metricas = useMemo((): MetricasSimples => {
    const totalRiscos = dadosFiltrados.length
    const riscosAltos = dadosFiltrados.filter(d => d.nivel === 'alto').length
    const riscosCriticos = dadosFiltrados.filter(d => d.nivel === 'critico').length
    const riscosMedios = dadosFiltrados.filter(d => d.nivel === 'medio').length
    const riscosBaixos = dadosFiltrados.filter(d => d.nivel === 'baixo').length
    
    // Simular riscos resolvidos baseado no tempo e severidade
    const riscosResolvidos = Math.floor(
      (riscosBaixos * 0.8) + (riscosMedios * 0.4) + (riscosAltos * 0.2) + (riscosCriticos * 0.1)
    )
    
    // Calcular confiança baseada na distribuição e quantidade de dados
    const confianca = Math.min(95, Math.max(60, 
      85 - (riscosCriticos * 5) - (riscosAltos * 2) + (totalRiscos > 5 ? 5 : 0)
    ))
    
    const colaboradoresAfetados = new Set(dadosFiltrados.map(d => d.colaborador)).size

    return {
      totalRiscos,
      riscosAltos,
      riscosCriticos,
      riscosResolvidos,
      confianca,
      colaboradoresAfetados
    }
  }, [dadosFiltrados])

  const limparFiltros = () => {
    setFiltros({
      area: 'todos',
      periodo: '30d',
      busca: ''
    })
  }

  return {
    filtros,
    setFiltros,
    dadosFiltrados,
    metricas,
    limparFiltros
  }
}