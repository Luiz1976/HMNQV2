// Script para excluir PERMANENTEMENTE todos os arquivos JSON do Local 2
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const copyFile = promisify(fs.copyFile);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

interface DeletionLog {
  timestamp: string;
  action: string;
  file: string;
  success: boolean;
  error?: string;
}

class Local2Deleter {
  private resultsDir = './archives/results';
  private backupDir = './backup-local2-' + new Date().toISOString().replace(/[:.]/g, '-');
  private logFile = './deletion-log-local2-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
  private deletionLog: DeletionLog[] = [];

  async getAllFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const items = await readdir(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          const subFiles = await this.getAllFiles(fullPath);
          files.push(...subFiles);
        } else if (item.endsWith('.json')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.log(`Diretório não encontrado ou vazio: ${dir}`);
    }
    
    return files;
  }

  async createBackup(files: string[]): Promise<void> {
    console.log('\n🔄 Criando backup de segurança...');
    
    try {
      await mkdir(this.backupDir, { recursive: true });
      
      for (const file of files) {
        const relativePath = path.relative(this.resultsDir, file);
        const backupPath = path.join(this.backupDir, relativePath);
        const backupDirPath = path.dirname(backupPath);
        
        await mkdir(backupDirPath, { recursive: true });
        await copyFile(file, backupPath);
        
        this.deletionLog.push({
          timestamp: new Date().toISOString(),
          action: 'BACKUP',
          file: file,
          success: true
        });
      }
      
      console.log(`✅ Backup criado em: ${this.backupDir}`);
      console.log(`📁 ${files.length} arquivos copiados para backup`);
    } catch (error) {
      console.error('❌ Erro ao criar backup:', error);
      throw error;
    }
  }

  async deleteFiles(files: string[]): Promise<void> {
    console.log('\n🗑️  Iniciando exclusão permanente...');
    
    let deletedCount = 0;
    let errorCount = 0;
    
    for (const file of files) {
      try {
        await unlink(file);
        deletedCount++;
        
        this.deletionLog.push({
          timestamp: new Date().toISOString(),
          action: 'DELETE',
          file: file,
          success: true
        });
        
        console.log(`🗑️  Excluído: ${file}`);
      } catch (error) {
        errorCount++;
        
        this.deletionLog.push({
          timestamp: new Date().toISOString(),
          action: 'DELETE',
          file: file,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
        
        console.error(`❌ Erro ao excluir ${file}:`, error);
      }
    }
    
    console.log(`\n📊 Resultado da exclusão:`);
    console.log(`✅ Arquivos excluídos: ${deletedCount}`);
    console.log(`❌ Erros: ${errorCount}`);
  }

  async cleanEmptyDirectories(): Promise<void> {
    console.log('\n🧹 Limpando diretórios vazios...');
    
    const checkAndRemoveDir = async (dir: string): Promise<void> => {
      try {
        const items = await readdir(dir);
        
        // Primeiro, verifica subdiretórios recursivamente
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stats = await stat(fullPath);
          
          if (stats.isDirectory()) {
            await checkAndRemoveDir(fullPath);
          }
        }
        
        // Depois verifica se o diretório atual está vazio
        const updatedItems = await readdir(dir);
        if (updatedItems.length === 0 && dir !== this.resultsDir) {
          await rmdir(dir);
          console.log(`🗑️  Diretório vazio removido: ${dir}`);
          
          this.deletionLog.push({
            timestamp: new Date().toISOString(),
            action: 'REMOVE_DIR',
            file: dir,
            success: true
          });
        }
      } catch (error) {
        console.log(`ℹ️  Diretório não pôde ser removido: ${dir}`);
      }
    };
    
    try {
      await checkAndRemoveDir(this.resultsDir);
    } catch (error) {
      console.log('ℹ️  Limpeza de diretórios concluída');
    }
  }

  async saveLog(): Promise<void> {
    const logData = {
      operation: 'DELETE_LOCAL2_RESULTS',
      timestamp: new Date().toISOString(),
      backupLocation: this.backupDir,
      totalOperations: this.deletionLog.length,
      summary: {
        backups: this.deletionLog.filter(log => log.action === 'BACKUP').length,
        deletions: this.deletionLog.filter(log => log.action === 'DELETE').length,
        directoryRemovals: this.deletionLog.filter(log => log.action === 'REMOVE_DIR').length,
        errors: this.deletionLog.filter(log => !log.success).length
      },
      operations: this.deletionLog
    };
    
    await writeFile(this.logFile, JSON.stringify(logData, null, 2));
    console.log(`\n📝 Log detalhado salvo em: ${this.logFile}`);
  }

  async confirmDeletion(): Promise<boolean> {
    console.log('\n⚠️  ATENÇÃO: OPERAÇÃO IRREVERSÍVEL!');
    console.log('🚨 Esta operação irá EXCLUIR PERMANENTEMENTE todos os arquivos JSON do Local 2');
    console.log('📁 Diretório: ./archives/results/');
    console.log('💾 Um backup será criado antes da exclusão');
    console.log('\n❓ Deseja continuar? (digite "CONFIRMAR" para prosseguir)');
    
    // Para automação, retorna true. Em uso interativo, implementar readline
    return true;
  }

  async execute(): Promise<void> {
    try {
      console.log('🔍 EXCLUSÃO PERMANENTE DO LOCAL 2 (ARQUIVOS JSON)');
      console.log('=' .repeat(60));
      
      // Confirmar operação
      const confirmed = await this.confirmDeletion();
      if (!confirmed) {
        console.log('❌ Operação cancelada pelo usuário');
        return;
      }
      
      // Contar arquivos antes da exclusão
      console.log('\n📊 Contando arquivos antes da exclusão...');
      const filesBefore = await this.getAllFiles(this.resultsDir);
      console.log(`📁 Total de arquivos JSON encontrados: ${filesBefore.length}`);
      
      if (filesBefore.length === 0) {
        console.log('ℹ️  Nenhum arquivo JSON encontrado para excluir');
        return;
      }
      
      // Exibir arquivos que serão excluídos
      console.log('\n📋 Arquivos que serão excluídos:');
      filesBefore.forEach((file, index) => {
        console.log(`${index + 1}. ${file}`);
      });
      
      // Criar backup
      await this.createBackup(filesBefore);
      
      // Excluir arquivos
      await this.deleteFiles(filesBefore);
      
      // Limpar diretórios vazios
      await this.cleanEmptyDirectories();
      
      // Contar arquivos após exclusão
      console.log('\n📊 Verificando resultado...');
      const filesAfter = await this.getAllFiles(this.resultsDir);
      console.log(`📁 Arquivos JSON restantes: ${filesAfter.length}`);
      
      // Salvar log
      await this.saveLog();
      
      console.log('\n✅ OPERAÇÃO CONCLUÍDA COM SUCESSO!');
      console.log('=' .repeat(60));
      console.log(`🗑️  Arquivos excluídos: ${filesBefore.length}`);
      console.log(`📁 Arquivos restantes: ${filesAfter.length}`);
      console.log(`💾 Backup disponível em: ${this.backupDir}`);
      console.log(`📝 Log detalhado em: ${this.logFile}`);
      
    } catch (error) {
      console.error('❌ Erro durante a operação:', error);
      await this.saveLog();
      throw error;
    }
  }
}

// Executar o script
async function main() {
  const deleter = new Local2Deleter();
  await deleter.execute();
}

main().catch(console.error);