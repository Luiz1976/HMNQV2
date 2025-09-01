const fetch = require('node-fetch').default;

async function testWebLogin() {
  try {
    console.log('🔍 Testando login via formulário web...');
    
    // 1. Primeiro, obter a página de login para pegar o CSRF token
    console.log('1. Obtendo página de login...');
    const loginPageResponse = await fetch('http://localhost:3000/auth/login');
    const loginPageHtml = await loginPageResponse.text();
    
    // Extrair CSRF token do HTML (se presente)
    const csrfMatch = loginPageHtml.match(/name="csrfToken"\s+value="([^"]+)"/);
    const csrfToken = csrfMatch ? csrfMatch[1] : null;
    console.log('CSRF Token encontrado:', csrfToken ? 'Sim' : 'Não');
    
    // Extrair cookies da página de login
    const initialCookies = loginPageResponse.headers.get('set-cookie');
    console.log('Cookies iniciais:', initialCookies ? 'Sim' : 'Não');
    
    // 2. Fazer login usando o endpoint correto do NextAuth
    console.log('\n2. Fazendo login via NextAuth signin...');
    const signinData = new URLSearchParams({
      email: 'colaborador@demo.com',
      password: '123456',
      callbackUrl: 'http://localhost:3000/colaborador'
    });
    
    if (csrfToken) {
      signinData.append('csrfToken', csrfToken);
    }
    
    const signinResponse = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': initialCookies || ''
      },
      body: signinData,
      redirect: 'manual'
    });
    
    console.log('Status do signin:', signinResponse.status);
    console.log('Headers da resposta:', Object.fromEntries(signinResponse.headers.entries()));
    
    const signinCookies = signinResponse.headers.get('set-cookie');
    console.log('Cookies do signin:', signinCookies ? 'Sim' : 'Não');
    
    if (signinCookies) {
      console.log('Cookies recebidos:', signinCookies.substring(0, 200) + '...');
    }
    
    // 3. Verificar se há redirecionamento
    const location = signinResponse.headers.get('location');
    if (location) {
      console.log('Redirecionamento para:', location);
    }
    
    // 4. Testar sessão com os novos cookies
    if (signinCookies) {
      console.log('\n3. Testando sessão com cookies do signin...');
      const sessionResponse = await fetch('http://localhost:3000/api/auth/session', {
        headers: {
          'Cookie': signinCookies
        }
      });
      
      const sessionData = await sessionResponse.text();
      console.log('Dados da sessão:', sessionData);
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

testWebLogin();