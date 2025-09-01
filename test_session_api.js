const fetch = require('node-fetch').default;

async function testSessionAPI() {
  try {
    console.log('🔍 Testando sessão na API...');
    
    // Primeiro, fazer login para obter cookies
    const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: 'colaborador@demo.com',
        password: '123456',
        redirect: 'false',
        json: 'true'
      }),
      redirect: 'manual'
    });
    
    console.log('Status do login:', loginResponse.status);
    
    // Extrair cookies
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Cookies recebidos:', cookies ? 'Sim' : 'Não');
    
    if (!cookies) {
      console.log('❌ Nenhum cookie recebido do login');
      return;
    }
    
    // Testar API de sessão com cookies
    console.log('\n🔍 Testando API /api/auth/session com cookies...');
    const sessionResponse = await fetch('http://localhost:3000/api/auth/session', {
      method: 'GET',
      headers: {
        'Cookie': cookies,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status da API de sessão:', sessionResponse.status);
    const sessionData = await sessionResponse.text();
    console.log('Dados da sessão:', sessionData);
    
    // Criar uma API de teste simples para verificar se getServerSession funciona
    console.log('\n🔍 Testando API de debug...');
    const debugResponse = await fetch('http://localhost:3000/api/debug/session', {
      method: 'GET',
      headers: {
        'Cookie': cookies,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status da API de debug:', debugResponse.status);
    const debugText = await debugResponse.text();
    console.log('Resposta da API de debug:');
    console.log(debugText.substring(0, 500));
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

testSessionAPI();