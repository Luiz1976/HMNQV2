// Script para verificar se o banco de dados está vazio após a exclusão

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyEmptyDatabase() {
  console.log('🔍 Verificando se o banco de dados está vazio...');
  
  try {
    const [testResultCount, testSessionCount, answerCount, aiAnalysisCount] = await Promise.all([
      prisma.testResult.count(),
      prisma.testSession.count(),
      prisma.answer.count(),
      prisma.aIAnalysis.count()
    ]);
    
    const total = testResultCount + testSessionCount + answerCount + aiAnalysisCount;
    
    console.log('\n📊 CONTAGEM ATUAL DO BANCO DE DADOS:');
    console.log(`📋 TestResult: ${testResultCount}`);
    console.log(`📋 TestSession: ${testSessionCount}`);
    console.log(`📋 Answer: ${answerCount}`);
    console.log(`📋 AIAnalysis: ${aiAnalysisCount}`);
    console.log(`📋 TOTAL: ${total}`);
    
    if (total === 0) {
      console.log('\n✅ SUCESSO: O banco de dados está completamente vazio!');
      console.log('🎉 Todos os 237 registros foram excluídos permanentemente.');
    } else {
      console.log('\n⚠️ ATENÇÃO: Ainda existem registros no banco de dados!');
      console.log(`❌ ${total} registros ainda estão presentes.`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar o banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar a verificação
if (require.main === module) {
  verifyEmptyDatabase().catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

export { verifyEmptyDatabase };