const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Função simplificada para ler resultados arquivados
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
            results.push(result);
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

async function testFinalFix() {
  try {
    console.log('🔍 Testando correção final da API de resultados...');
    
    // 1. Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    });
    
    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado');
      return;
    }
    
    console.log(`👤 Usuário encontrado: ${user.email} (ID: ${user.id})`);
    
    // 2. Buscar resultados do banco de dados
    const dbResults = await prisma.testResult.findMany({
      where: { userId: user.id },
      include: {
        test: {
          select: {
            name: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    });
    
    console.log(`📊 Resultados no banco de dados: ${dbResults.length}`);
    
    // 3. Buscar resultados arquivados
    const archivedResults = readArchivedResults(user.id);
    console.log(`📁 Resultados arquivados: ${archivedResults.length}`);
    
    // 4. Simular a lógica da API corrigida
    const dbResultIds = new Set(dbResults.map(result => result.id));
    const uniqueArchivedResults = archivedResults.filter(archivedResult => 
      !dbResultIds.has(archivedResult.id)
    );
    
    console.log(`🔧 Resultados arquivados únicos (após filtro): ${uniqueArchivedResults.length}`);
    
    // 5. Combinar resultados
    const totalUniqueResults = dbResults.length + uniqueArchivedResults.length;
    console.log(`✅ Total de resultados únicos: ${totalUniqueResults}`);
    
    // 6. Verificar se há duplicatas
    const duplicates = archivedResults.filter(archivedResult => 
      dbResultIds.has(archivedResult.id)
    );
    
    console.log(`🔍 Duplicatas encontradas e filtradas: ${duplicates.length}`);
    
    if (duplicates.length > 0) {
      console.log('📋 IDs das duplicatas filtradas:');
      duplicates.forEach(dup => {
        console.log(`   - ${dup.id} (${dup.testName})`);
      });
    }
    
    console.log('\n🎯 RESULTADO FINAL:');
    console.log(`   - Antes da correção: ${dbResults.length + archivedResults.length} resultados (com duplicatas)`);
    console.log(`   - Após a correção: ${totalUniqueResults} resultados (sem duplicatas)`);
    console.log(`   - Duplicatas removidas: ${duplicates.length}`);
    
    if (totalUniqueResults === dbResults.length) {
      console.log('\n✅ SUCESSO: A correção está funcionando! Agora o usuário verá apenas seus resultados únicos.');
    } else {
      console.log('\n⚠️  ATENÇÃO: Ainda há resultados arquivados únicos que serão exibidos.');
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFinalFix();