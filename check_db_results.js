const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function checkDatabaseResults() {
  try {
    console.log('🔍 Verificando resultados no banco de dados...');
    
    // 1. Buscar usuário colaborador@demo.com
    const user = await db.user.findUnique({
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
    
    // 2. Buscar todos os resultados deste usuário
    const allResults = await db.testResult.findMany({
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
      orderBy: {
        completedAt: 'desc'
      }
    });
    
    console.log(`\n📊 Total de resultados encontrados: ${allResults.length}`);
    
    if (allResults.length > 0) {
      console.log('\n📝 Detalhes dos resultados:');
      allResults.forEach((result, index) => {
        console.log(`\n${index + 1}. ${result.test.name}`);
        console.log(`   ID: ${result.id}`);
        console.log(`   Test ID: ${result.testId}`);
        console.log(`   Score: ${result.overallScore}`);
        console.log(`   Completed: ${result.completedAt}`);
        console.log(`   Test Type: ${result.test.testType}`);
      });
      
      // 3. Buscar especificamente resultados do HumaniQ BOLIE
      const bolieResults = allResults.filter(r => 
        r.test.name.toLowerCase().includes('bolie') || 
        r.test.name.toLowerCase().includes('inteligência emocional')
      );
      
      console.log(`\n🎯 Resultados do HumaniQ BOLIE encontrados: ${bolieResults.length}`);
      if (bolieResults.length > 0) {
        bolieResults.forEach((result, index) => {
          console.log(`\n   BOLIE ${index + 1}:`);
          console.log(`   Nome: ${result.test.name}`);
          console.log(`   ID: ${result.id}`);
          console.log(`   Score: ${result.overallScore}`);
          console.log(`   Data: ${result.completedAt}`);
        });
      }
    } else {
      console.log('❌ Nenhum resultado encontrado para este usuário');
    }
    
    // 4. Verificar se há testes disponíveis
    const availableTests = await db.test.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        testType: true
      }
    });
    
    console.log(`\n🧪 Total de testes disponíveis: ${availableTests.length}`);
    const bolieTest = availableTests.find(t => 
      t.name.toLowerCase().includes('bolie') || 
      t.name.toLowerCase().includes('inteligência emocional')
    );
    
    if (bolieTest) {
      console.log('✅ Teste HumaniQ BOLIE encontrado:', {
        id: bolieTest.id,
        name: bolieTest.name,
        testType: bolieTest.testType
      });
    } else {
      console.log('❌ Teste HumaniQ BOLIE não encontrado nos testes disponíveis');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar banco de dados:', error);
  } finally {
    await db.$disconnect();
  }
}

checkDatabaseResults();