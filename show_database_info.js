const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function showDatabaseInfo() {
  try {
    console.log('\n=== INFORMAÇÕES DO BANCO DE DADOS ===\n');
    
    // Mostrar a URL de conexão (mascarada por segurança)
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      const maskedUrl = dbUrl.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@');
      console.log('🔗 URL de Conexão:', maskedUrl);
    } else {
      console.log('❌ DATABASE_URL não encontrada no arquivo .env');
      return;
    }
    
    // Testar conexão
    console.log('\n🔍 Testando conexão com o banco...');
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Contar registros na tabela test_results
    const testResultsCount = await prisma.testResult.count();
    console.log(`\n📊 Total de resultados de testes: ${testResultsCount}`);
    
    // Mostrar informações sobre os últimos 5 resultados
    if (testResultsCount > 0) {
      console.log('\n📋 Últimos 5 resultados de testes:');
      const recentResults = await prisma.testResult.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true
            }
          },
          test: {
            select: {
              name: true,
              testType: true
            }
          }
        }
      });
      
      recentResults.forEach((result, index) => {
        console.log(`\n${index + 1}. ID: ${result.id}`);
        console.log(`   Usuário: ${result.user.firstName} ${result.user.lastName} (${result.user.email})`);
        console.log(`   Teste: ${result.test.name} (${result.test.testType})`);
        console.log(`   Pontuação: ${result.overallScore || 'N/A'}`);
        console.log(`   Completado em: ${result.completedAt.toLocaleString('pt-BR')}`);
      });
    }
    
    // Informações sobre outras tabelas relacionadas
    const sessionsCount = await prisma.testSession.count();
    const answersCount = await prisma.answer.count();
    const usersCount = await prisma.user.count();
    
    console.log('\n📈 Estatísticas do banco:');
    console.log(`   - Usuários: ${usersCount}`);
    console.log(`   - Sessões de teste: ${sessionsCount}`);
    console.log(`   - Respostas: ${answersCount}`);
    console.log(`   - Resultados de testes: ${testResultsCount}`);
    
    console.log('\n🗄️  Tabelas principais onde os dados estão armazenados:');
    console.log('   - test_results: Resultados finais dos testes');
    console.log('   - test_sessions: Sessões de teste dos usuários');
    console.log('   - answers: Respostas individuais às perguntas');
    console.log('   - users: Informações dos usuários');
    console.log('   - tests: Definições dos testes disponíveis');
    
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

showDatabaseInfo();