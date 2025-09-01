const { spawn } = require('child_process');

console.log('Iniciando servidor Next.js na porta 3001...');

const server = spawn('npx', ['next', 'dev', '-p', '3001'], {
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('Erro ao iniciar o servidor:', error);
});

server.on('close', (code) => {
  console.log(`Servidor encerrado com código: ${code}`);
});

process.on('SIGINT', () => {
  console.log('\nEncerrando servidor...');
  server.kill();
  process.exit();
});