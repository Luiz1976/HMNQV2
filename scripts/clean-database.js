const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('🧹 Iniciando limpeza do banco de dados...');
  console.log('⚠️  ATENÇÃO: Esta operação irá remover TODOS os dados exceto o usuário admin@humaniq.ai');
  
  try {
    // 1. Deletar dados relacionados a testes (em ordem para respeitar foreign keys)
    console.log('\n📊 Removendo dados de testes...');
    
    await prisma.aIAnalysis.deleteMany({});
    console.log('✅ AIAnalysis removidas');
    
    await prisma.answer.deleteMany({});
    console.log('✅ Answers removidas');
    
    await prisma.testResult.deleteMany({});
    console.log('✅ TestResults removidos');
    
    await prisma.testSession.deleteMany({});
    console.log('✅ TestSessions removidas');
    
    // 2. Deletar dados de ERP
    console.log('\n🔗 Removendo dados de ERP...');
    
    await prisma.eRPEmployee.deleteMany({});
    console.log('✅ ERPEmployees removidos');
    
    await prisma.eRPSyncLog.deleteMany({});
    console.log('✅ ERPSyncLogs removidos');
    
    await prisma.eRPConfig.deleteMany({});
    console.log('✅ ERPConfigs removidos');
    
    // 3. Deletar notificações
    console.log('\n🔔 Removendo notificações...');
    
    await prisma.userNotification.deleteMany({});
    console.log('✅ UserNotifications removidas');
    
    await prisma.companyNotification.deleteMany({});
    console.log('✅ CompanyNotifications removidas');
    
    // 4. Deletar convites
    console.log('\n📧 Removendo convites...');
    
    await prisma.invitation.deleteMany({});
    console.log('✅ Invitations removidos');
    
    // 5. Deletar sessões e contas do NextAuth (exceto do admin)
    console.log('\n🔐 Removendo sessões e contas...');
    
    // Primeiro, obter o ID do usuário admin
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@humaniq.ai' }
    });
    
    if (!adminUser) {
      console.log('❌ Usuário admin@humaniq.ai não encontrado!');
      return;
    }
    
    console.log(`👤 Admin encontrado: ${adminUser.id}`);
    
    // Deletar sessões de outros usuários
    await prisma.session.deleteMany({
      where: {
        userId: {
          not: adminUser.id
        }
      }
    });
    console.log('✅ Sessions de outros usuários removidas');
    
    // Deletar contas de outros usuários
    await prisma.account.deleteMany({
      where: {
        userId: {
          not: adminUser.id
        }
      }
    });
    console.log('✅ Accounts de outros usuários removidas');
    
    // 6. Deletar permissões de outros usuários
    await prisma.userPermission.deleteMany({
      where: {
        userId: {
          not: adminUser.id
        }
      }
    });
    console.log('✅ UserPermissions de outros usuários removidas');
    
    // 7. Deletar empresas (isso também remove usuários associados via cascade)
    console.log('\n🏢 Removendo empresas...');
    
    await prisma.company.deleteMany({});
    console.log('✅ Companies removidas');
    
    // 8. Deletar outros usuários (exceto admin)
    console.log('\n👥 Removendo outros usuários...');
    
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        email: {
          not: 'admin@humaniq.ai'
        }
      }
    });
    console.log(`✅ ${deletedUsers.count} usuários removidos (exceto admin)`);
    
    // 9. Deletar tokens de verificação
    await prisma.verificationToken.deleteMany({});
    console.log('✅ VerificationTokens removidos');
    
    // 10. Verificar se o admin ainda existe
    const adminCheck = await prisma.user.findUnique({
      where: { email: 'admin@humaniq.ai' }
    });
    
    if (adminCheck) {
      console.log('\n✅ Usuário admin@humaniq.ai preservado com sucesso!');
      console.log(`   ID: ${adminCheck.id}`);
      console.log(`   Nome: ${adminCheck.firstName} ${adminCheck.lastName}`);
      console.log(`   Tipo: ${adminCheck.userType}`);
    } else {
      console.log('\n❌ ERRO: Usuário admin@humaniq.ai foi removido acidentalmente!');
    }
    
    // 11. Mostrar estatísticas finais
    console.log('\n📊 Estatísticas finais:');
    const userCount = await prisma.user.count();
    const companyCount = await prisma.company.count();
    const testResultCount = await prisma.testResult.count();
    const testSessionCount = await prisma.testSession.count();
    
    console.log(`   Usuários restantes: ${userCount}`);
    console.log(`   Empresas restantes: ${companyCount}`);
    console.log(`   Resultados de testes: ${testResultCount}`);
    console.log(`   Sessões de testes: ${testSessionCount}`);
    
    console.log('\n🎉 Limpeza do banco de dados concluída com sucesso!');
    console.log('\n📋 Dados preservados:');
    console.log('   ✅ Usuário admin@humaniq.ai');
    console.log('   ✅ Estruturas de tabelas');
    console.log('   ✅ Categorias de testes (TestCategory)');
    console.log('   ✅ Testes públicos (Test)');
    console.log('   ✅ Questões dos testes (Question)');
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  cleanDatabase()
    .then(() => {
      console.log('\n✅ Script executado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erro na execução do script:', error);
      process.exit(1);
    });
}

module.exports = { cleanDatabase };