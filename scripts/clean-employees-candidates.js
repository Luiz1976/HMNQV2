const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanEmployeesAndCandidates() {
  try {
    console.log('🧹 Iniciando limpeza de colaboradores e candidatos...');
    
    // 1. Buscar usuários do tipo EMPLOYEE e CANDIDATE
    const employeesAndCandidates = await prisma.user.findMany({
      where: {
        userType: {
          in: ['EMPLOYEE', 'CANDIDATE']
        }
      },
      select: {
        id: true,
        email: true,
        userType: true
      }
    });
    
    console.log(`📊 Encontrados ${employeesAndCandidates.length} usuários para remover:`);
    employeesAndCandidates.forEach(user => {
      console.log(`  - ${user.email} (${user.userType})`);
    });
    
    if (employeesAndCandidates.length === 0) {
      console.log('✅ Nenhum colaborador ou candidato encontrado para remover.');
      return;
    }
    
    const userIds = employeesAndCandidates.map(user => user.id);
    
    // 2. Remover dados relacionados em ordem de dependência
    console.log('\n🗑️ Removendo dados relacionados...');
    
    // Remover respostas de testes
    const deletedAnswers = await prisma.testAnswer.deleteMany({
      where: {
        session: {
          userId: {
            in: userIds
          }
        }
      }
    });
    console.log(`  ✓ ${deletedAnswers.count} respostas de testes removidas`);
    
    // Remover resultados de testes
    const deletedResults = await prisma.testResult.deleteMany({
      where: {
        userId: {
          in: userIds
        }
      }
    });
    console.log(`  ✓ ${deletedResults.count} resultados de testes removidos`);
    
    // Remover sessões de testes
    const deletedSessions = await prisma.testSession.deleteMany({
      where: {
        userId: {
          in: userIds
        }
      }
    });
    console.log(`  ✓ ${deletedSessions.count} sessões de testes removidas`);
    
    // Remover notificações
    const deletedNotifications = await prisma.notification.deleteMany({
      where: {
        userId: {
          in: userIds
        }
      }
    });
    console.log(`  ✓ ${deletedNotifications.count} notificações removidas`);
    
    // Remover convites
    const deletedInvitations = await prisma.invitation.deleteMany({
      where: {
        email: {
          in: employeesAndCandidates.map(user => user.email)
        }
      }
    });
    console.log(`  ✓ ${deletedInvitations.count} convites removidos`);
    
    // Remover contas de autenticação
    const deletedAccounts = await prisma.account.deleteMany({
      where: {
        userId: {
          in: userIds
        }
      }
    });
    console.log(`  ✓ ${deletedAccounts.count} contas de autenticação removidas`);
    
    // Remover sessões de autenticação
    const deletedAuthSessions = await prisma.session.deleteMany({
      where: {
        userId: {
          in: userIds
        }
      }
    });
    console.log(`  ✓ ${deletedAuthSessions.count} sessões de autenticação removidas`);
    
    // 3. Finalmente, remover os usuários
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds
        }
      }
    });
    console.log(`  ✓ ${deletedUsers.count} usuários removidos`);
    
    console.log('\n✅ Limpeza concluída com sucesso!');
    
    // 4. Verificar contadores finais
    console.log('\n📊 Contadores atuais:');
    
    const totalUsers = await prisma.user.count();
    const adminUsers = await prisma.user.count({
      where: { userType: 'ADMIN' }
    });
    const companyOwners = await prisma.user.count({
      where: { userType: 'COMPANY_OWNER' }
    });
    const employees = await prisma.user.count({
      where: { userType: 'EMPLOYEE' }
    });
    const candidates = await prisma.user.count({
      where: { userType: 'CANDIDATE' }
    });
    
    console.log(`  - Total de usuários: ${totalUsers}`);
    console.log(`  - Administradores: ${adminUsers}`);
    console.log(`  - Proprietários de empresa: ${companyOwners}`);
    console.log(`  - Colaboradores: ${employees}`);
    console.log(`  - Candidatos: ${candidates}`);
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  cleanEmployeesAndCandidates()
    .then(() => {
      console.log('\n🎉 Script executado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Falha na execução do script:', error);
      process.exit(1);
    });
}

module.exports = { cleanEmployeesAndCandidates };