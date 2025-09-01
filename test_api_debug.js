// Script para testar a API de resultados e verificar filtragem por usuário
const http = require('http');

async function testAPI() {
  try {
    console.log('🔍 Testando API de resultados...');
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/colaborador/resultados?page=1&limit=12&includeAI=true&sortBy=completedAt&sortOrder=desc',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const response = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.end();
    });
    
    console.log('📊 Status da resposta:', response.status);
    console.log('📊 Headers da resposta:', response.headers);
    
    if (response.status === 401) {
      console.log('❌ API retornou 401 - Não autorizado (esperado sem autenticação)');
      return;
    }
    
    const data = JSON.parse(response.data);
    
    if (data.success) {
      console.log('✅ API respondeu com sucesso');
      console.log('📈 Total de resultados:', data.data.pagination.totalCount);
      console.log('📈 Resultados na página:', data.data.results.length);
      
      if (data.data.results.length > 0) {
        console.log('\n📝 Primeiros 3 resultados:');
        data.data.results.slice(0, 3).forEach((result, index) => {
          console.log(`  ${index + 1}. ${result.testName} - Usuário: ${result.userId} - Score: ${result.overallScore}`);
        });
        
        // Verificar se todos os resultados são do mesmo usuário
        const uniqueUserIds = [...new Set(data.data.results.map(r => r.userId))];
        console.log('\n👥 Usuários únicos nos resultados:', uniqueUserIds);
        
        if (uniqueUserIds.length === 1) {
          console.log('✅ Todos os resultados são do mesmo usuário:', uniqueUserIds[0]);
        } else {
          console.log('❌ PROBLEMA: Resultados de múltiplos usuários encontrados!');
          uniqueUserIds.forEach(userId => {
            const count = data.data.results.filter(r => r.userId === userId).length;
            console.log(`  - Usuário ${userId}: ${count} resultados`);
          });
        }
      }
      
      console.log('\n📊 Estatísticas gerais:', {
        totalTests: data.data.statistics.totalTests,
        completedTests: data.data.statistics.completedTests,
        averageScore: data.data.statistics.averageScore
      });
      
    } else {
      console.log('❌ API retornou erro:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
  }
}

// Executar teste
testAPI();