const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBolieTest() {
  try {
    console.log('🔍 Verificando teste BOLIE no banco de dados...');
    
    // Verificar se o teste existe com o ID usado no código
    const testWithCodeId = await prisma.test.findUnique({
      where: { id: 'cmehdpsox000o8wc0yuai0swa' }
    });
    
    console.log('\n📋 Teste com ID do código (cmehdpsox000o8wc0yuai0swa):');
    if (testWithCodeId) {
      console.log(`✅ Encontrado: ${testWithCodeId.name}`);
    } else {
      console.log('❌ NÃO ENCONTRADO');
    }
    
    // Buscar todos os testes BOLIE no banco
    const allBolieTests = await prisma.test.findMany({
      where: {
        name: {
          contains: 'BOLIE'
        }
      }
    });
    
    console.log('\n📊 Todos os testes BOLIE no banco:');
    if (allBolieTests.length > 0) {
      allBolieTests.forEach((test, index) => {
        console.log(`${index + 1}. ID: ${test.id}`);
        console.log(`   Nome: ${test.name}`);
        console.log(`   Categoria: ${test.category}`);
        console.log('---');
      });
    } else {
      console.log('❌ Nenhum teste BOLIE encontrado');
    }
    
    // Verificar resultados recentes do BOLIE
    const recentResults = await prisma.testResult.findMany({
      where: {
        test: {
          name: {
            contains: 'BOLIE'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      include: {
        test: true,
        user: true
      }
    });
    
    console.log('\n📈 Resultados recentes do BOLIE:');
    if (recentResults.length > 0) {
      recentResults.forEach((result, index) => {
        console.log(`${index + 1}. ID: ${result.id}`);
        console.log(`   Teste: ${result.test.name}`);
        console.log(`   Usuário: ${result.user.email}`);
        console.log(`   Pontuação: ${result.overallScore || 'N/A'}`);
        console.log(`   Data: ${result.createdAt.toLocaleString('pt-BR')}`);
        console.log('---');
      });
    } else {
      console.log('❌ Nenhum resultado BOLIE encontrado');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkBolieTest();