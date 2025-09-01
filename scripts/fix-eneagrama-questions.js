const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixEneagramaQuestions() {
  try {
    console.log('🚀 Corrigindo questões do HumaniQ Eneagrama...')
    
    // Buscar o teste correto
    const test = await prisma.test.findUnique({
      where: { id: 'humaniq_eneagrama' }
    })
    
    if (!test) {
      console.log('❌ Teste humaniq_eneagrama não encontrado!')
      return
    }
    
    console.log(`✅ Teste encontrado: ${test.name} (ID: ${test.id})`)
    
    // Verificar se já existem questões
    const existingQuestions = await prisma.question.count({
      where: { testId: test.id }
    })
    
    if (existingQuestions > 0) {
      console.log(`⚠️ Já existem ${existingQuestions} questões. Removendo...`)
      await prisma.question.deleteMany({
        where: { testId: test.id }
      })
    }
    
    console.log('❓ Criando questões do Eneagrama...')
    
    // Definir as 45 questões do Eneagrama (5 para cada tipo)
    const eneagramQuestions = [
      // Tipo 1 - O Perfeccionista
      { type: 1, text: 'Eu me esforço para fazer tudo da maneira correta e perfeita.' },
      { type: 1, text: 'Fico irritado quando as coisas não são feitas adequadamente.' },
      { type: 1, text: 'Tenho padrões muito altos para mim mesmo e para os outros.' },
      { type: 1, text: 'Sinto-me responsável por corrigir erros e melhorar as situações.' },
      { type: 1, text: 'Tenho dificuldade em relaxar quando há trabalho a ser feito.' },
      
      // Tipo 2 - O Prestativo
      { type: 2, text: 'Gosto de ajudar os outros e me sinto bem quando sou útil.' },
      { type: 2, text: 'Frequentemente coloco as necessidades dos outros antes das minhas.' },
      { type: 2, text: 'Sinto-me valorizado quando as pessoas precisam de mim.' },
      { type: 2, text: 'Tenho facilidade em perceber o que os outros estão sentindo.' },
      { type: 2, text: 'Às vezes me esqueço das minhas próprias necessidades.' },
      
      // Tipo 3 - O Realizador
      { type: 3, text: 'Sou orientado para objetivos e gosto de alcançar o sucesso.' },
      { type: 3, text: 'Preocupo-me com a imagem que projeto para os outros.' },
      { type: 3, text: 'Sou competitivo e gosto de ser reconhecido pelos meus feitos.' },
      { type: 3, text: 'Tenho facilidade em me adaptar a diferentes situações.' },
      { type: 3, text: 'Às vezes sacrifico relacionamentos em prol do trabalho.' },
      
      // Tipo 4 - O Individualista
      { type: 4, text: 'Sinto-me diferente e único em relação aos outros.' },
      { type: 4, text: 'Tenho uma vida emocional intensa e profunda.' },
      { type: 4, text: 'Valorizo a autenticidade e a expressão pessoal.' },
      { type: 4, text: 'Às vezes me sinto melancólico ou nostálgico.' },
      { type: 4, text: 'Busco significado e propósito em tudo que faço.' },
      
      // Tipo 5 - O Investigador
      { type: 5, text: 'Prefiro observar e analisar antes de agir.' },
      { type: 5, text: 'Valorizo minha privacidade e tempo sozinho.' },
      { type: 5, text: 'Gosto de entender como as coisas funcionam.' },
      { type: 5, text: 'Sinto-me drenado por muita interação social.' },
      { type: 5, text: 'Prefiro ser competente a ser popular.' },
      
      // Tipo 6 - O Leal
      { type: 6, text: 'Valorizo segurança e estabilidade.' },
      { type: 6, text: 'Tendo a antecipar problemas e me preparar para eles.' },
      { type: 6, text: 'Sou leal às pessoas e grupos importantes para mim.' },
      { type: 6, text: 'Às vezes duvido de mim mesmo e busco orientação.' },
      { type: 6, text: 'Posso ser cauteloso com pessoas novas.' },
      
      // Tipo 7 - O Entusiasta
      { type: 7, text: 'Gosto de variedade e novas experiências.' },
      { type: 7, text: 'Sou otimista e vejo possibilidades em tudo.' },
      { type: 7, text: 'Tenho dificuldade em me comprometer com uma única opção.' },
      { type: 7, text: 'Evito situações que me deixam triste ou limitado.' },
      { type: 7, text: 'Gosto de manter minhas opções em aberto.' },
      
      // Tipo 8 - O Desafiador
      { type: 8, text: 'Gosto de estar no controle das situações.' },
      { type: 8, text: 'Não tenho medo de confronto quando necessário.' },
      { type: 8, text: 'Protejo as pessoas que considero vulneráveis.' },
      { type: 8, text: 'Prefiro ser direto e honesto, mesmo que seja difícil.' },
      { type: 8, text: 'Tenho energia intensa e presença forte.' },
      
      // Tipo 9 - O Pacificador
      { type: 9, text: 'Valorizo harmonia e evito conflitos.' },
      { type: 9, text: 'Tenho facilidade em ver diferentes pontos de vista.' },
      { type: 9, text: 'Às vezes procrastino em decisões importantes.' },
      { type: 9, text: 'Prefiro manter a paz a expressar minha opinião.' },
      { type: 9, text: 'Sou uma pessoa calma e estável.' }
    ]
    
    // Criar as questões no banco
    for (let i = 0; i < eneagramQuestions.length; i++) {
      const question = eneagramQuestions[i]
      
      await prisma.question.create({
        data: {
          testId: test.id,
          questionNumber: i + 1,
          questionText: question.text,
          questionType: 'SCALE',
          isRequired: true,
          options: {
            type: 'likert',
            scale: 5,
            labels: {
              1: 'Discordo totalmente',
              2: 'Discordo',
              3: 'Neutro',
              4: 'Concordo',
              5: 'Concordo totalmente'
            }
          },
          metadata: {
            dimension: `tipo_${question.type}`,
            enneagramType: question.type
          }
        }
      })
    }
    
    console.log(`✅ Todas as ${eneagramQuestions.length} questões foram criadas!`)
    
    // Verificar total de questões
    const totalQuestions = await prisma.question.count({
      where: { testId: test.id }
    })
    
    console.log(`📊 Total de questões no teste: ${totalQuestions}`)
    
    // Atualizar configuração do teste
    await prisma.test.update({
      where: { id: test.id },
      data: {
        configuration: {
          ...test.configuration,
          totalQuestions: totalQuestions
        }
      }
    })
    
    console.log('🎉 Questões do HumaniQ Eneagrama criadas com sucesso!')
    console.log(`🔗 ID do teste: ${test.id}`)
    console.log('✅ Configuração do teste atualizada!')
    
  } catch (error) {
    console.error('❌ Erro ao criar questões:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixEneagramaQuestions()