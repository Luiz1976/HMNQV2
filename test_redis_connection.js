const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');

// Configuração do Redis baseada no .env
const redisConfig = {
  host: 'localhost',
  port: 6379,
  password: undefined,
  db: 0,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxLoadingTimeout: 1000,
};

async function testRedisConnection() {
  console.log('🔍 Testando conexão com Redis...');
  
  try {
    // Teste de conexão direta
    const redis = new Redis(redisConfig);
    const pong = await redis.ping();
    console.log('✅ Redis ping:', pong);
    
    // Teste do BullMQ Queue
    const testQueue = new Queue('test-queue', {
      connection: redisConfig,
    });
    
    console.log('✅ Queue criada com sucesso');
    
    // Adicionar um job de teste
    const job = await testQueue.add('test-job', { message: 'Hello Redis!' });
    console.log('✅ Job adicionado:', job.id);
    
    // Criar worker para processar o job
    const worker = new Worker('test-queue', async (job) => {
      console.log('🔄 Processando job:', job.data.message);
      return { status: 'completed', processedAt: new Date().toISOString() };
    }, {
      connection: redisConfig,
    });
    
    console.log('✅ Worker criado e ativo');
    
    // Aguardar processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificar status da queue
    const waiting = await testQueue.getWaiting();
    const completed = await testQueue.getCompleted();
    
    console.log('📊 Status da Queue:');
    console.log('  - Jobs aguardando:', waiting.length);
    console.log('  - Jobs completados:', completed.length);
    
    // Cleanup
    await worker.close();
    await testQueue.close();
    await redis.quit();
    
    console.log('🎉 Teste concluído com sucesso! Redis está funcionando.');
    
  } catch (error) {
    console.error('❌ Erro no teste Redis:', error.message);
    process.exit(1);
  }
}

testRedisConnection();