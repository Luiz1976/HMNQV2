
// HumaniQ AI - Database Seed Script
// Populates database with initial data for testing

import { PrismaClient, TestType, QuestionType } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { getDefaultPermissions } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create main admin user (SaaS owner)
  console.log('👤 Creating main administrator...')
  const adminPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@humaniq.ai' },
    update: {},
    create: {
      email: 'admin@humaniq.ai',
      firstName: 'Admin',
      lastName: 'HumaniQ',
      password: adminPassword,
      userType: 'ADMIN',
      isActive: true,
      emailVerified: new Date()
    }
  })

  // Create admin permissions
  const adminPermissions = getDefaultPermissions('ADMIN')
  for (const permission of adminPermissions) {
    await prisma.userPermission.upsert({
      where: {
        userId_permission: {
          userId: adminUser.id,
          permission: permission
        }
      },
      update: {},
      create: {
        userId: adminUser.id,
        permission: permission
      }
    })
  }

  // Create demo company user
  console.log('🏢 Creating demo company user...')
  const companyPassword = await bcrypt.hash('empresa123', 12)
  
  const companyUser = await prisma.user.upsert({
    where: { email: 'empresa@demo.com' },
    update: {},
    create: {
      email: 'empresa@demo.com',
      firstName: 'Empresa',
      lastName: 'Demo',
      password: companyPassword,
      userType: 'COMPANY',
      isActive: true,
      emailVerified: new Date(),
      companyId: null // Will be set after company creation
    }
  })

  // Create demo employee user
  console.log('👤 Creating demo employee user...')
  const employeePassword = await bcrypt.hash('colaborador123', 12)
  
  const employeeUser = await prisma.user.upsert({
    where: { email: 'colaborador@demo.com' },
    update: {},
    create: {
      email: 'colaborador@demo.com',
      firstName: 'João',
      lastName: 'Silva',
      password: employeePassword,
      userType: 'EMPLOYEE',
      isActive: true,
      emailVerified: new Date(),
      companyId: null // Will be set after company creation
    }
  })

  // Create demo candidate user
  console.log('🎯 Creating demo candidate user...')
  const candidatePassword = await bcrypt.hash('candidato123', 12)
  
  const candidateUser = await prisma.user.upsert({
    where: { email: 'candidato@demo.com' },
    update: {},
    create: {
      email: 'candidato@demo.com',
      firstName: 'Maria',
      lastName: 'Santos',
      password: candidatePassword,
      userType: 'CANDIDATE',
      isActive: true,
      emailVerified: new Date(),
      companyId: null // Will be set after company creation
    }
  })

  // Create Luiz Carlo user
  console.log('👤 Creating Luiz Carlo user...')
  const luizPassword = await bcrypt.hash('123456', 12)
  
  const luizUser = await prisma.user.upsert({
    where: { email: 'luiz.carlo@gmail.com' },
    update: {},
    create: {
      email: 'luiz.carlo@gmail.com',
      firstName: 'Luiz',
      lastName: 'Carlo',
      password: luizPassword,
      userType: 'EMPLOYEE',
      isActive: true,
      emailVerified: new Date(),
      companyId: null // Will be set after company creation
    }
  })

  // Create test categories
  console.log('📋 Creating test categories...')
  const categories = [
    {
      name: 'Testes Psicossociais',
      description: 'Avaliação de riscos psicossociais, burnout, saúde mental e segurança ocupacional',
      icon: 'Brain',
      color: '#3B82F6',
      sortOrder: 1
    },
    {
      name: 'Testes de Perfil',
      description: 'Análise de personalidade, comportamento e inteligência emocional',
      icon: 'User',
      color: '#10B981',
      sortOrder: 2
    },
    {
      name: 'Teste Grafológico',
      description: 'Análise de personalidade através da análise da escrita',
      icon: 'PenTool',
      color: '#F59E0B',
      sortOrder: 3
    },
    {
      name: 'Testes Corporativos',
      description: 'Competências profissionais, liderança, trabalho em equipe e habilidades organizacionais',
      icon: 'Building',
      color: '#8B5CF6',
      sortOrder: 4
    }
  ]

  const createdCategories = []
  for (const category of categories) {
    // Check if category exists by name
    const existing = await prisma.testCategory.findFirst({
      where: { name: category.name }
    })
    
    let created
    if (existing) {
      created = await prisma.testCategory.update({
        where: { id: existing.id },
        data: category
      })
    } else {
      created = await prisma.testCategory.create({
        data: category
      })
    }
    createdCategories.push(created)
  }

  // Create the complete 18 tests as specified
  console.log('🧪 Creating the 18 HumaniQ tests...')
  const tests = [
    // CATEGORIA 1: TESTES PSICOSSOCIAIS (4 TESTES)
    {
      categoryId: createdCategories[0].id,
      name: 'HumaniQ RPO - Riscos Psicossociais Ocupacionais',
      description: 'Avalia a presença de riscos psicossociais no ambiente de trabalho baseado na ISO 10075 e Modelo de Demandas-Controle de Karasek.',
      instructions: 'Responda baseado em sua experiência atual no trabalho. Use a escala de 1 (Nunca) a 5 (Sempre). Total: 96 questões organizadas em 8 dimensões.',
      testType: TestType.PSYCHOSOCIAL,
      estimatedDuration: 45,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: false,
        timeLimit: 2700,
        retakePolicy: 'limited',
        maxRetakes: 2,
        dimensions: ['Demandas do Trabalho', 'Autonomia e Controle', 'Relações Interpessoais', 'Reconhecimento', 'Justiça Organizacional', 'Segurança no Trabalho', 'Interface Trabalho-Vida', 'Violência/Assédio'],
        questionsPerDimension: 12,
        totalQuestions: 96
      }
    },
    {
      categoryId: createdCategories[0].id,
      name: 'HumaniQ BSC - Burnout Scale Corporate',
      description: 'Avalia níveis de esgotamento profissional baseado no Maslach Burnout Inventory adaptado para ambiente corporativo.',
      instructions: 'Reflita sobre seus sentimentos em relação ao trabalho nos últimos 6 meses. Responda com honestidade usando a escala fornecida.',
      testType: TestType.PSYCHOSOCIAL,
      estimatedDuration: 20,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: false,
        timeLimit: 1200,
        retakePolicy: 'limited',
        maxRetakes: 1,
        dimensions: ['Exaustão Emocional', 'Despersonalização', 'Realização Pessoal'],
        totalQuestions: 22
      }
    },
    {
      categoryId: createdCategories[0].id,
      name: 'HumaniQ SESM - Saúde Mental e Bem-estar',
      description: 'Avalia indicadores de saúde mental, bem-estar psicológico e qualidade de vida no trabalho.',
      instructions: 'Considere como você tem se sentido nas últimas duas semanas. Responda de forma sincera sobre seu estado emocional e mental.',
      testType: TestType.PSYCHOSOCIAL,
      estimatedDuration: 25,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: false,
        timeLimit: 1500,
        retakePolicy: 'unlimited',
        dimensions: ['Bem-estar Emocional', 'Estresse', 'Ansiedade', 'Depressão', 'Satisfação com a Vida'],
        totalQuestions: 30
      }
    },
    {
      categoryId: createdCategories[0].id,
      name: 'HumaniQ RAO - Risco de Acidente e Segurança Ocupacional',
      description: 'Avalia fatores comportamentais e psicológicos relacionados à segurança no trabalho e propensão a acidentes.',
      instructions: 'Responda com base em seu comportamento habitual no ambiente de trabalho. Foque em situações de segurança e prevenção.',
      testType: TestType.PSYCHOSOCIAL,
      estimatedDuration: 30,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: false,
        timeLimit: 1800,
        retakePolicy: 'limited',
        maxRetakes: 2,
        dimensions: ['Percepção de Risco', 'Comportamento Seguro', 'Atitude com Normas', 'Impulsividade'],
        totalQuestions: 40
      }
    },

    // CATEGORIA 2: TESTES DE PERFIL (10 TESTES)
    {
      categoryId: createdCategories[1].id,
      name: 'HumaniQ BOLIE – Inteligência Emocional',
      description: 'Avalia competências de inteligência emocional baseado no modelo de Goleman.',
      instructions: 'Responda com base em como você normalmente age em situações emocionais. Considere experiências recentes.',
      testType: TestType.PERSONALITY,
      estimatedDuration: 30,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: false,
        timeLimit: 1800,
        retakePolicy: 'limited',
        maxRetakes: 2,
        dimensions: ['Autoconsciência', 'Autorregulação', 'Motivação', 'Empatia', 'Habilidades Sociais'],
        totalQuestions: 50
      }
    },
    {
      categoryId: createdCategories[1].id,
      name: 'HumaniQ Big Five – Cinco Grandes Fatores da Personalidade',
      description: 'Avalia os cinco principais fatores de personalidade: Abertura, Conscienciosidade, Extroversão, Amabilidade e Neuroticismo.',
      instructions: 'Avalie cada afirmação de acordo com o quanto ela descreve você. Use a escala de 1 (Discordo totalmente) a 5 (Concordo totalmente).',
      testType: TestType.PERSONALITY,
      estimatedDuration: 15,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: true,
        timeLimit: 900,
        retakePolicy: 'limited',
        maxRetakes: 1,
        dimensions: ['Abertura', 'Conscienciosidade', 'Extroversão', 'Amabilidade', 'Neuroticismo'],
        totalQuestions: 120
      }
    },
    {
      categoryId: createdCategories[1].id,
      name: 'HumaniQ DISC - Comportamento e Comunicação',
      description: 'Identifica perfil comportamental baseado no modelo DISC para otimizar comunicação e trabalho em equipe.',
      instructions: 'Para cada situação, escolha a alternativa que melhor descreve seu comportamento mais natural e espontâneo.',
      testType: TestType.PERSONALITY,
      estimatedDuration: 20,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: true,
        timeLimit: 1200,
        retakePolicy: 'unlimited',
        dimensions: ['Dominância', 'Influência', 'Estabilidade', 'Conformidade'],
        totalQuestions: 28
      }
    },
    {
      categoryId: createdCategories[1].id,
      name: 'HumaniQ Eneagrama – Tipos de Personalidade',
      description: 'Identifica o tipo de personalidade baseado no sistema do Eneagrama, revelando motivações centrais e padrões de comportamento.',
      instructions: 'Escolha a opção que melhor descreve você em cada grupo de afirmações.',
      testType: TestType.PERSONALITY,
      estimatedDuration: 25,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: true,
        timeLimit: 1500,
        retakePolicy: 'unlimited',
        dimensions: ['Tipo 1: Perfeccionista', 'Tipo 2: Ajudante', 'Tipo 3: Realizador', 'Tipo 4: Individualista', 'Tipo 5: Investigador', 'Tipo 6: Leal', 'Tipo 7: Entusiasta', 'Tipo 8: Desafiador', 'Tipo 9: Pacificador'],
        totalQuestions: 45
      }
    },
    {
      categoryId: createdCategories[1].id,
      name: 'HumaniQ FLEX – Avaliação de Adaptabilidade',
      description: 'Avalia a capacidade de adaptação a mudanças, flexibilidade e resiliência em ambientes dinâmicos.',
      instructions: 'Responda como você reagiria às situações de mudança descritas.',
      testType: TestType.PERSONALITY,
      estimatedDuration: 20,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: false,
        timeLimit: 1200,
        retakePolicy: 'limited',
        maxRetakes: 2,
        dimensions: ['Flexibilidade Cognitiva', 'Adaptabilidade Emocional', 'Resiliência', 'Abertura a Novidades'],
        totalQuestions: 32
      }
    },
    {
      categoryId: createdCategories[1].id,
      name: 'HumaniQ MOTIVA – Perfil de Motivação Profissional',
      description: 'Identifica os fatores que motivam o desempenho profissional e o engajamento no trabalho.',
      instructions: 'Avalie o quanto cada fator é importante para sua motivação no trabalho.',
      testType: TestType.PERSONALITY,
      estimatedDuration: 15,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: true,
        timeLimit: 900,
        retakePolicy: 'unlimited',
        dimensions: ['Motivação Intrínseca', 'Motivação Extrínseca', 'Crescimento', 'Relacionamentos', 'Autonomia'],
        totalQuestions: 25
      }
    },
    {
      categoryId: createdCategories[1].id,
      name: 'HumaniQ QI – Quociente de Inteligência',
      description: 'Avalia habilidades cognitivas, raciocínio lógico e capacidade de resolução de problemas.',
      instructions: 'Resolva os problemas lógicos e padrões o mais rapidamente possível.',
      testType: TestType.PERSONALITY,
      estimatedDuration: 30,
      configuration: {
        adaptiveTesting: true,
        randomizeQuestions: false,
        timeLimit: 1800,
        retakePolicy: 'limited',
        maxRetakes: 1,
        dimensions: ['Raciocínio Verbal', 'Raciocínio Numérico', 'Raciocínio Abstrato', 'Memória'],
        totalQuestions: 40
      }
    },
    {
      categoryId: createdCategories[1].id,
      name: 'HumaniQ TAR – Teste de Atenção e Raciocínio',
      description: 'Avalia níveis de atenção, concentração e habilidades de raciocínio rápido.',
      instructions: 'Complete as tarefas de atenção e raciocínio no tempo determinado.',
      testType: TestType.PERSONALITY,
      estimatedDuration: 25,
      configuration: {
        adaptiveTesting: true,
        randomizeQuestions: false,
        timeLimit: 1500,
        retakePolicy: 'limited',
        maxRetakes: 1,
        dimensions: ['Atenção Seletiva', 'Atenção Sustentada', 'Raciocínio Lógico', 'Velocidade de Processamento'],
        totalQuestions: 35
      }
    },
    {
      categoryId: createdCategories[1].id,
      name: 'HumaniQ TIPOS – Perfil Cognitivo (MBTI)',
      description: 'Baseado no MBTI, identifica um dos 16 tipos de personalidade através de 4 dimensões principais.',
      instructions: 'Para cada par de características, escolha a que melhor descreve sua preferência natural. Não há respostas certas ou erradas.',
      testType: TestType.PERSONALITY,
      estimatedDuration: 25,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: false,
        timeLimit: 1500,
        retakePolicy: 'unlimited',
        dimensions: ['Extroversão vs Introversão', 'Sensação vs Intuição', 'Pensamento vs Sentimento', 'Julgamento vs Percepção'],
        totalQuestions: 70
      }
    },
    {
      categoryId: createdCategories[1].id,
      name: 'HumaniQ Valores – Mapa de Valores Pessoais e Profissionais',
      description: 'Mapeia os valores centrais que orientam decisões, comportamento e motivação profissional baseado na Teoria dos Valores Humanos Universais de Shalom H. Schwartz.',
      instructions: 'Avalie cada afirmação de acordo com o quanto ela reflete seus valores pessoais e profissionais. Use a escala de 1 (Discordo totalmente) a 5 (Concordo totalmente). Seja honesto e reflita sobre o que realmente é importante para você.',
      testType: TestType.PERSONALITY,
      estimatedDuration: 25,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: false,
        timeLimit: 1500,
        retakePolicy: 'unlimited',
        dimensions: ['Universalismo', 'Benevolência', 'Realização', 'Poder', 'Hedonismo', 'Estimulação', 'Autodireção', 'Segurança', 'Conformidade', 'Tradição'],
        totalQuestions: 50
      }
    },

    // CATEGORIA 3: TESTE GRAFOLÓGICO (1 TESTE)
    {
      categoryId: createdCategories[2].id,
      name: 'HumaniQ GRA - Análise Grafológica',
      description: 'Análise de personalidade através da escrita manuscrita com interpretação por Inteligência Artificial.',
      instructions: 'Escreva o texto solicitado de forma natural, como escreveria normalmente. Use caneta ou stylus se disponível.',
      testType: TestType.GRAPHOLOGY,
      estimatedDuration: 15,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: false,
        timeLimit: 900,
        retakePolicy: 'none',
        analysisType: 'AI-powered',
        textSamples: ['Texto livre sobre seus objetivos profissionais', 'Descrição de uma experiência marcante', 'Assinatura e texto padrão'],
        totalSamples: 3
      }
    },

    // CATEGORIA 4: TESTES CORPORATIVOS (9 TESTES)
    {
      categoryId: createdCategories[3].id,
      name: 'HumaniQ LID - Liderança e Gestão',
      description: 'Avalia competências de liderança, capacidade de gestão de equipes e tomada de decisão.',
      instructions: 'Responda baseado em experiências reais de liderança, mesmo que informais. Considere situações onde você orientou outros.',
      testType: TestType.CORPORATE,
      estimatedDuration: 35,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: false,
        timeLimit: 2100,
        retakePolicy: 'limited',
        maxRetakes: 2,
        dimensions: ['Visão Estratégica', 'Influência', 'Delegação', 'Desenvolvimento de Pessoas', 'Tomada de Decisão'],
        totalQuestions: 45
      }
    },
    {
      categoryId: createdCategories[3].id,
      name: 'HumaniQ TEQ - Trabalho em Equipe',
      description: 'Avalia habilidades de colaboração, cooperação e contribuição efetiva em equipes de trabalho.',
      instructions: 'Pense em experiências recentes trabalhando em equipe. Responda como você naturalmente se comporta nessas situações.',
      testType: TestType.CORPORATE,
      estimatedDuration: 25,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: true,
        timeLimit: 1500,
        retakePolicy: 'unlimited',
        dimensions: ['Colaboração', 'Comunicação em Equipe', 'Resolução de Conflitos', 'Compartilhamento'],
        totalQuestions: 32
      }
    },
    {
      categoryId: createdCategories[3].id,
      name: 'HumaniQ ADT - Adaptabilidade e Mudança',
      description: 'Mede flexibilidade, resiliência e capacidade de adaptação a mudanças organizacionais.',
      instructions: 'Reflita sobre como você reage a mudanças e situações imprevistas no trabalho. Seja honesto sobre suas reações.',
      testType: TestType.CORPORATE,
      estimatedDuration: 20,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: false,
        timeLimit: 1200,
        retakePolicy: 'limited',
        maxRetakes: 3,
        dimensions: ['Flexibilidade', 'Resiliência', 'Abertura à Mudança', 'Aprendizagem Contínua'],
        totalQuestions: 28
      }
    },
    {
      categoryId: createdCategories[3].id,
      name: 'HumaniQ CRI - Criatividade e Inovação',
      description: 'Avalia pensamento criativo, capacidade de inovação e geração de soluções originais.',
      instructions: 'Responda sobre como você aborda problemas e gera ideias. Considere tanto criatividade quanto implementação prática.',
      testType: TestType.CORPORATE,
      estimatedDuration: 30,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: true,
        timeLimit: 1800,
        retakePolicy: 'unlimited',
        dimensions: ['Pensamento Divergente', 'Originalidade', 'Implementação de Ideias', 'Inovação Prática'],
        totalQuestions: 36
      }
    },
    {
      categoryId: createdCategories[3].id,
      name: 'HumaniQ PRE - Resolução de Problemas',
      description: 'Mede habilidades analíticas, pensamento lógico e capacidade de resolver problemas complexos.',
      instructions: 'Você encontrará situações-problema. Analise cada cenário e escolha a melhor abordagem de solução.',
      testType: TestType.CORPORATE,
      estimatedDuration: 40,
      configuration: {
        adaptiveTesting: true,
        randomizeQuestions: false,
        timeLimit: 2400,
        retakePolicy: 'limited',
        maxRetakes: 2,
        dimensions: ['Análise de Problemas', 'Pensamento Lógico', 'Criatividade na Solução', 'Implementação'],
        totalQuestions: 35
      }
    },
    {
      categoryId: createdCategories[3].id,
      name: 'HumaniQ COM - Comunicação Eficaz',
      description: 'Avalia habilidades de comunicação verbal, escrita e capacidade de transmitir informações claramente.',
      instructions: 'Responda sobre suas preferências e habilidades de comunicação em diferentes contextos profissionais.',
      testType: TestType.CORPORATE,
      estimatedDuration: 25,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: false,
        timeLimit: 1500,
        retakePolicy: 'unlimited',
        dimensions: ['Comunicação Verbal', 'Comunicação Escrita', 'Escuta Ativa', 'Apresentações'],
        totalQuestions: 30
      }
    },
    {
      categoryId: createdCategories[3].id,
      name: 'HumaniQ MOT - Motivação e Engajamento',
      description: 'Identifica fatores motivacionais pessoais e nível de engajamento com o trabalho e objetivos organizacionais.',
      instructions: 'Reflita sobre o que mais te motiva no trabalho e como você se relaciona com seus objetivos profissionais.',
      testType: TestType.CORPORATE,
      estimatedDuration: 20,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: true,
        timeLimit: 1200,
        retakePolicy: 'unlimited',
        dimensions: ['Motivação Intrínseca', 'Motivação Extrínseca', 'Engajamento', 'Propósito'],
        totalQuestions: 26
      }
    },
    {
      categoryId: createdCategories[3].id,
      name: 'HumaniQ EST - Gestão de Estresse',
      description: 'Avalia capacidade de lidar com pressão, gerenciar estresse e manter performance sob adversidade.',
      instructions: 'Pense em situações estressantes que você enfrentou no trabalho. Responda sobre suas estratégias de enfrentamento.',
      testType: TestType.CORPORATE,
      estimatedDuration: 25,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: false,
        timeLimit: 1500,
        retakePolicy: 'limited',
        maxRetakes: 2,
        dimensions: ['Reconhecimento do Estresse', 'Estratégias de Enfrentamento', 'Resiliência', 'Equilíbrio'],
        totalQuestions: 32
      }
    },
    {
      categoryId: createdCategories[3].id,
      name: 'HumaniQ ETI - Ética e Integridade',
      description: 'Avalia valores éticos, integridade moral e comportamento ético em situações profissionais complexas.',
      instructions: 'Você encontrará dilemas éticos profissionais. Escolha a resposta que melhor reflete seus valores e princípios.',
      testType: TestType.CORPORATE,
      estimatedDuration: 30,
      configuration: {
        adaptiveTesting: false,
        randomizeQuestions: false,
        timeLimit: 1800,
        retakePolicy: 'limited',
        maxRetakes: 1,
        dimensions: ['Integridade', 'Responsabilidade', 'Transparência', 'Valores Organizacionais'],
        totalQuestions: 24
      }
    }
  ]

  const createdTests = []
  for (const test of tests) {
    // Check if test exists by name
    const existing = await prisma.test.findFirst({
      where: { name: test.name }
    })
    
    let created
    if (existing) {
      created = await prisma.test.update({
        where: { id: existing.id },
        data: test
      })
    } else {
      created = await prisma.test.create({
        data: test
      })
    }
    createdTests.push(created)
  }

  // Create questions for HumaniQ Valores test
  console.log('❓ Creating HumaniQ Valores questions...')
  const valoresTest = createdTests.find(test => test.name === 'HumaniQ Valores – Mapa de Valores Pessoais e Profissionais')
  
  if (!valoresTest) {
    throw new Error('HumaniQ Valores test not found')
  }
  
  const valoresQuestions = [
    // Universalismo (1-5)
    {
      testId: valoresTest.id,
      questionNumber: 1,
      questionText: 'Acredito que todos devem ser tratados com igualdade e respeito.',
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
      metadata: { dimension: 'Universalismo' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 2,
      questionText: 'Me preocupo com problemas ambientais.',
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
      metadata: { dimension: 'Universalismo' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 3,
      questionText: 'Defendo a diversidade cultural e a inclusão.',
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
      metadata: { dimension: 'Universalismo' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 4,
      questionText: 'Sinto responsabilidade pelas gerações futuras.',
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
      metadata: { dimension: 'Universalismo' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 5,
      questionText: 'Tenho empatia com quem sofre, mesmo que esteja longe de mim.',
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
      metadata: { dimension: 'Universalismo' }
    },
    // Benevolência (6-10)
    {
      testId: valoresTest.id,
      questionNumber: 6,
      questionText: 'Procuro ajudar pessoas próximas sempre que possível.',
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
      metadata: { dimension: 'Benevolência' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 7,
      questionText: 'Me preocupo com o bem-estar da minha equipe.',
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
      metadata: { dimension: 'Benevolência' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 8,
      questionText: 'Tenho prazer em apoiar colegas em dificuldades.',
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
      metadata: { dimension: 'Benevolência' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 9,
      questionText: 'Prezo pela harmonia nos relacionamentos.',
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
      metadata: { dimension: 'Benevolência' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 10,
      questionText: 'Evito atitudes que possam prejudicar pessoas ao meu redor.',
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
      metadata: { dimension: 'Benevolência' }
    },
    // Realização (11-15)
    {
      testId: valoresTest.id,
      questionNumber: 11,
      questionText: 'Me esforço para alcançar meus objetivos com excelência.',
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
      metadata: { dimension: 'Realização' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 12,
      questionText: 'Busco ser reconhecido pelo meu desempenho.',
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
      metadata: { dimension: 'Realização' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 13,
      questionText: 'Sinto motivação quando supero desafios.',
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
      metadata: { dimension: 'Realização' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 14,
      questionText: 'Tenho ambição de crescer profissionalmente.',
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
      metadata: { dimension: 'Realização' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 15,
      questionText: 'O sucesso pessoal é uma prioridade para mim.',
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
      metadata: { dimension: 'Realização' }
    },
    // Poder (16-20)
    {
      testId: valoresTest.id,
      questionNumber: 16,
      questionText: 'Gosto de estar em posições de liderança.',
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
      metadata: { dimension: 'Poder' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 17,
      questionText: 'Quero ser respeitado pela minha autoridade.',
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
      metadata: { dimension: 'Poder' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 18,
      questionText: 'Ter influência sobre decisões me realiza.',
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
      metadata: { dimension: 'Poder' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 19,
      questionText: 'Valorizo alcançar status elevado.',
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
      metadata: { dimension: 'Poder' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 20,
      questionText: 'Busco segurança através de poder financeiro ou social.',
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
      metadata: { dimension: 'Poder' }
    },
    // Hedonismo (21-25)
    {
      testId: valoresTest.id,
      questionNumber: 21,
      questionText: 'Gosto de aproveitar a vida com conforto e prazer.',
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
      metadata: { dimension: 'Hedonismo' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 22,
      questionText: 'Busco momentos de lazer mesmo em dias de trabalho intenso.',
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
      metadata: { dimension: 'Hedonismo' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 23,
      questionText: 'Sinto que o trabalho deve proporcionar satisfação pessoal.',
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
      metadata: { dimension: 'Hedonismo' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 24,
      questionText: 'Gosto de recompensas que tragam prazer imediato.',
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
      metadata: { dimension: 'Hedonismo' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 25,
      questionText: 'Prezo pelo equilíbrio entre dever e prazer.',
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
      metadata: { dimension: 'Hedonismo' }
    },
    // Estimulação (26-30)
    {
      testId: valoresTest.id,
      questionNumber: 26,
      questionText: 'Me motivo com projetos diferentes e inovadores.',
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
      metadata: { dimension: 'Estimulação' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 27,
      questionText: 'Rotinas muito fixas me desanimam.',
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
      metadata: { dimension: 'Estimulação' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 28,
      questionText: 'Gosto de experimentar coisas novas.',
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
      metadata: { dimension: 'Estimulação' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 29,
      questionText: 'Busco desafios que me tirem da zona de conforto.',
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
      metadata: { dimension: 'Estimulação' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 30,
      questionText: 'Sinto prazer em correr riscos controlados.',
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
      metadata: { dimension: 'Estimulação' }
    },
    // Autodireção (31-35)
    {
      testId: valoresTest.id,
      questionNumber: 31,
      questionText: 'Gosto de decidir como realizar meu trabalho.',
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
      metadata: { dimension: 'Autodireção' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 32,
      questionText: 'Prefiro ter liberdade do que seguir ordens rígidas.',
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
      metadata: { dimension: 'Autodireção' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 33,
      questionText: 'Penso com independência, mesmo que isso gere conflitos.',
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
      metadata: { dimension: 'Autodireção' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 34,
      questionText: 'Me incomoda ter que seguir regras sem sentido.',
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
      metadata: { dimension: 'Autodireção' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 35,
      questionText: 'Tenho preferência por tarefas que me permitam criar.',
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
      metadata: { dimension: 'Autodireção' }
    },
    // Segurança (36-40)
    {
      testId: valoresTest.id,
      questionNumber: 36,
      questionText: 'Busco estabilidade e previsibilidade no ambiente de trabalho.',
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
      metadata: { dimension: 'Segurança' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 37,
      questionText: 'Me preocupo com riscos que afetem minha segurança ou a da equipe.',
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
      metadata: { dimension: 'Segurança' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 38,
      questionText: 'Valorizo normas e políticas claras.',
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
      metadata: { dimension: 'Segurança' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 39,
      questionText: 'A segurança financeira é essencial para mim.',
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
      metadata: { dimension: 'Segurança' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 40,
      questionText: 'Me tranquiliza saber que estou em um ambiente protegido.',
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
      metadata: { dimension: 'Segurança' }
    },
    // Conformidade (41-45)
    {
      testId: valoresTest.id,
      questionNumber: 41,
      questionText: 'Cumpro regras, mesmo que não concorde totalmente com elas.',
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
      metadata: { dimension: 'Conformidade' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 42,
      questionText: 'Acredito que seguir processos é importante para a harmonia.',
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
      metadata: { dimension: 'Conformidade' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 43,
      questionText: 'Evito agir impulsivamente.',
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
      metadata: { dimension: 'Conformidade' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 44,
      questionText: 'Sinto desconforto quando os outros não respeitam regras.',
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
      metadata: { dimension: 'Conformidade' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 45,
      questionText: 'A disciplina é fundamental em qualquer organização.',
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
      metadata: { dimension: 'Conformidade' }
    },
    // Tradição (46-50)
    {
      testId: valoresTest.id,
      questionNumber: 46,
      questionText: 'Respeito valores e práticas tradicionais.',
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
      metadata: { dimension: 'Tradição' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 47,
      questionText: 'Acredito que há sabedoria em costumes antigos.',
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
      metadata: { dimension: 'Tradição' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 48,
      questionText: 'Mantenho rituais e rotinas que me conectam com minhas raízes.',
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
      metadata: { dimension: 'Tradição' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 49,
      questionText: 'Valorizo a história e os princípios que moldaram quem sou.',
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
      metadata: { dimension: 'Tradição' }
    },
    {
      testId: valoresTest.id,
      questionNumber: 50,
      questionText: 'Acredito que tradições mantêm a coesão social.',
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
      metadata: { dimension: 'Tradição' }
    }
  ]

  for (const question of valoresQuestions) {
    // Check if question already exists
    const existingQuestion = await prisma.question.findFirst({
      where: {
        testId: question.testId,
        questionNumber: question.questionNumber
      }
    })

    if (existingQuestion) {
      await prisma.question.update({
        where: { id: existingQuestion.id },
        data: question
      })
    } else {
      await prisma.question.create({
        data: question
      })
    }
  }

  console.log(`✅ Created ${valoresQuestions.length} questions for HumaniQ Valores test`)
  console.log('📊 Questions organized by dimensions:')
  const dimensionCounts = valoresQuestions.reduce((acc: Record<string, number>, q) => {
    acc[q.metadata.dimension] = (acc[q.metadata.dimension] || 0) + 1
    return acc
  }, {})
  Object.entries(dimensionCounts).forEach(([dimension, count]) => {
    console.log(`   ${dimension}: ${count} questions`)
  })

  // Create sample company
  console.log('🏢 Creating sample company...')
  const existingCompany = await prisma.company.findFirst({
    where: { name: 'Empresa Demonstração Ltda' }
  })
  
  let sampleCompany
  if (existingCompany) {
    sampleCompany = existingCompany
  } else {
    sampleCompany = await prisma.company.create({
      data: {
        name: 'Empresa Demonstração Ltda',
        cnpj: '12.345.678/0001-90',
        industry: 'Tecnologia',
        size: 'MEDIUM',
        website: 'https://exemplo.com.br',
        street: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        country: 'Brasil',
        subscriptionPlan: 'PROFESSIONAL',
        subscriptionStatus: 'ACTIVE',
        subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        ownerId: companyUser.id, // Company user is the owner
        settings: {
          theme: 'light',
          notifications: true,
          autoReports: true,
          language: 'pt-BR'
        }
      }
    })
  }

  // Update users to associate with the company
  await prisma.user.update({
    where: { id: companyUser.id },
    data: { companyId: sampleCompany.id }
  })

  await prisma.user.update({
    where: { id: employeeUser.id },
    data: { companyId: sampleCompany.id }
  })

  await prisma.user.update({
    where: { id: candidateUser.id },
    data: { companyId: sampleCompany.id }
  })

  await prisma.user.update({
    where: { id: luizUser.id },
    data: { companyId: sampleCompany.id }
  })



  // Create ERP configuration sample
  console.log('🔗 Creating ERP configuration...')
  await prisma.eRPConfig.upsert({
    where: { id: 'erp-demo-config' },
    update: {},
    create: {
      id: 'erp-demo-config',
      name: 'TOTVS Protheus Demo',
      companyId: sampleCompany.id,
      erpType: 'TOTVS_PROTHEUS',
      apiUrl: 'https://demo-totvs-api.com/api/v1',
      apiKey: 'demo-api-key-12345',
      username: 'demo_user',
      isActive: true,
      syncStatus: 'SUCCESS',
      lastSync: new Date(),
      employeeCount: 150,
      autoSync: true,
      config: {
        syncEmployees: true,
        syncDepartments: true,
        syncFrequency: 'daily',
        mappings: {
          employeeId: 'employee_code',
          department: 'dept_name',
          position: 'job_title'
        }
      }
    }
  })

  // Create sample notifications
  console.log('🔔 Creating sample notifications...')
  await prisma.userNotification.create({
    data: {
      userId: adminUser.id,
      type: 'INFO',
      title: 'Bem-vindo ao HumaniQ AI!',
      message: 'Sistema inicializado com sucesso. Você é o administrador principal da plataforma.',
      createdAt: new Date()
    }
  })

  await prisma.companyNotification.create({
    data: {
      companyId: sampleCompany.id,
      type: 'SUCCESS',
      title: 'Integração ERP Configurada',
      message: 'A integração com TOTVS foi configurada e está funcionando corretamente.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    }
  })

  console.log('✅ Database seed completed successfully!')
  console.log('\n📝 Demo User Accounts:')
  console.log('👑 ADMINISTRADOR:')
  console.log('   🔹 Email: admin@humaniq.ai')
  console.log('   🔹 Senha: admin123')
  console.log('   🔹 Tipo: Administrador Principal (Proprietário da SaaS)')
  console.log('\n🏢 EMPRESA:')
  console.log('   🔹 Email: empresa@demo.com')
  console.log('   🔹 Senha: empresa123')
  console.log('   🔹 Tipo: Empresa (Gestão de colaboradores e testes)')
  console.log('\n👤 COLABORADOR:')
  console.log('   🔹 Email: colaborador@demo.com')
  console.log('   🔹 Senha: colaborador123')
  console.log('   🔹 Tipo: Colaborador (Realizar testes psicossociais)')
  console.log('\n🎯 CANDIDATO:')
  console.log('   🔹 Email: candidato@demo.com')
  console.log('   🔹 Senha: candidato123')
  console.log('   🔹 Tipo: Candidato (Processo seletivo)')
  console.log('\n🧪 HumaniQ AI Complete Test Suite:')
  console.log(`🔹 ${createdCategories.length} test categories`)
  console.log(`🔹 ${createdTests.length} complete HumaniQ tests (4 Psicossociais + 4 Perfil + 1 Grafológico + 9 Corporativos)`)
  console.log(`🔹 ${valoresQuestions.length} questions for HumaniQ Valores test`)
  console.log('🔹 1 sample company with ERP integration')
  console.log('🔹 Sample notifications')
  console.log('\n🎯 Test Distribution:')
  console.log('🔹 Testes Psicossociais: RPO, BSC, SESM, RAO')
  console.log('🔹 Testes de Perfil: BFI, 16P, DISC, EIQ')
  console.log('🔹 Teste Grafológico: GRA')
  console.log('🔹 Testes Corporativos: LID, TEQ, ADT, CRI, PRE, COM, MOT, EST, ETI')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
