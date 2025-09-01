const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testLoginNextAuth() {
  console.log('🔍 Testando login via NextAuth API...');
  
  try {
    // 1. Obter CSRF token
    console.log('\n1. 🔐 Obtendo CSRF token...');
    const csrfResponse = await fetch('http://localhost:3000/api/auth/csrf');
    const csrfData = await csrfResponse.json();
    console.log('   ✅ CSRF token obtido:', csrfData.csrfToken ? 'Sim' : 'Não');
    
    if (!csrfData.csrfToken) {
      console.log('   ❌ Não foi possível obter CSRF token');
      return;
    }
    
    // 2. Fazer login
    console.log('\n2. 🔐 Fazendo login...');
    const loginData = new URLSearchParams({
      email: 'colaborador@demo.com',
      password: '123456',
      csrfToken: csrfData.csrfToken,
      callbackUrl: 'http://localhost:3000/colaborador',
      json: 'true'
    });
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': csrfResponse.headers.get('set-cookie') || ''
      },
      body: loginData.toString(),
      redirect: 'manual'
    });
    
    console.log('   Status do login:', loginResponse.status);
    console.log('   Headers do login:', Object.fromEntries(loginResponse.headers.entries()));
    
    if (loginResponse.status === 302 || loginResponse.status === 200) {
      console.log('   ✅ Login realizado com sucesso');
      
      // Extrair cookies da resposta
      const setCookieHeaders = loginResponse.headers.get('set-cookie');
      console.log('   Cookies recebidos:', setCookieHeaders);
      
      // 3. Testar sessão após login
      console.log('\n3. 🔐 Testando sessão após login...');
      const sessionResponse = await fetch('http://localhost:3000/api/auth/session', {
        headers: {
          'Cookie': setCookieHeaders || ''
        }
      });
      
      console.log('   Status da sessão:', sessionResponse.status);
      
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        console.log('   ✅ Dados da sessão:', JSON.stringify(sessionData, null, 2));
        
        // 4. Testar API de resultados com sessão
        console.log('\n4. 🔐 Testando API de resultados com sessão...');
        const resultadosResponse = await fetch('http://localhost:3000/api/colaborador/resultados-recentes', {
          headers: {
            'Cookie': setCookieHeaders || ''
          }
        });
        
        console.log('   Status dos resultados:', resultadosResponse.status);
        
        if (resultadosResponse.ok) {
          const resultadosData = await resultadosResponse.json();
          console.log('   ✅ Dados dos resultados:', JSON.stringify(resultadosData, null, 2));
        } else {
          console.log('   ❌ Erro ao obter resultados');
          const errorText = await resultadosResponse.text();
          console.log('   Erro:', errorText.substring(0, 300));
        }
      } else {
        console.log('   ❌ Erro ao obter sessão');
        const errorText = await sessionResponse.text();
        console.log('   Erro:', errorText.substring(0, 300));
      }
    } else {
      console.log('   ❌ Erro no login');
      const errorText = await loginResponse.text();
      console.log('   Erro:', errorText.substring(0, 300));
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

testLoginNextAuth();