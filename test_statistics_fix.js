const fetch = require('node-fetch');

async function testStatisticsFix() {
  try {
    console.log('🔍 Testando correção das estatísticas...');
    console.log('=' .repeat(50));
    
    const response = await fetch('http://localhost:3000/api/colaborador/resultados', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'next-auth.session-token=your-session-token' // Placeholder
      }
    });
    
    if (!response.ok) {
      console.log('❌ Erro na requisição:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    
    if (data.success && data.data.statistics) {
      const stats = data.data.statistics;
      
      console.log('📊 ESTATÍSTICAS ATUALIZADAS:');
      console.log('- Total de testes:', stats.totalTests);
      console.log('- Testes completados:', stats.completedTests);
      console.log('- Taxa de conclusão:', stats.completionRate + '%');
      console.log('- Pontuação média:', stats.averageScore || 'N/A');
      console.log('- Análises de IA:', stats.aiAnalysesCount);
      
      if (stats.archivedResults) {
        console.log('\n📁 RESULTADOS ARQUIVADOS:');
        console.log('- Total arquivado:', stats.archivedResults.total);
        console.log('- Pontuação média arquivada:', stats.archivedResults.averageScore || 'N/A');
      }
      
      console.log('\n📋 RESULTADOS NA LISTA:');
      console.log('- Quantidade de resultados retornados:', data.data.results.length);
      
      // Verificar se a correção funcionou
      if (stats.completedTests === 8) {
        console.log('\n✅ CORREÇÃO APLICADA COM SUCESSO!');
        console.log('   O contador agora mostra 8 testes completados.');
      } else {
        console.log('\n❌ PROBLEMA AINDA EXISTE!');
        console.log(`   O contador ainda mostra ${stats.completedTests} em vez de 8.`);
      }
      
    } else {
      console.log('❌ Resposta inválida da API:', data);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar:', error.message);
  }
}

testStatisticsFix();