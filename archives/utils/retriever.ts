import fs from 'fs/promises';
import path from 'path';
import { TestResult, IndexEntry } from './indexer';

interface SearchCriteria {
  userId?: string;
  testType?: 'personalidade' | 'psicossociais' | 'outros';
  testId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: 'completed' | 'incomplete';
  minScore?: number;
  maxScore?: number;
  limit?: number;
  offset?: number;
}

interface SearchResult {
  results: TestResult[];
  totalCount: number;
  hasMore: boolean;
}

class TestResultRetriever {
  private archivesPath: string;
  private indexPath: string;
  private resultsPath: string;

  constructor() {
    this.archivesPath = path.join(process.cwd(), 'archives');
    this.indexPath = path.join(this.archivesPath, 'index');
    this.resultsPath = path.join(this.archivesPath, 'results');
  }

  /**
   * Busca resultados baseado em critérios
   */
  async searchResults(criteria: SearchCriteria = {}): Promise<SearchResult> {
    const {
      userId,
      testType,
      testId,
      dateFrom,
      dateTo,
      status,
      minScore,
      maxScore,
      limit = 50,
      offset = 0
    } = criteria;

    try {
      let results: TestResult[] = [];

      // Usar índice mais apropriado baseado nos critérios
      if (userId) {
        results = await this.searchByUser(userId);
      } else if (testType) {
        results = await this.searchByTestType(testType, testId);
      } else if (dateFrom || dateTo) {
        results = await this.searchByDateRange(dateFrom, dateTo);
      } else {
        results = await this.getAllResults();
      }

      // Aplicar filtros adicionais
      results = this.applyFilters(results, {
        testType,
        testId,
        dateFrom,
        dateTo,
        status,
        minScore,
        maxScore
      });

      // Ordenar por data (mais recente primeiro)
      results.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

      const totalCount = results.length;
      const paginatedResults = results.slice(offset, offset + limit);
      const hasMore = offset + limit < totalCount;

      return {
        results: paginatedResults,
        totalCount,
        hasMore
      };

    } catch (error) {
      console.error('Erro na busca de resultados:', error);
      throw error;
    }
  }

  /**
   * Busca resultados por usuário
   */
  private async searchByUser(userId: string): Promise<TestResult[]> {
    const indexFile = path.join(this.indexPath, 'by-user.json');
    const index = await this.loadIndex(indexFile);
    
    const userEntry = index.index.entries[userId];
    if (!userEntry) {
      return [];
    }

    const results: TestResult[] = [];
    
    for (const test of userEntry.tests) {
      try {
        const result = await this.loadTestResult(test.filePath);
        results.push(result);
      } catch (error) {
        console.warn(`Erro ao carregar resultado ${test.filePath}:`, error);
      }
    }

    return results;
  }

  /**
   * Busca resultados por tipo de teste
   */
  private async searchByTestType(testType: string, testId?: string): Promise<TestResult[]> {
    const indexFile = path.join(this.indexPath, 'by-test-type.json');
    const index = await this.loadIndex(indexFile);
    
    const testTypeEntry = index.index.entries[testType];
    if (!testTypeEntry) {
      return [];
    }

    const results: TestResult[] = [];
    
    if (testId) {
      // Buscar teste específico
      const specificTest = testTypeEntry.tests[testId];
      if (specificTest) {
        for (const result of specificTest.results) {
          try {
            const testResult = await this.loadTestResult(result.filePath);
            results.push(testResult);
          } catch (error) {
            console.warn(`Erro ao carregar resultado ${result.filePath}:`, error);
          }
        }
      }
    } else {
      // Buscar todos os testes do tipo
      for (const [, testData] of Object.entries(testTypeEntry.tests)) {
        for (const result of (testData as any).results) {
          try {
            const testResult = await this.loadTestResult(result.filePath);
            results.push(testResult);
          } catch (error) {
            console.warn(`Erro ao carregar resultado ${result.filePath}:`, error);
          }
        }
      }
    }

    return results;
  }

  /**
   * Busca resultados por intervalo de datas
   */
  private async searchByDateRange(dateFrom?: string, dateTo?: string): Promise<TestResult[]> {
    const indexFile = path.join(this.indexPath, 'by-date.json');
    const index = await this.loadIndex(indexFile);
    
    const results: TestResult[] = [];
    const fromDate = dateFrom ? new Date(dateFrom) : new Date('1900-01-01');
    const toDate = dateTo ? new Date(dateTo) : new Date();

    for (const [date, entries] of Object.entries(index.index.entries)) {
      const entryDate = new Date(date);
      
      if (entryDate >= fromDate && entryDate <= toDate) {
        for (const entry of entries as any[]) {
          try {
            const result = await this.loadTestResult(entry.filePath);
            results.push(result);
          } catch (error) {
            console.warn(`Erro ao carregar resultado ${entry.filePath}:`, error);
          }
        }
      }
    }

    return results;
  }

