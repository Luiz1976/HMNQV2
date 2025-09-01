const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTodayBolie() {
  try {
    console.log('🔍 Verificando resultados BOLIE de hoje...');
    
    // Data de hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    console.log('📅 Data de hoje:', today.toLocaleDateString('pt-BR'));
    
    const results = await prisma.testResult.findMany({
      where: {
        test: {
          name: {
            contains: 'BOLIE'
          }
        },
        completedAt: {
          gte: today
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
      }
    });
    
    console.log(`\n📊 Resultados BOLIE de hoje: ${results.length}`);
    
    if (results.length > 0) {
      console.log('\n🎯 RESULTADOS DE HOJE:');
      console.log('='.repeat(40));
      
      results.forEach((result, index) => {
        console.log(`${index + 1}. ID: ${result.id}`);
        console.log(`   Usuário: ${result.user.email}`);
        console.log(`   Score: ${result.overallScore || 'N/A'}`);
        console.log(`   Data: ${new Date(result.completedAt).toLocaleString('pt-BR')}`);
        console.log('   ---');
      });
    } else {
      console.log('❌ Nenhum resultado BOLIE encontrado para hoje.');
      console.log('\n🔍 Verificando últimos resultados...');
      
      const lastResults = await prisma.testResult.findMany({
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
        take: 3
      });
      
      console.log(`\n📊 Últimos ${lastResults.length} resultados BOLIE:`);
      lastResults.forEach((result, index) => {
        console.log(`${index + 1}. ID: ${result.id}`);
        console.log(`   Usuário: ${result.user.email}`);
        console.log(`   Score: ${result.overallScore || 'N/A'}`);
        console.log(`   Data: ${new Date(result.completedAt).toLocaleString('pt-BR')}`);
        console.log('   ---');
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTodayBolie();