const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRealAPI() {
  try {
    console.log('=== TESTE DA API REAL ===\n');
    
    // 1. Buscar o usuário colaborador@demo.com para obter o ID
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    });
    
    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado');
      return;
    }
    
    console.log(`✅ Usuário encontrado: ${user.email} (ID: ${user.id})\n`);
    
    // 2. Fazer requisição para a API real
    console.log('🌐 Fazendo requisição para a API real...');
    
    const apiUrl = 'http://localhost:3000/api/colaborador/resultados';
    const params = new URLSearchParams({
      page: '1',
      limit: '20'
    });
    
    const response = await fetch(`${apiUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Simular autenticação - em produção seria um token JWT
        'x-user-id': user.id
      }
    });
    
    if (!response.ok) {
      console.log(`❌ Erro na API: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.log('Resposta de erro:', errorText);
      return;
    }
    
    const data = await response.json();
    
    console.log(`📊 Status da resposta: ${response.status}`);
    console.log(`📋 Total de resultados retornados: ${data.results ? data.results.length : 'N/A'}`);
    
    if (data.results) {
      console.log('\n=== DETALHES DOS RESULTADOS DA API ===');
      data.results.forEach((result, index) => {
        console.log(`${index + 1}. ID: ${result.id} | Título: ${result.title} | Data: ${result.completedAt}`);
      });
      
      // Verificar duplicatas
      const resultIds = data.results.map(r => r.id);
      const uniqueIds = new Set(resultIds);
      const hasDuplicates = resultIds.length !== uniqueIds.size;
      
      console.log(`\n🔍 Verificação de duplicatas na resposta da API:`);
      console.log(`- Total de IDs: ${resultIds.length}`);
      console.log(`- IDs únicos: ${uniqueIds.size}`);
      console.log(`- Há duplicatas: ${hasDuplicates ? '❌ SIM' : '✅ NÃO'}`);
      
      if (hasDuplicates) {
        const duplicateIds = resultIds.filter((id, index) => resultIds.indexOf(id) !== index);
        console.log(`- IDs duplicados: ${[...new Set(duplicateIds)].join(', ')}`);
      }
    }
    
    // Mostrar informações de paginação
    if (data.pagination) {
      console.log('\n📄 Informações de paginação:');
      console.log(`- Página atual: ${data.pagination.currentPage}`);
      console.log(`- Total de páginas: ${data.pagination.totalPages}`);
      console.log(`- Total de itens: ${data.pagination.totalItems}`);
      console.log(`- Itens por página: ${data.pagination.itemsPerPage}`);
    }
    
    // Mostrar estatísticas
    if (data.statistics) {
      console.log('\n📈 Estatísticas:');
      console.log(`- Total de testes: ${data.statistics.totalTests}`);
      console.log(`- Testes concluídos: ${data.statistics.completedTests}`);
      console.log(`- Taxa de conclusão: ${data.statistics.completionRate}%`);
    }
    
    console.log('\n=== CONCLUSÃO ===');
    const resultCount = data.results ? data.results.length : 0;
    
    if (resultCount === 16) {
      console.log('⚠️  PROBLEMA CONFIRMADO: A API real está retornando 16 resultados!');
      console.log('Isso confirma que há um problema na API, não no frontend.');
    } else if (resultCount === 8) {
      console.log('✅ A API real está funcionando corretamente (8 resultados)');
      console.log('O problema dos 16 resultados deve estar no frontend ou cache.');
    } else {
      console.log(`🤔 A API retornou ${resultCount} resultados - número inesperado.`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar API real:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Certifique-se de que o servidor está rodando em http://localhost:3000');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testRealAPI();