const fetch = require('node-fetch');

async function testResultadosAPI() {
  try {
    console.log('🔍 Testando API /api/colaborador/resultados...');
    
    // Fazer login primeiro para obter cookies
    const loginResponse = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'colaborador@humaniq.com',
        password: 'colaborador123'
      })
    });
    
    console.log('🔐 Status do login:', loginResponse.status);
    
    // Extrair cookies
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('🍪 Cookies obtidos:', cookies ? 'Sim' : 'Não');
    
    // Testar a API de resultados
    const resultadosResponse = await fetch('http://localhost:3000/api/colaborador/resultados?page=1&limit=20', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      }
    });
    
    console.log('📊 Status da API resultados:', resultadosResponse.status);
    
    if (resultadosResponse.ok) {
      const data = await resultadosResponse.json();
      console.log('✅ Resposta da API recebida');
      console.log('📋 Total de resultados:', data.data?.results?.length || 0);
      
      // Procurar por testes BOLIE
      const bolieResults = data.data?.results?.filter(result => 
        result.test.name.includes('BOLIE')
      ) || [];
      
      console.log('🎯 Resultados BOLIE encontrados na API:', bolieResults.length);
      
      if (bolieResults.length > 0) {
        console.log('\n📝 Detalhes dos testes BOLIE na API:');
        bolieResults.forEach((result, index) => {
          console.log(`${index + 1}. ID: ${result.id}`);
          console.log(`   Nome: ${result.test.name}`);
          console.log(`   Categoria: ${result.test.category?.name}`);
          console.log(`   Concluído: ${result.completedAt}`);
          console.log(`   Score: ${result.overallScore}`);
          console.log('   ---');
        });
      } else {
        console.log('❌ Nenhum teste BOLIE encontrado na resposta da API');
        console.log('\n🔍 Todos os resultados na API:');
        data.data?.results?.forEach((result, index) => {
          console.log(`${index + 1}. ${result.test.name} (${result.test.category?.name})`);
        });
      }
      
    } else {
      const errorText = await resultadosResponse.text();
      console.error('❌ Erro na API:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}