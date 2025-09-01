// Script para verificar resultados do usuário colaborador@demo.com no banco de dados
const { PrismaClient } = require('@prisma/client');

async function checkUserResults() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Verificando resultados do usuário colaborador@demo.com...');
    
    // Buscar o usuário colaborador@demo.com
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    });
    
    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado!');
      return;
    }
    
    console.log('✅ Usuário encontrado:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
    
    // Contar total de resultados para este usuário
    const totalResults = await prisma.testResult.count({
      where: { userId: user.id }
    });
    
    console.log(`📊 Total de resultados para ${user.email}: ${totalResults}`);
    
    // Buscar alguns resultados para análise
    const results = await prisma.testResult.findMany({
      where: { userId: user.id },
      include: {
        test: {
          select: {
            name: true,
            testType: true
          }
        }
      },
      orderBy: { completedAt: 'desc' },
      take: 5
    });
    
    console.log('\n📝 Últimos 5 resultados:');
    results.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.test.name} - Score: ${result.overallScore} - Data: ${result.completedAt}`);
    });
    
    // Verificar se existem resultados de outros usuários
    const allResults = await prisma.testResult.findMany({
      include: {
        user: {
          select: {
            email: true
          }
        },
        test: {
          select: {
            name: true
          }
        }
      },
      take: 20
    });
    
    console.log('\n👥 Verificando outros usuários no sistema:');
    const userEmails = [...new Set(allResults.map(r => r.user.email))];
    userEmails.forEach(email => {
      const count = allResults.filter(r => r.user.email === email).length;
      console.log(`  - ${email}: ${count} resultados (dos 20 primeiros)`);
    });
    
    // Contar total de resultados no sistema
    const totalSystemResults = await prisma.testResult.count();
    console.log(`\n📈 Total de resultados no sistema: ${totalSystemResults}`);
    
  } catch (error) {
    console.error('❌ Erro ao verificar resultados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar verificação
checkUserResults();