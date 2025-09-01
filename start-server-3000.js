const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando servidor Next.js na porta 3000...');
console.log('📁 Diretório:', process.cwd());

// Verificar se estamos no diretório correto
const packageJsonPath = path.join(process.cwd(), 'package.json');
try {
  const packageJson = require(packageJsonPath);
  console.log('✅ package.json encontrado:', packageJson.name);
} catch (error) {
  console.error('❌ Erro ao ler package.json:', error.message);
  process.exit(1);
}

// Iniciar o servidor Next.js
const server = spawn('npx', ['next', 'dev', '-p', '3000'], {
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('❌ Erro ao iniciar servidor:', error.message);
  process.exit(1);
});

server.on('exit', (code, signal) => {
  if (code !== 0) {
    console.error(`❌ Servidor encerrado com código ${code}`);
    if (signal) {
      console.error(`📡 Sinal recebido: ${signal}`);
    }
  } else {
    console.log('✅ Servidor encerrado normalmente');
  }
});

// Capturar sinais para encerramento gracioso
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Encerrando servidor...');
  server.kill('SIGTERM');
});

console.log('🌐 Servidor deve estar disponível em: http://localhost:3000');
console.log('⏹️  Pressione Ctrl+C para parar o servidor');