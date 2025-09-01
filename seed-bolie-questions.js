const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const questions = [
  // TOHE - Teste de Organização e Histórias Emocionais (15 questões)
  { id: 1, text: "Consigo identificar facilmente quando alguém está triste, mesmo que tente esconder.", dimension: "Reconhecimento Emocional", test: "TOHE" },
  { id: 2, text: "Percebo rapidamente mudanças no humor das pessoas ao meu redor.", dimension: "Reconhecimento Emocional", test: "TOHE" },
  { id: 3, text: "Entendo por que certas situações me deixam ansioso(a) ou estressado(a).", dimension: "Compreensão de Causas", test: "TOHE" },
  { id: 4, text: "Consigo explicar as razões por trás dos meus sentimentos.", dimension: "Compreensão de Causas", test: "TOHE" },
  { id: 5, text: "Quando alguém está chateado, consigo entender o ponto de vista dessa pessoa.", dimension: "Tomada de Perspectiva", test: "TOHE" },
  { id: 6, text: "Coloco-me facilmente no lugar dos outros para compreender seus sentimentos.", dimension: "Tomada de Perspectiva", test: "TOHE" },
  { id: 7, text: "Reconheço quando estou começando a ficar irritado(a) antes que isso se torne um problema.", dimension: "Reconhecimento Emocional", test: "TOHE" },
  { id: 8, text: "Identifico os sinais físicos que acompanham minhas emoções (tensão, respiração, etc.).", dimension: "Reconhecimento Emocional", test: "TOHE" },
  { id: 9, text: "Compreendo como eventos passados influenciam meus sentimentos atuais.", dimension: "Compreensão de Causas", test: "TOHE" },
  { id: 10, text: "Entendo por que certas pessoas ou situações me afetam emocionalmente.", dimension: "Compreensão de Causas", test: "TOHE" },
  { id: 11, text: "Consigo ver uma situação conflituosa sob diferentes perspectivas.", dimension: "Tomada de Perspectiva", test: "TOHE" },
  { id: 12, text: "Quando há desentendimentos, procuro entender todos os lados envolvidos.", dimension: "Tomada de Perspectiva", test: "TOHE" },
  { id: 13, text: "Noto quando minhas expressões faciais não condizem com o que estou sentindo.", dimension: "Reconhecimento Emocional", test: "TOHE" },
  { id: 14, text: "Percebo quando meu tom de voz revela emoções que prefiro não mostrar.", dimension: "Reconhecimento Emocional", test: "TOHE" },
  { id: 15, text: "Entendo como meu histórico pessoal influencia minhas reações emocionais.", dimension: "Compreensão de Causas", test: "TOHE" },

  // VE - Velocidade Emocional (15 questões)
  { id: 16, text: "Reajo rapidamente de forma adequada quando alguém precisa de apoio emocional.", dimension: "Reação Rápida", test: "VE" },
  { id: 17, text: "Tomo decisões equilibradas mesmo sob pressão emocional.", dimension: "Tomada de Decisão Emocional", test: "VE" },
  { id: 18, text: "Consigo me acalmar rapidamente após situações estressantes.", dimension: "Autorregulação", test: "VE" },
  { id: 19, text: "Respondo de forma apropriada a críticas ou feedback negativo.", dimension: "Reação Rápida", test: "VE" },
  { id: 20, text: "Tomo decisões importantes considerando tanto a lógica quanto as emoções.", dimension: "Tomada de Decisão Emocional", test: "VE" },
  { id: 21, text: "Controlo meus impulsos mesmo quando estou muito irritado(a).", dimension: "Autorregulação", test: "VE" },
  { id: 22, text: "Adapto-me rapidamente a mudanças inesperadas no ambiente de trabalho.", dimension: "Reação Rápida", test: "VE" },
  { id: 23, text: "Mantenho a calma em situações de conflito ou tensão.", dimension: "Reação Rápida", test: "VE" },
  { id: 24, text: "Escolho o momento certo para expressar meus sentimentos.", dimension: "Tomada de Decisão Emocional", test: "VE" },
  { id: 25, text: "Evito tomar decisões importantes quando estou emocionalmente alterado(a).", dimension: "Tomada de Decisão Emocional", test: "VE" },
  { id: 26, text: "Uso técnicas de respiração ou relaxamento para me acalmar.", dimension: "Autorregulação", test: "VE" },
  { id: 27, text: "Consigo interromper pensamentos negativos antes que me afetem demais.", dimension: "Autorregulação", test: "VE" },
  { id: 28, text: "Respondo construtivamente quando recebo feedback sobre meu comportamento.", dimension: "Reação Rápida", test: "VE" },
  { id: 29, text: "Considero as consequências emocionais antes de tomar decisões importantes.", dimension: "Tomada de Decisão Emocional", test: "VE" },
  { id: 30, text: "Mantenho o autocontrole mesmo em situações muito frustrantes.", dimension: "Autorregulação", test: "VE" },

  // QORE - Questionário Online de Regulação Emocional (15 questões)
  { id: 31, text: "Transformo experiências negativas em oportunidades de aprendizado.", dimension: "Redirecionamento Positivo", test: "QORE" },
  { id: 32, text: "Entendo intelectualmente por que as pessoas agem de determinada forma.", dimension: "Empatia Cognitiva", test: "QORE" },
  { id: 33, text: "Sinto genuinamente as emoções das pessoas próximas a mim.", dimension: "Empatia Emocional", test: "QORE" },
  { id: 34, text: "Encontro aspectos positivos mesmo em situações difíceis.", dimension: "Redirecionamento Positivo", test: "QORE" },
  { id: 35, text: "Analiso logicamente os motivos por trás das ações das pessoas.", dimension: "Empatia Cognitiva", test: "QORE" },
  { id: 36, text: "Fico emocionalmente tocado(a) quando vejo alguém sofrendo.", dimension: "Empatia Emocional", test: "QORE" },
  { id: 37, text: "Uso o humor para lidar com situações estressantes.", dimension: "Redirecionamento Positivo", test: "QORE" },
  { id: 38, text: "Reinterpreto situações negativas de forma mais positiva.", dimension: "Redirecionamento Positivo", test: "QORE" },
  { id: 39, text: "Compreendo racionalmente as motivações das pessoas, mesmo quando discordo.", dimension: "Empatia Cognitiva", test: "QORE" },
  { id: 40, text: "Consigo me colocar mentalmente no lugar de outra pessoa.", dimension: "Empatia Cognitiva", test: "QORE" },
  { id: 41, text: "Sinto-me afetado(a) emocionalmente pela alegria ou tristeza dos outros.", dimension: "Empatia Emocional", test: "QORE" },
  { id: 42, text: "Compartilho naturalmente as emoções das pessoas ao meu redor.", dimension: "Empatia Emocional", test: "QORE" },
  { id: 43, text: "Foco nos aspectos que posso controlar quando enfrento problemas.", dimension: "Redirecionamento Positivo", test: "QORE" },
  { id: 44, text: "Entendo as razões lógicas por trás dos comportamentos das pessoas.", dimension: "Empatia Cognitiva", test: "QORE" },
  { id: 45, text: "Sinto fisicamente o desconforto emocional dos outros.", dimension: "Empatia Emocional", test: "QORE" }
]

async function seedBolieQuestions() {
  try {
    console.log('🔍 Verificando teste BOLIE...')
    
    // Primeiro, vamos encontrar o teste BOLIE
    const bolieTest = await prisma.test.findFirst({
      where: {
        name: {
          contains: 'BOLIE'
        }
      }
    })
    
    if (!bolieTest) {
      console.error('❌ Teste BOLIE não encontrado!')
      return
    }
    
    console.log(`✅ Teste BOLIE encontrado: ${bolieTest.name} (ID: ${bolieTest.id})`)
    
    // Verificar se já existem perguntas
    const existingQuestions = await prisma.question.findMany({
      where: {
        testId: bolieTest.id
      }
    })
    
    console.log(`📊 Perguntas existentes: ${existingQuestions.length}`)
    
    if (existingQuestions.length > 0) {
      console.log('⚠️  Já existem perguntas para este teste. Deseja continuar? (y/n)')
      // Para automação, vamos prosseguir
    }
    
    console.log('🚀 Cadastrando perguntas do BOLIE...')
    
    // Cadastrar as perguntas
    for (const question of questions) {
      const createdQuestion = await prisma.question.create({
        data: {
          testId: bolieTest.id,
          questionText: question.text,
          questionType: 'SCALE',
          questionNumber: question.id,
          options: [
            'Discordo totalmente',
            'Discordo parcialmente', 
            'Neutro',
            'Concordo parcialmente',
            'Concordo totalmente'
          ],
          metadata: {
            dimension: question.dimension,
            test: question.test,
            originalId: question.id
          }
        }
      })
      
      console.log(`✅ Pergunta ${question.id} cadastrada: ${question.text.substring(0, 50)}...`)
    }
    
    console.log('🎉 Todas as 45 perguntas do BOLIE foram cadastradas com sucesso!')
    
    // Verificar o resultado final
    const finalCount = await prisma.question.count({
      where: {
        testId: bolieTest.id
      }
    })
    
    console.log(`📈 Total de perguntas cadastradas: ${finalCount}`)
    
  } catch (error) {
    console.error('❌ Erro ao cadastrar perguntas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedBolieQuestions()