const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function detailedGraphologyCheck() {
  try {
    console.log('🔍 Análise detalhada dos resultados grafológicos...');
    
    // Buscar todos os resultados de teste grafológico
    const graphologyResults = await prisma.testResult.findMany({
      where: {
        test: {
          name: {
            contains: 'Grafológica'
          }
        }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        test: {
          select: {
            name: true,
            id: true
          }
        },
        aiAnalyses: true,
        session: {
          select: {
            status: true,
            startedAt: true,
            completedAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`\n📊 Total de resultados grafológicos encontrados: ${graphologyResults.length}`);
    
    if (graphologyResults.length === 0) {
      console.log('❌ Nenhum resultado grafológico encontrado.');
      
      // Verificar se há testes grafológicos cadastrados
      const graphologyTests = await prisma.test.findMany({
        where: {
          OR: [
            { name: { contains: 'Grafológica' } },
            { name: { contains: 'grafológica' } },
            { name: { contains: 'Grafologia' } },
            { name: { contains: 'grafologia' } }
          ]
        }
      });
      
      console.log(`\n🔍 Testes grafológicos cadastrados: ${graphologyTests.length}`);
      graphologyTests.forEach((test, index) => {
        console.log(`${index + 1}. ${test.name} (ID: ${test.id})`);
      });
      
      return;
    }
    
    // Analisar cada resultado
    graphologyResults.forEach((result, index) => {
      console.log(`\n=== RESULTADO ${index + 1} ===`);
      console.log(`👤 Usuário: ${result.user.firstName} ${result.user.lastName} (${result.user.email})`);
      console.log(`📝 Teste: ${result.test.name}`);
      console.log(`🎯 Pontuação Geral: ${result.overallScore || 'N/A'}`);
      console.log(`📅 Data: ${result.completedAt.toLocaleString('pt-BR')}`);
      console.log(`⏱️ Duração: ${result.duration} segundos`);
      
      // Status da sessão
      if (result.session) {
        console.log(`📊 Status da Sessão: ${result.session.status}`);
        if (result.session.startedAt) {
          console.log(`🚀 Iniciado em: ${result.session.startedAt.toLocaleString('pt-BR')}`);
        }
        if (result.session.completedAt) {
          console.log(`✅ Completado em: ${result.session.completedAt.toLocaleString('pt-BR')}`);
        }
      }
      
      // Pontuações por dimensão
      if (result.dimensionScores) {
        console.log('📈 Pontuações por Dimensão:');
        const scores = typeof result.dimensionScores === 'string' 
          ? JSON.parse(result.dimensionScores) 
          : result.dimensionScores;
        
        Object.entries(scores).forEach(([dimension, score]) => {
          console.log(`   • ${dimension}: ${score}`);
        });
      }
      
      // Análises de IA
      console.log(`🤖 Análises de IA: ${result.aiAnalyses.length}`);
      result.aiAnalyses.forEach((analysis, aiIndex) => {
        console.log(`   ${aiIndex + 1}. Tipo: ${analysis.analysisType}`);
        console.log(`      Confiança: ${analysis.confidence}%`);
        console.log(`      Data: ${analysis.createdAt.toLocaleString('pt-BR')}`);
        
        // Tentar fazer parse da análise JSON
        try {
          const analysisData = JSON.parse(analysis.analysis);
          
          if (analysisData.behavioralSummary) {
            console.log(`      📝 Resumo: ${analysisData.behavioralSummary.substring(0, 100)}...`);
          }
          
          if (analysisData.workplaceTrends) {
            console.log('      💼 Tendências no Trabalho:');
            Object.entries(analysisData.workplaceTrends).forEach(([key, value]) => {
              if (value && typeof value === 'object' && value.score) {
                console.log(`         • ${key}: ${value.score}/100`);
              }
            });
          }
          
          if (analysisData.visualHighlights && Array.isArray(analysisData.visualHighlights)) {
            console.log(`      🎯 Destaques Visuais: ${analysisData.visualHighlights.length}`);
          }
          
          if (analysisData.practicalSuggestions && Array.isArray(analysisData.practicalSuggestions)) {
            console.log(`      💡 Sugestões Práticas: ${analysisData.practicalSuggestions.length}`);
          }
          
        } catch (parseError) {
          console.log('      ⚠️ Erro ao fazer parse da análise JSON');
        }
      });
      
      // Metadados
      if (result.metadata) {
        console.log('📋 Metadados:');
        const metadata = typeof result.metadata === 'string' 
          ? JSON.parse(result.metadata) 
          : result.metadata;
        
        Object.entries(metadata).forEach(([key, value]) => {
          console.log(`   • ${key}: ${value}`);
        });
      }
    });
    
    // Estatísticas gerais
    console.log('\n📊 ESTATÍSTICAS GERAIS:');
    const avgScore = graphologyResults.reduce((sum, r) => sum + (r.overallScore || 0), 0) / graphologyResults.length;
    console.log(`📈 Pontuação média: ${avgScore.toFixed(1)}`);
    
    const totalAnalyses = graphologyResults.reduce((sum, r) => sum + r.aiAnalyses.length, 0);
    console.log(`🤖 Total de análises de IA: ${totalAnalyses}`);
    
    const avgConfidence = graphologyResults.reduce((sum, r) => {
      const analyses = r.aiAnalyses;
      if (analyses.length === 0) return sum;
      const avgConf = analyses.reduce((s, a) => s + a.confidence, 0) / analyses.length;
      return sum + avgConf;
    }, 0) / graphologyResults.length;
    console.log(`🎯 Confiança média das análises: ${avgConfidence.toFixed(1)}%`);
    
  } catch (error) {
    console.error('❌ Erro na análise:', error);
  } finally {
    await prisma.$disconnect();
  }
}

detailedGraphologyCheck();