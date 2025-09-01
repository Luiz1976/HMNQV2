import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';

interface ResultadoVerificacao {
  tipo: string;
  caminho: string;
  tamanho: number;
  modificado: Date;
  conteudo?: string;
}

interface RelatorioDetalhado {
  timestamp: Date;
  totalArquivos: number;
  arquivosPorTipo: Record<string, number>;
  resultadosEncontrados: ResultadoVerificacao[];
  diretoriosVerificados: string[];
  padroesTestados: string[];
  resumo: {
    temResultadosTeste: boolean;
    totalResultados: number;
    tiposEncontrados: string[];
  };
}

class VerificadorResultados {
  private baseDir: string;
  private resultados: ResultadoVerificacao[] = [];
  private diretoriosVerificados: string[] = [];
  private padroesTestados: string[] = [];

  constructor(baseDir: string = process.cwd()) {
    this.baseDir = baseDir;
  }

  async verificarTudo(): Promise<RelatorioDetalhado> {
    console.log('🔍 Iniciando verificação EXTREMAMENTE detalhada de resultados de teste...');
    
    // 1. Buscar por padrões de arquivos relacionados a testes
    await this.buscarPadroesTeste();
    
    // 2. Verificar diretórios ocultos e especiais
    await this.verificarDiretoriosOcultos();
    
    // 3. Analisar arquivos de backup
    await this.analisarBackups();
    
    // 4. Buscar strings relacionadas a testes
    await this.buscarStringsRelacionadas();
    
    // 5. Verificar arquivos compactados
    await this.verificarArquivosCompactados();
    
    // 6. Analisar logs
    await this.analisarLogs();
    
    // 7. Verificar todas as pastas profundamente
    await this.verificarTodasPastas();
    
    return this.gerarRelatorio();
  }

  private async buscarPadroesTeste(): Promise<void> {
    console.log('📁 Buscando padrões de arquivos relacionados a testes...');
    
    const padroes = [
      '**/*.test.*',
      '**/*.result.*',
      '**/*test-result*',
      '**/*answer*',
      '**/*session*',
      '**/*TestResult*',
      '**/*TestSession*',
      '**/*AIAnalysis*',
      '**/*resultado*',
      '**/*resposta*',
      '**/*sessao*',
      '**/*analise*',
      '**/test-*',
      '**/result-*',
      '**/session-*',
      '**/answer-*',
      '**/*.json',
      '**/*.db',
      '**/*.sqlite',
      '**/*.sqlite3'
    ];

    this.padroesTestados = padroes;

    for (const padrao of padroes) {
      try {
        const arquivos = await glob(padrao, {
          cwd: this.baseDir,
          ignore: ['node_modules/**', '.git/**'],
          dot: true,
          absolute: true
        });

        for (const arquivo of arquivos) {
          await this.analisarArquivo(arquivo, 'padrao-teste');
        }
      } catch (error) {
        console.log(`⚠️ Erro ao buscar padrão ${padrao}:`, error);
      }
    }
  }

  private async verificarDiretoriosOcultos(): Promise<void> {
    console.log('🔍 Verificando diretórios ocultos e especiais...');
    
    const diretoriosEspeciais = [
      '.cache',
      '.temp',
      '.tmp',
      'temp',
      'tmp',
      'cache',
      'archives',
      'backup',
      'backups',
      'data',
      'storage',
      'uploads',
      'downloads',
      'results',
      'outputs',
      'logs'
    ];

    for (const dir of diretoriosEspeciais) {
      const caminhoCompleto = path.join(this.baseDir, dir);
      try {
        const stats = await fs.stat(caminhoCompleto);
        if (stats.isDirectory()) {
          this.diretoriosVerificados.push(caminhoCompleto);
          await this.verificarDiretorioRecursivo(caminhoCompleto);
        }
      } catch (error) {
        // Diretório não existe, continuar
      }
    }
  }

