
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

    // CATEGORIA 2: TESTES DE PERFIL (4 TESTES)
    {
      categoryId: createdCategories[1].id,
      name: 'HumaniQ BFI - Big Five Inventory',
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
        totalQuestions: 44
      }
    },
    {
      categoryId: createdCategories[1].id,
      name: 'HumaniQ 16P - 16 Tipos de Personalidade',
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
      name: 'HumaniQ EIQ - Inteligência Emocional',
      description: 'Avalia competências de inteligência emocional baseado no modelo de Goleman adaptado para ambiente corporativo.',
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

  // Create sample questions for first test
  console.log('❓ Creating sample questions...')
  const sampleQuestions = [
    {
      testId: createdTests[0].id,
      questionNumber: 1,
      questionText: 'Como você geralmente reage em situações de alta pressão no trabalho?',
      questionType: QuestionType.MULTIPLE_CHOICE,
      options: {
        choices: [
          { id: 'a', text: 'Mantenho a calma e foco na solução', value: 'calm_focused' },
          { id: 'b', text: 'Fico nervoso(a) mas continuo trabalhando', value: 'nervous_working' },
          { id: 'c', text: 'Procuro ajuda de colegas ou superiores', value: 'seek_help' },
          { id: 'd', text: 'Preciso de um tempo para me organizar', value: 'need_time' }
        ]
      }
    },
    {
      testId: createdTests[0].id,
      questionNumber: 2,
      questionText: 'Em uma escala de 1 a 5, o quanto você se considera uma pessoa comunicativa?',
      questionType: QuestionType.SCALE,
      options: {
        scale: {
          min: 1,
          max: 5,
          minLabel: 'Muito reservado(a)',
          maxLabel: 'Muito comunicativo(a)',
          step: 1
        }
      }
    },
    {
      testId: createdTests[0].id,
      questionNumber: 3,
      questionText: 'Descreva uma situação em que você demonstrou liderança:',
      questionType: QuestionType.TEXT,
      options: {
        textConfig: {
          maxLength: 500,
          minLength: 50,
          placeholder: 'Descreva a situação, suas ações e os resultados obtidos...'
        }
      }
    }
  ]

  for (const question of sampleQuestions) {
    await prisma.question.upsert({
      where: {
        testId_questionNumber: {
          testId: question.testId,
          questionNumber: question.questionNumber
        }
      },
      update: question,
      create: question
    })
  }

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
  console.log(`🔹 ${sampleQuestions.length} sample questions for first test`)
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
