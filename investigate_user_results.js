const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function investigateUserResults() {
  try {
    console.log('🔍 INVESTIGAÇÃO COMPLETA DOS RESULTADOS DO USUÁRIO');
    console.log('=' .repeat(60));
    
    // 1. Verificar o usuário colaborador@demo.com
    console.log('\n1️⃣ VERIFICANDO USUÁRIO COLABORADOR@DEMO.COM');
    const targetUser = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    });
    
    if (!targetUser) {
      console.log('❌ Usuário colaborador@demo.com não encontrado!');
      return;
    }
    
    console.log(`✅ Usuário encontrado:`);
    console.log(`   - ID: ${targetUser.id}`);
    console.log(`   - Email: ${targetUser.email}`);
    console.log(`   - Nome: ${targetUser.name || 'N/A'}`);
    console.log(`   - Tipo: ${targetUser.userType || 'N/A'}`);
    
    // 2. Verificar TODOS os usuários no sistema
    console.log('\n2️⃣ VERIFICANDO TODOS OS USUÁRIOS NO SISTEMA');
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
        _count: {
          select: {
            testResults: true
          }
        }
      }
    });
    
    console.log(`📊 Total de usuários no sistema: ${allUsers.length}`);
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (ID: ${user.id}) - ${user._count.testResults} resultados`);
    });
    
    // 3. Verificar resultados no banco de dados para colaborador@demo.com
    console.log('\n3️⃣ RESULTADOS NO BANCO DE DADOS PARA COLABORADOR@DEMO.COM');
    const dbResults = await prisma.testResult.findMany({
      where: { userId: targetUser.id },
      include: {
        test: {
          select: {
            name: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    });
    
    console.log(`📊 Total de resultados no banco: ${dbResults.length}`);
    if (dbResults.length > 0) {
      console.log('\n📋 DETALHES DOS RESULTADOS NO BANCO:');
      dbResults.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.test.name}`);
        console.log(`      - ID: ${result.id}`);
        console.log(`      - Data: ${result.completedAt}`);
        console.log(`      - User ID: ${result.userId}`);
      });
    }
    
    // 4. Função para ler resultados arquivados
    function readArchivedResults(userId = null) {
      const archivesDir = path.join(__dirname, 'archives', 'results');
      const results = [];
    
      function readDirectory(dir) {
        if (!fs.existsSync(dir)) return;
        
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            readDirectory(itemPath);
          } else if (item.endsWith('.json')) {
            try {
              const content = fs.readFileSync(itemPath, 'utf8');
              const result = JSON.parse(content);
              
              if (!userId || result.userId === userId) {
                results.push({
                  ...result,
                  filePath: itemPath
                });
              }
            } catch (error) {
              console.error(`Erro ao ler arquivo ${itemPath}:`, error.message);
            }
          }
        }
      }
    
      readDirectory(archivesDir);
      return results;
    }
    
    // 5. Verificar resultados arquivados para colaborador@demo.com
    console.log('\n4️⃣ RESULTADOS ARQUIVADOS PARA COLABORADOR@DEMO.COM');
    const archivedResults = readArchivedResults(targetUser.id);
    console.log(`📁 Total de resultados arquivados: ${archivedResults.length}`);
    
    if (archivedResults.length > 0) {
      console.log('\n📋 DETALHES DOS RESULTADOS ARQUIVADOS:');
      archivedResults.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.testName || 'Nome não disponível'}`);
        console.log(`      - ID: ${result.id}`);
        console.log(`      - Data: ${result.completedAt}`);
        console.log(`      - User ID: ${result.userId}`);
        console.log(`      - Arquivo: ${result.filePath}`);
      });
    }
    
    // 6. Verificar TODOS os resultados arquivados (de todos os usuários)
    console.log('\n5️⃣ TODOS OS RESULTADOS ARQUIVADOS (TODOS OS USUÁRIOS)');
    const allArchivedResults = readArchivedResults();
    console.log(`📁 Total de resultados arquivados (todos usuários): ${allArchivedResults.length}`);
    
    // Agrupar por usuário
    const archivedByUser = {};
    allArchivedResults.forEach(result => {
      if (!archivedByUser[result.userId]) {
        archivedByUser[result.userId] = [];
      }
      archivedByUser[result.userId].push(result);
    });
    
    console.log('\n📊 RESULTADOS ARQUIVADOS POR USUÁRIO:');
    Object.keys(archivedByUser).forEach(userId => {
      const count = archivedByUser[userId].length;
      const user = allUsers.find(u => u.id === userId);
      const userEmail = user ? user.email : 'Usuário não encontrado';
      console.log(`   - ${userEmail} (${userId}): ${count} resultados arquivados`);
    });
    
    // 7. Verificar duplicação entre banco e arquivos
    console.log('\n6️⃣ VERIFICAÇÃO DE DUPLICAÇÃO');
    const dbIds = new Set(dbResults.map(r => r.id));
    const archivedIds = new Set(archivedResults.map(r => r.id));
    
    const duplicateIds = [...dbIds].filter(id => archivedIds.has(id));
    console.log(`🔄 IDs duplicados entre banco e arquivos: ${duplicateIds.length}`);
    
    if (duplicateIds.length > 0) {
      console.log('\n📋 IDs DUPLICADOS:');
      duplicateIds.forEach((id, index) => {
        const dbResult = dbResults.find(r => r.id === id);
        const archivedResult = archivedResults.find(r => r.id === id);
        console.log(`   ${index + 1}. ID: ${id}`);
        console.log(`      - Banco: ${dbResult?.test?.name || 'N/A'}`);
        console.log(`      - Arquivo: ${archivedResult?.testName || 'N/A'}`);
      });
    }
    
    // 8. RESUMO FINAL
    console.log('\n🎯 RESUMO FINAL');
    console.log('=' .repeat(60));
    console.log(`👤 Usuário: colaborador@demo.com (${targetUser.id})`);
    console.log(`📊 Resultados no banco de dados: ${dbResults.length}`);
    console.log(`📁 Resultados arquivados: ${archivedResults.length}`);
    console.log(`🔄 Duplicatas: ${duplicateIds.length}`);
    console.log(`🧮 Total único esperado: ${dbResults.length + archivedResults.length - duplicateIds.length}`);
    
    // 9. Verificar se há resultados de outros usuários sendo exibidos
    console.log('\n7️⃣ VERIFICAÇÃO DE CONTAMINAÇÃO DE DADOS');
    const otherUsersWithResults = allUsers.filter(u => u.id !== targetUser.id && u._count.testResults > 0);
    
    if (otherUsersWithResults.length > 0) {
      console.log('⚠️  OUTROS USUÁRIOS COM RESULTADOS:');
      otherUsersWithResults.forEach(user => {
        console.log(`   - ${user.email}: ${user._count.testResults} resultados`);
      });
    } else {
      console.log('✅ Apenas colaborador@demo.com possui resultados no banco.');
    }
    
    // 10. Conclusão
    console.log('\n🔍 ANÁLISE FINAL:');
    const expectedTotal = dbResults.length + archivedResults.length - duplicateIds.length;
    if (expectedTotal === 16) {
      console.log('✅ CONFIRMADO: Os 16 resultados são realmente do usuário colaborador@demo.com');
      console.log('   - A API deveria estar filtrando as duplicatas corretamente');
      console.log('   - Pode haver problema na implementação do filtro ou cache do navegador');
    } else {
      console.log(`⚠️  DISCREPÂNCIA: Esperado ${expectedTotal} resultados, mas interface mostra 16`);
      console.log('   - Pode haver problema na lógica de filtragem da API');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a investigação:', error);
  } finally {
    await prisma.$disconnect();
  }
}

investigateUserResults();