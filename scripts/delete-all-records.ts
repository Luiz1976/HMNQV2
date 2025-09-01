// Script para excluir PERMANENTEMENTE todos os 237 registros do banco de dados SQLite
// ATENÇÃO: Esta operação é IRREVERSÍVEL!

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const prisma = new PrismaClient();

// Interface para confirmação do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Função para criar backup dos dados
async function createBackup() {
  console.log('\n🔄 Criando backup dos dados...');
  
  const backupDir = path.join(__dirname, '../backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `backup-before-delete-${timestamp}.json`);
  
  try {
    // Buscar todos os dados
    const [testResults, testSessions, answers, aiAnalyses] = await Promise.all([
      prisma.testResult.findMany({
        include: {
          user: true,
          testSession: true,
          aiAnalysis: true
        }
      }),
      prisma.testSession.findMany({
        include: {
          user: true,
          answers: true
        }
      }),
      prisma.answer.findMany({
        include: {
          user: true,
          testSession: true,
          question: true
        }
      }),
      prisma.aIAnalysis.findMany({
        include: {
          testResult: true
        }
      })
    ]);
    
    const backupData = {
      timestamp: new Date().toISOString(),
      totalRecords: testResults.length + testSessions.length + answers.length + aiAnalyses.length,
      data: {
        testResults,
        testSessions,
        answers,
        aiAnalyses
      }
    };
    
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    console.log(`✅ Backup criado: ${backupFile}`);
    console.log(`📊 Total de registros no backup: ${backupData.totalRecords}`);
    
    return backupFile;
  } catch (error) {
    console.error('❌ Erro ao criar backup:', error);
    throw error;
  }
}

// Função para contar registros antes da exclusão
async function countRecords() {
  console.log('\n📊 Contando registros atuais...');
  
  const [testResultCount, testSessionCount, answerCount, aiAnalysisCount] = await Promise.all([
    prisma.testResult.count(),
    prisma.testSession.count(),
    prisma.answer.count(),
    prisma.aIAnalysis.count()
  ]);
  
  const total = testResultCount + testSessionCount + answerCount + aiAnalysisCount;
  
  console.log(`📋 TestResult: ${testResultCount}`);
  console.log(`📋 TestSession: ${testSessionCount}`);
  console.log(`📋 Answer: ${answerCount}`);
  console.log(`📋 AIAnalysis: ${aiAnalysisCount}`);
  console.log(`📋 TOTAL: ${total}`);
  
  return {
    testResult: testResultCount,
    testSession: testSessionCount,
    answer: answerCount,
    aiAnalysis: aiAnalysisCount,
    total
  };
}

// Função para excluir todos os registros respeitando as relações de chave estrangeira
async function deleteAllRecords() {
  console.log('\n🗑️ Iniciando exclusão de registros...');
  
  try {
    // Ordem de exclusão respeitando as relações de chave estrangeira:
    // 1. AIAnalysis (referencia TestResult)
    // 2. Answer (referencia TestSession e User)
    // 3. TestResult (referencia TestSession e User)
    // 4. TestSession (referencia User)
    
    console.log('🔄 Excluindo AIAnalysis...');
    const deletedAIAnalysis = await prisma.aIAnalysis.deleteMany({});
    console.log(`✅ ${deletedAIAnalysis.count} registros AIAnalysis excluídos`);
    
    console.log('🔄 Excluindo Answer...');
    const deletedAnswers = await prisma.answer.deleteMany({});
    console.log(`✅ ${deletedAnswers.count} registros Answer excluídos`);
    
    console.log('🔄 Excluindo TestResult...');
    const deletedTestResults = await prisma.testResult.deleteMany({});
    console.log(`✅ ${deletedTestResults.count} registros TestResult excluídos`);
    
    console.log('🔄 Excluindo TestSession...');
    const deletedTestSessions = await prisma.testSession.deleteMany({});
    console.log(`✅ ${deletedTestSessions.count} registros TestSession excluídos`);
    
    const totalDeleted = deletedAIAnalysis.count + deletedAnswers.count + deletedTestResults.count + deletedTestSessions.count;
    
    return {
      aiAnalysis: deletedAIAnalysis.count,
      answer: deletedAnswers.count,
      testResult: deletedTestResults.count,
      testSession: deletedTestSessions.count,
      total: totalDeleted
    };
  } catch (error) {
    console.error('❌ Erro durante a exclusão:', error);
    throw error;
  }
}

// Função para salvar log da operação
function saveOperationLog(beforeCount: any, afterCount: any, deletedCount: any, backupFile: string) {
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logFile = path.join(logDir, `delete-operation-${timestamp}.log`);
  
  const logContent = `
=== LOG DE EXCLUSÃO PERMANENTE ===
Data/Hora: ${new Date().toISOString()}
Operação: Exclusão permanente de todos os registros do banco SQLite

CONTAGEM ANTES DA EXCLUSÃO:
- TestResult: ${beforeCount.testResult}
- TestSession: ${beforeCount.testSession}
- Answer: ${beforeCount.answer}
- AIAnalysis: ${beforeCount.aiAnalysis}
- TOTAL: ${beforeCount.total}

REGISTROS EXCLUÍDOS:
- TestResult: ${deletedCount.testResult}
- TestSession: ${deletedCount.testSession}
- Answer: ${deletedCount.answer}
- AIAnalysis: ${deletedCount.aiAnalysis}
- TOTAL: ${deletedCount.total}

CONTAGEM APÓS A EXCLUSÃO:
- TestResult: ${afterCount.testResult}
- TestSession: ${afterCount.testSession}
- Answer: ${afterCount.answer}
- AIAnalysis: ${afterCount.aiAnalysis}
- TOTAL: ${afterCount.total}

ARQUIVO DE BACKUP: ${backupFile}

STATUS: OPERAÇÃO CONCLUÍDA COM SUCESSO
=== FIM DO LOG ===
`;
  
  fs.writeFileSync(logFile, logContent);
  console.log(`📝 Log salvo: ${logFile}`);
}

// Função principal
async function main() {
  console.log('🚨 ATENÇÃO: EXCLUSÃO PERMANENTE DE DADOS 🚨');
  console.log('Esta operação irá excluir PERMANENTEMENTE todos os 237 registros do banco de dados.');
  console.log('Esta ação é IRREVERSÍVEL!');
  
  try {
    // Contar registros antes da exclusão
    const beforeCount = await countRecords();
    
    if (beforeCount.total === 0) {
      console.log('\n✅ Não há registros para excluir.');
      return;
    }
    
    // Confirmação de segurança
    console.log('\n⚠️ CONFIRMAÇÃO DE SEGURANÇA ⚠️');
    const confirmation1 = await askQuestion(`Você tem certeza que deseja excluir ${beforeCount.total} registros? (digite 'SIM' para confirmar): `);
    
    if (confirmation1 !== 'SIM') {
      console.log('❌ Operação cancelada pelo usuário.');
      return;
    }
    
    const confirmation2 = await askQuestion('Esta ação é IRREVERSÍVEL. Digite "EXCLUIR TUDO" para confirmar: ');
    
    if (confirmation2 !== 'EXCLUIR TUDO') {
      console.log('❌ Operação cancelada pelo usuário.');
      return;
    }
    
    // Criar backup
    const backupFile = await createBackup();
    
    // Última confirmação
    const finalConfirmation = await askQuestion('\nBackup criado. Prosseguir com a exclusão? (digite "CONFIRMAR"): ');
    
    if (finalConfirmation !== 'CONFIRMAR') {
      console.log('❌ Operação cancelada pelo usuário.');
      return;
    }
    
    // Excluir registros
    const deletedCount = await deleteAllRecords();
    
    // Contar registros após a exclusão
    const afterCount = await countRecords();
    
    // Salvar log
    saveOperationLog(beforeCount, afterCount, deletedCount, backupFile);
    
    console.log('\n🎉 OPERAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log(`📊 Total de registros excluídos: ${deletedCount.total}`);
    console.log(`💾 Backup salvo em: ${backupFile}`);
    console.log('\n⚠️ LEMBRE-SE: Esta operação foi IRREVERSÍVEL!');
    
  } catch (error) {
    console.error('\n❌ ERRO DURANTE A OPERAÇÃO:', error);
    console.log('\n🔄 Verifique o backup e os logs para mais detalhes.');
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Executar o script
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

export { main as deleteAllRecords };