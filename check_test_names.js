const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkTestNames() {
  try {
    console.log('🔍 Verificando nomes dos testes no banco de dados...')
    
    const tests = await prisma.test.findMany({
      select: {
        id: true,
        name: true,
        description: true
      }
    })
    
    console.log('\n📋 Testes encontrados:')
    tests.forEach((test, index) => {
      console.log(`${index + 1}. Nome: "${test.name}"`)
      console.log(`   ID: ${test.id}`)
      console.log(`   Descrição: ${test.description || 'N/A'}`)
      console.log('')
    })
    
    console.log(`\n✅ Total de ${tests.length} testes encontrados`)
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTestNames()