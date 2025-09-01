const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testLoginAPI() {
  try {
    console.log('🔐 Testando API de login...');
    
    // Primeiro, obter o CSRF token
    const csrfResponse = await fetch('http://localhost:3000/api/auth/csrf');
    const csrfData = await csrfResponse.json();
    console.log('🔑 CSRF Token:', csrfData.csrfToken ? 'Obtido' : 'Não obtido');
    
    // Tentar fazer login
    const loginData = {
      email: 'colaborador@demo.com',
      password: '123456',
      csrfToken: csrfData.csrfToken
    };
    
    console.log('📧 Tentando login com:', loginData.email);
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(loginData)
    });
    
    console.log('📊 Status da resposta:', loginResponse.status);
    console.log('📋 Headers da resposta:', Object.fromEntries(loginResponse.headers.entries()));
    
    const responseText = await loginResponse.text();
    console.log('📄 Resposta (primeiros 500 chars):', responseText.substring(0, 500));
    
  } catch (error) {
    console.error('❌ Erro ao testar API de login:', error.message);
  }
}

testLoginAPI();