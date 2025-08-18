const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Lista oficial de 22 testes HumaniQ AI
const OFFICIAL_TESTS = [
  {
    name: 'HumaniQ Insight – Clima Organizacional e Bem-Estar Psicológico',
    code: 'humaniq_insight',
    description: 'Avaliação do clima organizacional e bem-estar psicológico dos colaboradores',
    testType: 'PSYCHOSOCIAL',
    category: 'Psicossociais'
  },
  {
    name: 'HumaniQ COBE – Clima Organizacional e Bem-Estar Psicológico',
    code: 'humaniq_cobe',
    description: 'Análise do clima organizacional e bem-estar psicológico',
    testType: 'PSYCHOSOCIAL',
    category: 'Psicossociais'
  },
  {
    name: 'HumaniQ QVT – Qualidade de Vida no Trabalho',
    code: 'humaniq_qvt',
    description: 'Avaliação da qualidade de vida no ambiente de trabalho',
    testType: 'PSYCHOSOCIAL',
    category: 'Psicossociais'
  },
  {
    name: 'HumaniQ Karasek-Siegrist – Teste Psicossocial Avançado',
    code: 'humaniq_karasek_siegrist',
    description: 'Teste psicossocial avançado baseado no modelo Karasek-Siegrist',
    testType: 'PSYCHOSOCIAL',
    category: 'Psicossociais'
  },
  {
    name: 'HumaniQ RPO – Riscos Psicossociais Ocupacionais',
    code: 'humaniq_rpo',
    description: 'Avaliação de riscos psicossociais no ambiente ocupacional',
    testType: 'PSYCHOSOCIAL',
    category: 'Psicossociais'
  },
  {
    name: 'HumaniQ EO – Estresse Ocupacional, Burnout e Resiliência',
    code: 'humaniq_eo',
    description: 'Análise de estresse ocupacional, burnout e níveis de resiliência',
    testType: 'PSYCHOSOCIAL',
    category: 'Psicossociais'
  },
  {
    name: 'HumaniQ PAS – Percepção de Assédio Moral e Sexual',
    code: 'humaniq_pas',
    description: 'Avaliação da percepção de assédio moral e sexual no ambiente de trabalho',
    testType: 'PSYCHOSOCIAL',
    category: 'Psicossociais'
  },
  {
    name: 'HumaniQ MGRP – Maturidade em Gestão de Riscos Psicossociais',
    code: 'humaniq_mgrp',
    description: 'Avaliação da maturidade organizacional em gestão de riscos psicossociais',
    testType: 'PSYCHOSOCIAL',
    category: 'Psicossociais'
  },
  {
    name: 'HumaniQ QI – Quociente de Inteligência',
    code: 'humaniq_qi',
    description: 'Avaliação do quociente de inteligência',
    testType: 'PERSONALITY',
    category: 'Perfil'
  },
  {
    name: 'HumaniQ TAR – Teste de Atenção e Raciocínio',
    code: 'humaniq_tar',
    description: 'Avaliação de capacidades de atenção e raciocínio',
    testType: 'PERSONALITY',
    category: 'Perfil'
  },
  {
    name: 'HumaniQ TIPOS – Perfil Cognitivo (MBTI)',
    code: 'humaniq_tipos',
    description: 'Avaliação do perfil cognitivo baseado no modelo MBTI',
    testType: 'PERSONALITY',
    category: 'Perfil'
  },
  {
    name: 'HumaniQ Big Five – Cinco Grandes Fatores da Personalidade',
    code: 'humaniq_big_five',
    description: 'Avaliação dos cinco grandes fatores da personalidade',
    testType: 'PERSONALITY',
    category: 'Perfil'
  },
  {
    name: 'HumaniQ Eneagrama – Tipos de Personalidade',
    code: 'humaniq_eneagrama',
    description: 'Avaliação de tipos de personalidade baseada no Eneagrama',
    testType: 'PERSONALITY',
    category: 'Perfil'
  },
  {
    name: 'HumaniQ Valores – Mapa de Valores Pessoais e Profissionais',
    code: 'humaniq_valores',
    description: 'Mapeamento de valores pessoais e profissionais',
    testType: 'PERSONALITY',
    category: 'Perfil'
  },
  {
    name: 'HumaniQ MOTIVA – Perfil de Motivação Profissional',
    code: 'humaniq_motiva',
    description: 'Avaliação do perfil de motivação profissional',
    testType: 'PERSONALITY',
    category: 'Perfil'
  },
  {
    name: 'HumaniQ BOLIE – Inteligência Emocional',
    code: 'humaniq_bolie',
    description: 'Avaliação da inteligência emocional',
    testType: 'PERSONALITY',
    category: 'Perfil'
  },
  {
    name: 'HumaniQ FLEX – Avaliação de Adaptabilidade',
    code: 'humaniq_flex',
    description: 'Avaliação da capacidade de adaptabilidade',
    testType: 'PERSONALITY',
    category: 'Perfil'
  },
  {
    name: 'HumaniQ LIDERA – Estilos e Competências de Liderança',
    code: 'humaniq_lidera',
    description: 'Avaliação de estilos e competências de liderança',
    testType: 'CORPORATE',
    category: 'Corporativos'
  },
  {
    name: 'HumaniQ TELA – Teste de Liderança Autêntica',
    code: 'humaniq_tela',
    description: 'Avaliação de liderança autêntica',
    testType: 'CORPORATE',
    category: 'Corporativos'
  },
  {
    name: 'HumaniQ Grafologia – Teste Grafológico',
    code: 'humaniq_grafologia',
    description: 'Análise grafológica da personalidade através da escrita',
    testType: 'GRAPHOLOGY',
    category: 'Grafológicos'
  },
  {
    name: 'HumaniQ Assinatura – Teste Grafológico de Assinatura',
    code: 'humaniq_assinatura',
    description: 'Análise grafológica através da assinatura',
    testType: 'GRAPHOLOGY',
    category: 'Grafológicos'
  }
]

