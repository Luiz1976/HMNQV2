const { PrismaClient } = require('@prisma/client');

async function simpleCheck() {
  const prisma = new PrismaClient();
  
  try {
    // Verificar usuário
    const user = await prisma.user.findFirst({
      where: { email: 'colaborador@demo.com' }
    });
    
    console.log('Usuário:', user ? user.id : 'Não encontrado');
    
    if (user) {
      // Contar resultados
      const count = await prisma.testResult.count({
        where: { userId: user.id }
      });
      
      console.log('Total de resultados:', count);
      
      // Buscar resultados recentes
      const results = await prisma.testResult.findMany({
        where: { userId: user.id },
        include: { test: true },
        orderBy: { completedAt: 'desc' },
        take: 5
      });
      
      console.log('Resultados encontrados:', results.length);
      results.forEach(r => {
        console.log(`- ${r.test.name} (${r.completedAt})`);
      });
    }
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

simpleCheck();