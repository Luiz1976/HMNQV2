const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getPerfilTestIds() {
  try {
    const tests = await prisma.test.findMany({
      where: {
        category: {
          name: 'Perfil'
        },
        isActive: true,
        isPublic: true
      },
      select: {
        id: true,
        name: true
      }
    });
    
    console.log('Testes de Perfil:');
    tests.forEach(test => {
      console.log(`'${test.id}', // ${test.name}`);
    });
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getPerfilTestIds();