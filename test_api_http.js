const { PrismaClient } = require('@prisma/client');
const { getServerSession } = require('next-auth/next');

const db = new PrismaClient();

// Simular uma sessão de usuário
const mockSession = {
  user: {
    id: null, // Será preenchido dinamicamente
    email: 'colaborador@demo.com'
  }
};

async function testAPILogic() {
  try {
    console.log('=== TESTE DA LÓGICA DA API /test-results ===\n');
    
    // 1. Buscar usuário para obter ID
    const user = await db.user.findUnique({
      where: { email: 'colaborador@demo.com' },
      select: { id: true, firstName: true, lastName: true, email: true }
    });
    
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    mockSession.user.id = user.id;
    console.log('✅ Usuário encontrado:', user);
    
    // 2. Simular a lógica da API GET /test-results
    const where = {
      userId: mockSession.user.id
    };
    
    const orderBy = {
      completedAt: 'desc'
    };
    
    console.log('\n🔍 Executando consulta da API...');
    console.log('Where:', JSON.stringify(where, null, 2));
    console.log('OrderBy:', JSON.stringify(orderBy, null, 2));
    
    // 3. Executar a mesma consulta que a API faz
    const [results, totalCount] = await Promise.all([
      db.testResult.findMany({
        where,
        include: {
          test: {
            select: {
              id: true,
              name: true,
              description: true,
              testType: true,
              estimatedDuration: true,
              category: {
                select: {
                  name: true,
                  color: true
                }
              }
            }
          },
          session: {
            select: {
              id: true,
              startedAt: true,
              completedAt: true,
              currentQuestion: true,
              totalQuestions: true,
              metadata: true
            }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy,
        skip: 0,
        take: 10
      }),
      db.testResult.count({ where })
    ]);
    
    console.log(`\n📊 Resultados da API: ${results.length} de ${totalCount} total`);
    
    // 4. Verificar resultados BOLIE especificamente
    const bolieResults = results.filter(r => r.test.name.includes('BOLIE'));
    console.log(`\n🎯 Resultados BOLIE encontrados: ${bolieResults.length}`);
    
    bolieResults.forEach((result, index) => {
      console.log(`\n${index + 1}. RESULTADO BOLIE:`);
      console.log(`   ID: ${result.id}`);
      console.log(`   Nome do Teste: ${result.test.name}`);
      console.log(`   Score: ${result.overallScore}`);
      console.log(`   Data: ${result.completedAt}`);
      console.log(`   Categoria: ${result.test.category?.name || 'N/A'}`);
      console.log(`   Tipo: ${result.test.testType}`);
      
      if (result.dimensionScores) {
        console.log('   Dimensões:');
        Object.entries(result.dimensionScores).forEach(([dim, score]) => {
          console.log(`     ${dim}: ${score}`);
        });
      }
    });
    
    // 5. Calcular estatísticas como a API faz
    const stats = await db.testResult.aggregate({
      where,
      _avg: {
        overallScore: true,
        duration: true
      },
      _max: {
        overallScore: true,
        duration: true
      },
      _min: {
        overallScore: true,
        duration: true
      }
    });
    
    console.log('\n📈 ESTATÍSTICAS:');
    console.log(`   Score Médio: ${stats._avg.overallScore}`);
    console.log(`   Duração Média: ${stats._avg.duration}s`);
    console.log(`   Score Máximo: ${stats._max.overallScore}`);
    console.log(`   Score Mínimo: ${stats._min.overallScore}`);
    
    // 6. Simular resposta da API
    const apiResponse = {
      success: true,
      data: results,
      pagination: {
        page: 1,
        limit: 10,
        totalCount,
        totalPages: Math.ceil(totalCount / 10),
        hasNext: false,
        hasPrev: false
      },
      statistics: {
        averageScore: stats._avg.overallScore,
        averageDuration: stats._avg.duration,
        maxScore: stats._max.overallScore,
        minScore: stats._min.overallScore,
        maxDuration: stats._max.duration,
        minDuration: stats._min.duration
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('\n✅ RESPOSTA DA API SIMULADA:');
    console.log(`   Success: ${apiResponse.success}`);
    console.log(`   Total de resultados: ${apiResponse.data.length}`);
    console.log(`   Resultados BOLIE: ${apiResponse.data.filter(r => r.test.name.includes('BOLIE')).length}`);
    
    // 7. Verificar se há problemas específicos
    const problemsFound = [];
    
    if (bolieResults.length === 0) {
      problemsFound.push('Nenhum resultado BOLIE encontrado');
    }
    
    bolieResults.forEach(result => {
      if (!result.overallScore || result.overallScore <= 0) {
        problemsFound.push(`Resultado ${result.id} tem score inválido: ${result.overallScore}`);
      }
      
      if (!result.dimensionScores || Object.keys(result.dimensionScores).length === 0) {
        problemsFound.push(`Resultado ${result.id} não tem dimensões preenchidas`);
      }
    });
    
    if (problemsFound.length > 0) {
      console.log('\n❌ PROBLEMAS ENCONTRADOS:');
      problemsFound.forEach(problem => console.log(`   - ${problem}`));
    } else {
      console.log('\n✅ Nenhum problema encontrado nos dados!');
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar lógica da API:', error);
  } finally {
    await db.$disconnect();
  }
}

testAPILogic();