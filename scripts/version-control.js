#!/usr/bin/env node

/**
 * Sistema de Controle de Versões - HumanIQ
 * Permite navegar entre diferentes versões do projeto
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class VersionControl {
  constructor() {
    this.availableVersions = this.getAvailableVersions();
    this.currentVersion = this.getCurrentVersion();
  }

  /**
   * Obtém todas as versões disponíveis (tags Git)
   */
  getAvailableVersions() {
    try {
      const tags = execSync('git tag -l', { encoding: 'utf8' }).trim().split('\n').filter(tag => tag);
      return tags.sort((a, b) => {
        // Ordenação semântica de versões
        const aNum = this.parseVersion(a);
        const bNum = this.parseVersion(b);
        return aNum - bNum;
      });
    } catch (error) {
      console.error('Erro ao obter versões:', error.message);
      return [];
    }
  }

  /**
   * Parse de versão para ordenação
   */
  parseVersion(version) {
    if (version === 'v01') return 1;
    const match = version.match(/v?(\d+)\.(\d+)\.(\d+)/);
    if (match) {
      return parseInt(match[1]) * 10000 + parseInt(match[2]) * 100 + parseInt(match[3]);
    }
    return 0;
  }

  /**
   * Obtém a versão atual
   */
  getCurrentVersion() {
    try {
      const currentCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      
      // Verifica se o commit atual tem uma tag
      for (const tag of this.availableVersions) {
        try {
          const tagCommit = execSync(`git rev-parse ${tag}`, { encoding: 'utf8' }).trim();
          if (tagCommit === currentCommit) {
            return tag;
          }
        } catch (e) {
          // Tag não existe, continua
        }
      }
      
      return 'desenvolvimento';
    } catch (error) {
      return 'desconhecida';
    }
  }

  /**
   * Lista todas as versões disponíveis
   */
  listVersions() {
    console.log('\n📋 Versões Disponíveis:');
    console.log('========================');
    
    this.availableVersions.forEach(version => {
      const isCurrent = version === this.currentVersion;
      const marker = isCurrent ? '👉' : '  ';
      console.log(`${marker} ${version}${isCurrent ? ' (atual)' : ''}`);
    });
    
    if (this.currentVersion === 'desenvolvimento') {
      console.log('👉 desenvolvimento (atual)');
    }
    
    console.log('\n');
  }

  /**
   * Muda para uma versão específica
   */
  switchToVersion(targetVersion) {
    if (!this.availableVersions.includes(targetVersion)) {
      console.error(`❌ Versão '${targetVersion}' não encontrada.`);
      console.log('\nVersões disponíveis:');
      this.listVersions();
      return false;
    }

    try {
      console.log(`🔄 Mudando para versão ${targetVersion}...`);
      
      // Salva mudanças pendentes se houver
      try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (status.trim()) {
          console.log('💾 Salvando mudanças pendentes...');
          execSync('git stash push -m "Auto-stash antes de mudar versão"');
        }
      } catch (e) {
        // Ignora erros de stash
      }

      // Faz checkout para a versão
      execSync(`git checkout ${targetVersion}`);
      
      console.log(`✅ Mudança para versão ${targetVersion} concluída!`);
      console.log('\n📝 Lembre-se de executar "npm install" se necessário.');
      
      return true;
    } catch (error) {
      console.error(`❌ Erro ao mudar para versão ${targetVersion}:`, error.message);
      return false;
    }
  }

  /**
   * Retorna para a branch principal (desenvolvimento)
   */
  returnToDevelopment() {
    try {
      console.log('🔄 Retornando para desenvolvimento...');
      execSync('git checkout main');
      
      // Restaura stash se houver
      try {
        const stashList = execSync('git stash list', { encoding: 'utf8' });
        if (stashList.includes('Auto-stash antes de mudar versão')) {
          console.log('🔄 Restaurando mudanças salvas...');
          execSync('git stash pop');
        }
      } catch (e) {
        // Ignora erros de stash
      }
      
      console.log('✅ Retorno ao desenvolvimento concluído!');
      return true;
    } catch (error) {
      console.error('❌ Erro ao retornar ao desenvolvimento:', error.message);
      return false;
    }
  }

  /**
   * Cria uma nova versão
   */
  createVersion(version, message = '') {
    try {
      console.log(`🏷️  Criando versão ${version}...`);
      
      const tagMessage = message || `Versão ${version}`;
      execSync(`git tag -a ${version} -m "${tagMessage}"`);
      execSync(`git push origin ${version}`);
      
      console.log(`✅ Versão ${version} criada com sucesso!`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao criar versão ${version}:`, error.message);
      return false;
    }
  }
}

// CLI Interface
if (require.main === module) {
  const vc = new VersionControl();
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'list':
    case 'ls':
      vc.listVersions();
      break;
      
    case 'switch':
    case 'checkout':
      const targetVersion = args[1];
      if (!targetVersion) {
        console.error('❌ Especifique a versão de destino.');
        console.log('Uso: node version-control.js switch <versão>');
        vc.listVersions();
      } else {
        vc.switchToVersion(targetVersion);
      }
      break;
      
    case 'dev':
    case 'development':
      vc.returnToDevelopment();
      break;
      
    case 'create':
      const newVersion = args[1];
      const message = args.slice(2).join(' ');
      if (!newVersion) {
        console.error('❌ Especifique a nova versão.');
        console.log('Uso: node version-control.js create <versão> [mensagem]');
      } else {
        vc.createVersion(newVersion, message);
      }
      break;
      
    case 'current':
      console.log(`📍 Versão atual: ${vc.currentVersion}`);
      break;
      
    default:
      console.log('🎯 Sistema de Controle de Versões - HumanIQ');
      console.log('============================================\n');
      console.log('Comandos disponíveis:');
      console.log('  list, ls           - Lista todas as versões');
      console.log('  switch <versão>    - Muda para uma versão específica');
      console.log('  dev, development   - Retorna ao desenvolvimento');
      console.log('  create <versão>    - Cria uma nova versão');
      console.log('  current            - Mostra a versão atual');
      console.log('\nExemplos:');
      console.log('  node version-control.js list');
      console.log('  node version-control.js switch v2.0.0');
      console.log('  node version-control.js dev');
      console.log('\n');
      vc.listVersions();
  }
}

module.exports = VersionControl;