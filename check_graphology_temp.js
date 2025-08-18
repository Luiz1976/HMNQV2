const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const results = await prisma.testResult.findMany({
      where: { test: { testType: 'GRAPHOLOGY' } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { test: true, user: { select: { firstName: true, lastName: true } } }
    });
    console.log('🔍 Últimos 5 resultados grafológicos encontrados:', results.length);
    results.forEach(r => {
      console.log(`ID: ${r.id} | Usuário: ${r.user.firstName} ${r.user.lastName} | Teste: ${r.test.name} | Data: ${r.createdAt}`);
    });
    if (results.length === 0) {
      console.log('❌ Nenhum resultado grafológico encontrado no banco de dados.');
    }
  } catch (err) {
    console.error('Erro ao consultar resultados grafológicos:', err);
  } finally {
    await prisma.$disconnect();
  }
})();