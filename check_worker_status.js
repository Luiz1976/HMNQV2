const { Queue } = require('bullmq');
const Redis = require('ioredis');

async function checkWorkerStatus() {
  try {
    console.log('🔍 Verificando status do worker e fila de processamento...');
    
    // Tentar conectar ao Redis
    const redis = new Redis({
      host: 'localhost',
      port: 6379,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    });
    
    console.log('\n📡 Testando conexão Redis...');
    await redis.ping();
    console.log('✅ Redis conectado com sucesso!');
    
    // Criar instância da fila
    const testResultQueue = new Queue('test-results', {
      connection: redis
    });
    
    console.log('\n📊 Status da fila de resultados de teste:');
    
    // Verificar jobs na fila
    const waiting = await testResultQueue.getWaiting();
    const active = await testResultQueue.getActive();
    const completed = await testResultQueue.getCompleted();
    const failed = await testResultQueue.getFailed();
    
    console.log(`   Aguardando: ${waiting.length} jobs`);
    console.log(`   Ativo: ${active.length} jobs`);
    console.log(`   Completados: ${completed.length} jobs`);
    console.log(`   Falharam: ${failed.length} jobs`);
    
    // Mostrar jobs ativos se houver
    if (active.length > 0) {
      console.log('\n🔄 JOBS ATIVOS:');
      active.forEach((job, index) => {
        console.log(`   ${index + 1}. Job ID: ${job.id}`);
        console.log(`      Tipo: ${job.data.type}`);
        console.log(`      Criado: ${new Date(job.timestamp).toLocaleString('pt-BR')}`);
      });
    }
    
    // Mostrar jobs aguardando se houver
    if (waiting.length > 0) {
      console.log('\n⏳ JOBS AGUARDANDO:');
      waiting.forEach((job, index) => {
        console.log(`   ${index + 1}. Job ID: ${job.id}`);
        console.log(`      Tipo: ${job.data.type}`);
        console.log(`      Criado: ${new Date(job.timestamp).toLocaleString('pt-BR')}`);
      });
    }
    
    // Mostrar jobs recentes que falharam
    if (failed.length > 0) {
      console.log('\n❌ JOBS QUE FALHARAM (últimos 5):');
      const recentFailed = failed.slice(-5);
      recentFailed.forEach((job, index) => {
        console.log(`   ${index + 1}. Job ID: ${job.id}`);
        console.log(`      Tipo: ${job.data.type}`);
        console.log(`      Erro: ${job.failedReason}`);
        console.log(`      Falhou em: ${new Date(job.processedOn).toLocaleString('pt-BR')}`);
      });
    }
    
    // Verificar se há workers conectados
    const workers = await redis.smembers('bull:test-results:workers');
    console.log(`\n👷 Workers conectados: ${workers.length}`);
    if (workers.length > 0) {
      workers.forEach((worker, index) => {
        console.log(`   ${index + 1}. ${worker}`);
      });
    } else {
      console.log('⚠️  Nenhum worker ativo encontrado!');
    }
    
    await redis.disconnect();
    
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 DIAGNÓSTICO:');
      console.log('   - Redis não está rodando ou não está acessível');
      console.log('   - Verifique se o Redis está instalado e rodando na porta 6379');
      console.log('   - O processamento em segundo plano pode não estar funcionando');
    }
  }
}

checkWorkerStatus();