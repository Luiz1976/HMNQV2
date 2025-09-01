// Script para testar a API de resultados em detalhes
const https = require('https');
const http = require('http');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
            parseError: error.message
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testAPI() {
  console.log('🧪 Testando API de resultados em detalhes...');
  
  try {
    const response = await makeRequest('http://localhost:3000/api/colaborador/resultados?page=1&limit=10');
    
    console.log('📊 Status da resposta:', response.status);
    console.log('📋 Headers:', response.headers);
    
    if (response.parseError) {
      console.log('❌ Erro ao fazer parse do JSON:', response.parseError);
      console.log('📄 Dados brutos:', response.data.substring(0, 500));
      return;
    }
    
    const data = response.data;
    
    console.log('✅ Resposta JSON válida');
    console.log('🔑 Chaves principais:', Object.keys(data));
    
    if (data.success) {
      console.log('✅ API retornou success: true');
      
      if (data.data) {
        console.log('📦 Chaves em data:', Object.keys(data.data));
        
        if (data.data.results) {
          console.log('📋 Número de resultados:', data.data.results.length);
          
          if (data.data.results.length > 0) {
            console.log('🎯 Primeiro resultado:');
            const firstResult = data.data.results[0];
            console.log('  - ID:', firstResult.id);
            console.log('  - Nome do teste:', firstResult.test?.name);
            console.log('  - Completado em:', firstResult.completedAt);
            console.log('  - Score:', firstResult.overallScore);
          } else {
            console.log('⚠️ Array de resultados está vazio');
          }
        } else {
          console.log('❌ Campo "results" não encontrado em data');
        }
        
        if (data.data.statistics) {
          console.log('📊 Estatísticas:');
          console.log('  - Total de testes:', data.data.statistics.totalTests);
          console.log('  - Testes completados:', data.data.statistics.completedTests);
        }
        
        if (data.data.pagination) {
          console.log('📄 Paginação:');
          console.log('  - Página atual:', data.data.pagination.currentPage);
          console.log('  - Total de páginas:', data.data.pagination.totalPages);
          console.log('  - Total de itens:', data.data.pagination.totalCount);
        }
      } else {
        console.log('❌ Campo "data" não encontrado na resposta');
      }
    } else {
      console.log('❌ API retornou success: false');
      console.log('🔍 Resposta completa:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
  }
}

testAPI();