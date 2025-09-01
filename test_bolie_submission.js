// Script para testar a submissão do teste BOLIE
// Este script simula uma submissão completa do teste para identificar problemas

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function testBolieSubmission() {
  console.log('🧪 TESTE DE SUBMISSÃO DO BOLIE - INICIANDO')
  console.log('='.repeat(60))
  
  try {
    // 1. Buscar o usuário colaborador@demo.com
    console.log('\n1. 🔍 Buscando usuário colaborador@demo.com...')
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado!')
      return
    }
    
    console.log('✅ Usuário encontrado:', {
      id: user.id,
      email: user.email,
      name: user.name
    })
    
    // 2. Buscar o teste BOLIE
    console.log('\n2. 🔍 Buscando teste BOLIE...')
    const bolieTest = await prisma.test.findFirst({
      where: {
        OR: [
          { name: { contains: 'BOLIE' } },
          { description: { contains: 'BOLIE' } },
          { id: 'cmehdpsox000o8wc0yuai0swa' }
        ]
      },
      include: {
        questions: true
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
    
    // 3. Criar uma nova sessão de teste
    console.log('\n3. 📝 Criando nova sessão de teste...')
    const testSession = await prisma.testSession.create({
      data: {
        testId: bolieTest.id,
        userId: user.id,
        companyId: user.companyId,
        startedAt: new Date(),
        totalQuestions: bolieTest.questions?.length || 45,
        status: 'STARTED'
      }
    })
    
    console.log('✅ Sessão criada:', {
      id: testSession.id,
      status: testSession.status,
      startedAt: testSession.startedAt
    })
    
    // 4. Simular respostas do teste (45 questões com respostas de 1 a 5)
    console.log('\n4. 📋 Simulando respostas do teste...')
    const simulatedAnswers = []
    
    // Gerar 45 respostas simuladas (questões 1-45 com valores 1-5)
    for (let i = 1; i <= 45; i++) {
      simulatedAnswers.push({
        questionId: i,
        selectedOption: Math.floor(Math.random() * 5) + 1, // Valor entre 1 e 5
        dimension: 'Simulada',
        test: 'BOLIE'
      })
    }
    
    console.log(`✅ ${simulatedAnswers.length} respostas simuladas geradas`)
    
    // 5. Simular dados de submissão completos
    console.log('\n5. 🚀 Preparando dados de submissão...')
    const submissionData = {
      testId: bolieTest.id,
      sessionId: testSession.id,
      answers: simulatedAnswers,
      results: {
        overallScore: 3.8,
        classification: 'Inteligência emocional desenvolvida',
        dimensionScores: {
          'Reconhecimento Emocional': 4.2,
          'Compreensão de Causas': 3.5,
          'Tomada de Perspectiva': 3.9,
          'Reação Rápida': 3.7,
          'Tomada de Decisão Emocional': 3.8,
          'Autorregulação': 4.0,
          'Redirecionamento Positivo': 3.6,
          'Empatia Cognitiva': 3.9,
          'Empatia Emocional': 3.7
        },
        testScores: {
          'TOHE': 3.8,
          'VE': 3.7,
          'QORE': 3.9,
          'QOE': 3.8
        }
      },
      duration: 1800, // 30 minutos
      metadata: {
        testName: 'HumaniQ BOLIE – Bateria de Orientação e Liderança para Inteligência Emocional',
        totalQuestions: 45,
        completedAt: new Date().toISOString()
      }
    }
    
    console.log('✅ Dados de submissão preparados:', {
      testId: submissionData.testId,
      sessionId: submissionData.sessionId,
      answersCount: submissionData.answers.length,
      overallScore: submissionData.results.overallScore
    })
    
    // 6. Simular o processo de submissão (sem chamar a API)
    console.log('\n6. 💾 Simulando processo de submissão...')
    
    // Salvar respostas
    console.log('   📝 Salvando respostas...')
    const answersData = submissionData.answers.map(answer => ({
      sessionId: submissionData.sessionId,
      questionId: answer.questionId.toString(),
      userId: user.id,
      answerValue: answer.selectedOption.toString(),
      metadata: { dimension: answer.dimension, test: answer.test }
    }))
    
    // Deletar respostas existentes
    await prisma.answer.deleteMany({
      where: {
        sessionId: submissionData.sessionId,
        userId: user.id
      }
    })
    
    // Inserir novas respostas
    await prisma.answer.createMany({
      data: answersData
    })
    
    console.log(`   ✅ ${answersData.length} respostas salvas no banco`)
    
    // Criar resultado do teste
    console.log('   📊 Criando resultado do teste...')
    const testResult = await prisma.testResult.create({
      data: {
        sessionId: submissionData.sessionId,
        testId: submissionData.testId,
        userId: user.id,
        duration: submissionData.duration,
        overallScore: submissionData.results.overallScore,
        dimensionScores: submissionData.results.dimensionScores,
        metadata: {
          ...submissionData.metadata,
          calculationDate: new Date().toISOString(),
          totalAnswers: submissionData.answers.length
        }
      }
    })
    
    console.log('   ✅ Resultado criado:', {
      id: testResult.id,
      overallScore: testResult.overallScore,
      createdAt: testResult.createdAt
    })
    
    // Atualizar status da sessão
    console.log('   🔄 Atualizando status da sessão...')
    const updatedSession = await prisma.testSession.update({
      where: { id: submissionData.sessionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    })
    
    console.log('   ✅ Sessão atualizada:', {
      id: updatedSession.id,
      status: updatedSession.status,
      completedAt: updatedSession.completedAt
    })
    
    // 7. Verificar se o resultado foi salvo corretamente
    console.log('\n7. 🔍 Verificando resultado salvo...')
    const savedResult = await prisma.testResult.findUnique({
      where: { id: testResult.id },
      include: {
        test: true,
        user: true,
        session: true
      }
    })
    
    if (savedResult) {
      console.log('✅ Resultado verificado no banco:', {
        id: savedResult.id,
        testName: savedResult.test.name,
        userName: savedResult.user.name,
        userEmail: savedResult.user.email,
        sessionStatus: savedResult.session.status,
        overallScore: savedResult.overallScore,
        createdAt: savedResult.createdAt
      })
    } else {
      console.log('❌ Resultado não encontrado no banco!')
    }
    
    // 8. Verificar arquivamento
    console.log('\n8. 📁 Verificando arquivamento...')
    const archiveDir = path.join(process.cwd(), 'archives', 'results')
    
    if (fs.existsSync(archiveDir)) {
      console.log('✅ Diretório de arquivos existe:', archiveDir)
      
      // Buscar arquivos JSON recentes
      const findJsonFiles = (dir) => {
        const files = []
        if (fs.existsSync(dir)) {
          const items = fs.readdirSync(dir, { withFileTypes: true })
          for (const item of items) {
            const fullPath = path.join(dir, item.name)
            if (item.isDirectory()) {
              files.push(...findJsonFiles(fullPath))
            } else if (item.name.endsWith('.json')) {
              const stats = fs.statSync(fullPath)
              files.push({
                path: fullPath,
                name: item.name,
                modified: stats.mtime
              })
            }
          }
        }
        return files
      }
      
      const jsonFiles = findJsonFiles(archiveDir)
      const recentFiles = jsonFiles
        .filter(file => Date.now() - file.modified.getTime() < 60000) // Últimos 60 segundos
        .sort((a, b) => b.modified.getTime() - a.modified.getTime())
      
      if (recentFiles.length > 0) {
        console.log(`✅ ${recentFiles.length} arquivo(s) JSON recente(s) encontrado(s):`)
        recentFiles.forEach(file => {
          console.log(`   📄 ${file.name} (${file.modified.toLocaleString()})`)
        })
      } else {
        console.log('⚠️ Nenhum arquivo JSON recente encontrado')
      }
    } else {
      console.log('❌ Diretório de arquivos não existe:', archiveDir)
    }
    
    console.log('\n' + '=' .repeat(60))
    console.log('🎉 TESTE DE SUBMISSÃO CONCLUÍDO COM SUCESSO!')
    console.log('\n📋 RESUMO:')
    console.log(`   • Usuário: ${user.email}`)
    console.log(`   • Teste: ${bolieTest.name}`)
    console.log(`   • Sessão: ${testSession.id} (${updatedSession.status})`)
    console.log(`   • Resultado: ${testResult.id} (Score: ${testResult.overallScore})`)
    console.log(`   • Respostas: ${answersData.length} salvas`)
    console.log(`   • Arquivos recentes: ${recentFiles?.length || 0}`)
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE DE SUBMISSÃO:')
    console.error('Erro:', error.message)
    console.error('Stack:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar o teste
testBolieSubmission()
  .then(() => {
    console.log('\n✅ Script finalizado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
  })