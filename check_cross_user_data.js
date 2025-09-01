const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCrossUserData() {
  try {
    console.log('=== Verificando vazamentos de dados entre usuários ===\n');
    
    // IDs dos usuários MGRP mencionados no código
    const mgrpUserIds = ['cmehdprly00048wc0dtrod76s', 'cmehdx7fo00018wwsscwgb815'];
    const demoUserEmail = 'colaborador@demo.com';
    
    // Buscar o usuário demo
    const demoUser = await prisma.user.findUnique({
      where: { email: demoUserEmail },
      select: { id: true, email: true }
    });
    
    if (!demoUser) {
      console.log('❌ Usuário colaborador@demo.com não encontrado!');
      return;
    }
    
    console.log('✅ Usuário demo encontrado:', demoUser);
    console.log();
    
    // Verificar se os usuários MGRP existem
    console.log('🔍 Verificando usuários MGRP...');
    for (const mgrpId of mgrpUserIds) {
      const mgrpUser = await prisma.user.findUnique({
        where: { id: mgrpId },
        select: { id: true, email: true, firstName: true, lastName: true }
      });
      
      if (mgrpUser) {
        console.log(`✅ Usuário MGRP encontrado: ${mgrpUser.email} (${mgrpUser.firstName} ${mgrpUser.lastName})`);
        
        // Verificar resultados deste usuário MGRP
        const mgrpResults = await prisma.testResult.findMany({
          where: { userId: mgrpId },
          include: {
            test: {
              include: { category: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
        
        console.log(`   📊 Resultados de testes: ${mgrpResults.length}`);
        mgrpResults.forEach((result, index) => {
          console.log(`   ${index + 1}. ${result.test.name} (${result.test.testType}) - ${result.createdAt}`);
        });
      } else {
        console.log(`❌ Usuário MGRP não encontrado: ${mgrpId}`);
      }
    }
    
    console.log();
    
    // Verificar se há resultados com userId diferente do esperado
    console.log('🔍 Verificando possíveis vazamentos de dados...');
    
    // Buscar todos os resultados de testes PSYCHOSOCIAL
    const psychosocialResults = await prisma.testResult.findMany({
      where: {
        test: {
          testType: 'PSYCHOSOCIAL'
        }
      },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true }
        },
        test: {
          select: { name: true, testType: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`📊 Total de resultados PSYCHOSOCIAL: ${psychosocialResults.length}`);
    
    // Agrupar por usuário
    const resultsByUser = {};
    psychosocialResults.forEach(result => {
      const userId = result.userId;
      if (!resultsByUser[userId]) {
        resultsByUser[userId] = {
          user: result.user,
          results: []
        };
      }
      resultsByUser[userId].results.push(result);
    });
    
    console.log('\n📋 Distribuição de resultados PSYCHOSOCIAL por usuário:');
    Object.entries(resultsByUser).forEach(([userId, data]) => {
      console.log(`\n👤 ${data.user.email} (${data.user.firstName} ${data.user.lastName})`);
      console.log(`   ID: ${userId}`);
      console.log(`   Resultados: ${data.results.length}`);
      data.results.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.test.name} - ${result.createdAt}`);
      });
    });
    
    // Verificar se há sessões de teste órfãs ou com associações incorretas
    console.log('\n🔍 Verificando sessões de teste...');
    const sessions = await prisma.testSession.findMany({
      where: {
        test: {
          testType: 'PSYCHOSOCIAL'
        }
      },
      include: {
        user: {
          select: { id: true, email: true }
        },
        test: {
          select: { name: true, testType: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`📊 Total de sessões PSYCHOSOCIAL: ${sessions.length}`);
    
    const sessionsByUser = {};
    sessions.forEach(session => {
      const userId = session.userId;
      if (!sessionsByUser[userId]) {
        sessionsByUser[userId] = {
          user: session.user,
          sessions: []
        };
      }
      sessionsByUser[userId].sessions.push(session);
    });
    
    console.log('\n📋 Distribuição de sessões PSYCHOSOCIAL por usuário:');
    Object.entries(sessionsByUser).forEach(([userId, data]) => {
      console.log(`\n👤 ${data.user.email}`);
      console.log(`   ID: ${userId}`);
      console.log(`   Sessões: ${data.sessions.length}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao consultar dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCrossUserData();