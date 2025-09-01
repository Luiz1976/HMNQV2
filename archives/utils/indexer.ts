import fs from 'fs/promises';
import path from 'path';

interface TestResult {
  id: string;
  userId: string;
  testType: 'personalidade' | 'psicossociais' | 'outros';
  testId: string;
  completedAt: string;
  score?: number;
  status: 'completed' | 'incomplete';
  filePath: string;
  metadata?: Record<string, any>;
}

interface IndexEntry {
  lastUpdated: string;
  totalEntries: number;
  index: {
    description: string;
    structure: string;
    entries: Record<string, any>;
  };
  metadata: {
    version: string;
    indexType: string;
    autoUpdate: boolean;
  };
}

class TestResultIndexer {
  private archivesPath: string;
  private indexPath: string;

  constructor() {
    this.archivesPath = path.join(process.cwd(), 'archives');
    this.indexPath = path.join(this.archivesPath, 'index');
  }

  /**
   * Atualiza todos os índices com um novo resultado de teste
   */
  async updateAllIndexes(testResult: TestResult): Promise<void> {
    try {
      await Promise.all([
        this.updateDateIndex(testResult),
        this.updateUserIndex(testResult),
        this.updateTestTypeIndex(testResult)
      ]);
    } catch (error) {
      console.error('Erro ao atualizar índices:', error);
      throw error;
    }
  }

  /**
   * Atualiza o índice por data
   */
  private async updateDateIndex(testResult: TestResult): Promise<void> {
    const indexFile = path.join(this.indexPath, 'by-date.json');
    const index = await this.loadIndex(indexFile);
    
    const date = new Date(testResult.completedAt).toISOString().split('T')[0];
    
    if (!index.index.entries[date]) {
      index.index.entries[date] = [];
    }
    
    index.index.entries[date].push({
      id: testResult.id,
      userId: testResult.userId,
      testType: testResult.testType,
      testId: testResult.testId,
      filePath: testResult.filePath,
      score: testResult.score,
      status: testResult.status
    });
    
    index.totalEntries++;
    index.lastUpdated = new Date().toISOString();
    
    await this.saveIndex(indexFile, index);
  }

  /**
   * Atualiza o índice por usuário
   */
  private async updateUserIndex(testResult: TestResult): Promise<void> {
    const indexFile = path.join(this.indexPath, 'by-user.json');
    const index = await this.loadIndex(indexFile);
    
    if (!index.index.entries[testResult.userId]) {
      index.index.entries[testResult.userId] = {
        totalTests: 0,
        tests: []
      };
    }
    
    index.index.entries[testResult.userId].tests.push({
      id: testResult.id,
      testType: testResult.testType,
      testId: testResult.testId,
      completedAt: testResult.completedAt,
      filePath: testResult.filePath,
      score: testResult.score,
      status: testResult.status
    });
    
    index.index.entries[testResult.userId].totalTests++;
    index.totalEntries++;
    index.lastUpdated = new Date().toISOString();
    
    await this.saveIndex(indexFile, index);
  }

  /**
   * Atualiza o índice por tipo de teste
   */
  private async updateTestTypeIndex(testResult: TestResult): Promise<void> {
    const indexFile = path.join(this.indexPath, 'by-test-type.json');
    const index = await this.loadIndex(indexFile);
    
    const testTypeEntry = index.index.entries[testResult.testType];
    
    // Verificar se testTypeEntry existe, se não, criar uma entrada padrão
    if (!testTypeEntry) {
      console.warn(`Tipo de teste '${testResult.testType}' não encontrado no índice. Criando entrada padrão.`);
      index.index.entries[testResult.testType] = {
        name: `Testes ${testResult.testType}`,
        count: 0,
        tests: {}
      };
    }
    
    const entry = index.index.entries[testResult.testType];
    
    if (!entry.tests[testResult.testId]) {
      entry.tests[testResult.testId] = {
        count: 0,
        results: []
      };
    }
    
    entry.tests[testResult.testId].results.push({
      id: testResult.id,
      userId: testResult.userId,
      completedAt: testResult.completedAt,
      filePath: testResult.filePath,
      score: testResult.score,
      status: testResult.status
    });
    
    entry.tests[testResult.testId].count++;
    entry.count++;
    index.totalEntries++;
    index.lastUpdated = new Date().toISOString();
    
    await this.saveIndex(indexFile, index);
  }

  /**
   * Carrega um arquivo de índice
   */
  private async loadIndex(filePath: string): Promise<IndexEntry> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Erro ao carregar índice ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Salva um arquivo de índice
   */
  private async saveIndex(filePath: string, index: IndexEntry): Promise<void> {
    try {
      await fs.writeFile(filePath, JSON.stringify(index, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Erro ao salvar índice ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Reconstrói todos os índices a partir dos arquivos existentes
   */
  async rebuildAllIndexes(): Promise<void> {
    try {
      // Limpar índices existentes
      await this.clearAllIndexes();
      
      // Escanear todos os arquivos de resultado
      const resultsPath = path.join(this.archivesPath, 'results');
      const testResults = await this.scanAllResults(resultsPath);
      
      // Recriar índices
      for (const testResult of testResults) {
        await this.updateAllIndexes(testResult);
      }
      
      console.log(`Índices reconstruídos com ${testResults.length} entradas`);
    } catch (error) {
      console.error('Erro ao reconstruir índices:', error);
      throw error;
    }
  }

  /**
   * Limpa todos os índices
   */
  private async clearAllIndexes(): Promise<void> {
    const indexFiles = ['by-date.json', 'by-user.json', 'by-test-type.json'];
    
    for (const file of indexFiles) {
      const filePath = path.join(this.indexPath, file);
      const index = await this.loadIndex(filePath);
      
      // Reset entries
      if (file === 'by-test-type.json') {
        index.index.entries = {
          personalidade: { name: 'Testes de Personalidade', count: 0, tests: {} },
          psicossociais: { name: 'Testes Psicossociais', count: 0, tests: {} },
          outros: { name: 'Outros Testes', count: 0, tests: {} }
        };
      } else {
        index.index.entries = {};
      }
      
      index.totalEntries = 0;
      index.lastUpdated = new Date().toISOString();
      
      await this.saveIndex(filePath, index);
    }
  }

  /**
   * Escaneia todos os arquivos de resultado existentes
   */
  private async scanAllResults(resultsPath: string): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    try {
      const years = await fs.readdir(resultsPath);
      
      for (const year of years) {
        const yearPath = path.join(resultsPath, year);
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
                  const content = await fs.readFile(filePath, 'utf-8');
                  const testResult = JSON.parse(content) as TestResult;
                  testResult.filePath = filePath;
                  results.push(testResult);
                } catch (error) {
                  console.warn(`Erro ao ler arquivo ${filePath}:`, error);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao escanear resultados:', error);
    }
    
    return results;
  }
}

export default TestResultIndexer;
export type { TestResult, IndexEntry };