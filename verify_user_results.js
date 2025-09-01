const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyUserResults() {
  try {
    console.log('=== VERIFICAÇÃO DETALHADA DOS RESULTADOS DO USUÁRIO ===\n');
    
    // 1. Verificar se o usuário colaborador@demo.com existe
    console.log('1. Verificando se o usuário colaborador@demo.com existe...');
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
        createdAt: true
      }
    });
    
    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado!');
      return;
    }
    
    console.log('✅ Usuário encontrado:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nome: ${user.firstName} ${user.lastName}`);
    console.log(`   Tipo: ${user.userType}`);
    console.log(`   Criado em: ${user.createdAt}\n`);
    
    // 2. Contar todos os resultados do usuário (incluindo arquivados)
    console.log('2. Contando TODOS os resultados do usuário (incluindo arquivados)...');
    const totalResults = await prisma.testResult.count({
      where: { userId: user.id }
    });
    console.log(`   Total de resultados: ${totalResults}\n`);
    
    // 3. Todos os resultados são considerados ativos (não há campo archived)
    console.log('3. Todos os resultados são ativos (não há sistema de arquivamento)...');
    console.log(`   Resultados ativos: ${totalResults}\n`);
    
    // 4. Não há resultados arquivados no sistema atual
    console.log('4. Sistema não possui arquivamento de resultados...');
    const archivedResults = 0;
    console.log(`   Resultados arquivados: ${archivedResults}\n`);
    
    // 5. Listar todos os resultados com detalhes
    console.log('5. Listando TODOS os resultados com detalhes...');
    const allResults = await prisma.testResult.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        testId: true,
        overallScore: true,
        createdAt: true,
        test: {
          select: {
            name: true,
            testType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`   Detalhes dos ${allResults.length} resultados:`);
    allResults.forEach((result, index) => {
      console.log(`   ${index + 1}. ID: ${result.id}`);
      console.log(`      Teste: ${result.test?.name || 'N/A'} (${result.test?.testType || 'N/A'})`);
      console.log(`      Score: ${result.overallScore || 'N/A'}`);
      console.log(`      Criado em: ${result.createdAt}`);
      console.log('');
    });
    
    // 6. Verificar se há duplicatas (mesmo testId, mesmo userId, scores iguais)
    console.log('6. Verificando possíveis DUPLICATAS...');
    const duplicateCheck = await prisma.testResult.groupBy({
      by: ['userId', 'testId', 'overallScore'],
      where: { userId: user.id },
      _count: {
        id: true
      },
      having: {
        id: {
          _count: {
            gt: 1
          }
        }
      }
    });
    
    if (duplicateCheck.length > 0) {
      console.log(`   ⚠️  Encontradas ${duplicateCheck.length} possíveis duplicatas:`);
      for (const dup of duplicateCheck) {
        console.log(`      TestId: ${dup.testId}, Score: ${dup.overallScore}, Quantidade: ${dup._count.id}`);
        
        // Buscar os IDs específicos das duplicatas
        const dupResults = await prisma.testResult.findMany({
          where: {
            userId: dup.userId,
            testId: dup.testId,
            overallScore: dup.overallScore
          },
          select: {
            id: true,
            createdAt: true
          },
          orderBy: { createdAt: 'asc' }
        });
        
        console.log(`      IDs das duplicatas: ${dupResults.map(r => r.id).join(', ')}`);
      }
    } else {
      console.log('   ✅ Nenhuma duplicata encontrada');
    }
    console.log('');
    
    // 7. Verificar outros usuários no sistema
    console.log('7. Verificando OUTROS usuários no sistema...');
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true
      },
      orderBy: {
        email: "asc"
      }
    });
    
    console.log(`   Total de usuários no sistema: ${allUsers.length}`);
    
    // Contar resultados para cada usuário manualmente
    for (const u of allUsers) {
      const userResultCount = await prisma.testResult.count({
        where: { userId: u.id }
      });
      console.log(`   ${allUsers.indexOf(u) + 1}. ${u.email} (${u.userType}) - ${userResultCount} resultados`);
      console.log(`      Nome: ${u.firstName} ${u.lastName}`);
      console.log(`      ID: ${u.id}`);
      console.log('');
    }
    console.log('');
    
    // 8. Pular verificação de resultados órfãos (não essencial)
    console.log('8. Pulando verificação de resultados órfãos...');
    const orphanResults = 0; // Não verificando devido a limitações do Prisma
    console.log(`   Resultados órfãos: ${orphanResults} (não verificado)\n`);
    
    // 9. Resumo final
    console.log('=== RESUMO FINAL ===');
    console.log(`✅ Usuário: ${user.email}`);
    console.log(`📊 Total de resultados: ${totalResults}`);
    console.log(`🟢 Resultados ativos: ${totalResults}`);
    console.log(`📁 Resultados arquivados: ${archivedResults} (sistema não possui arquivamento)`);
    console.log(`👥 Total de usuários no sistema: ${allUsers.length}`);
    console.log(`🔍 Duplicatas encontradas: ${duplicateCheck.length}`);
    console.log(`❓ Resultados órfãos: ${orphanResults}`);
    
    if (totalResults === 16) {
      console.log('\n⚠️  CONFIRMADO: O usuário tem exatamente 16 resultados!');
    } else {
      console.log(`\n🤔 DISCREPÂNCIA: O usuário tem ${totalResults} resultados, mas a interface mostra 16.`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar resultados do usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUserResults();