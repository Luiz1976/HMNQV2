// Script para testar a comunicação frontend-API
const fetch = require('node-fetch');

async function testFrontendAPI() {
  try {
    console.log('🔍 Testando API do frontend...');
    
    const response = await fetch('http://localhost:3000/api/colaborador/resultados', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('📡 Status da resposta:', response.status);
    console.log('📡 Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.log('❌ Resposta não OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('❌ Erro:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Dados recebidos:');
    console.log('   - Success:', data.success);
    console.log('   - Total results:', data.data?.results?.length || 0);
    
    if (data.data?.results) {
      console.log('\n📊 Resultados encontrados:');
      data.data.results.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.test?.name || 'Nome não encontrado'}`);
        console.log(`      - ID: ${result.id}`);
        console.log(`      - Completado em: ${result.completedAt}`);
        console.log(`      - É BOLIE: ${result.test?.name?.includes('BOLIE') ? 'SIM' : 'NÃO'}`);
      });
      
      // Verificar especificamente BOLIE
      const bolieResults = data.data.results.filter(r => r.test?.name?.includes('BOLIE'));
      console.log(`\n🎯 Resultados BOLIE encontrados: ${bolieResults.length}`);
      
      if (bolieResults.length > 0) {
        bolieResults.forEach((result, index) => {
          console.log(`   BOLIE ${index + 1}:`);
          console.log(`      - Nome: ${result.test.name}`);
          console.log(`      - ID: ${result.id}`);
          console.log(`      - Completado: ${result.completedAt}`);
          console.log(`      - Score: ${result.overallScore}`);
        });
      }
    }
    
    console.log('\n📈 Estatísticas:', data.data?.statistics);
    console.log('📄 Paginação:', data.data?.pagination);
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
  }
}

testFrontendAPI();