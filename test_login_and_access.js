const { PrismaClient } = require('@prisma/client');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const prisma = new PrismaClient();

async function testLoginAndAccess() {
  try {
    console.log('🔐 Testando login e acesso às páginas...');
    console.log('============================================================');
    
    // 1. Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' },
      select: { id: true, firstName: true, lastName: true, email: true, password: true }
    });
    
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    console.log('✅ Usuário encontrado:', {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
    
    // 2. Fazer login via API
    console.log('\n🔐 Fazendo login via API...');
    console.log('========================================');
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        email: 'colaborador@demo.com',
        password: 'demo123',
        csrfToken: 'test', // Em produção, seria necessário obter o token CSRF real
        callbackUrl: 'http://localhost:3000/colaborador',
        json: 'true'
      })
    });
    
    console.log('Login Status:', loginResponse.status, loginResponse.statusText);
    console.log('Login Headers:', Object.fromEntries(loginResponse.headers.entries()));
    
    // Extrair cookies de sessão
    const setCookieHeaders = loginResponse.headers.get('set-cookie');
    console.log('Set-Cookie Headers:', setCookieHeaders);
    
    let sessionCookies = '';
    if (setCookieHeaders) {
      // Extrair cookies de sessão do NextAuth
      const cookies = setCookieHeaders.split(',').map(cookie => {
        const [nameValue] = cookie.trim().split(';');
        return nameValue;
      }).filter(cookie => 
        cookie.includes('next-auth') || 
        cookie.includes('__Secure-next-auth') ||
        cookie.includes('__Host-next-auth')
      );
      sessionCookies = cookies.join('; ');
      console.log('Session Cookies:', sessionCookies);
    }
    
    // 3. Testar acesso às páginas com cookies de sessão
    console.log('\n🌐 Testando acesso às páginas com sessão...');
    console.log('========================================');
    
    const pages = [
      'http://localhost:3000/colaborador',
      'http://localhost:3000/colaborador/resultados-recentes',
      'http://localhost:3000/colaborador/todos-resultados'
    ];
    
    for (const pageUrl of pages) {
      try {
        console.log(`\n📡 Testando: ${pageUrl}`);
        
        const response = await fetch(pageUrl, {
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Cookie': sessionCookies
          }
        });
        
        console.log('Status:', response.status, response.statusText);
        console.log('Content-Type:', response.headers.get('content-type'));
        
        const responseText = await response.text();
        
        // Verificar se é uma página de login
        if (responseText.includes('login') || responseText.includes('signin') || responseText.includes('entrar')) {
          console.log('🔒 Ainda requer autenticação (redirecionou para login)');
        } else if (responseText.includes('resultados') || responseText.includes('dashboard') || responseText.includes('colaborador')) {
          console.log('✅ Página carregou corretamente com autenticação');
        } else {
          console.log('❓ Página carregou, mas conteúdo não identificado');
        }
        
      } catch (error) {
        console.log('❌ Erro ao acessar página:', error.message);
      }
    }
    
    // 4. Testar APIs com cookies de sessão
    console.log('\n🔌 Testando APIs com sessão...');
    console.log('========================================');
    
    const apis = [
      '/api/auth/session',
      '/api/colaborador/resultados-recentes',
      '/api/colaborador/resultados'
    ];
    
    for (const apiPath of apis) {
      try {
        const apiUrl = `http://localhost:3000${apiPath}`;
        console.log(`\n📡 Testando API: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': sessionCookies
          }
        });
        
        console.log('Status:', response.status, response.statusText);
        console.log('Content-Type:', response.headers.get('content-type'));
        
        const responseText = await response.text();
        
        if (response.headers.get('content-type')?.includes('application/json')) {
          try {
            const data = JSON.parse(responseText);
            console.log('✅ Resposta JSON válida');
            
            if (apiPath === '/api/auth/session') {
              console.log('👤 Sessão:', data.user ? `${data.user.firstName} ${data.user.lastName}` : 'Não autenticado');
            } else if (data.error) {
              console.log('❌ Erro na API:', data.error);
            } else {
              console.log('📊 Dados retornados:', Object.keys(data));
              if (data.results && Array.isArray(data.results)) {
                console.log('📋 Número de resultados:', data.results.length);
                if (data.results.length > 0) {
                  const bolieResults = data.results.filter(r => r.testName && r.testName.includes('BOLIE'));
                  console.log('🧠 Resultados BOLIE encontrados:', bolieResults.length);
                  if (bolieResults.length > 0) {
                    console.log('🎯 Último resultado BOLIE:', {
                      testName: bolieResults[0].testName,
                      overallScore: bolieResults[0].overallScore,
                      completedAt: bolieResults[0].completedAt,
                      hasDimensionScores: !!bolieResults[0].dimensionScores
                    });
                  }
                }
              }
            }
          } catch (e) {
            console.log('❌ Erro ao parsear JSON:', e.message);
            console.log('📄 Resposta (primeiros 200 chars):', responseText.substring(0, 200));
          }
        } else {
          console.log('🔒 API retornou HTML (provavelmente redirecionamento para login)');
          console.log('📄 Resposta (primeiros 200 chars):', responseText.substring(0, 200));
        }
        
      } catch (error) {
        console.log('❌ Erro ao testar API:', error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLoginAndAccess();