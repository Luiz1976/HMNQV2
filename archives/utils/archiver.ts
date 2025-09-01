import fs from 'fs/promises';
import path from 'path';
import TestResultIndexer, { TestResult } from './indexer';

interface ArchiveOptions {
  autoIndex?: boolean;
  createDirectories?: boolean;
  overwrite?: boolean;
}

class TestResultArchiver {
  private archivesPath: string;
  private resultsPath: string;
  private indexer: TestResultIndexer;

  constructor() {
    this.archivesPath = path.join(process.cwd(), 'archives');
    this.resultsPath = path.join(this.archivesPath, 'results');
    this.indexer = new TestResultIndexer();
  }

  /**
   * Arquiva um resultado de teste
   */
  async archiveTestResult(
    testResult: Omit<TestResult, 'filePath'>,
    options: ArchiveOptions = {}
  ): Promise<string> {
    const {
      autoIndex = true,
      createDirectories = true,
      overwrite = false
    } = options;

    try {
      // Gerar caminho do arquivo
      const filePath = await this.generateFilePath(testResult);
      
      // Criar diretórios se necessário
      if (createDirectories) {
        await this.ensureDirectoryExists(path.dirname(filePath));
      }
      
      // Verificar se arquivo já existe
      if (!overwrite && await this.fileExists(filePath)) {
        throw new Error(`Arquivo já existe: ${filePath}`);
      }
      
      // Preparar dados para arquivamento
      const archiveData = {
        ...testResult,
        archivedAt: new Date().toISOString(),
        filePath: filePath
      };
      
      // Salvar arquivo
      await fs.writeFile(filePath, JSON.stringify(archiveData, null, 2), 'utf-8');
      
      // Atualizar índices
      if (autoIndex) {
        await this.indexer.updateAllIndexes({ ...archiveData, filePath });
      }
      
      console.log(`Resultado arquivado com sucesso: ${filePath}`);
      return filePath;
      
    } catch (error) {
      console.error('Erro ao arquivar resultado:', error);
      throw error;
    }
  }

  /**
   * Arquiva múltiplos resultados de teste
   */
  async archiveMultipleResults(
    testResults: Omit<TestResult, 'filePath'>[],
    options: ArchiveOptions = {}
  ): Promise<string[]> {
    const archivedPaths: string[] = [];
    
    for (const testResult of testResults) {
      try {
        const filePath = await this.archiveTestResult(testResult, options);
        archivedPaths.push(filePath);
      } catch (error) {
        console.error(`Erro ao arquivar resultado ${testResult.id}:`, error);
        // Continuar com os próximos resultados
      }
    }
    
    return archivedPaths;
  }

  /**
   * Gera o caminho do arquivo baseado no resultado do teste
   * Resultados do HumaniQ BOLIE são armazenados em 'personalidade';
   * os demais seguem o diretório correspondente a testResult.testType
   */
  private async generateFilePath(testResult: Omit<TestResult, 'filePath'>): Promise<string> {
    const date = new Date(testResult.completedAt);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Formato: userId_testType_testId_timestamp.json
    const timestamp = date.toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0];
    const fileName = `${testResult.userId}_${testResult.testType}_${testResult.testId}_${timestamp}.json`;
    
    // Determina o subdiretório: se for BOLIE armazena em "personalidade", caso contrário usa o tipo do teste
    const archiveSubDir = testResult.testType?.toLowerCase().includes('bolie') ? 'personalidade' : testResult.testType;

    return path.join(
      this.resultsPath,
      year,
      month,
      archiveSubDir,
      fileName
    );
  }

  /**
   * Garante que o diretório existe
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Verifica se um arquivo existe
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Move um resultado existente para o arquivo
   */
  async moveToArchive(
    sourceFilePath: string,
    testResult: Omit<TestResult, 'filePath'>,
    options: ArchiveOptions = {}
  ): Promise<string> {
    try {
      // Ler arquivo original
      const originalContent = await fs.readFile(sourceFilePath, 'utf-8');
      const originalData = JSON.parse(originalContent);
      
      // Combinar dados
      const combinedData = {
        ...originalData,
        ...testResult,
        movedAt: new Date().toISOString()
      };
      
      // Arquivar
      const archivePath = await this.archiveTestResult(combinedData, options);
      
      // Remover arquivo original (opcional)
      if (options.overwrite) {
        await fs.unlink(sourceFilePath);
      }
      
      return archivePath;
      
    } catch (error) {
      console.error('Erro ao mover para arquivo:', error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas do arquivo
   */
  async getArchiveStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    byTestType: Record<string, number>;
    byYear: Record<string, number>;
  }> {
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      byTestType: {} as Record<string, number>,
      byYear: {} as Record<string, number>
    };

    try {
      const years = await fs.readdir(this.resultsPath);
      
      for (const year of years) {
        const yearPath = path.join(this.resultsPath, year);
        stats.byYear[year] = 0;
        
        const months = await fs.readdir(yearPath);
        
        for (const month of months) {
          const monthPath = path.join(yearPath, month);
          const testTypes = await fs.readdir(monthPath);
          
          for (const testType of testTypes) {
            const testTypePath = path.join(monthPath, testType);
            
            if (!stats.byTestType[testType]) {
              stats.byTestType[testType] = 0;
            }
            
            const files = await fs.readdir(testTypePath);
            
            for (const file of files) {
              if (file.endsWith('.json')) {
                const filePath = path.join(testTypePath, file);
                const fileStat = await fs.stat(filePath);
                
                stats.totalFiles++;
                stats.totalSize += fileStat.size;
                stats.byTestType[testType]++;
                stats.byYear[year]++;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
    }

    return stats;
  }

  /**
   * Limpa arquivos antigos baseado em critérios
   */
  async cleanupOldFiles(options: {
    olderThanDays?: number;
    testType?: string;
    dryRun?: boolean;
  } = {}): Promise<string[]> {
    const {
      olderThanDays = 365,
      testType,
      dryRun = true
    } = options;

    const deletedFiles: string[] = [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    try {
      const years = await fs.readdir(this.resultsPath);
      
      for (const year of years) {
        const yearPath = path.join(this.resultsPath, year);
        const months = await fs.readdir(yearPath);
        
        for (const month of months) {
          const monthPath = path.join(yearPath, month);
          const testTypes = await fs.readdir(monthPath);
          
          for (const currentTestType of testTypes) {
            if (testType && currentTestType !== testType) continue;
            
            const testTypePath = path.join(monthPath, currentTestType);
            const files = await fs.readdir(testTypePath);
            
            for (const file of files) {
              if (file.endsWith('.json')) {
                const filePath = path.join(testTypePath, file);
                const fileStat = await fs.stat(filePath);
                
                if (fileStat.mtime < cutoffDate) {
                  deletedFiles.push(filePath);
                  
                  if (!dryRun) {
                    await fs.unlink(filePath);
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro na limpeza de arquivos:', error);
    }

    return deletedFiles;
  }
}

export default TestResultArchiver;
export type { ArchiveOptions };