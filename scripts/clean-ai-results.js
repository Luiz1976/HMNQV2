const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanAIResults() {
  console.log('🧹 Iniciando limpeza dos resultados e análises de IA do HumaniQ AI...');
  console.log('⚠️  ATENÇÃO: Esta operação irá remover APENAS os resultados de testes e análises de IA');
  console.log('✅ Usuários, empresas e estrutura dos testes serão preservados');
  
  try {
    // 1. Deletar análises de IA
    console.log('\n🤖 Removendo análises de IA...');
    const aiAnalysisCount = await prisma.aIAnalysis.count();
    await prisma.aIAnalysis.deleteMany({});
    console.log(`✅ ${aiAnalysisCount} análises de IA removidas`);
    
    // 2. Deletar respostas dos testes
    console.log('\n📝 Removendo respostas dos testes...');
    const answersCount = await prisma.answer.count();
    await prisma.answer.deleteMany({});
    console.log(`✅ ${answersCount} respostas removidas`);
    
    // 3. Deletar resultados de testes
    console.log('\n📊 Removendo resultados de testes...');
    const testResultsCount = await prisma.testResult.count();
    await prisma.testResult.deleteMany({});
    console.log(`✅ ${testResultsCount} resultados de testes removidos`);
    
    // 4. Deletar sessões de testes
    console.log('\n🎯 Removendo sessões de testes...');
    const testSessionsCount = await prisma.testSession.count();
    await prisma.testSession.deleteMany({});
    console.log(`✅ ${testSessionsCount} sessões de testes removidas`);
    
    // 5. Verificar estatísticas finais
    console.log('\n📊 Verificando limpeza...');
    const remainingAI = await prisma.aIAnalysis.count();
    const remainingAnswers = await prisma.answer.count();
    const remainingResults = await prisma.testResult.count();
    const remainingSessions = await prisma.testSession.count();
    
    console.log(`   Análises de IA restantes: ${remainingAI}`);
    console.log(`   Respostas restantes: ${remainingAnswers}`);
    console.log(`   Resultados restantes: ${remainingResults}`);
    console.log(`   Sessões restantes: ${remainingSessions}`);
    
    // 6. Verificar dados preservados
    console.log('\n📋 Verificando dados preservados...');
    const userCount = await prisma.user.count();
    const companyCount = await prisma.company.count();
    const testCount = await prisma.test.count();
    const questionCount = await prisma.question.count();
    const categoryCount = await prisma.testCategory.count();
    
    console.log(`   Usuários preservados: ${userCount}`);
    console.log(`   Empresas preservadas: ${companyCount}`);
    console.log(`   Testes preservados: ${testCount}`);
    console.log(`   Questões preservadas: ${questionCount}`);
    console.log(`   Categorias preservadas: ${categoryCount}`);
    
    if (remainingAI === 0 && remainingAnswers === 0 && remainingResults === 0 && remainingSessions === 0) {
      console.log('\n🎉 LIMPEZA DE RESULTADOS REALIZADA COM SUCESSO!');
      console.log('   ✅ Todas as análises de IA foram removidas');
      console.log('   ✅ Todos os resultados de testes foram removidos');
      console.log('   ✅ Todas as respostas foram removidas');
      console.log('   ✅ Todas as sessões de testes foram removidas');
      console.log('   ✅ Estrutura dos testes e usuários preservados');
    } else {
      console.log('\n⚠️  ATENÇÃO: Alguns dados podem não ter sido removidos completamente');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza dos resultados:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  cleanAIResults()
    .then(() => {
      console.log('\n✅ Script de limpeza de resultados executado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erro na execução do script:', error);
      process.exit(1);
    });
}

module.exports = { cleanAIResults };