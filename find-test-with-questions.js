const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findTestWithQuestions() {
  try {
    const tests = await prisma.test.findMany({
      include: {
        questions: true
      }
    });
    
    console.log('Procurando teste com perguntas...');
    
    const testWithQuestions = tests.find(t => t.questions.length > 0);
    
    if (testWithQuestions) {
      console.log('\n✅ TESTE COM PERGUNTAS ENCONTRADO:');
      console.log('Nome:', testWithQuestions.name);
      console.log('ID:', testWithQuestions.id);
      console.log('Quantidade de perguntas:', testWithQuestions.questions.length);
      console.log('\nPrimeiras 5 perguntas:');
      testWithQuestions.questions.slice(0, 5).forEach((q, i) => {
        console.log(`${i+1}. ${q.questionText}`);
      });
    } else {
      console.log('❌ Nenhum teste com perguntas encontrado');
    }
    
    // Verificar total de perguntas no banco
    const totalQuestions = await prisma.question.count();
    console.log(`\n📊 Total de perguntas no banco: ${totalQuestions}`);
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findTestWithQuestions();