
// Simple auth test for HumaniQ AI
const https = require('https');
const http = require('http');

async function testAuth() {
  console.log('🔍 Testing HumaniQ AI Authentication...');
  
  // Test the main page first
  const testEndpoint = (url, description) => {
    return new Promise((resolve) => {
      const req = http.get(url, (res) => {
        console.log(`${description}: Status ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log('✅ Endpoint accessible');
        } else {
          console.log('❌ Endpoint issue');
        }
        resolve(res.statusCode);
      });
      
      req.on('error', (err) => {
        console.log(`❌ ${description} failed:`, err.message);
        resolve(500);
      });
      
      req.setTimeout(5000, () => {
        console.log(`⏰ ${description} timeout`);
        req.destroy();
        resolve(408);
      });
    });
  };
  
  await testEndpoint('http://localhost:3000', 'Main page');
  await testEndpoint('http://localhost:3000/auth/login', 'Login page');
  await testEndpoint('http://localhost:3000/api/auth/providers', 'Auth providers');
  
  console.log('✅ Basic endpoint tests completed');
}

testAuth();
