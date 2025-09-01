// Script para mostrar datas e horários dos testes realizados no banco SQLite (Local 1)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TestWithDates {
  id: string;
  testName: string;
  userName: string;
  userEmail: string;
  startedAt: Date | null;
  completedAt: Date | null;
  duration: string;
  testType: string;
  status: string;
}

function formatDate(date: Date | null): string {
  if (!date) return 'N/A';
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function calculateDuration(startedAt: Date | null, completedAt: Date | null): string {
  if (!startedAt || !completedAt) return 'N/A';
  
  const diffMs = completedAt.getTime() - startedAt.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  if (diffMinutes > 0) {
    return `${diffMinutes}min ${diffSeconds}s`;
  }
  return `${diffSeconds}s`;
}

async function showTestDates() {
  try {
    console.log('🔍 Buscando testes realizados no banco SQLite...');
    console.log('=' .repeat(80));

    // Buscar todos os TestResult com informações relacionadas
    const testResults = await prisma.testResult.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        test: {
          select: {
            name: true,
            testType: true
          }
        },
        session: {
          select: {
            startedAt: true,
            completedAt: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Mais recente primeiro
      }
    });

    if (testResults.length === 0) {
      console.log('❌ Nenhum teste encontrado no banco de dados.');
      return;
    }

    console.log(`📊 Total de testes encontrados: ${testResults.length}`);
    console.log('\n');

    // Processar e exibir os dados
    const testsWithDates: TestWithDates[] = testResults.map(result => ({
      id: result.id,
      testName: result.test?.name || 'Nome não disponível',
      userName: result.user ? `${result.user.firstName} ${result.user.lastName || ''}`.trim() : 'Usuário não disponível',
      userEmail: result.user?.email || 'Email não disponível',
      startedAt: result.session?.startedAt || result.createdAt,
      completedAt: result.session?.completedAt || result.completedAt,
      duration: calculateDuration(
        result.session?.startedAt || result.createdAt,
        result.session?.completedAt || result.completedAt
      ),
      testType: result.test?.testType || 'Tipo não disponível',
      status: result.session?.status || 'COMPLETED'
    }));

    // Exibir cabeçalho da tabela
    console.log('📋 RELATÓRIO DE TESTES REALIZADOS');
    console.log('=' .repeat(120));
    console.log(
      'ID'.padEnd(8) + ' | ' +
      'TESTE'.padEnd(25) + ' | ' +
      'USUÁRIO'.padEnd(20) + ' | ' +
      'INÍCIO'.padEnd(20) + ' | ' +
      'CONCLUSÃO'.padEnd(20) + ' | ' +
      'DURAÇÃO'.padEnd(10) + ' | ' +
      'TIPO'.padEnd(15)
    );
    console.log('-'.repeat(120));

    // Exibir cada teste
    testsWithDates.forEach((test, index) => {
      const shortId = test.id.substring(0, 8);
      const shortTestName = test.testName.length > 25 ? test.testName.substring(0, 22) + '...' : test.testName;
      const shortUserName = test.userName.length > 20 ? test.userName.substring(0, 17) + '...' : test.userName;
      const shortType = test.testType.length > 15 ? test.testType.substring(0, 12) + '...' : test.testType;
      
      console.log(
        shortId.padEnd(8) + ' | ' +
        shortTestName.padEnd(25) + ' | ' +
        shortUserName.padEnd(20) + ' | ' +
        formatDate(test.startedAt).padEnd(20) + ' | ' +
        formatDate(test.completedAt).padEnd(20) + ' | ' +
        test.duration.padEnd(10) + ' | ' +
        shortType.padEnd(15)
      );
    });

    console.log('-'.repeat(120));

    // Estatísticas resumidas
    const completedTests = testsWithDates.filter(t => t.completedAt && t.startedAt);
    const testsByType = testsWithDates.reduce((acc, test) => {
      acc[test.testType] = (acc[test.testType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n📈 ESTATÍSTICAS RESUMIDAS:');
    console.log(`• Total de testes: ${testResults.length}`);
    console.log(`• Testes concluídos: ${completedTests.length}`);
    console.log(`• Testes por tipo:`);
    Object.entries(testsByType).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });

    if (completedTests.length > 0) {
      const avgDuration = completedTests.reduce((sum, test) => {
        if (test.startedAt && test.completedAt) {
          return sum + (test.completedAt.getTime() - test.startedAt.getTime());
        }
        return sum;
      }, 0) / completedTests.length;
      
      const avgMinutes = Math.floor(avgDuration / (1000 * 60));
      const avgSeconds = Math.floor((avgDuration % (1000 * 60)) / 1000);
      console.log(`• Duração média: ${avgMinutes}min ${avgSeconds}s`);
    }

    // Testes mais recentes (últimos 7 dias)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentTests = testsWithDates.filter(t => 
      t.startedAt && t.startedAt > sevenDaysAgo
    );
    console.log(`• Testes dos últimos 7 dias: ${recentTests.length}`);

    console.log('\n✅ Relatório gerado com sucesso!');
    console.log(`📅 Data do relatório: ${formatDate(new Date())}`);

  } catch (error) {
    console.error('❌ Erro ao buscar dados do banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script
if (require.main === module) {
  showTestDates();
}

export { showTestDates };