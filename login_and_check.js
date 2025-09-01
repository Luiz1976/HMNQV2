const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function loginAndCheck() {
  try {
    console.log('🔐 Fazendo login como colaborador@demo.com...');
    
    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    });
    
    if (!user) {
      console.log('❌ Usuário não encontrado!');
      return;
    }
    
    console.log(`✅ Usuário encontrado: ${user.firstName} ${user.lastName}`);
    
    // Atualizar o último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });
    
    console.log('✅ Login atualizado!');
    
    // Verificar resultados BOLIE
    const bolieTest = await prisma.test.findFirst({
      where: {
        name: {
          contains: 'BOLIE'
        }
      }
    });
    
    if (bolieTest) {
      const bolieResults = await prisma.testResult.findMany({
        where: {
          userId: user.id,
          testId: bolieTest.id
        },
        orderBy: {
          completedAt: 'desc'
        }
      });
      
      console.log(`\n📊 Resultados BOLIE para ${user.email}: ${bolieResults.length}`);
      
      if (bolieResults.length > 0) {
        const latest = bolieResults[0];
        console.log('\n🎯 Resultado mais recente:');
        console.log(`   Data: ${latest.completedAt}`);
        console.log(`   Pontuação: ${latest.overallScore}`);
        console.log(`   Dimensões: ${JSON.stringify(latest.dimensionScores, null, 2)}`);
      }
    }
    
    // Verificar todos os resultados do usuário
    const allResults = await prisma.testResult.findMany({
      where: { userId: user.id },
      include: {
        test: {
          select: {
            name: true,
            testType: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    });
    
    console.log(`\n📈 Total de resultados: ${allResults.length}`);
    allResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result.test.name} - Pontuação: ${result.overallScore} (${result.completedAt})`);
    });
    
    // Simular uma chamada à API de resultados
    console.log('\n🔍 Simulando chamada à API de resultados...');
    
    // Buscar resultados como a API faria
    const apiResults = await prisma.testResult.findMany({
      where: {
        userId: user.id
      },
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
    
    console.log(`\n🔄 API retornaria ${apiResults.length} resultados:`);
    apiResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result.test.name}`);
      console.log(`   ID: ${result.id}`);
      console.log(`   Pontuação: ${result.overallScore}`);
      console.log(`   Data: ${result.completedAt}`);
      console.log(`   Test ID: ${result.testId}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

loginAndCheck();