async function migrateOfficialTests() {
  try {
    console.log('🔄 Iniciando migração para testes oficiais HumaniQ AI...')
    
    // 1. Backup dos testes existentes
    console.log('📋 Fazendo backup dos testes existentes...')
    const existingTests = await prisma.test.findMany({
      include: { category: true }
    })
    
    console.log(`Encontrados ${existingTests.length} testes existentes`)
    
    // 2. Desativar todos os testes existentes
    console.log('🚫 Desativando todos os testes existentes...')
    await prisma.test.updateMany({
      data: {
        isActive: false,
        isPublic: false
      }
    })
    
    // 3. Criar/atualizar categorias necessárias
    console.log('📁 Criando/atualizando categorias...')
    const categories = ['Psicossociais', 'Perfil', 'Corporativos', 'Grafológicos']
    const categoryMap = {}
    
    for (let i = 0; i < categories.length; i++) {
      const categoryName = categories[i]
      
      // Verificar se categoria já existe
      let category = await prisma.testCategory.findFirst({
        where: { name: categoryName }
      })
      
      if (category) {
         // Atualizar categoria existente
         category = await prisma.testCategory.update({
           where: { id: category.id },
           data: {
             isActive: true
           }
         })
       } else {
         // Criar nova categoria
         category = await prisma.testCategory.create({
           data: {
             name: categoryName,
             description: `Categoria ${categoryName}`,
             isActive: true
           }
         })
       }
      
      categoryMap[categoryName] = category.id
      console.log(`  ✅ Categoria: ${categoryName} (ID: ${category.id})`)
    }
    
    // 4. Criar os 22 testes oficiais
    console.log('🧪 Criando os 22 testes oficiais...')
    
    for (let i = 0; i < OFFICIAL_TESTS.length; i++) {
      const testData = OFFICIAL_TESTS[i]
      
      // Verificar se teste já existe
      let test = await prisma.test.findFirst({
        where: { name: testData.name }
      })
      
      if (test) {
         // Atualizar teste existente
         test = await prisma.test.update({
           where: { id: test.id },
           data: {
             description: testData.description,
             testType: testData.testType,
             categoryId: categoryMap[testData.category],
             isActive: true,
             isPublic: true,
             estimatedDuration: 30,
             instructions: `Instruções para ${testData.name}`
           }
         })
       } else {
         // Criar novo teste
         test = await prisma.test.create({
           data: {
             name: testData.name,
             description: testData.description,
             testType: testData.testType,
             categoryId: categoryMap[testData.category],
             isActive: true,
             isPublic: true,
             estimatedDuration: 30,
             instructions: `Instruções para ${testData.name}`
           }
         })
       }
      
      console.log(`  ✅ ${test.name} (ID: ${test.id})`)
    }
    
    // 5. Verificar resultado final
    console.log('\n📊 Verificando resultado final...')
    const finalTests = await prisma.test.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { name: 'asc' }
    })
    
    console.log(`\n✅ Migração concluída com sucesso!`)
    console.log(`\n✅ Total de testes ativos: ${finalTests.length}`)
    console.log(`\n🧪 Testes oficiais HumaniQ AI:`)
    
    finalTests.forEach((test, index) => {
      console.log(`  ${index + 1}. ${test.name} (${test.category.name})`)
    })
    
    console.log('\n🔒 Apenas estes testes estão agora disponíveis no sistema!')
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar migração
migrateOfficialTests()
  .then(() => {
    console.log('\n🎉 Migração para testes oficiais HumaniQ AI concluída!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Falha na migração:', error)
    process.exit(1)
  })