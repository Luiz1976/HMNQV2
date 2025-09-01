const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBolieResults() {
  try {
    console.log('🔍 Verificando resultados do BOLIE no banco de dados...');
    
    // Primeiro, encontrar o usuário colaborador@demo.com
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    });
    
    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado');
      return;
    }
    
    console.log('✅ Usuário encontrado:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
    
    // Verificar todos os resultados deste usuário
    const allResults = await prisma.testResult.findMany({
      where: { userId: user.id },
      include: {
        test: {
          select: {
            id: true,
            name: true,
            testType: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    });
    
    console.log(`\n📊 Total de resultados para o usuário: ${allResults.length}`);
    
    if (allResults.length > 0) {
      console.log('\n📝 Todos os resultados:');
      allResults.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.test.name}`);
        console.log(`     ID do resultado: ${result.id}`);
        console.log(`     ID do teste: ${result.test.id}`);
        console.log(`     Tipo do teste: ${result.test.testType}`);
        console.log(`     Data de conclusão: ${result.completedAt}`);
        console.log(`     Pontuação geral: ${result.overallScore}`);
        console.log('');
      });
      
      // Filtrar especificamente resultados do BOLIE
      const bolieResults = allResults.filter(r => 
        r.test.id === 'cmehdpsox000o8wc0yuai0swa' ||
        r.test.name.toLowerCase().includes('bolie') ||
        r.test.name.toLowerCase().includes('inteligência emocional')
      );
      
      console.log(`🎯 Resultados do BOLIE encontrados: ${bolieResults.length}`);
      
      if (bolieResults.length > 0) {
        console.log('\n🎯 Detalhes dos resultados BOLIE:');
        bolieResults.forEach((result, index) => {
          console.log(`  ${index + 1}. ${result.test.name}`);
          console.log(`     ID do resultado: ${result.id}`);
          console.log(`     ID do teste: ${result.test.id}`);
          console.log(`     Data de conclusão: ${result.completedAt}`);
          console.log(`     Pontuação geral: ${result.overallScore}`);
          console.log(`     Duração: ${result.duration}`);
          console.log(`     Pontuações por dimensão:`, result.dimensionScores);
          console.log('');
        });
      }
    } else {
      console.log('⚠️ Nenhum resultado encontrado para este usuário');
    }
    
    // Verificar se o teste BOLIE existe
    const bolieTest = await prisma.test.findUnique({
      where: { id: 'cmehdpsox000o8wc0yuai0swa' }
    });
    
    if (bolieTest) {
      console.log('\n✅ Teste BOLIE encontrado no banco:');
      console.log('  - ID:', bolieTest.id);
      console.log('  - Nome:', bolieTest.name);
      console.log('  - Tipo:', bolieTest.testType);
      console.log('  - Ativo:', bolieTest.isActive);
    } else {
      console.log('\n❌ Teste BOLIE não encontrado no banco');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar resultados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkB