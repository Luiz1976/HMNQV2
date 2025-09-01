const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkLatestBolie() {
  try {
    console.log('🔍 Verificando resultados do teste BOLIE...');
    
    const results = await prisma.testResult.findMany({
      where: {
        test: {
          name: {
            contains: 'BOLIE'
          }
        }
      },
      include: {
        test: true,
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 10
    });
    
    console.log(`\n📊 Total de resultados BOLIE encontrados: ${results.length}`);
    
    if (results.length > 0) {
      console.log('\n🎯 RESULTADOS MAIS RECENTES:');
      console.log('='.repeat(50));
      
      results.forEach((result, index) => {
        console.log(`${index + 1}. ID: ${result.id}`);
        console.log(`   Usuário: ${result.user.email}`);
        console.log(`   Teste: ${result.test.name}`);
        console.log(`   Score: ${result.overallScore || 'N/A'}`);
        console.log(`   Data: ${result.completedAt ? new Date(result.completedAt).toLocaleString('pt-BR') : 'N/A'}`);
        console.log('   ---');
      });
      
      // Verificar o mais recente
      const latest = results[0];
      console.log('\n✅ RESULTADO MAIS RECENTE:');
      console.log(`   ID: ${latest.id}`);
      console.log(`   Usuário: ${latest.user.email}`);
      console.log(`   Score: ${latest.overallScore || 'N/A'}`);
      console.log(`   Data: ${latest.completedAt ? new Date(latest.completedAt).toLocaleString('pt-BR') : 'N/A'}`);
      
    } else {
      console.log('❌ Nenhum resultado do teste BOLIE encontrado!');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLatestBolie();