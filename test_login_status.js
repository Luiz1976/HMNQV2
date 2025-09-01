const { PrismaClient } = require('@prisma/client');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const prisma = new PrismaClient();

async function testLoginStatus() {
  try {
    console.log('🔍 Testando status de login e acesso às páginas...');
    console.log('============================================================');
    
    // 1. Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' },
      select: { id: true, firstName: true, lastName: true, email: true }
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
    
    // 2. Testar acesso à página principal
    console.log('\n🌐 Testando acesso às páginas...');
    console.log('========================================');
    
    const pages = [
      'http://localhost:3000/',
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
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        console.log('Status:', response.status, response.statusText);
        console.log('Content-Type:', response.headers.get('content-type'));
        
        const responseText = await response.text();
        
        // Verificar se é uma página de login
        if (responseText.includes('login') || responseText.includes('signin') || responseText.includes('entrar')) {
          console.log('🔒 Página requer autenticação (redirecionou para login)');
        } else if (responseText.includes('resultados') || responseText.includes('dashboard')) {
          console.log('✅ Página carregou corretamente');
        } else {
          console.log('❓ Página carregou, mas conteúdo não identificado');
        }
        
        // Verificar se há erros JavaScript na página
        if (responseText.includes('error') || responseText.includes('Error')) {
          console.log('⚠️  Possíveis erros detectados na página');
        }
        
      } catch (error) {
        console.log('❌ Erro ao acessar página:', error.message);
      }
    }
    
    // 3. Testar APIs específicas
    console.log('\n🔌 Testando APIs específicas...');
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
            'Accept': 'application/json'
          }
        });
        
        console.log('Status:', response.status, response.statusText);
        console.log('Content-Type:', response.headers.get('content-type'));
        
        const responseText = await response.text();
        
        if (response.headers.get('content-type')?.includes('application/json')) {
          try {
            const data = JSON.parse(responseText);
            console.log('✅ Resposta JSON válida');
            if (data.error) {
              console.log('❌ Erro na API:', data.error);
            } else {
              console.log('📊 Dados retornados:', Object.keys(data));
            }
          } catch (e) {
            console.log('❌ Erro ao parsear JSON:', e.message);
          }
        } else {
          console.log('🔒 API retornou HTML (provavelmente redirecionamento para login)');
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

testLoginStatus();