const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...');
    
    // Buscar o usuário demo
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
    
    // Buscar todos os resultados do usuário
    const allResults = await db.testResult.findMany({
      where: { userId: user.id },
      include: {
        test: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    });
    
    console.log(`\n📊 Total de resultados encontrados: ${allResults.length}`);
    
    if (allResults.length > 0) {
      console.log('\n📝 Lista de resultados:');
      allResults.forEach((result, index) => {
        console.log(`${index + 1}. ${result.test.name}`);
        console.log(`   - ID: ${result.id}`);
        console.log(`   - Score: ${result.overallScore}`);
        console.log(`   - Data: ${result.completedAt}`);
        console.log(`   - Tipo: ${result.test.testType}`);
        console.log(`   - Categoria: ${result.test.category?.name || 'N/A'}`);
        console.log('');
      });
      
      // Verificar especificamente o HumaniQ BOLIE
      const bolieResults = allResults.filter(r => 
        r.test.name.toLowerCase().includes('bolie') ||
        r.test.name.toLowerCase().includes('inteligência emocional')
      );
      
      console.log(`\n🎯 Resultados HumaniQ BOLIE encontrados: ${bolieResults.length}`);
      if (bolieResults.length > 0) {
        bolieResults.forEach(result => {
          console.log(`- ${result.test.name} (${result.completedAt})`);
        });
      }
    } else {
      console.log('⚠️ Nenhum resultado encontrado para este usuário');
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar banco de dados:', error);
  } finally {
    await db.$disconnect();
  }
}

testDatabase();