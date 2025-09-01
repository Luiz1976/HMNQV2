const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function removeDemoColaborador() {
  try {
    console.log('🔍 Procurando usuário colaborador@demo.com...');
    
    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: {
        email: 'colaborador@demo.com'
      },
      include: {
        testResults: true,
        invitations: true,
        testSessions: true,
        answers: true
      }
    });

    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado.');
      return;
    }

    console.log(`✅ Usuário encontrado: ${user.firstName} ${user.lastName} (${user.email})`);
    console.log(`📊 Resultados de teste: ${user.testResults.length}`);
    console.log(`📧 Convites: ${user.invitations.length}`);
    console.log(`🎯 Sessões de teste: ${user.testSessions.length}`);
    console.log(`📝 Respostas: ${user.answers.length}`);

    // Remover resultados de teste
    if (user.testResults.length > 0) {
      console.log('🗑️ Removendo resultados de teste...');
      await prisma.testResult.deleteMany({
        where: {
          userId: user.id
        }
      });
      console.log('✅ Resultados de teste removidos.');
    }

    // Remover convites
    if (user.invitations.length > 0) {
      console.log('🗑️ Removendo convites...');
      await prisma.invitation.deleteMany({
        where: {
          userId: user.id
        }
      });
      console.log('✅ Convites removidos.');
    }

    // Remover sessões de teste
    if (user.testSessions.length > 0) {
      console.log('🗑️ Removendo sessões de teste...');
      await prisma.testSession.deleteMany({
        where: {
          userId: user.id
        }
      });
      console.log('✅ Sessões de teste removidas.');
    }

    // Remover respostas
    if (user.answers.length > 0) {
      console.log('🗑️ Removendo respostas...');
      await prisma.answer.deleteMany({
        where: {
          userId: user.id
        }
      });
      console.log('✅ Respostas removidas.');
    }

    // Remover o usuário
    console.log('🗑️ Removendo usuário...');
    await prisma.user.delete({
      where: {
        id: user.id
      }
    });

    console.log('✅ Usuário colaborador@demo.com removido com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao remover usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeDemoColaborador();