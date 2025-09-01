// Script para adicionar o teste HumaniQ MGRP ao banco de dados
// Este teste está sendo referenciado no código mas não existe no banco

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMGRPTest() {
  console.log('🔍 Adicionando teste HumaniQ MGRP...');

  try {
    // Verificar se o teste já existe
    const existingTest = await prisma.test.findUnique({
      where: { id: 'cme216boc000d8wg02vj91skk' }
    });

    if (existingTest) {
      console.log('✅ Teste MGRP já existe no banco de dados!');
      return;
    }

    // Buscar a categoria de testes psicossociais
    const psychosocialCategory = await prisma.testCategory.findFirst({
      where: {
        name: {
          contains: 'Psicossociais'
        }
      }
    });

    if (!psychosocialCategory) {
      console.log('❌ Categoria de testes psicossociais não encontrada!');
      return;
    }

    console.log(`✅ Categoria encontrada: ${psychosocialCategory.name}`);

    // Criar o teste MGRP
    const mgrpTest = await prisma.test.create({
      data: {
        id: 'cme216boc000d8wg02vj91skk',
        categoryId: psychosocialCategory.id,
        name: 'HumaniQ MGRP – Maturidade em Gestão de Riscos Psicossociais',
        description: 'Avalia o nível de maturidade organizacional na gestão de riscos psicossociais, identificando pontos fortes e oportunidades de melhoria.',
        instructions: 'Este teste avalia cinco dimensões da maturidade em gestão de riscos psicossociais: Prevenção e Mapeamento, Monitoramento e Controle, Acolhimento e Suporte, Conformidade Legal, e Cultura e Comunicação. Responda com base na realidade da sua organização.',
        testType: 'PSYCHOSOCIAL',
        estimatedDuration: 25,
        version: 1,
        isActive: true,
        isPublic: true,
        configuration: {
          dimensions: [
            'Prevenção e Mapeamento',
            'Monitoramento e Controle', 
            'Acolhimento e Suporte',
            'Conformidade Legal',
            'Cultura e Comunicação'
          ],
          totalQuestions: 40,
          questionsPerDimension: 8,
          scoreRange: {
            min: 1,
            max: 5
          },
          maturityLevels: [
            { level: 1, name: 'Inicial', range: [1.0, 2.0] },
            { level: 2, name: 'Básico', range: [2.1, 3.0] },
            { level: 3, name: 'Intermediário', range: [3.1, 4.0] },
            { level: 4, name: 'Avançado', range: [4.1, 4.5] },
            { level: 5, name: 'Excelente', range: [4.6, 5.0] }
          ]
        }
      }
    });

    console.log('✅ Teste MGRP criado com sucesso!');
    console.log(`   ID: ${mgrpTest.id}`);
    console.log(`   Nome: ${mgrpTest.name}`);
    console.log(`   Categoria: ${psychosocialCategory.name}`);
    console.log(`   Tipo: ${mgrpTest.testType}`);

    // Agora vamos criar as 40 questões do teste MGRP
    console.log('\n📝 Criando questões do teste MGRP...');
    
    const questions = [
      // Prevenção e Mapeamento (8 questões)
      { dimension: 'Prevenção e Mapeamento', text: 'A organização possui um mapeamento formal dos riscos psicossociais existentes no ambiente de trabalho.' },
      { dimension: 'Prevenção e Mapeamento', text: 'Existe um processo estruturado para identificação de novos riscos psicossociais.' },
      { dimension: 'Prevenção e Mapeamento', text: 'A organização realiza avaliações periódicas dos riscos psicossociais.' },
      { dimension: 'Prevenção e Mapeamento', text: 'Há ferramentas específicas para diagnóstico de riscos psicossociais.' },
      { dimension: 'Prevenção e Mapeamento', text: 'A organização possui planos de ação preventiva para riscos psicossociais.' },
      { dimension: 'Prevenção e Mapeamento', text: 'Existe documentação adequada sobre os riscos psicossociais identificados.' },
      { dimension: 'Prevenção e Mapeamento', text: 'A organização considera fatores organizacionais na prevenção de riscos psicossociais.' },
      { dimension: 'Prevenção e Mapeamento', text: 'Há integração entre a gestão de riscos psicossociais e outros sistemas de gestão.' },
      
      // Monitoramento e Controle (8 questões)
      { dimension: 'Monitoramento e Controle', text: 'A organização possui indicadores para monitorar riscos psicossociais.' },
      { dimension: 'Monitoramento e Controle', text: 'Existe um sistema de acompanhamento contínuo dos riscos psicossociais.' },
      { dimension: 'Monitoramento e Controle', text: 'A organização realiza análises periódicas da eficácia das medidas de controle.' },
      { dimension: 'Monitoramento e Controle', text: 'Há relatórios regulares sobre a situação dos riscos psicossociais.' },
      { dimension: 'Monitoramento e Controle', text: 'A organização possui mecanismos de alerta precoce para riscos psicossociais.' },
      { dimension: 'Monitoramento e Controle', text: 'Existe controle de qualidade das ações de gestão de riscos psicossociais.' },
      { dimension: 'Monitoramento e Controle', text: 'A organização monitora a satisfação dos colaboradores com as medidas implementadas.' },
      { dimension: 'Monitoramento e Controle', text: 'Há revisão periódica dos procedimentos de controle de riscos psicossociais.' },
      
      // Acolhimento e Suporte (8 questões)
      { dimension: 'Acolhimento e Suporte', text: 'A organização oferece suporte psicológico aos colaboradores.' },
      { dimension: 'Acolhimento e Suporte', text: 'Existe um programa de acolhimento para situações de crise.' },
      { dimension: 'Acolhimento e Suporte', text: 'A organização possui canais de escuta e apoio aos colaboradores.' },
      { dimension: 'Acolhimento e Suporte', text: 'Há profissionais capacitados para oferecer suporte psicossocial.' },
      { dimension: 'Acolhimento e Suporte', text: 'A organização promove ações de bem-estar e qualidade de vida.' },
      { dimension: 'Acolhimento e Suporte', text: 'Existe apoio específico para colaboradores em situação de vulnerabilidade.' },
      { dimension: 'Acolhimento e Suporte', text: 'A organização oferece programas de reabilitação psicossocial.' },
      { dimension: 'Acolhimento e Suporte', text: 'Há integração entre suporte interno e recursos externos de apoio.' },
      
      // Conformidade Legal (8 questões)
      { dimension: 'Conformidade Legal', text: 'A organização conhece e cumpre a legislação sobre riscos psicossociais.' },
      { dimension: 'Conformidade Legal', text: 'Existe acompanhamento das mudanças na legislação relacionada.' },
      { dimension: 'Conformidade Legal', text: 'A organização possui documentação legal adequada sobre riscos psicossociais.' },
      { dimension: 'Conformidade Legal', text: 'Há procedimentos para garantir conformidade legal contínua.' },
      { dimension: 'Conformidade Legal', text: 'A organização realiza auditorias de conformidade legal.' },
      { dimension: 'Conformidade Legal', text: 'Existe responsabilização clara pela conformidade legal.' },
      { dimension: 'Conformidade Legal', text: 'A organização possui assessoria jurídica especializada em riscos psicossociais.' },
      { dimension: 'Conformidade Legal', text: 'Há integração entre conformidade legal e práticas de gestão.' },
      
      // Cultura e Comunicação (8 questões)
      { dimension: 'Cultura e Comunicação', text: 'A organização promove uma cultura de prevenção de riscos psicossociais.' },
      { dimension: 'Cultura e Comunicação', text: 'Existe comunicação clara sobre políticas de riscos psicossociais.' },
      { dimension: 'Cultura e Comunicação', text: 'A organização oferece treinamentos sobre riscos psicossociais.' },
      { dimension: 'Cultura e Comunicação', text: 'Há engajamento da liderança na gestão de riscos psicossociais.' },
      { dimension: 'Cultura e Comunicação', text: 'A organização promove diálogo aberto sobre saúde mental.' },
      { dimension: 'Cultura e Comunicação', text: 'Existe participação dos colaboradores na gestão de riscos psicossociais.' },
      { dimension: 'Cultura e Comunicação', text: 'A organização combate estigmas relacionados à saúde mental.' },
      { dimension: 'Cultura e Comunicação', text: 'Há campanhas de conscientização sobre riscos psicossociais.' }
    ];

    // Criar as questões no banco
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      await prisma.question.create({
        data: {
          testId: mgrpTest.id,
          questionNumber: i + 1,
          questionText: question.text,
          questionType: 'SCALE',
          isRequired: true,
          options: {
            type: 'scale',
            min: 1,
            max: 5,
            labels: {
              1: 'Discordo totalmente',
              2: 'Discordo parcialmente', 
              3: 'Neutro',
              4: 'Concordo parcialmente',
              5: 'Concordo totalmente'
            }
          },
          metadata: {
            dimension: question.dimension
          }
        }
      });
    }

    console.log(`✅ ${questions.length} questões criadas com sucesso!`);
    console.log('\n🎉 Teste MGRP configurado completamente!');
    
  } catch (error) {
    console.error('❌ Erro ao criar teste MGRP:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMGRPTest();