/**
 * Exemplo de uso do Sistema de Arquivamento de Resultados de Testes
 * 
 * Este arquivo demonstra como usar as funcionalidades do sistema de arquivamento
 * para salvar, buscar e gerenciar resultados de testes.
 */

import TestResultArchiver from '../utils/archiver'
import TestResultRetriever from '../utils/retriever'
import TestResultIndexer from '../utils/indexer'
import { TestResult } from '../utils/indexer'

// Exemplo de como arquivar um resultado de teste
export async function exemploArquivarResultado() {
  const archiver = new TestResultArchiver()
  
  const resultadoTeste: Omit<TestResult, 'filePath'> = {
    id: 'test_12345',
    userId: 'user_67890',
    testType: 'personalidade',
    testId: 'big-five',
    completedAt: new Date().toISOString(),
    score: 85,
    status: 'completed',
    metadata: {
      duration: 1200, // segundos
      questionsAnswered: 50,
      version: '1.0'
    }
  }
  
  try {
    const caminhoArquivo = await archiver.archiveTestResult(resultadoTeste)
    console.log(`Resultado arquivado em: ${caminhoArquivo}`)
    return caminhoArquivo
  } catch (error) {
    console.error('Erro ao arquivar resultado:', error)
    throw error
  }
}

// Exemplo de como buscar resultados
export async function exemploBuscarResultados() {
  const retriever = new TestResultRetriever()
  
  try {
    // Buscar todos os resultados de um usuário específico
    const resultadosUsuario = await retriever.searchResults({
      userId: 'user_67890',
      limit: 10
    })
    
    console.log(`Encontrados ${resultadosUsuario.totalCount} resultados para o usuário`)
    
    // Buscar resultados por tipo de teste
    const testesPersonalidade = await retriever.searchResults({
      testType: 'personalidade',
      dateFrom: '2025-01-01',
      dateTo: '2025-12-31'
    })
    
    console.log(`Testes de personalidade em 2025: ${testesPersonalidade.totalCount}`)
    
    // Buscar resultados com pontuação alta
    const resultadosAltos = await retriever.searchResults({
      minScore: 80,
      status: 'completed'
    })
    
    console.log(`Resultados com pontuação ≥ 80: ${resultadosAltos.totalCount}`)
    
    return {
      porUsuario: resultadosUsuario,
      porTipo: testesPersonalidade,
      pontosAltos: resultadosAltos
    }
  } catch (error) {
    console.error('Erro na busca:', error)
    throw error
  }
}

// Exemplo de como obter estatísticas
export async function exemploEstatisticas() {
  const retriever = new TestResultRetriever()
  const archiver = new TestResultArchiver()
  
  try {
    // Estatísticas dos resultados
    const statsResultados = await retriever.getResultsStatistics()
    console.log('Estatísticas dos Resultados:', {
      total: statsResultados.totalResults,
      porTipo: statsResultados.byTestType,
      porStatus: statsResultados.byStatus,
      mediaPontuacoes: statsResultados.averageScores
    })
    
    // Estatísticas do arquivo
    const statsArquivo = await archiver.getArchiveStats()
    console.log('Estatísticas do Arquivo:', {
      totalArquivos: statsArquivo.totalFiles,
      tamanhoTotal: `${(statsArquivo.totalSize / 1024 / 1024).toFixed(2)} MB`,
      porTipo: statsArquivo.byTestType,
      porAno: statsArquivo.byYear
    })
    
    return { statsResultados, statsArquivo }
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    throw error
  }
}

// Exemplo de como exportar dados
export async function exemploExportacao() {
  const retriever = new TestResultRetriever()
  
  try {
    // Exportar para CSV
    const csvData = await retriever.exportToCSV({
      testType: 'personalidade',
      dateFrom: '2025-01-01'
    })
    
    console.log('Dados CSV gerados:', csvData.substring(0, 200) + '...')
    
    return csvData
  } catch (error) {
    console.error('Erro na exportação:', error)
    throw error
  }
}

// Exemplo de como reconstruir índices
export async function exemploReconstruirIndices() {
  const indexer = new TestResultIndexer()
  
  try {
    console.log('Iniciando reconstrução dos índices...')
    await indexer.rebuildAllIndexes()
    console.log('Índices reconstruídos com sucesso!')
  } catch (error) {
    console.error('Erro ao reconstruir índices:', error)
    throw error
  }
}

// Exemplo de uso completo
export async function exemploCompleto() {
  console.log('=== Exemplo Completo do Sistema de Arquivamento ===')
  
  try {
    // 1. Arquivar um resultado
    console.log('\n1. Arquivando resultado...')
    const caminhoArquivo = await exemploArquivarResultado()
    
    // 2. Buscar resultados
    console.log('\n2. Buscando resultados...')
    const resultadosBusca = await exemploBuscarResultados()
    
    // 3. Obter estatísticas
    console.log('\n3. Obtendo estatísticas...')
    const estatisticas = await exemploEstatisticas()
    
    // 4. Exportar dados
    console.log('\n4. Exportando dados...')
    const dadosCSV = await exemploExportacao()
    
    console.log('\n=== Exemplo concluído com sucesso! ===')
    
    return {
      arquivado: caminhoArquivo,
      buscas: resultadosBusca,
      stats: estatisticas,
      csv: dadosCSV
    }
  } catch (error) {
    console.error('Erro no exemplo completo:', error)
    throw error
  }
}

// Exemplo de integração com API
export async function exemploIntegracaoAPI() {
  console.log('=== Exemplo de Integração com API ===')
  
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  
  try {
    // Arquivar via API
    const resultadoParaArquivar = {
      id: 'api_test_' + Date.now(),
      userId: 'user_api_test',
      testType: 'psicossociais',
      testId: 'stress-test',
      completedAt: new Date().toISOString(),
      score: 75,
      status: 'completed'
    }
    
    const responseArchive = await fetch(`${baseURL}/api/archives/archive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultadoParaArquivar)
    })
    
    if (responseArchive.ok) {
      const archiveResult = await responseArchive.json()
      console.log('Resultado arquivado via API:', archiveResult.filePath)
    }
    
    // Buscar via API
    const responseSearch = await fetch(`${baseURL}/api/archives/search?testType=psicossociais&limit=5`)
    if (responseSearch.ok) {
      const searchResult = await responseSearch.json()
      console.log(`Encontrados ${searchResult.totalCount} resultados via API`)
    }
    
    // Obter estatísticas via API
    const responseStats = await fetch(`${baseURL}/api/archives/stats`)
    if (responseStats.ok) {
      const stats = await responseStats.json()
      console.log('Estatísticas via API:', stats)
    }
    
    console.log('\n=== Integração com API concluída! ===')
  } catch (error) {
    console.error('Erro na integração com API:', error)
    throw error
  }
}

// Executar exemplo se chamado diretamente
if (require.main === module) {
  exemploCompleto()
    .then(() => console.log('Todos os exemplos executados com sucesso!'))
    .catch(error => console.error('Erro nos exemplos:', error))
}