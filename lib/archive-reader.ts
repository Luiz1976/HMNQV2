import fs from 'fs'
import path from 'path'

export interface ArchivedTestResult {
  id: string
  testName: string
  testType: string
  userId: string
  sessionId: string
  overallScore?: number
  dimensionScores?: Record<string, number>
  duration: number
  completedAt: string
  createdAt: string
  status: string
  metadata: {
    testCategory: string
    testDescription: string
    version: string
  }
  archivedAt: string
  filePath: string
  insights?: string[]
}

/**
 * Lê todos os arquivos JSON arquivados de resultados de testes
 * @param userId - ID do usuário para filtrar resultados (opcional)
 * @returns Array de resultados arquivados
 */
export async function readArchivedResults(userId?: string): Promise<ArchivedTestResult[]> {
  const archivesPath = path.join(process.cwd(), 'archives', 'results')
  const results: ArchivedTestResult[] = []

  try {
    // Verificar se o diretório de arquivos existe
    if (!fs.existsSync(archivesPath)) {
      console.log('Diretório de arquivos não encontrado:', archivesPath)
      return results
    }

    // Função recursiva para ler arquivos JSON
    const readDirectory = async (dirPath: string): Promise<void> => {
      const items = fs.readdirSync(dirPath, { withFileTypes: true })

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name)

        if (item.isDirectory()) {
          // Recursivamente ler subdiretórios
          await readDirectory(fullPath)
        } else if (item.isFile() && item.name.endsWith('.json') && !item.name.startsWith('.')) {
          try {
            // Ler e parsear arquivo JSON
            const fileContent = fs.readFileSync(fullPath, 'utf-8')
            const testResult: ArchivedTestResult = JSON.parse(fileContent)

            // Filtrar por usuário se especificado
            if (!userId || testResult.userId === userId) {
              results.push(testResult)
            }
          } catch (error) {
            console.error(`Erro ao ler arquivo ${fullPath}:`, error)
          }
        }
      }
    }

    await readDirectory(archivesPath)

    // Ordenar por data de conclusão (mais recente primeiro)
    results.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

    console.log(`Encontrados ${results.length} resultados arquivados${userId ? ` para usuário ${userId}` : ''}`)
    return results

  } catch (error) {
    console.error('Erro ao ler resultados arquivados:', error)
    return results
  }
}

/**
 * Converte resultado arquivado para o formato esperado pelo frontend
 * @param archivedResult - Resultado arquivado
 * @returns Resultado formatado
 */
export function formatArchivedResult(archivedResult: ArchivedTestResult) {
  return {
    id: `archived_${archivedResult.id}`,
    testName: archivedResult.testName,
    category: archivedResult.metadata?.testCategory || archivedResult.testType,
    status: 'completed' as const,
    score: archivedResult.overallScore ? Math.round(archivedResult.overallScore) : undefined,
    completedAt: archivedResult.completedAt,
    duration: archivedResult.duration,
    insights: archivedResult.insights || [
      'Resultado arquivado',
      'Dados históricos disponíveis'
    ],
    isArchived: true,
    archivedAt: archivedResult.archivedAt,
    filePath: archivedResult.filePath
  }
}

/**
 * Obtém estatísticas dos resultados arquivados
 * @param archivedResults - Array de resultados arquivados
 * @returns Estatísticas dos resultados
 */
export function getArchivedResultsStats(archivedResults: ArchivedTestResult[]) {
  const total = archivedResults.length
  const withScores = archivedResults.filter(r => r.overallScore)
  const averageScore = withScores.length > 0
    ? Math.round(withScores.reduce((acc, r) => acc + (r.overallScore || 0), 0) / withScores.length)
    : 0

  const byCategory = archivedResults.reduce((acc, result) => {
    const category = result.metadata?.testCategory || result.testType
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    total,
    averageScore,
    byCategory,
    oldestResult: archivedResults.length > 0 
      ? archivedResults[archivedResults.length - 1].completedAt 
      : null,
    newestResult: archivedResults.length > 0 
      ? archivedResults[0].completedAt 
      : null
  }
}