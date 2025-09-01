// Script para verificar se todos os arquivos JSON do Local 2 foram excluídos
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

class Local2Verifier {
  private resultsDir = './archives/results';

  async getAllJsonFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const items = await readdir(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          const subFiles = await this.getAllJsonFiles(fullPath);
          files.push(...subFiles);
        } else if (item.endsWith('.json') && !item.startsWith('.')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.log(`Diretório não encontrado: ${dir}`);
    }
    
    return files;
  }

  async verifyDeletion(): Promise<void> {
    console.log('🔍 VERIFICAÇÃO DE EXCLUSÃO DO LOCAL 2');
    console.log('=' .repeat(50));
    
    try {
      const remainingFiles = await this.getAllJsonFiles(this.resultsDir);
      
      console.log(`\n📊 Resultado da verificação:`);
      console.log(`📁 Arquivos JSON encontrados: ${remainingFiles.length}`);
      
      if (remainingFiles.length === 0) {
        console.log('\n✅ SUCESSO: Todos os arquivos JSON foram excluídos do Local 2!');
        console.log('🗑️  O Local 2 está completamente limpo');
        console.log('💾 Backup disponível para recuperação se necessário');
      } else {
        console.log('\n⚠️  ATENÇÃO: Ainda existem arquivos JSON no Local 2:');
        remainingFiles.forEach((file, index) => {
          console.log(`${index + 1}. ${file}`);
        });
      }
      
      // Verificar estrutura de diretórios
      console.log('\n📂 Estrutura de diretórios restante:');
      await this.showDirectoryStructure(this.resultsDir, 0);
      
    } catch (error) {
      console.error('❌ Erro durante a verificação:', error);
    }
  }

  async showDirectoryStructure(dir: string, level: number): Promise<void> {
    try {
      const items = await readdir(dir);
      const indent = '  '.repeat(level);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          console.log(`${indent}📁 ${item}/`);
          await this.showDirectoryStructure(fullPath, level + 1);
        } else {
          const icon = item.endsWith('.json') ? '📄' : '📋';
          console.log(`${indent}${icon} ${item}`);
        }
      }
    } catch (error) {
      console.log(`${' '.repeat(level * 2)}❌ Erro ao ler diretório: ${dir}`);
    }
  }
}

// Executar verificação
async function main() {
  const verifier = new Local2Verifier();
  await verifier.verifyDeletion();
}

main().catch(console.error);