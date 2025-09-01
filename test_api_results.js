const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🚀 Testando API de resultados...');
    
    const response = await fetch('http://localhost:3000/api/colaborador/resultados?page=1&limit=10', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('📊 Status da resposta:', response.status);
    console.log('📊 Headers da resposta:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Erro na resposta:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Resposta da API:');
    console.log('- Success:', data.success);
    console.log('- Total results:', data.data?.results?.length || 0);
    console.log('- Pagination:', data.data?.pagination);
    
    if (data.data?.results?.length > 0) {
      console.log('\n📋 Primeiros resultados:');
      data.data.results.slice(0, 3).forEach((result, index) => {
        console.log(`${index + 1}. ${result.test?.name || 'Nome não disponível'}`);
        console.log(`   - ID: ${result.id}`);
        console.log(`   - Completado: ${result.completedAt}`);
        console.log(`   - Score: ${result.overallScore}`);
        console.log('');
      });
    } else {
      console.log('❌ Nenhum resultado retornado pela API');
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
  }
}

testAPI();