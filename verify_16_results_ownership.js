// Script para verificar se todos os 16 resultados realmente pertencem ao usuário colaborador@demo.com
// Investiga: resultados no banco, arquivados, outros usuários e filtragem da API

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function verifyResultsOwnership() {
  try {
    console.log('🔍 === VERIFICAÇÃO DE PROPRIEDADE DOS 16 RESULTADOS ===');
    console.log('📧 Usuário alvo: colaborador@demo.com');
    console.log('');

    // 1. Buscar o usuário colaborador@demo.com
    const targetUser = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    });

    if (!targetUser) {
      console.log('❌ Usuário colaborador@demo.com não encontrado!');
      return;
    }

    console.log('✅ Usuário encontrado:');
    console.log(`   ID: ${targetUser.id}`);
    console.log(`   Nome: ${targetUser.firstName} ${targetUser.lastName}`);
    console.log(`   Email: ${targetUser.email}`);
    console.log('');

    // 2. Verificar TODOS os resultados no banco de dados para este usuário
    const dbResults = await prisma.testResult.findMany({
      where: {
        userId: targetUser.id
      },
      include: {
        test: {
          include: {
            category: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 RESULTADOS NO BANCO DE DADOS: ${dbResults.length}`);
    console.log('');

    if (dbResults.length > 0) {
      console.log('📋 Detalhes dos resultados no banco:');
      dbResults.forEach((result, index) => {
        console.log(`   ${index + 1}. ID: ${result.id}`);
        console.log(`      Teste: ${result.test.name}`);
        console.log(`      Usuário: ${result.user.email}`);
        console.log(`      Status: ${result.completedAt ? 'COMPLETED' : 'IN_PROGRESS'}`);
        console.log(`      Data: ${result.completedAt || result.createdAt}`);
        console.log(`      Score: ${result.overallScore || 'N/A'}`);
        console.log('');
      });
    }

    // 3. Verificar resultados arquivados
    console.log('📁 === VERIFICAÇÃO DE RESULTADOS ARQUIVADOS ===');
    
    const archivesPath = path.join(process.cwd(), 'archives', 'results');
    let archivedResults = [];
    
    if (fs.existsSync(archivesPath)) {
      const archiveFiles = fs.readdirSync(archivesPath)
        .filter(file => file.endsWith('.json'));
      
      console.log(`📁 Arquivos de arquivo encontrados: ${archiveFiles.length}`);
      
      for (const file of archiveFiles) {
        try {
          const filePath = path.join(archivesPath, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const archived = JSON.parse(fileContent);
          
          // Filtrar apenas resultados do usuário alvo
          if (archived.userId === targetUser.id) {
            archivedResults.push({
              ...archived,
              fileName: file
            });
          }
        } catch (error) {
          console.log(`⚠️ Erro ao ler arquivo ${file}:`, error.message);
        }
      }
    } else {
      console.log('📁 Diretório de arquivos não encontrado');
    }

    console.log(`📁 RESULTADOS ARQUIVADOS: ${archivedResults.length}`);
    console.log('');

    if (archivedResults.length > 0) {
      console.log('📋 Detalhes dos resultados arquivados:');
      archivedResults.forEach((result, index) => {
        console.log(`   ${index + 1}. ID: ${result.id}`);
        console.log(`      Teste: ${result.testName || 'N/A'}`);
        console.log(`      Arquivo: ${result.fileName}`);
        console.log(`      Data: ${result.completedAt}`);
        console.log(`      Score: ${result.overallScore || 'N/A'}`);
        console.log('');
      });
    }

    // 4. Verificar se há duplicatas entre banco e arquivos
    console.log('🔄 === VERIFICAÇÃO DE DUPLICATAS ===');
    
    const dbResultIds = new Set(dbResults.map(r => r.id));
    const archivedResultIds = new Set(archivedResults.map(r => r.id));
    
    const duplicateIds = [...dbResultIds].filter(id => archivedResultIds.has(id));
    
    console.log(`🔄 IDs duplicados entre banco e arquivos: ${duplicateIds.length}`);
    if (duplicateIds.length > 0) {
      console.log('   Duplicatas:', duplicateIds);
    }
    console.log('');

    // 5. Verificar outros usuários no sistema
    console.log('👥 === VERIFICAÇÃO DE OUTROS USUÁRIOS ===');
    
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        _count: {
          select: {
            testResults: true
          }
        }
      },
      orderBy: {
        email: 'asc'
      }
    });

    console.log(`👥 Total de usuários no sistema: ${allUsers.length}`);
    console.log('');
    
    console.log('📊 Usuários e seus resultados:');
    allUsers.forEach((user, index) => {
      const isTarget = user.email === 'colaborador@demo.com';
      const marker = isTarget ? '🎯' : '  ';
      console.log(`${marker} ${index + 1}. ${user.email}`);
      console.log(`      Nome: ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`);
      console.log(`      Resultados: ${user._count.testResults}`);
      if (isTarget) {
        console.log(`      ⭐ USUÁRIO ALVO`);
      }
      console.log('');
    });

    // 6. Verificar se há resultados com userId inválido
    console.log('🔍 === VERIFICAÇÃO DE RESULTADOS COM USERID INVÁLIDO ===');
    
    const allResultsWithUsers = await prisma.testResult.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        test: {
          select: {
            name: true
          }
        }
      }
    });

    const invalidResults = allResultsWithUsers.filter(result => !result.user);
    
    console.log(`🔍 Resultados com userId inválido: ${invalidResults.length}`);
    if (invalidResults.length > 0) {
      invalidResults.forEach((result, index) => {
        console.log(`   ${index + 1}. ID: ${result.id}, Teste: ${result.test?.name || 'N/A'}`);
      });
    }
    console.log('');

    // 7. Simular a resposta da API (como ela combina resultados)
    console.log('🔄 === SIMULAÇÃO DA RESPOSTA DA API ===');
    
    // Filtrar arquivados que não estão no banco (lógica da API)
    const uniqueArchivedResults = archivedResults.filter(archived => 
      !dbResultIds.has(archived.id)
    );
    
    const totalCombinedResults = dbResults.length + uniqueArchivedResults.length;
    
    console.log(`📊 Simulação da combinação de resultados:`);
    console.log(`   Resultados do banco: ${dbResults.length}`);
    console.log(`   Resultados arquivados únicos: ${uniqueArchivedResults.length}`);
    console.log(`   Total combinado (como na API): ${totalCombinedResults}`);
    console.log('');

    // 8. Análise final
    console.log('📋 === ANÁLISE FINAL ===');
    console.log(`🎯 Usuário alvo: colaborador@demo.com (ID: ${targetUser.id})`);
    console.log(`📊 Resultados no banco: ${dbResults.length}`);
    console.log(`📁 Resultados arquivados: ${archivedResults.length}`);
    console.log(`🔄 Duplicatas: ${duplicateIds.length}`);
    console.log(`📋 Total esperado pela API: ${totalCombinedResults}`);
    console.log(`🖥️ Total mostrado na interface: 16`);
    console.log('');

    if (totalCombinedResults === 16) {
      console.log('✅ CONCLUSÃO: Os 16 resultados na interface correspondem exatamente aos dados do usuário!');
      console.log('   - Todos os resultados pertencem ao usuário colaborador@demo.com');
      console.log('   - A API está funcionando corretamente');
      console.log('   - O problema pode estar na renderização dupla do frontend');
    } else if (totalCombinedResults === 8) {
      console.log('⚠️ CONCLUSÃO: Há uma discrepância!');
      console.log('   - API deveria retornar 8 resultados');
      console.log('   - Interface mostra 16 resultados');
      console.log('   - Provável duplicação no frontend (renderização dupla)');
    } else {
      console.log('❓ CONCLUSÃO: Situação inesperada!');
      console.log(`   - API deveria retornar ${totalCombinedResults} resultados`);
      console.log('   - Interface mostra 16 resultados');
      console.log('   - Necessária investigação adicional');
    }

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar verificação
verifyResultsOwnership().catch(console.error);