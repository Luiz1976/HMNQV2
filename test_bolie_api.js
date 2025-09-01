// Usando fetch nativo do Node.js 22

async function testBolieAPI() {
  try {
    console.log('🔍 Testando API de resultados para BOLIE...');
    
    // Testar com o ID do teste BOLIE
    const testId = 'cmehdpsox000o8wc0yuai0swa';
    const url = `http://localhost:3000/api/colaborador/resultados?page=1&limit=10`;
    
    console.log('📡 Fazendo requisição para:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Status da resposta:', response.status);
    console.log('📊 Headers da resposta:', Object.fromEntries(response.headers));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na API:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Resposta da API:');
    console.log('  - Total de resultados:', data.totalCount || 0);
    console.log('  - Resultados retornados:', data.results?.length || 0);
    
    if (data.results && data.results.length > 0) {
      console.log('\n📝 Primeiros resultados:');
      data.results.slice(0, 3).forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.test?.name || 'Nome não disponível'}`);
        console.log(`     ID: ${result.id}`);
        console.log(`     Data: ${result.completedAt}`);
        console.log(`     Pontuação: ${result.overallScore}`);
        console.log(`     Teste ID: ${result.test?.id}`);
        console.log('');
      });
      
      // Verificar se há resultados do BOLIE
      const bolieResults = data.results.filter(r => 
        r.test?.id === testId || 
        r.test?.name?.toLowerCase().includes('bolie') ||
        r.test?.name?.toLowerCase().includes('inteligência emocional')
      );
      
      console.log(`🎯 Resultados do BOLIE encontrados: ${bolieResults.length}`);
      if (bolieResults.length > 0) {
        console.log('\n🎯 Detalhes dos resultados BOLIE:');
        bolieResults.forEach((result, index) => {
          console.log(`  ${index + 1}. ${result.test?.name}`);
          console.log(`     ID do resultado: ${result.id}`);
          console.log(`     ID do teste: ${result.test?.id}`);
          console.log(`     Data de conclusão: ${result.completedAt}`);
          console.log(`     Pontuação geral: ${result.overallScore}`);
          console.log(`     Duração: ${result.duration}`);
          console.log('');
        });
      }
    } else {
      console.log('⚠️ Nenhum resultado encontrado');
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testBolieAPI();