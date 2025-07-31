// Script para testar login e verificar o sidebar
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--allow-running-insecure-content'
    ]
  });
  
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/auth/login');
  
  // Preencher campos de login
  await page.type('input[type="email"]', 'admin@humaniq.ai');
  await page.type('input[type="password"]', 'admin123');
  
  // Clicar no botão de login
  await page.click('button[type="submit"]');
  
  // Aguardar redirecionamento para dashboard
  await page.waitForNavigation();
  
  console.log('Login realizado com sucesso!');
  console.log('URL atual:', page.url());
  
  // Aguardar um pouco para visualizar o dashboard
  await page.waitForTimeout(5000);
  
  await browser.close();
})();
