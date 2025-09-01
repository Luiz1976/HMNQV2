// Script para testar login via browser usando Puppeteer
const puppeteer = require('puppeteer')

async function testBrowserLogin() {
  let browser
  
  try {
    console.log('🚀 Iniciando teste de login via browser...')
    
    // Lançar browser
    browser = await puppeteer.launch({
      headless: false, // Mostrar o browser para debug
      defaultViewport: null,
      args: ['--start-maximized']
    })
    
    const page = await browser.newPage()
    
    // Interceptar erros de console
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Erro no console:', msg.text())
      }
    })
    
    // Interceptar erros de rede
    page.on('response', response => {
      if (response.status() >= 400) {
        console.log(`❌ Erro HTTP ${response.status()}: ${response.url()}`)
      }
    })
    
    console.log('🌐 Acessando página de login...')
    await page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle2' })
    
    // Aguardar o formulário de login aparecer
    await page.waitForSelector('input[name="email"]', { timeout: 10000 })
    console.log('✅ Página de login carregada')
    
    // Preencher credenciais
    console.log('📝 Preenchendo credenciais...')
    await page.type('input[name="email"]', 'colaborador@demo.com')
    await page.type('input[name="password"]', 'colaborador123')
    
    // Fazer login
    console.log('🔐 Fazendo login...')
    await page.click('button[type="submit"]')
    
    // Aguardar redirecionamento
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 })
    
    const currentUrl = page.url()
    console.log('📍 URL atual após login:', currentUrl)
    
    if (currentUrl.includes('/colaborador')) {
      console.log('✅ Login realizado com sucesso!')
      
      // Navegar para página de resultados
      console.log('📋 Acessando página de resultados...')
      await page.goto('http://localhost:3000/colaborador/resultados', { waitUntil: 'networkidle2' })
      
      // Aguardar a página carregar
      await page.waitForTimeout(3000)
      
      // Verificar se há resultados BOLIE na página
      const bolieResults = await page.evaluate(() => {
        const elements = document.querySelectorAll('*')
        const bolieElements = []
        
        elements.forEach(el => {
          if (el.textContent && (el.textContent.includes('BOLIE') || el.textContent.includes('Inteligência Emocional'))) {
            bolieElements.push({
              tag: el.tagName,
              text: el.textContent.substring(0, 100),
              className: el.className
            })
          }
        })
        
        return bolieElements
      })
      
      console.log('🎯 Elementos BOLIE encontrados na página:', bolieResults.length)
      
      if (bolieResults.length > 0) {
        console.log('✅ Resultados BOLIE estão sendo exibidos!')
        bolieResults.forEach((result, index) => {
          console.log(`  ${index + 1}. ${result.tag}: ${result.text}...`)
        })
      } else {
        console.log('❌ Nenhum resultado BOLIE encontrado na página')
        
        // Capturar screenshot para debug
        await page.screenshot({ path: 'debug_resultados.png', fullPage: true })
        console.log('📸 Screenshot salva como debug_resultados.png')
        
        // Verificar se há algum erro na página
        const pageContent = await page.content()
        if (pageContent.includes('erro') || pageContent.includes('error')) {
          console.log('⚠️  Possível erro detectado na página')
        }
        
        // Verificar se há indicação de carregamento
        const loadingElements = await page.evaluate(() => {
          const elements = document.querySelectorAll('*')
          const loadingElements = []
          
          elements.forEach(el => {
            if (el.textContent && (el.textContent.includes('Carregando') || el.textContent.includes('Loading'))) {
              loadingElements.push(el.textContent)
            }
          })
          
          return loadingElements
        })
        
        if (loadingElements.length > 0) {
          console.log('⏳ Elementos de carregamento encontrados:', loadingElements)
          console.log('💡 A página pode ainda estar carregando os dados')
        }
      }
      
      // Verificar se há contadores na página
      const counters = await page.evaluate(() => {
        const elements = document.querySelectorAll('*')
        const counterElements = []
        
        elements.forEach(el => {
          if (el.textContent && /\d+/.test(el.textContent) && el.textContent.length < 20) {
            counterElements.push(el.textContent.trim())
          }
        })
        
        return [...new Set(counterElements)].filter(text => text.match(/^\d+$/))
      })
      
      console.log('📊 Contadores encontrados na página:', counters)
      
      console.log('\n🎉 TESTE CONCLUÍDO!')
      console.log('✅ Login funcionando')
      console.log('✅ Página de resultados acessível')
      
      if (bolieResults.length > 0) {
        console.log('✅ Resultados BOLIE sendo exibidos corretamente')
      } else {
        console.log('⚠️  Resultados BOLIE não estão sendo exibidos - verifique a API ou componente')
      }
      
    } else {
      console.log('❌ Login falhou - redirecionado para:', currentUrl)
      
      // Capturar screenshot do erro
      await page.screenshot({ path: 'debug_login_error.png', fullPage: true })
      console.log('📸 Screenshot do erro salva como debug_login_error.png')
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message)
    
    if (browser) {
      try {
        const page = (await browser.pages())[0]
        if (page) {
          await page.screenshot({ path: 'debug_error.png', fullPage: true })
          console.log('📸 Screenshot do erro salva como debug_error.png')
        }
      } catch (screenshotError) {
        console.log('⚠️  Não foi possível capturar screenshot do erro')
      }
    }
  } finally {
    if (browser) {
      console.log('🔒 Fechando browser...')
      await browser.close()
    }
  }
}

// Verificar se Puppeteer está disponível
try {
  testBrowserLogin()
} catch (error) {
  console.log('❌ Puppeteer não está disponível. Instalando...')
  console.log('💡 Execute: npm install puppeteer')
  console.log('💡 Depois execute novamente: node test_browser_login.js')
}