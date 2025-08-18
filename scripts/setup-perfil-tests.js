const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Lista dos 9 testes específicos para a categoria "Testes de Perfil"
const PERFIL_TESTS = [
  {
    name: 'HumaniQ QI – Quociente de Inteligência',
    description: 'Avaliação das capacidades cognitivas e intelectuais através de testes de raciocínio lógico, verbal e numérico.',
    testType: 'PERSONALITY',
    category: 'Testes de Perfil'
  },
  {
    name: 'HumaniQ TAR – Teste de Atenção e Raciocínio',
    description: 'Avaliação da capacidade de atenção sustentada, concentração e raciocínio lógico.',
    testType: 'PERSONALITY',
    category: 'Testes de Perfil'
  },
  {
    name: 'HumaniQ TIPOS – Perfil Cognitivo (MBTI)',
    description: 'Identificação do tipo de personalidade baseado nas preferências cognitivas (Myers-Briggs Type Indicator).',
    testType: 'PERSONALITY',
    category: 'Testes de Perfil'
  },
  {
    name: 'HumaniQ Big Five – Cinco Grandes Fatores da Personalidade',
    description: 'Avaliação dos cinco principais fatores de personalidade: Abertura, Conscienciosidade, Extroversão, Amabilidade e Neuroticismo.',
    testType: 'PERSONALITY',
    category: 'Testes de Perfil'
  },
  {
    name: 'HumaniQ Eneagrama – Tipos de Personalidade',
    description: 'Identificação do tipo de personalidade baseado no sistema Eneagrama, revelando motivações e padrões comportamentais.',
    testType: 'PERSONALITY',
    category: 'Testes de Perfil'
  },
  {
    name: 'HumaniQ Valores – Mapa de Valores Pessoais e Profissionais',
    description: 'Mapeamento dos valores fundamentais que orientam decisões e comportamentos no ambiente pessoal e profissional.',
    testType: 'PERSONALITY',
    category: 'Testes de Perfil'
  },
  {
    name: 'HumaniQ MOTIVA – Perfil de Motivação Profissional',
    description: 'Análise dos fatores motivacionais que impulsionam o desempenho e engajamento profissional.',
    testType: 'PERSONALITY',
    category: 'Testes de Perfil'
  },
  {
    name: 'HumaniQ BOLIE – Inteligência Emocional',
    description: 'Avaliação das competências de inteligência emocional: autoconsciência, autorregulação, motivação, empatia e habilidades sociais.',
    testType: 'PERSONALITY',
    category: 'Testes de Perfil'
  },
  {
    name: 'HumaniQ FLEX – Avaliação de Adaptabilidade',
    description: 'Medição da capacidade de adaptação a mudanças, flexibilidade cognitiva e resiliência em diferentes contextos.',
    testType: 'PERSONALITY',
    category: 'Testes de Perfil'
  }
]

async function setupPerfilTests() {
  try {
    console.log('🔧 Configurando os 9 testes da categoria "Testes de Perfil"...')
    
    // Verificar se a categoria existe
    let perfilCategory = await prisma.testCategory.findFirst({
      where: { name: 'Testes de Perfil' }
    })
    
    if (!perfilCategory) {
      console.log('📋 Criando categoria "Testes de Perfil"...')
      perfilCategory = await prisma.testCategory.create({
        data: {
          name: 'Testes de Perfil',
          description: 'Avaliações de personalidade, inteligência e competências comportamentais',
          sortOrder: 2
        }
      })
    }
    
    console.log(`✅ Categoria encontrada/criada: ${perfilCategory.name} (ID: ${perfilCategory.id})`)
    
    // Verificar quais testes já existem
    const existingTests = await prisma.test.findMany({
      where: {
        categoryId: perfilCategory.id
      }
    })
    
    console.log(`\n📊 Testes existentes na categoria: ${existingTests.length}`)
    existingTests.forEach(test => {
      console.log(`  - ${test.name}`)
    })
    
    // Adicionar/atualizar cada teste
    let addedCount = 0
    let updatedCount = 0
    
    for (const testData of PERFIL_TESTS) {
      const existingTest = await prisma.test.findFirst({
        where: {
          name: testData.name
        }
      })
      
      if (existingTest) {
        // Atualizar teste existente
        await prisma.test.update({
          where: { id: existingTest.id },
          data: {
            name: testData.name,
            description: testData.description,
            testType: testData.testType,
            categoryId: perfilCategory.id,
            isActive: true,
            isPublic: true
          }
        })
        console.log(`🔄 Atualizado: ${testData.name}`)
        updatedCount++
      } else {
        // Criar novo teste
        await prisma.test.create({
          data: {
            name: testData.name,
            description: testData.description,
            testType: testData.testType,
            categoryId: perfilCategory.id,
            isActive: true,
            isPublic: true
          }
        })
        console.log(`➕ Adicionado: ${testData.name}`)
        addedCount++
      }
    }
    
    // Verificar resultado final
    const finalTests = await prisma.test.findMany({
      where: {
        categoryId: perfilCategory.id,
        isActive: true
      },
      orderBy: { name: 'asc' }
    })
    
    console.log(`\n✅ Configuração concluída!`)
    console.log(`📊 Resumo:`)
    console.log(`  - Testes adicionados: ${addedCount}`)
    console.log(`  - Testes atualizados: ${updatedCount}`)
    console.log(`  - Total de testes ativos na categoria: ${finalTests.length}`)
    
    console.log(`\n📋 Testes na categoria "Testes de Perfil":`)
    finalTests.forEach((test, index) => {
      console.log(`  ${index + 1}. ${test.name}`)
    })
    
    // Verificar se todos os 9 testes solicitados estão presentes
    const requiredTestNames = PERFIL_TESTS.map(t => t.name)
    const finalTestNames = finalTests.map(t => t.name)
    const missingTests = requiredTestNames.filter(name => !finalTestNames.includes(name))
    
    if (missingTests.length === 0) {
      console.log(`\n🎉 SUCESSO! Todos os 9 testes solicitados estão cadastrados e ativos na categoria "Testes de Perfil"!`)
    } else {
      console.log(`\n⚠️ Atenção! Testes ainda faltando:`)
      missingTests.forEach(name => {
        console.log(`  - ${name}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Erro ao configurar testes de perfil:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupPerfilTests()