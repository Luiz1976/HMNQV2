const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function compareUserTests() {
  try {
    console.log('🔍 Comparando testes do banco com a lista fornecida pelo usuário...')
    
    // Buscar todos os testes do banco
    const testsFromDB = await prisma.test.findMany({
      include: {
        category: true
      },
      orderBy: { name: 'asc' }
    })
    
    console.log(`\n📋 Testes encontrados no banco: ${testsFromDB.length}`)
    
    // Lista fornecida pelo usuário
    const userProvidedTests = [
      // 1. Testes Psicossociais
      'HumaniQ Insight – Clima Organizacional e Bem-Estar Psicológico',
      'HumaniQ COBE – Clima Organizacional e Bem-Estar Psicológico',
      'HumaniQ QVT – Qualidade de Vida no Trabalho',
      'HumaniQ Karasek-Siegrist – Teste Psicossocial Avançado',
      'HumaniQ RPO – Riscos Psicossociais Ocupacionais',
      'HumaniQ EO – Estresse Ocupacional, Burnout e Resiliência',
      'HumaniQ PAS – Percepção de Assédio Moral e Sexual',
      'HumaniQ MGRP – Maturidade em Gestão de Riscos Psicossociais',
      
      // 2. Testes de Perfil
      'HumaniQ QI – Quociente de Inteligência',
      'HumaniQ TAR – Teste de Atenção e Raciocínio',
      'HumaniQ TIPOS – Perfil Cognitivo (MBTI)',
      'HumaniQ Big Five – Cinco Grandes Fatores da Personalidade',
      'HumaniQ Eneagrama – Tipos de Personalidade',
      'HumaniQ Valores – Mapa de Valores Pessoais e Profissionais',
      'HumaniQ MOTIVA – Perfil de Motivação Profissional',
      'HumaniQ BOLIE – Inteligência Emocional',
      'HumaniQ FLEX – Avaliação de Adaptabilidade',
      
      // 3. Testes Corporativos
      'HumaniQ LIDERA – Estilos e Competências de Liderança',
      'HumaniQ TELA – Teste de Liderança Autêntica'
    ]
    
    console.log(`\n📊 Testes fornecidos pelo usuário: ${userProvidedTests.length}`)
    
    // Comparar nomes dos testes
    const dbTestNames = testsFromDB.map(t => t.name)
    
    console.log('\n🔍 Análise detalhada:')
    console.log('\n--- TESTES NO BANCO ---')
    testsFromDB.forEach(test => {
      console.log(`✅ ${test.name} (${test.category.name})`)
    })
    
    console.log('\n--- TESTES FORNECIDOS PELO USUÁRIO ---')
    userProvidedTests.forEach(testName => {
      const found = dbTestNames.some(dbName => {
        // Verificar correspondência exata ou similar
        return dbName === testName || 
               dbName.includes(testName.split(' –')[0]) || 
               testName.includes(dbName.split(' –')[0])
      })
      
      if (found) {
        console.log(`✅ ${testName} (ENCONTRADO)`)
      } else {
        console.log(`❌ ${testName} (NÃO ENCONTRADO)`)
      }
    })
    
    // Identificar testes faltando
    const missingTests = userProvidedTests.filter(userTest => {
      return !dbTestNames.some(dbName => {
        return dbName === userTest || 
               dbName.includes(userTest.split(' –')[0]) || 
               userTest.includes(dbName.split(' –')[0])
      })
    })
    
    // Identificar testes extras no banco
    const extraTests = dbTestNames.filter(dbTest => {
      return !userProvidedTests.some(userTest => {
        return dbTest === userTest || 
               dbTest.includes(userTest.split(' –')[0]) || 
               userTest.includes(dbTest.split(' –')[0])
      })
    })
    
    console.log('\n📈 RESUMO DA COMPARAÇÃO:')
    console.log(`Testes no banco: ${testsFromDB.length}`)
    console.log(`Testes fornecidos pelo usuário: ${userProvidedTests.length}`)
    console.log(`Testes faltando: ${missingTests.length}`)
    console.log(`Testes extras no banco: ${extraTests.length}`)
    
    if (missingTests.length > 0) {
      console.log('\n❌ TESTES FALTANDO NO BANCO:')
      missingTests.forEach(test => console.log(`  - ${test}`))
    }
    
    if (extraTests.length > 0) {
      console.log('\n➕ TESTES EXTRAS NO BANCO (não mencionados pelo usuário):')
      extraTests.forEach(test => console.log(`  - ${test}`))
    }
    
    if (missingTests.length === 0) {
      console.log('\n✅ Todos os testes fornecidos pelo usuário estão presentes no banco!')
      console.log('\n🔍 POSSÍVEL CAUSA DO PROBLEMA:')
      console.log('Se ainda aparecem dados fictícios na página, o problema pode estar:')
      console.log('1. Na renderização do componente frontend')
      console.log('2. Em dados mockados/hardcoded no código')
      console.log('3. Em cache do navegador')
      console.log('4. Na API não estar retornando os dados corretos')
    }
    
  } catch (error) {
    console.error('❌ Erro ao comparar testes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

compareUserTests()