// Script para adicionar o teste HumaniQ Pesquisa de Clima ao banco de dados
// Este teste está sendo referenciado no código mas não existe no banco

import { PrismaClient, TestType, QuestionType } from '@prisma/client'

const prisma = new PrismaClient()

async function addPesquisaClimaTest() {
  console.log('🔍 Adicionando teste HumaniQ Pesquisa de Clima...')

  try {
    // Verificar se o teste já existe
    const existingTest = await prisma.test.findUnique({
      where: { id: 'humaniq-pesquisa-clima' }
    })

    if (existingTest) {
      console.log('✅ Teste HumaniQ Pesquisa de Clima já existe no banco de dados')
      console.log(`   ID: ${existingTest.id}`)
      console.log(`   Nome: ${existingTest.name}`)
      console.log(`   Tipo: ${existingTest.testType}`)
      return
    }

    // Buscar categoria Corporate
    const corporateCategory = await prisma.testCategory.findFirst({
      where: { name: 'Corporate' }
    })

    if (!corporateCategory) {
      throw new Error('Categoria Corporate não encontrada')
    }

    // Criar o teste
    const pesquisaClimaTest = await prisma.test.create({
      data: {
        id: 'humaniq-pesquisa-clima',
        name: 'HumaniQ Pesquisa de Clima',
        description: 'Avaliação abrangente do clima organizacional e bem-estar psicológico, medindo 12 dimensões críticas para o engajamento e performance das equipes.',
        testType: TestType.CORPORATE,
        categoryId: corporateCategory.id,
        estimatedDuration: 15,
        isActive: true,
        instructions: 'Este teste avalia o clima organizacional através de 60 questões organizadas em 12 dimensões. Responda com sinceridade baseando-se na sua experiência atual na organização.',
        metadata: {
          version: '1.0',
          dimensions: [
            'Liderança & Confiança',
            'Comunicação & Transparência',
            'Reconhecimento & Valorização',
            'Desenvolvimento & Crescimento',
            'Autonomia & Empoderamento',
            'Colaboração & Trabalho em Equipe',
            'Inovação & Criatividade',
            'Equilíbrio Vida-Trabalho',
            'Segurança Psicológica',
            'Justiça & Ética',
            'Recursos & Suporte',
            'Propósito & Significado'
          ],
          questionsPerDimension: 5,
          totalQuestions: 60,
          scaleType: 'likert_5',
          calculationMethod: 'weighted_average'
        }
      }
    })

    console.log('✅ Teste HumaniQ Pesquisa de Clima criado com sucesso!')
    console.log(`   ID: ${pesquisaClimaTest.id}`)
    console.log(`   Nome: ${pesquisaClimaTest.name}`)
    console.log(`   Tipo: ${pesquisaClimaTest.testType}`)
    console.log(`   Categoria: ${corporateCategory.name}`)
    console.log(`   Duração estimada: ${pesquisaClimaTest.estimatedDuration} minutos`)

    // Criar algumas questões de exemplo (as 60 questões completas podem ser adicionadas posteriormente)
    const sampleQuestions = [
      {
        questionNumber: 1,
        questionText: 'Sinto que minha liderança direta é acessível quando preciso.',
        dimension: 'Liderança & Confiança'
      },
      {
        questionNumber: 2,
        questionText: 'Minha liderança cumpre o que promete.',
        dimension: 'Liderança & Confiança'
      },
      {
        questionNumber: 3,
        questionText: 'Recebo feedback construtivo sobre meu desempenho.',
        dimension: 'Liderança & Confiança'
      },
      {
        questionNumber: 4,
        questionText: 'Sinto-me à vontade para expressar minhas opiniões.',
        dimension: 'Liderança & Confiança'
      },
      {
        questionNumber: 5,
        questionText: 'Confio nas decisões tomadas pela liderança.',
        dimension: 'Liderança & Confiança'
      }
    ]

    for (const question of sampleQuestions) {
      await prisma.question.create({
        data: {
          testId: pesquisaClimaTest.id,
          questionNumber: question.questionNumber,
          questionText: question.questionText,
          questionType: QuestionType.SCALE,
          options: {
            scale: {
              min: 1,
              max: 5,
              minLabel: 'Discordo totalmente',
              maxLabel: 'Concordo totalmente',
              step: 1
            }
          },
          metadata: {
            dimension: question.dimension
          }
        }
      })
    }

    console.log(`✅ Criadas ${sampleQuestions.length} questões de exemplo`)
    console.log('📝 Nota: As 55 questões restantes podem ser adicionadas posteriormente')

  } catch (error) {
    console.error('❌ Erro ao criar teste:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar o script
addPesquisaClimaTest()
  .then(() => {
    console.log('🎉 Script executado com sucesso!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Erro na execução:', error)
    process.exit(1)
  })