  private async verificarDiretorioRecursivo(dirPath: string): Promise<void> {
    try {
      const itens = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const item of itens) {
        const caminhoCompleto = path.join(dirPath, item.name);
        
        if (item.isDirectory()) {
          await this.verificarDiretorioRecursivo(caminhoCompleto);
        } else if (item.isFile()) {
          await this.analisarArquivo(caminhoCompleto, 'diretorio-oculto');
        }
      }
    } catch (error) {
      console.log(`⚠️ Erro ao verificar diretório ${dirPath}:`, error);
    }
  }

  private async analisarBackups(): Promise<void> {
    console.log('💾 Analisando arquivos de backup...');
    
    const padroesBkp = [
      '**/*.bak',
      '**/*.backup',
      '**/*backup*',
      '**/*.old',
      '**/*.orig'
    ];

    for (const padrao of padroesBkp) {
      try {
        const arquivos = await glob(padrao, {
          cwd: this.baseDir,
          ignore: ['node_modules/**'],
          dot: true,
          absolute: true
        });

        for (const arquivo of arquivos) {
          await this.analisarArquivo(arquivo, 'backup', true);
        }
      } catch (error) {
        console.log(`⚠️ Erro ao buscar backups ${padrao}:`, error);
      }
    }
  }

  private async buscarStringsRelacionadas(): Promise<void> {
    console.log('🔤 Buscando strings relacionadas a testes...');
    
    const arquivosTexto = await glob('**/*.{js,ts,json,txt,log,md}', {
      cwd: this.baseDir,
      ignore: ['node_modules/**', '.git/**'],
      absolute: true
    });

    const stringsRelevantes = [
      'TestResult',
      'TestSession',
      'AIAnalysis',
      'Answer',
      'resultado',
      'resposta',
      'sessao',
      'analise',
      'test_result',
      'test_session',
      'ai_analysis'
    ];

    for (const arquivo of arquivosTexto.slice(0, 100)) { // Limitar para evitar sobrecarga
      try {
        const conteudo = await fs.readFile(arquivo, 'utf-8');
        
        for (const string of stringsRelevantes) {
          if (conteudo.toLowerCase().includes(string.toLowerCase())) {
            await this.analisarArquivo(arquivo, 'contem-string-teste', false, `Contém: ${string}`);
            break;
          }
        }
      } catch (error) {
        // Arquivo binário ou erro de leitura, pular
      }
    }
  }

  private async verificarArquivosCompactados(): Promise<void> {
    console.log('📦 Verificando arquivos compactados...');
    
    const padroes = [
      '**/*.zip',
      '**/*.tar',
      '**/*.gz',
      '**/*.rar',
      '**/*.7z'
    ];

    for (const padrao of padroes) {
      try {
        const arquivos = await glob(padrao, {
          cwd: this.baseDir,
          ignore: ['node_modules/**'],
          absolute: true
        });

        for (const arquivo of arquivos) {
          await this.analisarArquivo(arquivo, 'arquivo-compactado');
        }
      } catch (error) {
        console.log(`⚠️ Erro ao buscar arquivos compactados ${padrao}:`, error);
      }
    }
  }

  private async analisarLogs(): Promise<void> {
    console.log('📋 Analisando logs...');
    
    const padroes = [
      '**/*.log',
      '**/logs/**/*',
      '**/*log*'
    ];

    for (const padrao of padroes) {
      try {
        const arquivos = await glob(padrao, {
          cwd: this.baseDir,
          ignore: ['node_modules/**'],
          absolute: true
        });

        for (const arquivo of arquivos) {
          await this.analisarArquivo(arquivo, 'log', true);
        }
      } catch (error) {
        console.log(`⚠️ Erro ao buscar logs ${padrao}:`, error);
      }
    }
  }

  private async verificarTodasPastas(): Promise<void> {
    console.log('📂 Verificando todas as pastas profundamente...');
    
    try {
      const todasPastas = await glob('**/', {
        cwd: this.baseDir,
        ignore: ['node_modules/**', '.git/**'],
        absolute: true
      });

      for (const pasta of todasPastas) {
        if (!this.diretoriosVerificados.includes(pasta)) {
          this.diretoriosVerificados.push(pasta);
          await this.verificarDiretorioRecursivo(pasta);
        }
      }
    } catch (error) {
      console.log('⚠️ Erro ao verificar todas as pastas:', error);
    }
  }

  private async analisarArquivo(
    caminho: string, 
    tipo: string, 
    lerConteudo: boolean = false,
    observacao?: string
  ): Promise<void> {
    try {
      const stats = await fs.stat(caminho);
      
      let conteudo: string | undefined;
      if (lerConteudo && stats.size < 1024 * 1024) { // Máximo 1MB
        try {
          conteudo = await fs.readFile(caminho, 'utf-8');
        } catch {
          conteudo = '[Arquivo binário ou erro de leitura]';
        }
      }

      const resultado: ResultadoVerificacao = {
        tipo,
        caminho: path.relative(this.baseDir, caminho),
        tamanho: stats.size,
        modificado: stats.mtime,
        conteudo: observacao || (conteudo ? conteudo.substring(0, 500) : undefined)
      };

      this.resultados.push(resultado);
    } catch (error) {
      console.log(`⚠️ Erro ao analisar arquivo ${caminho}:`, error);
    }
  }

  private gerarRelatorio(): RelatorioDetalhado {
    const arquivosPorTipo: Record<string, number> = {};
    const tiposEncontrados = new Set<string>();

    for (const resultado of this.resultados) {
      arquivosPorTipo[resultado.tipo] = (arquivosPorTipo[resultado.tipo] || 0) + 1;
      tiposEncontrados.add(resultado.tipo);
    }

    return {
      timestamp: new Date(),
      totalArquivos: this.resultados.length,
      arquivosPorTipo,
      resultadosEncontrados: this.resultados,
      diretoriosVerificados: this.diretoriosVerificados,
      padroesTestados: this.padroesTestados,
      resumo: {
        temResultadosTeste: this.resultados.length > 0,
        totalResultados: this.resultados.length,
        tiposEncontrados: Array.from(tiposEncontrados)
      }
    };
  }
}

async function main() {
  try {
    const verificador = new VerificadorResultados();
    const relatorio = await verificador.verificarTudo();
    
    console.log('\n📊 RELATÓRIO DETALHADO DE VERIFICAÇÃO DE RESULTADOS DE TESTE');
    console.log('=' .repeat(70));
    console.log(`🕐 Timestamp: ${relatorio.timestamp.toLocaleString('pt-BR')}`);
    console.log(`📁 Total de arquivos encontrados: ${relatorio.totalArquivos}`);
    console.log(`📂 Diretórios verificados: ${relatorio.diretoriosVerificados.length}`);
    console.log(`🔍 Padrões testados: ${relatorio.padroesTestados.length}`);
    
    console.log('\n📈 ARQUIVOS POR TIPO:');
    for (const [tipo, quantidade] of Object.entries(relatorio.arquivosPorTipo)) {
      console.log(`  ${tipo}: ${quantidade}`);
    }
    
    console.log('\n🎯 RESUMO:');
    console.log(`  Tem resultados de teste: ${relatorio.resumo.temResultadosTeste ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`  Total de resultados: ${relatorio.resumo.totalResultados}`);
    console.log(`  Tipos encontrados: ${relatorio.resumo.tiposEncontrados.join(', ')}`);
    
    if (relatorio.resultadosEncontrados.length > 0) {
      console.log('\n📋 DETALHES DOS ARQUIVOS ENCONTRADOS:');
      console.log('-'.repeat(70));
      
      for (const resultado of relatorio.resultadosEncontrados) {
        console.log(`\n📄 ${resultado.caminho}`);
        console.log(`   Tipo: ${resultado.tipo}`);
        console.log(`   Tamanho: ${resultado.tamanho} bytes`);
        console.log(`   Modificado: ${resultado.modificado.toLocaleString('pt-BR')}`);
        if (resultado.conteudo) {
          console.log(`   Conteúdo/Observação: ${resultado.conteudo}`);
        }
      }
    }
    
    // Salvar relatório detalhado
    const nomeArquivo = `verificacao-detalhada-resultados-${Date.now()}.json`;
    await fs.writeFile(nomeArquivo, JSON.stringify(relatorio, null, 2));
    console.log(`\n💾 Relatório detalhado salvo em: ${nomeArquivo}`);
    
    console.log('\n🏁 Verificação detalhada concluída!');
    
  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export type { RelatorioDetalhado, ResultadoVerificacao };
export { VerificadorResultados };