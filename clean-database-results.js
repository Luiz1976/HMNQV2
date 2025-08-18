#!/usr/bin/env node

/**
 * Script para Limpeza de Resultados de Testes do Banco de Dados
 * 
 * Este script remove todos os resultados de testes do banco de dados,
 * mantendo apenas a estrutura das tabelas e dados de configuração.
 * 
 * Tabelas que serão limpas:
 * - test_results (resultados dos testes)
 * - answers (respostas dos usuários)
 * - test_sessions (sessões de teste)
 * - ai_analyses (análises de IA)
 * 
 * Tabelas preservadas:
 * - users (usuários)
 * - companies (empresas)
 * - tests (definições de testes)
 * - test_categories (categorias de testes)
 * - questions (perguntas dos testes)
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function cleanDatabaseResults() {
  console.log('🧹 Iniciando limpeza dos resultados de testes do banco de dados...')
  console.log('⏰ Timestamp:', new Date().toISOString())
  console.log()

  const startTime = Date.now()
  let totalRecordsDeleted = 0

  try {
    // Conectar ao banco de dados
    await prisma.$connect()
    console.log('✅ Conectado ao banco de dados')

    // 1. Contar registros antes da limpeza
    console.log('📊 Contando registros antes da limpeza...')
    const beforeCounts = {
      aiAnalyses: await prisma.aIAnalysis.count(),
      testResults: await prisma.testResult.count(),
      answers: await prisma.answer.count(),
      testSessions: await prisma.testSession.count()
    }

    console.log('📈 Registros encontrados:')
    console.log(`   • AI Analyses: ${beforeCounts.aiAnalyses}`)
    console.log(`   • Test Results: ${beforeCounts.testResults}`)
    console.log(`   • Answers: ${beforeCounts.answers}`)
    console.log(`   • Test Sessions: ${beforeCounts.testSessions}`)
    console.log()

    // 2. Limpar tabelas em ordem (respeitando foreign keys)
    console.log('🗑️  Iniciando limpeza das tabelas...')

    // 2.1. Limpar AI Analyses primeiro
    console.log('   Limpando AI Analyses...')
    const deletedAI = await prisma.aIAnalysis.deleteMany({})
    console.log(`   ✅ ${deletedAI.count} registros de AI Analyses removidos`)
    totalRecordsDeleted += deletedAI.count

    // 2.2. Limpar Test Results
    console.log('   Limpando Test Results...')
    const deletedResults = await prisma.testResult.deleteMany({})
    console.log(`   ✅ ${deletedResults.count} registros de Test Results removidos`)
    totalRecordsDeleted += deletedResults.count

    // 2.3. Limpar Answers
    console.log('   Limpando Answers...')
    const deletedAnswers = await prisma.answer.deleteMany({})
    console.log(`   ✅ ${deletedAnswers.count} registros de Answers removidos`)
    totalRecordsDeleted += deletedAnswers.count

    // 2.4. Limpar Test Sessions por último
    console.log('   Limpando Test Sessions...')
    const deletedSessions = await prisma.testSession.deleteMany({})
    console.log(`   ✅ ${deletedSessions.count} registros de Test Sessions removidos`)
    totalRecordsDeleted += deletedSessions.count

    console.log()

    // 3. Verificar se as tabelas estão vazias
    console.log('🔍 Verificando limpeza...')
    const afterCounts = {
      aiAnalyses: await prisma.aIAnalysis.count(),
      testResults: await prisma.testResult.count(),
      answers: await prisma.answer.count(),
      testSessions: await prisma.testSession.count()
    }

    console.log('📉 Registros após limpeza:')
    console.log(`   • AI Analyses: ${afterCounts.aiAnalyses}`)
    console.log(`   • Test Results: ${afterCounts.testResults}`)
    console.log(`   • Answers: ${afterCounts.answers}`)
    console.log(`   • Test Sessions: ${afterCounts.testSessions}`)
    console.log()

    // 4. Verificar tabelas preservadas
    console.log('🔒 Verificando tabelas preservadas...')
    const preservedCounts = {
      users: await prisma.user.count(),
      companies: await prisma.company.count(),
      tests: await prisma.test.count(),
      testCategories: await prisma.testCategory.count(),
      questions: await prisma.question.count()
    }

    console.log('✅ Tabelas preservadas:')
    console.log(`   • Users: ${preservedCounts.users}`)
    console.log(`   • Companies: ${preservedCounts.companies}`)
    console.log(`   • Tests: ${preservedCounts.tests}`)
    console.log(`   • Test Categories: ${preservedCounts.testCategories}`)
    console.log(`   • Questions: ${preservedCounts.questions}`)
    console.log()

    // 5. Relatório final
    const endTime = Date.now()
    const duration = Math.round((endTime - startTime) / 1000 * 100) / 100

    console.log('🎉 LIMPEZA CONCLUÍDA COM SUCESSO!')
    console.log('=' .repeat(50))
    console.log(`📊 Total de registros removidos: ${totalRecordsDeleted}`)
    console.log(`⏱️  Tempo de execução: ${duration} segundos`)
    console.log(`🕐 Concluído em: ${new Date().toISOString()}`)
    console.log()
    console.log('✅ Todas as tabelas de resultados foram limpas')
    console.log('✅ Estrutura do banco de dados preservada')
    console.log('✅ Dados de configuração mantidos')
    console.log()
    console.log('🔄 A página "Resultados Recentes" agora deve estar vazia')

  } catch (error) {
    console.error('❌ ERRO durante a limpeza do banco de dados:')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  } finally {
    // Desconectar do banco de dados
    await prisma.$disconnect()
    console.log('\n🔌 Desconectado do banco de dados')
  }
}

// Executar o script
if (require.main === module) {
  cleanDatabaseResults()
    .then(() => {
      console.log('\n✨ Script executado com sucesso!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Falha na execução do script:', error)
      process.exit(1)
    })
}

module.exports = { cleanDatabaseResults }