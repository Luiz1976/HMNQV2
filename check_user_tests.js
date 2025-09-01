const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserTests() {
  try {
    console.log('=== Verificando testes do usuário colaborador@demo.com ===\n');
    
    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' },
      select: { id: true, email: true, firstName: true, lastName: true }
    });
    
    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado!');
      return;
    }
    
    console.log('✅ Usuário encontrado:', user);
    console.log();
    
    // Buscar todos os resultados de testes do usuário
    const testResults = await prisma.testResult.findMany({
      where: { userId: user.id },
      include: {
        test: {
          include: {
            category: true
          }
        },
        session: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`📊 Total de resultados de testes: ${testResults.length}\n`);
    
    if (testResults.length === 0) {
      console.log('⚠️ Nenhum resultado de teste encontrado para este usuário.');
    } else {
      testResults.forEach((result, index) => {
        console.log(`${index + 1}. ${result.test.name}`);
        console.log(`   - ID: ${result.id}`);
        console.log(`   - Tipo: ${result.test.testType}`);
        console.log(`   - Categoria: ${result.test.category.name}`);
        console.log(`   - Completado em: ${result.completedAt}`);
        console.log(`   - Criado em: ${result.createdAt}`);
        console.log(`   - Score geral: ${result.overallScore || 'N/A'}`);
        console.log();
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao consultar dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserTests();