// Script para verificar as questões do teste BOLIE
// Este script verifica se existem questões cadastradas no banco de dados

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkBolieQuestions() {
  console.log('🔍 VERIFICANDO QUESTÕES DO TESTE BOLIE')
  console.log('='.repeat(50))
  
  try {
    // 1. Buscar o teste BOLIE
    console.log('\n1. 🔍 Buscando teste BOLIE...')
    const bolieTest = await prisma.test.findFirst({
      where: {
        OR: [
          { name: { contains: 'BOLIE' } },
          { description: { contains: 'BOLIE' } },
          { id: 'cmehdpsox000o8wc0yuai0swa' }
        ]
      },
      include: {
        questions: {
          orderBy: {
            questionNumber: 'asc'
          }
        }
      }
    })
    
    if (!bolieTest) {
      console.log('❌ Teste BOLIE não encontrado!')
      return
    }
    
    console.log('✅ Teste BOLIE encontrado:', {
      id: bolieTest.id,
      name: bolieTest.name,
      isActive: bolieTest.isActive,
      questionsCount: bolieTest.questions?.length || 0
    })
    
    // 2. Verificar questões
    console.log('\n2. 📋 Verificando questões cadastradas...')
    
    if (!bolieTest.questions || bolieTest.questions.length === 0) {
      console.log('❌ PROBLEMA ENCONTRADO: Nenhuma questão cadastrada para o teste BOLIE!')
      console.log('\n🔧 SOLUÇÃO NECESSÁRIA:')
      console.log('   • O teste BOLIE precisa ter questões cadastradas na tabela Question')
      console.log('   • Cada questão deve ter um ID único (CUID) e referenciar o testId do BOLIE')
      console.log('   • As respostas do usuário devem referenciar esses IDs de questão')
      
      // Verificar se existem questões órfãs
      console.log('\n3. 🔍 Verificando questões órfãs...')
      const allQuestions = await prisma.question.findMany({
        include: {
          test: true
        }
      })
      
      console.log(`\n📊 Total de questões no banco: ${allQuestions.length}`)
      
      if (allQuestions.length > 0) {
        console.log('\n📋 Questões por teste:')
        const questionsByTest = {}
        allQuestions.forEach(q => {
          const testName = q.test.name || 'Sem nome'
          if (!questionsByTest[testName]) {
            questionsByTest[testName] = 0
          }
          questionsByTest[testName]++
        })
        
        Object.entries(questionsByTest).forEach(([testName, count]) => {
          console.log(`   • ${testName}: ${count} questões`)
        })
      }
      
    } else {
      console.log(`✅ ${bolieTest.questions.length} questões encontradas:`)
      
      // Mostrar algumas questões como exemplo
      const sampleQuestions = bolieTest.questions.slice(0, 5)
      sampleQuestions.forEach((q, index) => {
        console.log(`\n   ${index + 1}. Questão ${q.questionNumber}:`)
        console.log(`      ID: ${q.id}`)
        console.log(`      Texto: ${q.questionText.substring(0, 80)}...`)
        console.log(`      Tipo: ${q.questionType}`)
      })
      
      if (bolieTest.questions.length > 5) {
        console.log(`\n   ... e mais ${bolieTest.questions.length - 5} questões`)
      }
      
      // Verificar IDs das questões
      console.log('\n📋 IDs das questões (primeiras 10):')
      const firstTenIds = bolieTest.questions.slice(0, 10).map(q => q.id)
      firstTenIds.forEach((id, index) => {
        console.log(`   Questão ${index + 1}: ${id}`)
      })
    }
    
    // 3. Verificar sessões existentes do BOLIE
    console.log('\n4. 🔍 Verificando sessões existentes do BOLIE...')
    const bolieSessions = await prisma.testSession.findMany({
      where: {
        testId: bolieTest.id
      },
      include: {
        user: true,
        answers: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`\n📊 ${bolieSessions.length} sessões encontradas para o BOLIE:`)
    
    bolieSessions.forEach((session, index) => {
      console.log(`\n   ${index + 1}. Sessão ${session.id}:`)
      console.log(`      Usuário: ${session.user.email}`)
      console.log(`      Status: ${session.status}`)
      console.log(`      Criada em: ${session.createdAt.toLocaleString()}`)
      console.log(`      Respostas: ${session.answers.length}`)
      
      if (session.answers.length > 0) {
        console.log(`      IDs das questões respondidas: ${session.answers.slice(0, 3).map(a => a.questionId).join(', ')}...`)
      }
    })
    
    console.log('\n' + '='.repeat(50))
    console.log('🎯 DIAGNÓSTICO COMPLETO:')
    
    if (!bolieTest.questions || bolieTest.questions.length === 0) {
      console.log('\n❌ PROBLEMA PRINCIPAL: TESTE SEM QUESTÕES')
      console.log('   • O teste BOLIE existe no banco mas não tem questões cadastradas')
      console.log('   • Isso impede que as respostas sejam salvas (violação de chave estrangeira)')
      console.log('   • É necessário cadastrar as 45 questões do BOLIE na tabela Question')
    } else {
      console.log('\n✅ TESTE COM QUESTÕES CADASTRADAS')
      console.log(`   • ${bolieTest.questions.length} questões encontradas`)
      console.log('   • O problema pode estar na forma como as respostas são enviadas')
      console.log('   • Verificar se os IDs das questões nas respostas correspondem aos IDs reais')
    }
    
  } catch (error) {
    console.error('\n❌ ERRO NA VERIFICAÇÃO:')
    console.error('Erro:', error.message)
    console.error('Stack:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar a verificação
checkBolieQuestions()
  .then(() => {
    console.log('\n✅ Verificação finalizada')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
  })