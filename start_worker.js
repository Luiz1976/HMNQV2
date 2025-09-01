// Script para iniciar o worker do BullMQ com Redis ativo
const { testResultWorker } = require('./app/lib/queue/testResultQueue');

console.log('🚀 Iniciando worker do BullMQ...');
console.log('📡 Redis deve estar rodando na porta 6379');

// O worker já está configurado no testResultQueue.ts
// Vamos apenas verificar se está funcionando
testResultWorker.on('ready', () => {
  console.log('✅ Worker está pronto e conectado ao Redis!');
});

testResultWorker.on('error', (error) => {
  console.error('❌ Erro no worker:', error.message);
});

testResultWorker.on('completed', (job) => {
  console.log('✅ Job completado:', job.id, job.returnvalue);
});

testResultWorker.on('failed', (job, err) => {
  console.error('❌ Job falhou:', job?.id, err.message);
});

console.log('🔄 Worker iniciado. Aguardando jobs...');
console.log('💡 Pressione Ctrl+C para parar');

// Manter o processo ativo
process.on('SIGINT', async () => {
  console.log('\n🛑 Parando worker...');
  await testResultWorker.close();
  process.exit(0);
});