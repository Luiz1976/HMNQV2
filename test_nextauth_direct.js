// Teste direto da API NextAuth
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')

async function testNextAuthAPI() {
  console.log('🔍 Testando API NextAuth diretamente...')
  
  try {
    // 1. Testar endpoint de CSRF
    console.log('\n1. 🔐 Testando CSRF token...')
    const csrfResponse = await fetch('http://localhost:3000/api/auth/csrf')
    console.log('   Status:', csrfResponse.status)
    
    if (csrfResponse.ok) {
      const csrfData = await csrfResponse.json()
      console.log('   ✅ CSRF token obtido:', csrfData.csrfToken ? 'Sim' : 'Não')
    } else {
      console.log('   ❌ Erro ao obter CSRF token')
      const errorText = await csrfResponse.text()
      console.log('   Erro:', errorText)
    }
    
    // 2. Testar endpoint de providers
    console.log('\n2. 🔧 Testando providers...')
    const providersResponse = await fetch('http://localhost:3000/api/auth/providers')
    console.log('   Status:', providersResponse.status)
    
    if (providersResponse.ok) {
      const providersData = await providersResponse.json()
      console.log('   ✅ Providers disponíveis:', Object.keys(providersData))
    } else {
      console.log('   ❌ Erro ao obter providers')
      const errorText = await providersResponse.text()
      console.log('   Erro:', errorText)
    }
    
    // 3. Testar endpoint de sessão (sem autenticação)
    console.log('\n3. 👤 Testando sessão (sem auth)...')
    const sessionResponse = await fetch('http://localhost:3000/api/auth/session')
    console.log('   Status:', sessionResponse.status)
    
    if (sessionResponse.ok) {
      const sessionData = await sessionResponse.json()
      console.log('   ✅ Resposta de sessão:', sessionData)
    } else {
      console.log('   ❌ Erro ao obter sessão')
      const errorText = await sessionResponse.text()
      console.log('   Erro:', errorText)
    }
    
    // 4. Testar login via API
    console.log('\n4. 🔑 Testando login via API...')
    
    // Primeiro, obter CSRF token para o login
    const csrfForLogin = await fetch('http://localhost:3000/api/auth/csrf')
    const { csrfToken } = await csrfForLogin.json()
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: 'colaborador@demo.com',
        password: 'colaborador123',
        csrfToken: csrfToken,
        callbackUrl: 'http://localhost:3000/colaborador',
        json: 'true'
      })
    })
    
    console.log('   Status do login:', loginResponse.status)
    console.log('   Headers do login:', Object.fromEntries(loginResponse.headers.entries()))
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      console.log('   ✅ Resposta do login:', loginData)
      
      // Extrair cookies de sessão
      const setCookieHeaders = loginResponse.headers.get('set-cookie')
      if (setCookieHeaders) {
        console.log('   🍪 Cookies definidos:', setCookieHeaders)
        
        // 5. Testar sessão com cookies
        console.log('\n5. 🔐 Testando sessão com cookies...')
        const sessionWithCookiesResponse = await fetch('http://localhost:3000/api/auth/session', {
          headers: {
            'Cookie': setCookieHeaders
          }
        })
        
        console.log('   Status da sessão autenticada:', sessionWithCookiesResponse.status)
        
        if (sessionWithCookiesResponse.ok) {
          const sessionWithCookiesData = await sessionWithCookiesResponse.json()
          console.log('   ✅ Sessão autenticada:', sessionWithCookiesData)
          
          if (sessionWithCookiesData.user) {
            console.log('   👤 Usuário logado:', sessionWithCookiesData.user.email)
            console.log('   🎯 Tipo de usuário:', sessionWithCookiesData.user.userType)
          }
        } else {
          console.log('   ❌ Erro na sessão autenticada')
          const errorText = await sessionWithCookiesResponse.text()
          console.log('   Erro:', errorText)
        }
      } else {
        console.log('   ⚠️  Nenhum cookie de sessão definido')
      }
    } else {
      console.log('   ❌ Erro no login')
      const errorText = await loginResponse.text()
      console.log('   Erro:', errorText)
    }
    
    console.log('\n🎉 TESTE DA API NEXTAUTH CONCLUÍDO!')
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message)
    console.error('Stack:', error.stack)
  }
}

// Executar teste
testNextAuthAPI()