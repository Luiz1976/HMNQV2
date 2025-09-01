const { PrismaClient } = require('@prisma/client');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const prisma = new PrismaClient();

async function testResultadosRecentesAPI() {
  try {
    console.log('🔍 Testando API de Resultados Recentes...');
    console.log('============================================================');
    
    // 1. Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' },
      select: { id: true, firstName: true, lastName: true, email: true }
    });
    
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    console.log('✅ Usuário encontrado:', {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
    
    // 2. Verificar resultados no banco de dados
    const testResults = await prisma.testResult.findMany({
      where: {
        userId: user.id
      },
      include: {
        test: {
          select: {
            name: true,
            estimatedDuration: true,
            category: {
              select: {
                name: true
              }
            }
          }
        },
        aiAnalyses: {
          select: {
            analysis: true,
            confidence: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`📊 Encontrados ${testResults.length} resultados no banco`);
    
    if (testResults.length > 0) {
      const latestResult = testResults[0];
      console.log('\n🎯 RESULTADO MAIS RECENTE:');
      console.log('ID:', latestResult.id);
      console.log('Teste:', latestResult.test?.name);
      console.log('Categoria:', latestResult.test?.category?.name);
      console.log('Data:', latestResult.completedAt || latestResult.createdAt);
      console.log('Pontuação Geral:', latestResult.overallScore);
      console.log('Duração:', latestResult.duration);
      console.log('Tem dimensionScores:', latestResult.dimensionScores ? 'Sim' : 'Não');
      console.log('Tem interpretação:', latestResult.interpretation ? 'Sim' : 'Não');
      console.log('Tem recomendações:', latestResult.recommendations ? 'Sim' : 'Não');
      console.log('Análises de IA:', latestResult.aiAnalyses?.length || 0);
      
      if (latestResult.dimensionScores) {
        console.log('\n📈 PONTUAÇÕES POR DIMENSÃO:');
        try {
          const scores = typeof latestResult.dimensionScores === 'string' 
            ? JSON.parse(latestResult.dimensionScores)
            : latestResult.dimensionScores;
          console.log(JSON.stringify(scores, null, 2));
        } catch (e) {
          console.log('Erro ao parsear dimensionScores:', e.message);
        }
      }
    }
    
    // 3. Testar a API HTTP diretamente (sem autenticação)
    console.log('\n🌐 Testando API HTTP...');
    console.log('========================================');
    
    try {
      const apiUrl = 'http://localhost:3000/api/colaborador/resultados-recentes';
      console.log('📡 Fazendo requisição para:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('📡 Status da resposta:', response.status, response.statusText);
      console.log('📡 Headers da resposta:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          console.log('\n✅ RESPOSTA DA API:');
          console.log('Success:', data.success);
          console.log('Total de resultados:', data.results?.length || 0);
          console.log('Stats:', data.stats);
          
          if (data.results && data.results.length > 0) {
            console.log('\n🎯 PRIMEIRO RESULTADO DA API:');
            const firstResult = data.results[0];
            console.log('ID:', firstResult.id);
            console.log('Nome do Teste:', firstResult.testName);
            console.log('Categoria:', firstResult.category);
            console.log('Status:', firstResult.status);
            console.log('Pontuação:', firstResult.score);
            console.log('Data de Conclusão:', firstResult.completedAt);
            console.log('Duração:', firstResult.duration);
            console.log('Insights:', firstResult.insights);
            console.log('Arquivado:', firstResult.isArchived);
          }
        } catch (parseError) {
          console.log('❌ Erro ao parsear JSON da resposta:', parseError.message);
          console.log('📄 Resposta bruta (primeiros 500 chars):', responseText.substring(0, 500));
        }
      } else {
        console.log('❌ Erro na requisição HTTP');
        console.log('📄 Resposta (primeiros 500 chars):', responseText.substring(0, 500));
      }
    } catch (fetchError) {
      console.log('❌ Erro ao fazer requisição HTTP:', fetchError.message);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testResultadosRecentesAPI();