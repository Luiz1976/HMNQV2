// Script para verificar especificamente o teste BOLIE
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkBolieTest() {
  try {
    console.log('🔍 Verificando teste BOLIE específico...')
    
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado')
      return
    }
    
    console.log('✅ Usuário encontrado:', user.email)
    
    // Buscar todos os resultados do usuário
    const allResults = await prisma.testResult.findMany({
      where: {
        userId: user.id
      },
      include: {
        test: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })
    
    console.log(`📊 Total de resultados: ${allResults.length}`)
    
    // Filtrar especificamente por BOLIE
    const bolieResults = allResults.filter(result => 
      result.test.name.toLowerCase().includes('bolie') ||
      result.test.name.toLowerCase().includes('inteligência emocional')
    )
    
    console.log(`🎯 Resultados BOLIE encontrados: ${bolieResults.length}`)
    
    if (bolieResults.length > 0) {
      bolieResults.forEach((result, index) => {
        console.log(`\n${index + 1}. TESTE BOLIE ENCONTRADO:`);
        console.log(`   - ID: ${result.id}`);
        console.log(`   - Nome: ${result.test.name}`);
        console.log(`   - Tipo: ${result.test.testType}`);
        console.log(`   - Completado em: ${result.completedAt}`);
        console.log(`   - Score: ${result.overallScore}`);
        console.log(`   - Categoria: ${result.test.category?.name || 'Sem categoria'}`);
        console.log(`   - Criado em: ${result.createdAt}`);
        console.log(`   - Atualizado em: ${result.updatedAt}`);
      });
    } else {
      console.log('❌ Nenhum teste BOLIE encontrado!');
    }
    
    // Verificar se há algum resultado muito recente
    console.log('\n🕐 Verificando resultados mais recentes...');
    const recentResults = allResults.slice(0, 3);
    recentResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result.test.name} - ${result.completedAt}`);
    });
    
    // Verificar se há algum teste BOLIE no banco de testes
    console.log('\n🧪 Verificando testes BOLIE disponíveis...');
    const bolieTests = await prisma.test.findMany({
      where: {
        OR: [
          { name: { contains: 'BOLIE', mode: 'insensitive' } },
          { name: { contains: 'Inteligência Emocional', mode: 'insensitive' } }
        ]
      },
      include: {
        category: true
      }
    });
    
    console.log(`🧪 Testes BOLIE no sistema: ${bolieTests.length}`);
    bolieTests.forEach((test, index) => {
      console.log(`   ${index + 1}. ID: ${test.id} - Nome: ${test.name}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBolieTest();