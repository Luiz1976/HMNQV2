#!/usr/bin/env node

/**
 * Script de Restauração - Retornar à Versão 2
 * Comando direto para retornar à versão 2.0.0
 */

const VersionControl = require('./version-control');
const { execSync } = require('child_process');

class RestoreVersion2 {
  constructor() {
    this.vc = new VersionControl();
  }

  async execute() {
    console.log('🎯 Iniciando restauração para Versão 2...');
    console.log('==========================================\n');

    // Verifica se a versão 2.0.0 existe
    const availableVersions = this.vc.getAvailableVersions();
    const version2 = availableVersions.find(v => v === 'v2.0.0');
    
    if (!version2) {
      console.error('❌ Versão 2.0.0 não encontrada!');
      console.log('\nVersões disponíveis:');
      this.vc.listVersions();
      return false;
    }

    // Verifica se já está na versão 2
    const currentVersion = this.vc.getCurrentVersion();
    if (currentVersion === 'v2.0.0') {
      console.log('✅ Você já está na Versão 2.0.0!');
      this.showVersion2Features();
      return true;
    }

    // Executa a mudança para versão 2
    const success = this.vc.switchToVersion('v2.0.0');
    
    if (success) {
      console.log('\n🎉 Restauração para Versão 2 concluída com sucesso!');
      this.showVersion2Features();
      this.showNextSteps();
    }

    return success;
  }

  showVersion2Features() {
    console.log('\n📋 Funcionalidades da Versão 2.0.0:');
    console.log('====================================');
    console.log('✅ Saudações personalizadas');
    console.log('✅ Sistema de versionamento');
    console.log('✅ Download de PDF');
    console.log('✅ Interface melhorada');
    console.log('✅ Controle de versões integrado');
    console.log('✅ Comandos de restauração');
  }

  showNextSteps() {
    console.log('\n🚀 Próximos passos:');
    console.log('===================');
    console.log('1. Execute "npm install" para garantir dependências');
    console.log('2. Execute "npm run dev" para iniciar o servidor');
    console.log('3. Acesse http://localhost:3000 para ver a aplicação');
    console.log('\n💡 Para retornar ao desenvolvimento:');
    console.log('   node scripts/version-control.js dev');
  }
}

// Execução direta
if (require.main === module) {
  const restore = new RestoreVersion2();
  restore.execute().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Erro durante a restauração:', error.message);
    process.exit(1);
  });
}

module.exports = RestoreVersion2;