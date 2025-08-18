const fs = require('fs');
const path = require('path');

/**
 * Script para limpar todos os resultados de testes da pasta archives/results/2025
 * - Remove apenas arquivos JSON de resultados
 * - Preserva arquivos .gitkeep
 * - Mantém estrutura de diretórios
 * - Gera log detalhado das operações
 */

class ArchiveCleaner {
  constructor() {
    this.basePath = path.join(__dirname, 'archives', 'results', '2025');
    this.removedFiles = [];
    this.preservedFiles = [];
    this.errors = [];
  }

  /**
   * Verifica se um arquivo deve ser preservado
   */
  shouldPreserveFile(fileName) {
    return fileName === '.gitkeep' || fileName.startsWith('.');
  }

  /**
   * Remove arquivos JSON recursivamente
   */
  async cleanDirectory(dirPath) {
    try {
      const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        const relativePath = path.relative(this.basePath, fullPath);
        
        if (item.isDirectory()) {
          console.log(`📁 Processando diretório: ${relativePath}`);
          await this.cleanDirectory(fullPath);
        } else if (item.isFile()) {
          if (this.shouldPreserveFile(item.name)) {
            console.log(`✅ Preservando: ${relativePath}`);
            this.preservedFiles.push(relativePath);
          } else {
            try {
              await fs.promises.unlink(fullPath);
              console.log(`🗑️  Removido: ${relativePath}`);
              this.removedFiles.push(relativePath);
            } catch (error) {
              console.error(`❌ Erro ao remover ${relativePath}:`, error.message);
              this.errors.push({ file: relativePath, error: error.message });
            }
          }
        }
      }
    } catch (error) {
      console.error(`❌ Erro ao processar diretório ${dirPath}:`, error.message);
      this.errors.push({ directory: dirPath, error: error.message });
    }
  }

  /**
   * Gera relatório final da limpeza
   */
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RELATÓRIO DE LIMPEZA - ARCHIVES 2025');
    console.log('='.repeat(60));
    
    console.log(`\n📁 Diretório base: ${this.basePath}`);
    console.log(`📅 Data/Hora: ${new Date().toLocaleString('pt-BR')}`);
    
    console.log(`\n🗑️  Arquivos removidos: ${this.removedFiles.length}`);
    if (this.removedFiles.length > 0) {
      this.removedFiles.forEach(file => {
        console.log(`   - ${file}`);
      });
    }
    
    console.log(`\n✅ Arquivos preservados: ${this.preservedFiles.length}`);
    if (this.preservedFiles.length > 0) {
      this.preservedFiles.forEach(file => {
        console.log(`   - ${file}`);
      });
    }
    
    if (this.errors.length > 0) {
      console.log(`\n❌ Erros encontrados: ${this.errors.length}`);
      this.errors.forEach(error => {
        console.log(`   - ${error.file || error.directory}: ${error.error}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (this.errors.length === 0) {
      console.log('✅ Limpeza concluída com sucesso!');
    } else {
      console.log('⚠️  Limpeza concluída com alguns erros.');
    }
    
    console.log('='.repeat(60));
  }

  /**
   * Executa a limpeza completa
   */
  async run() {
    console.log('🧹 Iniciando limpeza dos arquivos de resultados 2025...');
    console.log(`📁 Caminho: ${this.basePath}`);
    
    // Verifica se o diretório existe
    try {
      await fs.promises.access(this.basePath);
    } catch (error) {
      console.error(`❌ Diretório não encontrado: ${this.basePath}`);
      return;
    }
    
    console.log('\n🔍 Processando arquivos...');
    await this.cleanDirectory(this.basePath);
    
    this.generateReport();
  }
}

// Execução do script
if (require.main === module) {
  const cleaner = new ArchiveCleaner();
  cleaner.run().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = ArchiveCleaner;