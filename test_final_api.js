const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🔍 Testando API /api/colaborador/resultados...');
    
    const response = await fetch('http://localhost:3000/api/colaborador/resultados?page=1&limit=10');
    
    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);
    
    if (!response.ok) {
      console.error('❌ Erro na resposta:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    
    console.log('\n📈 RESULTADOS DA API:');
    console.log('- Total de resultados:', data.total || 0);
    console.log('- Sucesso:', data.success);
    console.log('- Número de resultados retornados:', data.results?.length || 0);
    
    if (data.results && data.results.length > 0) {
      console.log('\n🎯 PRIMEIRO RESULTADO:');
      const firstResult = data.results[0];
      console.log('- ID:', firstResult.id);
      console.log('- Teste:', firstResult.test?.name || 'N/A');
      console.log('- Usuário:', firstResult.user?.email || 'N/A');
      console.log('- Data:', firstResult.completedAt);
      console.log('- Score:', firstResult.score);
      
      // Procurar especificamente por HumaniQ BOLIE
      const bolieResult = data.results.find(r => 
        r.test?.name?.includes('BOLIE') || 
        r.test?.name?.includes('Inteligência Emocional')
      );
      
      if (bolieResult) {
        console.log('\n✅ RESULTADO BOLIE ENCONTRADO:');
        console.log('- Nome do teste:', bolieResult.test?.name);
        console.log('- ID do resultado:', bolieResult.id);
        console.log('- Score:', bolieResult.score);
      } else {
        console.log('\n⚠️  Resultado BOLIE não encontrado nos resultados retornados');
      }
    } else {
      console.log('\n❌ Nenhum resultado retornado pela API');
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
  }