  /**
   * Obtém todos os resultados
   */
  private async getAllResults(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    try {
      const years = await fs.readdir(this.resultsPath);
      
      for (const year of years) {
        const yearPath = path.join(this.resultsPath, year);
        const months = await fs.readdir(yearPath);
        
        for (const month of months) {
          const monthPath = path.join(yearPath, month);
          const testTypes = await fs.readdir(monthPath);
          
          for (const testType of testTypes) {
            const testTypePath = path.join(monthPath, testType);
            const files = await fs.readdir(testTypePath);
            
            for (const file of files) {
              if (file.endsWith('.json')) {
                const filePath = path.join(testTypePath, file);
                try {
                  const result = await this.loadTestResult(filePath);
                  results.push(result);
                } catch (error) {
                  console.warn(`Erro ao carregar resultado ${filePath}:`, error);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao obter todos os resultados:', error);
    }
    
    return results;
  }

  /**
   * Aplica filtros aos resultados
   */
  private applyFilters(results: TestResult[], filters: Partial<SearchCriteria>): TestResult[] {
    return results.filter(result => {
      // Filtro por tipo de teste
      if (filters.testType && result.testType !== filters.testType) {
        return false;
      }

      // Filtro por ID do teste
      if (filters.testId && result.testId !== filters.testId) {
        return false;
      }

      // Filtro por intervalo de datas
      if (filters.dateFrom || filters.dateTo) {
        const resultDate = new Date(result.completedAt);
        
        if (filters.dateFrom && resultDate < new Date(filters.dateFrom)) {
          return false;
        }
        
        if (filters.dateTo && resultDate > new Date(filters.dateTo)) {
          return false;
        }
      }

      // Filtro por status
      if (filters.status && result.status !== filters.status) {
        return false;
      }

      // Filtro por pontuação mínima
      if (filters.minScore !== undefined && (result.score === undefined || result.score < filters.minScore)) {
        return false;
      }

      // Filtro por pontuação máxima
      if (filters.maxScore !== undefined && (result.score === undefined || result.score > filters.maxScore)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Obtém um resultado específico por ID
   */
  async getResultById(resultId: string): Promise<TestResult | null> {
    try {
      const allResults = await this.getAllResults();
      return allResults.find(result => result.id === resultId) || null;
    } catch (error) {
      console.error('Erro ao buscar resultado por ID:', error);
      return null;
    }
  }

  /**
   * Obtém estatísticas dos resultados
   */
  async getResultsStatistics(): Promise<{
    totalResults: number;
    byTestType: Record<string, number>;
    byStatus: Record<string, number>;
    byMonth: Record<string, number>;
    averageScores: Record<string, number>;
  }> {
    const results = await this.getAllResults();
    
    const stats = {
      totalResults: results.length,
      byTestType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      byMonth: {} as Record<string, number>,
      averageScores: {} as Record<string, number>
    };

    const scoresByType: Record<string, number[]> = {};

    for (const result of results) {
      // Por tipo de teste
      stats.byTestType[result.testType] = (stats.byTestType[result.testType] || 0) + 1;
      
      // Por status
      stats.byStatus[result.status] = (stats.byStatus[result.status] || 0) + 1;
      
      // Por mês
      const month = new Date(result.completedAt).toISOString().substring(0, 7);
      stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
      
      // Pontuações para média
      if (result.score !== undefined) {
        if (!scoresByType[result.testType]) {
          scoresByType[result.testType] = [];
        }
        scoresByType[result.testType].push(result.score);
      }
    }

    // Calcular médias
    for (const [testType, scores] of Object.entries(scoresByType)) {
      if (scores.length > 0) {
        stats.averageScores[testType] = scores.reduce((a, b) => a + b, 0) / scores.length;
      }
    }

    return stats;
  }

  /**
   * Exporta resultados para CSV
   */
  async exportToCSV(criteria: SearchCriteria = {}): Promise<string> {
    const searchResult = await this.searchResults({ ...criteria, limit: 10000 });
    const results = searchResult.results;

    if (results.length === 0) {
      return 'Nenhum resultado encontrado';
    }

    // Cabeçalho CSV
    const headers = [
      'ID',
      'Usuario ID',
      'Tipo de Teste',
      'ID do Teste',
      'Data de Conclusao',
      'Pontuacao',
      'Status',
      'Caminho do Arquivo'
    ];

    // Linhas de dados
    const rows = results.map(result => [
      result.id,
      result.userId,
      result.testType,
      result.testId,
      result.completedAt,
      result.score?.toString() || '',
      result.status,
      result.filePath
    ]);

    // Combinar cabeçalho e dados
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  /**
   * Carrega um índice
   */
  private async loadIndex(filePath: string): Promise<IndexEntry> {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Carrega um resultado de teste
   */
  private async loadTestResult(filePath: string): Promise<TestResult> {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }
}

export default TestResultRetriever;
export type { SearchCriteria, SearchResult };