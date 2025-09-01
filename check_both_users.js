const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBothUsers() {
  try {
    console.log('🔍 Verificando usuários...');
    
    const demoUser = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' },
      select: { id: true, email: true, firstName: true, lastName: true, isActive: true }
    });
    
    const humaniqUser = await prisma.user.findUnique({
      where: { email: 'colaborador@humaniq.com' },
      select: { id: true, email: true, firstName: true, lastName: true, isActive: true }
    });
    
    console.log('\n📊 RESULTADOS:');
    console.log('colaborador@demo.com:', demoUser ? 'EXISTS' : 'NOT FOUND');
    if (demoUser) {
      console.log('  ID:', demoUser.id);
      console.log('  Nome:', demoUser.firstName, demoUser.lastName);
      console.log('  Ativo:', demoUser.isActive);
    }
    
    console.log('\ncolaborador@humaniq.com:', humaniqUser ? 'EXISTS' : 'NOT FOUND');
    if (humaniqUser) {
      console.log('  ID:', humaniqUser.id);
      console.log('  Nome:', humaniqUser.firstName, humaniqUser.lastName);
      console.log('  Ativo:', humaniqUser.isActive);
    }
    
    console.log('\n🎯 CONCLUSÃO:');
    if (demoUser && humaniqUser) {
      console.log('Ambos os usuários existem no sistema');
    } else if (demoUser) {
      console.log('Apenas colaborador@demo.com existe');
    } else if (humaniqUser) {
      console.log('Apenas colaborador@humaniq.com existe');
    } else {
      console.log('Nenhum dos usuários existe');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBothUsers();