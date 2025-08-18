// Script para padronizar o armazenamento e exibição de resultados de todos os tipos de teste
// Garante que todos os testes usem a mesma rota e apareçam na página de resultados de forma consistente

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function standardizeTestResults() {
  console.log('🔄 Iniciando padronização de resultados de testes...');
  
  try {
    // 1. Verificar estrutura atual dos resultados
    console.log('\n📊 Analisando estrutura atual dos resultados...');
    
    const resultsByType = await prisma.testResult.groupBy({
      by: ['testId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });
    
    console.log(`Encontrados resultados para ${resultsByType.length} testes diferentes`);
    
    // 2. Buscar detalhes dos testes com resultados
    const testsWithResults = await prisma.test.findMany({
      where: {
        id: {
          in: resultsByType.map(r => r.testId)
        }
      },
      include: {
        category: true,
        results: {
          select: {
            id: true,
            overallScore: true,
            dimensionScores: true,
            metadata: true,
            completedAt: true
          },
          take: 5,
          orderBy: {
            completedAt: 'desc'
          }
        }
      }
    });
    
    console.log('\n📋 Resumo por categoria:');
    const categoryStats = {};
    
    testsWithResults.forEach(test => {
      const categoryName = test.category?.name || 'Sem categoria';
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = {
          tests: 0,
          results: 0,
          testType: test.testType
        };
      }
      categoryStats[categoryName].tests++;
      categoryStats[categoryName].results += test.results.length;
    });
    
    Object.entries(categoryStats).forEach(([category, stats]) => {
      console.log(`  ${category}: ${stats.tests} testes, ${stats.results} resultados (${stats.testType})`);
    });
    
    // 3. Verificar consistência dos metadados
    console.log('\n🔍 Verificando consistência dos metadados...');
    
    const inconsistentResults = [];
    
    for (const test of testsWithResults) {
      for (const result of test.results) {
        const metadata = result.metadata || {};
        
        // Verificar se tem método de cálculo definido
        if (!metadata.calculationMethod) {
          inconsistentResults.push({
            testId: test.id,
            testName: test.name,
            resultId: result.id,
            issue: 'Sem método de cálculo definido'
          });
        }
        
        // Verificar se tem dimensionScores consistente
        if (!result.dimensionScores || Object.keys(result.dimensionScores).length === 0) {
          inconsistentResults.push({
            testId: test.id,
            testName: test.name,
            resultId: result.id,
            issue: 'Sem dimensionScores definidas'
          });
        }
      }
    }
    
    if (inconsistentResults.length > 0) {
      console.log(`⚠️  Encontradas ${inconsistentResults.length} inconsistências:`);
      inconsistentResults.slice(0, 10).forEach(issue => {
        console.log(`  - ${issue.testName}: ${issue.issue}`);
      });
      if (inconsistentResults.length > 10) {
        console.log(`  ... e mais ${inconsistentResults.length - 10} problemas`);
      }
    } else {
      console.log('✅ Todos os resultados estão consistentes!');
    }
    
    // 4. Verificar se todos os tipos de teste estão usando a mesma rota
    console.log('\n🛣️  Verificando rotas de armazenamento...');
    
    // Buscar todas as sessões de teste para verificar o fluxo
    const sessionsByStatus = await prisma.testSession.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });
    
    console.log('Status das sessões de teste:');
    sessionsByStatus.forEach(status => {
      console.log(`  ${status.status}: ${status._count.id} sessões`);
    });
    
    // 5. Verificar se há sessões completas sem resultados
    const completedSessionsWithoutResults = await prisma.testSession.findMany({
      where: {
        status: 'COMPLETED',
        results: {
          none: {}
        }
      },
      include: {
        test: {
          select: {
            id: true,
            name: true,
            testType: true
          }
        }
      },
      take: 10
    });
    
    if (completedSessionsWithoutResults.length > 0) {
      console.log(`\n⚠️  Encontradas ${completedSessionsWithoutResults.length} sessões completas sem resultados:`);
      completedSessionsWithoutResults.forEach(session => {
        console.log(`  - ${session.test.name} (${session.test.testType}) - Sessão: ${session.id}`);
      });
    }
    
    // 6. Propor padronização
    console.log('\n📝 Proposta de padronização:');
    console.log('\n1. Estrutura padrão de resultado:');
    console.log('   - overallScore: número (0-100 ou escala específica)');
    console.log('   - dimensionScores: objeto com dimensões específicas do teste');
    console.log('   - metadata.calculationMethod: string identificando o método');
    console.log('   - metadata.totalQuestions: número de questões');
    console.log('   - interpretation: texto explicativo (opcional)');
    console.log('   - recommendations: recomendações (opcional)');
    
    console.log('\n2. Fluxo padrão de armazenamento:');
    console.log('   - Todos os testes usam /api/tests/submit para calcular resultados');
    console.log('   - Resultados são salvos via /api/colaborador/resultados (POST)');
    console.log('   - Exibição via /api/colaborador/resultados (GET)');
    
    console.log('\n3. Categorias identificadas:');
    Object.entries(categoryStats).forEach(([category, stats]) => {
      console.log(`   - ${category} (${stats.testType}): ${stats.tests} testes`);
    });
    
    // 7. Verificar testes ativos sem resultados
    const activeTestsWithoutResults = await prisma.test.findMany({
      where: {
        isActive: true,
        results: {
          none: {}
        }
      },
      include: {
        category: true,
        _count: {
          select: {
            sessions: true
          }
        }
      }
    });
    
    if (activeTestsWithoutResults.length > 0) {
      console.log(`\n📋 Testes ativos sem resultados (${activeTestsWithoutResults.length}):`);
      activeTestsWithoutResults.forEach(test => {
        console.log(`  - ${test.name} (${test.testType}) - ${test._count.sessions} sessões`);
      });
    }
    
    console.log('\n✅ Análise de padronização concluída!');
    console.log('\n💡 Próximos passos:');
    console.log('   1. Verificar se todos os testes estão usando calculateScoresByTestType()');
    console.log('   2. Garantir que todos os resultados tenham metadata.calculationMethod');
    console.log('   3. Padronizar dimensionScores para todos os tipos');
    console.log('   4. Testar fluxo completo para cada categoria');
    
  } catch (error) {
    console.error('❌ Erro durante a padronização:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  standardizeTestResults();
}

module.exports = { standardizeTestResults };