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
    descricao: 'Relato de assédio moral na equipe',
    colaborador: 'João Silva'
  },
  {
    id: '2',
    area: 'ti',
    tipo: 'Estresse Ocupacional',
    nivel: 'alto',
    data: '2024-01-14',
    descricao: 'Sobrecarga de trabalho relatada',
    colaborador: 'Maria Santos'
  },
  {
    id: '3',
    area: 'vendas',
    tipo: 'Baixa Autonomia',
    nivel: 'medio',
    data: '2024-01-13',
    descricao: 'Falta de autonomia para tomada de decisões',
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
    nivel: 'baixo',
    data: '2024-01-10',
    descricao: 'Questões menores de ambiente',
    colaborador: 'Lucia Ferreira'
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
    const total = dadosFiltrados.length
    const altos = dadosFiltrados.filter(d => d.nivel === 'alto').length
    const criticos = dadosFiltrados.filter(d => d.nivel === 'critico').length
    const colaboradoresUnicos = new Set(dadosFiltrados.map(d => d.colaborador)).size
    
    return {
      totalRiscos: total,
      riscosAltos: altos,
      riscosCriticos: criticos,
      riscosResolvidos: Math.floor(total * 0.3), // 30% resolvidos (simulado)
      confianca: total > 0 ? Math.min(95, 70 + (total * 2)) : 0,
      colaboradoresAfetados: colaboradoresUnicos
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