const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function testDatabaseCount() {
  try {
    console.log('🔍 Verificando contagem no banco de dados...');
    console.log('=' .repeat(50));
    
    const userId = 'cmehdprxt00068wc0rz0enici'; // colaborador@demo.com
    
    // Contar resultados no banco
    const dbCount = await db.testResult.count({
      where: { userId }
    });
    
    console.log(`📊 Resultados no banco de dados: ${dbCount}`);
    
    // Buscar alguns resultados para verificar
    const results = await db.testResult.findMany({
      where: { userId },
      select: {
        id: true,
        testId: true,
        completedAt: true,
        overallScore: true
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 10
    });
    
    console.log('\n📋 Últimos resultados:');
    results.forEach((result, index) => {
      console.log(`${index + 1}. ID: ${result.id}, Score: ${result.overallScore}, Data: ${result.completedAt.toISOString().split('T')[0]}`);
    });
    
    console.log(`\n✅ Total de resultados únicos no banco: ${dbCount}`);
    console.log('   Este deve ser o número exibido no card "Testes Completados".');
    
  } catch (error) {
    console.error('❌ Erro ao verificar banco:', error.message);
  } finally {
    await db.$disconnect();
  }
}

testDatabaseCount();