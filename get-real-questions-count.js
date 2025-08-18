const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function getRealQuestionsCount() {
  try {
    console.log('🔍 Buscando números reais de questões por teste...')
    
    // Buscar todos os testes com suas categorias e contar questões
    const tests = await prisma.test.findMany({
      include: {
        category: true,
        _count: {
          select: {
            questions: true
          }
        }
      },
      where: {
        isActive: true
      },
      orderBy: [
        { category: { name: 'asc' } },
        { name: 'asc' }
      ]
    })

    console.log('\n📊 NÚMEROS REAIS DE QUESTÕES POR TESTE:')
    console.log('=' .repeat(80))
    
    const testsByCategory = {}
    
    tests.forEach(test => {
      const categoryName = test.category.name
      if (!testsByCategory[categoryName]) {
        testsByCategory[categoryName] = []
      }
      
      testsByCategory[categoryName].push({
        id: test.id,
        name: test.name,
        questionsCount: test._count.questions,
        estimatedDuration: test.estimatedDuration
      })
    })
    
    // Exibir por categoria
    Object.keys(testsByCategory).forEach(categoryName => {
      console.log(`\n🏷️  ${categoryName.toUpperCase()}`)
      console.log('-'.repeat(50))
      
      testsByCategory[categoryName].forEach(test => {
        console.log(`📝 ${test.name}`)
        console.log(`   ID: ${test.id}`)
        console.log(`   Questões: ${test.questionsCount}`)
        console.log(`   Duração estimada: ${test.estimatedDuration} min`)
        console.log()
      })
    })
    
    // Gerar objeto JavaScript para usar no código
    console.log('\n🔧 OBJETO JAVASCRIPT PARA USO NO CÓDIGO:')
    console.log('=' .repeat(80))
    console.log('const REAL_QUESTIONS_COUNT = {')
    
    Object.keys(testsByCategory).forEach(categoryName => {
      console.log(`  // ${categoryName}`)
      testsByCategory[categoryName].forEach(test => {
        // Extrair ID mais simples do nome do teste
        let simpleId = test.name.toLowerCase()
          .replace(/humaniq\s*/i, 'humaniq-')
          .replace(/[–—-].*$/, '') // Remove tudo após o traço
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
        
        console.log(`  '${simpleId}': ${test.questionsCount}, // ${test.name}`)
      })
      console.log()
    })
    
    console.log('}')
    
    return testsByCategory
    
  } catch (error) {
    console.error('❌ Erro ao buscar questões:', error)
  } finally {
    await prisma.$disconnect()
  }
}

getRealQuestionsCount()