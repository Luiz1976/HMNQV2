const fetch = require('node-fetch').default || require('node-fetch');

async function testSessionDirect() {
  console.log('🔍 Testing NextAuth session API directly...');
  
  try {
    // Test direct access to session API
    const response = await fetch('http://localhost:3000/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('📊 Session API Response:');
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    // Try to parse as JSON
    try {
      const jsonData = JSON.parse(responseText);
      console.log('✅ Valid JSON response:', jsonData);
    } catch (e) {
      console.log('❌ Not valid JSON, response is HTML or other format');
    }
    
  } catch (error) {
    console.error('❌ Error testing session API:', error.message);
  }
}

// Test CSRF token endpoint
async function testCSRF() {
  console.log('\n🔍 Testing CSRF token...');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/csrf', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 CSRF Response:');
    console.log('Status:', response.status);
    
    const responseText = await response.text();
    console.log('Response:', responseText);
    
  } catch (error) {
    console.error('❌ Error testing CSRF:', error.message);
  }
}

// Test providers endpoint
async function testProviders() {
  console.log('\n🔍 Testing providers...');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/providers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Providers Response:');
    console.log('Status:', response.status);
    
    const responseText = await response.text();
    console.log('Response:', responseText);
    
  } catch (error) {
    console.error('❌ Error testing providers:', error.message);
  }
}

async function runTests() {
  await testSessionDirect();
  await testCSRF();
  await testProviders();
}

runTests();