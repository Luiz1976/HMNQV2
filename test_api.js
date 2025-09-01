const http = require('http');

function testAPI() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/colaborador/resultados?testType=cmehdpsox000o8wc0yuai0swa&page=1&limit=10',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\n📊 Resposta da API:');
      try {
        const jsonData = JSON.parse(data);
        console.log(JSON.stringify(jsonData, null, 2));
      } catch (error) {
        console.log('Resposta não é JSON válido:');
        console.log(data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erro na requisição:', error.message);
  });

  req.end();
}

console.log('🔍 Testando API de resultados...');
testAPI();