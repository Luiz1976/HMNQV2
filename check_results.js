const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkResults() {
  try {
    console.log('Verificando resultados no banco...');
    
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    });
    
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    console.log('✅ Usuário encontrado:', user.email);
    
    const results = await prisma.testResult.findMany({
      where: { userId: user.id },
      include: {
        test: {
          select: {
            name: true,
            testType: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    });
    
    console.log(`📊 Total de resultados: ${results.length}`);
    
    if (results.length > 0) {
      console.log('\n📋 Resultados encontrados:');
      results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.test.name}`);
        console.log(`   - ID: ${result.id}`);
        console.log(`   - Tipo: ${result.test.testType}`);
        console.log(`   - Completado em: ${result.completedAt}`);
        console.log(`   - Score: ${result.overallScore}`);
        console.log('');
      });
    } else {
      console.log('❌ Nenhum resultado encontrado para este usuário');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkResults();