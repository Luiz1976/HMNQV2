const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixOfficialTests() {
  console.log('🔧 Corrigindo lista de testes oficiais...');
  console.log('=' .repeat(60));
  
  try {
    // 1. Buscar todos os testes de perfil no banco
    console.log('📋 1. Verificando testes de perfil no banco:');
    
    const testsPerfil = await prisma.test.findMany({
      where: {
        isActive: true,
        category: {
          name: 'Testes de Perfil'
        }
      },
      include: {
        category: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    console.log(`Encontrados ${testsPerfil.length} testes de perfil:`);
    testsPerfil.forEach((test, index) => {
      console.log(`   ${index + 1}. "${test.name}"`);
    });
    
    console.log('\n' + '=' .repeat(60));
    console.log('🎯 2. Lista oficial atual no código:');
    
    const currentOfficialTests = [
      'HumaniQ QI',
      'HumaniQ TAR', 
      'HumaniQ TIPOS',
      'HumaniQ Big Five',
      'HumaniQ Eneagrama',
      'HumaniQ Valores',
      'HumaniQ MOTIVA',
      'HumaniQ BOLIE',
      'HumaniQ FLEX'
    ];
    
    currentOfficialTests.forEach((test, index) => {
      console.log(`   ${index + 1}. "${test}"`);
    });
    
    console.log('\n' + '=' .repeat(60));
    console.log('🔍 3. Comparando nomes:');
    
    const testesNoBanco = testsPerfil.map(t => t.name);
    const testesNaLista = currentOfficialTests;
    
    console.log('\n📊 ANÁLISE:');
    
    // Verificar quais testes do banco não estão na lista oficial
    const faltandoNaLista = testesNoBanco.filter(testeBanco => {
      return !testesNaLista.some(testeLista => 
        testeBanco.toLowerCase().includes(testeLista.toLowerCase()) ||
        testeLista.toLowerCase().includes(testeBanco.toLowerCase())
      );
    });
    
    if (faltandoNaLista.length > 0) {
      console.log('\n❌ TESTES NO BANCO QUE NÃO ESTÃO NA LISTA OFICIAL:');
      faltandoNaLista.forEach(teste => {
        console.log(`   - "${teste}"`);
      });
    }
    
    // Verificar quais testes da lista não estão no banco
    const faltandoNoBanco = testesNaLista.filter(testeLista => {
      return !testesNoBanco.some(testeBanco => 
        testeBanco.toLowerCase().includes(testeLista.toLowerCase()) ||
        testeLista.toLowerCase().includes(testeBanco.toLowerCase())
      );
    });
    
    if (faltandoNoBanco.length > 0) {
      console.log('\n❌ TESTES NA LISTA OFICIAL QUE NÃO ESTÃO NO BANCO:');
      faltandoNoBanco.forEach(teste => {
        console.log(`   - "${teste}"`);
      });
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('💡 SOLUÇÃO RECOMENDADA:');
    
    if (faltandoNaLista.length > 0) {
      console.log('\n🔧 Atualizar a lista OFFICIAL_TESTS em lib/test-validation.ts:');
      console.log('\nSubstituir a seção "Testes de Perfil" por:');
      console.log('  // Testes de Perfil (10 testes)');
      testesNoBanco.forEach(teste => {
        // Extrair apenas a parte principal do nome (antes do "–")
        const nomeSimples = teste.split(' –')[0].trim();
        console.log(`  '${nomeSimples}',`);
      });
    }
    
    if (faltandoNoBanco.length > 0) {
      console.log('\n🔧 Ou criar os testes faltantes no banco de dados.');
    }
    
    if (faltandoNaLista.length === 0 && faltandoNoBanco.length === 0) {
      console.log('✅ Todos os testes estão sincronizados!');
    }
    
  } catch (error) {
    console.error('💥 Erro ao analisar testes:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar a análise
fixOfficialTests().then(() => {
  console.log('\n🏁 Análise concluída!');
}).catch(error => {
  console.error('💥 Erro fatal:', error);
});