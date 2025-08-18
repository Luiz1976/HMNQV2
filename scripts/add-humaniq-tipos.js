const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addHumaniQTipos() {
  try {
    console.log('🚀 Iniciando criação do teste HumaniQ TIPOS...')

    // 1. Verificar se a categoria já existe ou criar uma nova
    let category = await prisma.testCategory.findFirst({
      where: { name: 'Perfil Cognitivo' }
    })

    if (!category) {
      console.log('📁 Criando categoria "Perfil Cognitivo"...')
      category = await prisma.testCategory.create({
        data: {
          name: 'Perfil Cognitivo',
          description: 'Testes que avaliam preferências cognitivas e comportamentais',
          icon: 'Brain',
          color: '#6366f1',
          sortOrder: 2
        }
      })
      console.log('✅ Categoria criada:', category.id)
    } else {
      console.log('📁 Categoria já existe:', category.id)
    }

    // 2. Criar o teste HumaniQ TIPOS
    console.log('🧠 Criando teste HumaniQ TIPOS...')
    const test = await prisma.test.create({
      data: {
        id: 'cmdxqvgu4000p8wsg7l8brjee', // ID específico para referência no código
        categoryId: category.id,
        name: 'HumaniQ TIPOS – Perfil Cognitivo',
        description: 'Mapeamento de preferências cognitivas e comportamentais baseado na teoria de Carl Jung (Base Junguiana / MBTI).',
        instructions: 'Este teste avalia suas preferências cognitivas em 4 dimensões: Energia (Extroversão/Introversão), Percepção (Sensação/Intuição), Decisão (Pensamento/Sentimento) e Organização (Julgamento/Percepção). Responda com sinceridade sobre como você naturalmente se comporta.',
        testType: 'PSYCHOSOCIAL',
        estimatedDuration: 12,
        version: 1,
        isActive: true,
        isPublic: true,
        configuration: {
          dimensions: [
            { name: 'Energia', options: ['Extroversão (E)', 'Introversão (I)'] },
            { name: 'Percepção', options: ['Sensação (S)', 'Intuição (N)'] },
            { name: 'Decisão', options: ['Pensamento (T)', 'Sentimento (F)'] },
            { name: 'Organização', options: ['Julgamento (J)', 'Percepção (P)'] }
          ],
          scaleType: 'likert5',
          resultType: 'personality_type'
        }
      }
    })
    console.log('✅ Teste criado:', test.id)

    // 3. Criar as 40 questões
    console.log('❓ Criando questões...')
    const questions = [
      // Extroversão (E) × Introversão (I)
      { number: 1, text: 'Gosto de iniciar conversas com pessoas novas.', dimension: 'Energia', type: 'E' },
      { number: 2, text: 'Sinto-me energizado ao participar de eventos sociais.', dimension: 'Energia', type: 'E' },
      { number: 3, text: 'Prefiro atividades em grupo a tarefas solitárias.', dimension: 'Energia', type: 'E' },
      { number: 4, text: 'Tenho facilidade em me expressar verbalmente.', dimension: 'Energia', type: 'E' },
      { number: 5, text: 'Recarrego minha energia em ambientes silenciosos.', dimension: 'Energia', type: 'I' },
      { number: 6, text: 'Gosto de refletir antes de falar.', dimension: 'Energia', type: 'I' },
      { number: 7, text: 'Prefiro escrever do que falar em público.', dimension: 'Energia', type: 'I' },
      { number: 8, text: 'Evito ambientes muito movimentados.', dimension: 'Energia', type: 'I' },
      { number: 9, text: 'Sinto-me cansado após muitas interações sociais.', dimension: 'Energia', type: 'I' },
      { number: 10, text: 'Fico entusiasmado quando tenho companhia para realizar atividades.', dimension: 'Energia', type: 'E' },

      // Sensação (S) × Intuição (N)
      { number: 11, text: 'Gosto de trabalhar com fatos concretos e verificáveis.', dimension: 'Percepção', type: 'S' },
      { number: 12, text: 'Prefiro seguir instruções claras e detalhadas.', dimension: 'Percepção', type: 'S' },
      { number: 13, text: 'Presto atenção aos detalhes do presente.', dimension: 'Percepção', type: 'S' },
      { number: 14, text: 'Valorizo experiências práticas em vez de teorias.', dimension: 'Percepção', type: 'S' },
      { number: 15, text: 'Tenho facilidade em imaginar diferentes cenários futuros.', dimension: 'Percepção', type: 'N' },
      { number: 16, text: 'Penso sobre o "todo" antes de olhar as partes.', dimension: 'Percepção', type: 'N' },
      { number: 17, text: 'Sinto-me atraído por ideias inovadoras.', dimension: 'Percepção', type: 'N' },
      { number: 18, text: 'Gosto de questionar padrões e regras estabelecidas.', dimension: 'Percepção', type: 'N' },
      { number: 19, text: 'Tenho insights espontâneos com frequência.', dimension: 'Percepção', type: 'N' },
      { number: 20, text: 'Gosto de explorar possibilidades e alternativas.', dimension: 'Percepção', type: 'N' },

      // Pensamento (T) × Sentimento (F)
      { number: 21, text: 'Tomo decisões com base em lógica e justiça.', dimension: 'Decisão', type: 'T' },
      { number: 22, text: 'Analiso prós e contras de forma objetiva.', dimension: 'Decisão', type: 'T' },
      { number: 23, text: 'Prefiro ser justo a ser gentil.', dimension: 'Decisão', type: 'T' },
      { number: 24, text: 'Valorizo argumentos racionais.', dimension: 'Decisão', type: 'T' },
      { number: 25, text: 'Considero os sentimentos das pessoas ao tomar decisões.', dimension: 'Decisão', type: 'F' },
      { number: 26, text: 'Preocupo-me com o impacto emocional das minhas ações.', dimension: 'Decisão', type: 'F' },
      { number: 27, text: 'Busco harmonia nos relacionamentos.', dimension: 'Decisão', type: 'F' },
      { number: 28, text: 'Evito magoar as pessoas, mesmo quando discordo.', dimension: 'Decisão', type: 'F' },
      { number: 29, text: 'Presto atenção à linguagem corporal e emoções.', dimension: 'Decisão', type: 'F' },
      { number: 30, text: 'Tenho empatia por quem está em dificuldade.', dimension: 'Decisão', type: 'F' },

      // Julgamento (J) × Percepção (P)
      { number: 31, text: 'Gosto de manter uma rotina organizada.', dimension: 'Organização', type: 'J' },
      { number: 32, text: 'Planejo atividades com antecedência.', dimension: 'Organização', type: 'J' },
      { number: 33, text: 'Fico desconfortável com imprevistos.', dimension: 'Organização', type: 'J' },
      { number: 34, text: 'Cumpro prazos rigorosamente.', dimension: 'Organização', type: 'J' },
      { number: 35, text: 'Sinto-me mais produtivo com horários flexíveis.', dimension: 'Organização', type: 'P' },
      { number: 36, text: 'Prefiro deixar decisões em aberto.', dimension: 'Organização', type: 'P' },
      { number: 37, text: 'Gosto de improvisar quando necessário.', dimension: 'Organização', type: 'P' },
      { number: 38, text: 'Adio decisões para reunir mais informações.', dimension: 'Organização', type: 'P' },
      { number: 39, text: 'Mudo de ideia com facilidade.', dimension: 'Organização', type: 'P' },
      { number: 40, text: 'Gosto de começar projetos mesmo sem todos os detalhes.', dimension: 'Organização', type: 'P' }
    ]

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
            dimension: question.dimension,
            type: question.type
          }
        }
      })
    }

    console.log('✅ Todas as 40 questões foram criadas!')
    console.log('🎉 Teste HumaniQ TIPOS criado com sucesso!')
    console.log('🔗 ID do teste:', test.id)

  } catch (error) {
    console.error('❌ Erro ao criar teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addHumaniQTipos()