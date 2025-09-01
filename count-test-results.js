const { PrismaClient } = require('@prisma/client');

async function countResults() {
  const prisma = new PrismaClient();
  
  try {
    // Contar resultados de testes
    const testResultsCount = await prisma.testResult.count();
    console.log(`Total de resultados de testes: ${testResultsCount}`);
    
    // Contar usuários
    const usersCount = await prisma.user.count();
    console.log(`Total de usuários: ${usersCount}`);
    
    // Contar empresas
    const empresasCount = await prisma.empresa.count();
    console.log(`Total de empresas: ${empresasCount}`);
    
    // Contar colaboradores
    const colaboradoresCount = await prisma.colaborador.count();
    console.log(`Total de colaboradores: ${colaboradoresCount}`);
    
    // Mostrar algumas estatísticas adicionais
    console.log('\n--- Estatísticas detalhadas ---');
    
    // Resultados por tipo de teste
    const resultsByTest = await prisma.testResult.groupBy({
      by: ['testName'],
      _count: {
        id: true
      }
    });
    
    console.log('\nResultados por tipo de teste:');
    resultsByTest.forEach(result => {
      console.log(`${result.testName}: ${result._count.id} resultados`);
    });
    
  } catch (error) {
    console.error('Erro ao consultar o banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

countResults();