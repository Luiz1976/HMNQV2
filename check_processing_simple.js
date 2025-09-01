const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProcessing() {
  try {
    console.log('🔍 Verificando processamento em segundo plano...');
    
    // Buscar resultados BOLIE de 31/08/2025
    const today = new Date('2025-08-31');
    const tomorrow = new Date('2025-09-01');
    
    const todayResults = await prisma.testResult.findMany({
      where: {
        test: {
          name: {
            contains: 'BOLIE'
          }
        },
        completedAt: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        test: true,
        user: {
          select: {
            email: true
          }
        }
      }
    });
    
    console.log(`\n📊 Resultados BOLIE de 31/08/2025: ${todayResults.length}`);
    
    if (todayResults.length > 0) {
      todayResults.forEach((result, index) => {
        console.log(`\n${index + 1}. ID: ${result.id}`);
        console.log(`   Usuário: ${result.user.email}`);
        console.log(`   Data: ${result.completedAt}`);
        console.log(`   Score: ${result.overallScore}`);
        console.log(`   Dimensões: ${result.dimensionScores ? Object.keys(result.dimensionScores).length + ' dimensões' : 'Não processadas'}`);
        console.log(`   Status: ${result.overallScore ? 'Processado' : 'Pendente'}`);
      });
    }
    
    // Verificar se há resultados sem score (ainda processando)
    const pendingResults = await prisma.testResult.findMany({
      where: {
        test: {
          name: {
            contains: 'BOLIE'
          }
        },
        OR: [
          { overallScore: null },
          { dimensionScores: null }
        ]
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
    
    console.log(`\n🔄 Resultados BOLIE pendentes de processamento: ${pendingResults.length}`);
    
    if (pendingResults.length > 0) {
      console.log('\n⏳ RESULTADOS EM PROCESSAMENTO:');
      pendingResults.forEach((result, index) => {
        console.log(`${index + 1}. ID: ${result.id}`);
        console.log(`   Usuário: ${result.user.email}`);
        console.log(`   Data: ${result.completedAt}`);
        console.log(`   Score: ${result.overallScore || 'Pendente'}`);
        console.log('');
      });
    } else {
      console.log('✅ Não há resultados pendentes de processamento.');
    }
    
    // Verificar último resultado processado
    const lastProcessed = await prisma.testResult.findFirst({
      where: {
        test: {
          name: {
            contains: 'BOLIE'
          }
        },
        overallScore: {
          not: null
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
    
    if (lastProcessed) {
      console.log('\n🏆 ÚLTIMO RESULTADO PROCESSADO:');
      console.log(`   ID: ${lastProcessed.id}`);
      console.log(`   Usuário: ${lastProcessed.user.email}`);
      console.log(`   Data: ${lastProcessed.completedAt}`);
      console.log(`   Score: ${lastProcessed.overallScore}`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkProcessing();