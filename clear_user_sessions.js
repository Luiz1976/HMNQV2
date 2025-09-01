const { PrismaClient } = require('@prisma/client');

async function clearUserSessions() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Buscando sessões do usuário colaborador@humaniq.com...');
    
    // Primeiro, encontrar o usuário
    const user = await prisma.user.findUnique({
      where: {
        email: 'colaborador@humaniq.com'
      },
      include: {
        sessions: true,
        accounts: true
      }
    });
    
    if (!user) {
      console.log('❌ Usuário colaborador@humaniq.com não encontrado');
      return;
    }
    
    console.log(`✅ Usuário encontrado: ${user.email}`);
    console.log(`📊 Sessões ativas: ${user.sessions.length}`);
    console.log(`📊 Contas vinculadas: ${user.accounts.length}`);
    
    // Remover todas as sessões do usuário
    if (user.sessions.length > 0) {
      console.log('\n🗑️ Removendo sessões ativas...');
      const deletedSessions = await prisma.session.deleteMany({
        where: {
          userId: user.id
        }
      });
      console.log(`✅ ${deletedSessions.count} sessões removidas`);
    }
    
    // Remover todas as contas OAuth vinculadas (se houver)
    if (user.accounts.length > 0) {
      console.log('\n🗑️ Removendo contas OAuth vinculadas...');
      const deletedAccounts = await prisma.account.deleteMany({
        where: {
          userId: user.id
        }
      });
      console.log(`✅ ${deletedAccounts.count} contas OAuth removidas`);
    }
    
    // Verificar se há outros usuários com email similar
    console.log('\n🔍 Verificando usuários com emails similares...');
    const similarUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: 'colaborador' } },
          { email: { contains: 'humaniq' } },
          { email: { contains: 'demo' } }
        ]
      },
      select: {
        id: true,
        email: true,
        _count: {
          select: {
            sessions: true,
            accounts: true
          }
        }
      }
    });
    
    console.log('\n📋 Usuários encontrados:');
    similarUsers.forEach(u => {
      console.log(`- ${u.email}: ${u._count.sessions} sessões, ${u._count.accounts} contas`);
    });
    
    console.log('\n✅ Limpeza de sessões concluída!');
    
  } catch (error) {
    console.error('❌ Erro ao limpar sessões:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearUserSessions();