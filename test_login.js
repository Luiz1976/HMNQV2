
// Test script for HumaniQ AI login
const puppeteer = require('puppeteer');

async function testLogin() {
  try {
    const browser = await puppeteer.launch({ 
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const page = await browser.newPage();
    
    console.log('🔍 Testing HumaniQ AI Login...');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/auth/login');
    await page.waitForSelector('input[type="email"]');
    
    // Test Admin Login
    console.log('👑 Testing Admin Login...');
    await page.type('input[type="email"]', 'admin@humaniq.ai');
    await page.type('input[type="password"]', 'admin123');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);
    
    if (currentUrl.includes('/admin') || currentUrl.includes('/dashboard')) {
      console.log('✅ Admin login successful!');
    } else {
      console.log('❌ Admin login failed. Current URL:', currentUrl);
    }
    
    await browser.close();
    
  } catch (error) {
    console.error('❌ Login test failed:', error);
  }
}

testLogin();
