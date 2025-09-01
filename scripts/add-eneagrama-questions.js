const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addEneagramaQuestions() {
  try {
    console.log('🚀 Iniciando criação das questões do HumaniQ Eneagrama...')

    // 1. Verificar se o teste existe
    const test = await prisma.test.findFirst({
      where: {
        OR: [
          { id: 'humaniq_eneagrama' },
          { name: { contains: 'Eneagrama' } }
        ]
      }
    })

    if (!test) {
      console.error('❌ Teste de Eneagrama não encontrado!')
      return
    }

    console.log('✅ Teste encontrado:', test.name, '(ID:', test.id, ')')

    // 2. Verificar se já existem questões
    const existingQuestions = await prisma.question.count({
      where: { testId: test.id }
    })

    if (existingQuestions > 0) {
      console.log(`⚠️ Já existem ${existingQuestions} questões para este teste.`)
      console.log('Deseja continuar e adicionar mais questões? (Ctrl+C para cancelar)')
    }

    // 3. Criar as 45 questões do Eneagrama (5 questões por tipo)
    console.log('❓ Criando questões do Eneagrama...')
    const questions = [
      // TIPO 1 - O PERFECCIONISTA
      { number: 1, text: 'Tenho padrões muito altos para mim mesmo e para os outros.', type: 1 },
      { number: 2, text: 'Fico irritado quando as coisas não são feitas da maneira correta.', type: 1 },
      { number: 3, text: 'Sinto-me responsável por corrigir erros e melhorar as situações.', type: 1 },
      { number: 4, text: 'Tenho dificuldade em relaxar quando há trabalho a ser feito.', type: 1 },
      { number: 5, text: 'Critico a mim mesmo quando cometo erros.', type: 1 },

      // TIPO 2 - O AJUDANTE
      { number: 6, text: 'Gosto de ajudar os outros, mesmo quando não pedem.', type: 2 },
      { number: 7, text: 'Tenho facilidade em perceber as necessidades das pessoas.', type: 2 },
      { number: 8, text: 'Às vezes me esqueço das minhas próprias necessidades.', type: 2 },
      { number: 9, text: 'Sinto-me bem quando sou útil e necessário para alguém.', type: 2 },
      { number: 10, text: 'Tenho dificuldade em dizer "não" quando alguém precisa de ajuda.', type: 2 },

      // TIPO 3 - O REALIZADOR
      { number: 11, text: 'Gosto de ser reconhecido pelos meus sucessos e conquistas.', type: 3 },
      { number: 12, text: 'Trabalho duro para alcançar meus objetivos.', type: 3 },
      { number: 13, text: 'Preocupo-me com a imagem que projeto para os outros.', type: 3 },
      { number: 14, text: 'Tenho facilidade em me adaptar a diferentes situações sociais.', type: 3 },
      { number: 15, text: 'Fico impaciente com pessoas que trabalham devagar.', type: 3 },

      // TIPO 4 - O INDIVIDUALISTA
      { number: 16, text: 'Sinto-me diferente das outras pessoas.', type: 4 },
      { number: 17, text: 'Meus sentimentos são intensos e profundos.', type: 4 },
      { number: 18, text: 'Valorizo a autenticidade e a expressão pessoal.', type: 4 },
      { number: 19, text: 'Às vezes me sinto melancólico ou nostálgico.', type: 4 },
      { number: 20, text: 'Tenho uma rica vida interior e imaginação.', type: 4 },

      // TIPO 5 - O INVESTIGADOR
      { number: 21, text: 'Preciso de tempo sozinho para recarregar minhas energias.', type: 5 },
      { number: 22, text: 'Gosto de entender como as coisas funcionam.', type: 5 },
      { number: 23, text: 'Prefiro observar antes de participar.', type: 5 },
      { number: 24, text: 'Sinto-me desconfortável quando as pessoas são muito emotivas.', type: 5 },
      { number: 25, text: 'Valorizo minha privacidade e independência.', type: 5 },

      // TIPO 6 - O LEAL
      { number: 26, text: 'Busco segurança e estabilidade na vida.', type: 6 },
      { number: 27, text: 'Questiono autoridades e suas motivações.', type: 6 },
      { number: 28, text: 'Preocupo-me com possíveis problemas futuros.', type: 6 },
      { number: 29, text: 'Sou leal aos meus amigos e grupos.', type: 6 },
      { number: 30, text: 'Tenho dificuldade em tomar decisões importantes sozinho.', type: 6 },

      // TIPO 7 - O ENTUSIASTA
      { number: 31, text: 'Gosto de ter muitas opções e possibilidades.', type: 7 },
      { number: 32, text: 'Fico entediado facilmente com rotinas.', type: 7 },
      { number: 33, text: 'Sou otimista e vejo o lado positivo das situações.', type: 7 },
      { number: 34, text: 'Tenho muitos interesses e hobbies diferentes.', type: 7 },
      { number: 35, text: 'Evito situações que me fazem sentir limitado ou preso.', type: 7 },

      // TIPO 8 - O DESAFIADOR
      { number: 36, text: 'Gosto de estar no controle das situações.', type: 8 },
      { number: 37, text: 'Não tenho medo de confrontos ou conflitos.', type: 8 },
      { number: 38, text: 'Protejo pessoas que considero vulneráveis.', type: 8 },
      { number: 39, text: 'Expresso minha raiva de forma direta.', type: 8 },
      { number: 40, text: 'Tenho energia intensa e presença forte.', type: 8 },

      // TIPO 9 - O PACIFICADOR
      { number: 41, text: 'Evito conflitos e busco harmonia.', type: 9 },
      { number: 42, text: 'Tenho dificuldade em expressar minha raiva.', type: 9 },
      { number: 43, text: 'Procrastino em decisões importantes.', type: 9 },
      { number: 44, text: 'Consigo ver diferentes pontos de vista em uma discussão.', type: 9 },
      { number: 45, text: 'Prefiro manter a paz a impor minha opinião.', type: 9 }
    ]

    // 4. Criar cada questão no banco de dados
    for (const question of questions) {
      await prisma.question.create({
        data: {
          testId: test.id,
          questionNumber: question.number,
          questionText: question.text,
          questionType: 'SCALE',
          isRequired: true,
          options: {
            scale: {
              min: 1,
              max: 5,
              labels: {
                1: 'Discordo totalmente',
                2: 'Discordo',
                3: 'Neutro',
                4: 'Concordo',
                5: 'Concordo totalmente'
              }
            }
          },
          metadata: {
            enneagramType: question.type,
            category: 'personality'
          }
        }
      })
    }

    console.log(`✅ Todas as ${questions.length} questões foram criadas!`)

    // 5. Verificar o resultado final
    const finalCount = await prisma.question.count({
      where: { testId: test.id }
    })

    console.log(`📊 Total de questões no teste: ${finalCount}`)
    console.log('🎉 Questões do HumaniQ Eneagrama criadas com sucesso!')
    console.log('🔗 ID do teste:', test.id)

    // 6. Atualizar configuração do teste se necessário
    await prisma.test.update({
      where: { id: test.id },
      data: {
        configuration: {
          ...test.configuration,
          totalQuestions: finalCount
        }
      }
    })

    console.log('✅ Configuração do teste atualizada!')

  } catch (error) {
    console.error('❌ Erro ao criar questões:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addEneagramaQuestions()