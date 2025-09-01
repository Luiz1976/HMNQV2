const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testNextAuthDebug() {
  console.log('🔍 Testando endpoints de debug do NextAuth...');
  
  try {
    // 1. Testar endpoint de debug da sessão
    console.log('\n1. 🔐 Testando debug da sessão...');
    const sessionDebugResponse = await fetch('http://localhost:3000/api/debug/session');
    console.log('   Status:', sessionDebugResponse.status);
    
    if (sessionDebugResponse.ok) {
      const sessionDebugData = await sessionDebugResponse.json();
      console.log('   ✅ Debug da sessão:', JSON.stringify(sessionDebugData, null, 2));
    } else {
      console.log('   ❌ Erro no debug da sessão');
      const errorText = await sessionDebugResponse.text();
      console.log('   Erro:', errorText.substring(0, 200));
    }
    
    // 2. Testar endpoint de debug do NextAuth
    console.log('\n2. 🔐 Testando debug do NextAuth...');
    const nextauthDebugResponse = await fetch('http://localhost:3000/api/debug/nextauth');
    console.log('   Status:', nextauthDebugResponse.status);
    
    if (nextauthDebugResponse.ok) {
      const nextauthDebugData = await nextauthDebugResponse.json();
      console.log('   ✅ Debug do NextAuth:', JSON.stringify(nextauthDebugData, null, 2));
    } else {
      console.log('   ❌ Erro no debug do NextAuth');
      const errorText = await nextauthDebugResponse.text();
      console.log('   Erro:', errorText.substring(0, 200));
    }
    
    // 3. Testar endpoint de CSRF
    console.log('\n3. 🔐 Testando CSRF token...');
    const csrfResponse = await fetch('http://localhost:3000/api/auth/csrf');
    console.log('   Status:', csrfResponse.status);
    
    if (csrfResponse.ok) {
      const csrfData = await csrfResponse.json();
      console.log('   ✅ CSRF token:', csrfData.csrfToken ? 'Obtido' : 'Não obtido');
    } else {
      console.log('   ❌ Erro ao obter CSRF token');
      const errorText = await csrfResponse.text();
      console.log('   Erro:', errorText.substring(0, 200));
    }
    
    // 4. Testar endpoint de providers
    console.log('\n4. 🔐 Testando providers...');
    const providersResponse = await fetch('http://localhost:3000/api/auth/providers');
    console.log('   Status:', providersResponse.status);
    
    if (providersResponse.ok) {
      const providersData = await providersResponse.json();
      console.log('   ✅ Providers:', JSON.stringify(providersData, null, 2));
    } else {
      console.log('   ❌ Erro ao obter providers');
      const errorText = await providersResponse.text();
      console.log('   Erro:', errorText.substring(0, 200));
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

testNextAuthDebug();