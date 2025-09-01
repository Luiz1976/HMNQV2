// Script para debugar a API de resultados

async function debugAPI() {
  try {
    console.log('🔍 Testando API de resultados com logs detalhados...');
    
    const url = 'http://localhost:3000/api/colaborador/resultados?page=1&limit=10';
    console.log('📡 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);
    
    const responseText = await response.text();
    console.log('📄 Response Text Length:', responseText.length);
    
    try {
      const data = JSON.parse(responseText);
      console.log('\n✅ Parsed JSON Structure:');
      console.log('  - success:', data.success);
      console.log('  - data keys:', Object.keys(data.data || {}));
      
      if (data.data) {
        console.log('  - data.results length:', data.data.results?.length || 0);
        console.log('  - data.totalCount:', data.data.totalCount);
        console.log('  - data.page:', data.data.page);
        console.log('  - data.limit:', data.data.limit);
        console.log('  - data.totalPages:', data.data.totalPages);
        
        if (data.data.results && data.data.results.length > 0) {
          console.log('\n📝 Primeiros resultados:');
          data.data.results.slice(0, 3).forEach((result, index) => {
            console.log(`  ${index + 1}. ${result.test?.name || 'Nome não disponível'}`);
            console.log(`     ID: ${result.id}`);
            console.log(`     Data: ${result.completedAt}`);
            console.log(`     Pontuação: ${result.overallScore}`);
            console.log(`     Teste ID: ${result.test?.id}`);
            console.log('');
          });
          
          // Verificar se há resultados do BOLIE
          const bolieResults = data.data.results.filter(r => 
            r.test?.id === 'cmehdpsox000o8wc0yuai0swa' ||
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
              console.log('');
            });
          }
        } else {
          console.log('⚠️ Nenhum resultado encontrado na resposta da API');
        }
      }
      
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError.message);
      console.log('📄 Raw response (first 1000 chars):', responseText.substring(0, 1000));
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugAPI();