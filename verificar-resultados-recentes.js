const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

async function checkRecentResults() {
  console.log('=== VERIFICAÇÃO DE RESULTADOS RECENTES ===\n');
  
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  console.log('Horário atual:', now.toISOString());
  console.log('Verificando desde:', oneHourAgo.toISOString());
  console.log('\n--- BANCO DE DADOS SQLite ---');
  
  try {
    const prisma = new PrismaClient();
    
    // Verificar registros da última hora
    const recentTestResults = await prisma.testResult.findMany({
      where: { createdAt: { gte: oneHourAgo } },
      orderBy: { createdAt: 'desc' }
    });
    
    const recentTestSessions = await prisma.testSession.findMany({
      where: { createdAt: { gte: oneHourAgo } },
      orderBy: { createdAt: 'desc' }
    });
    
    const recentAnswers = await prisma.answer.findMany({
      where: { createdAt: { gte: oneHourAgo } },
      orderBy: { createdAt: 'desc' }
    });
    
    const recentAIAnalysis = await prisma.aIAnalysis.findMany({
      where: { createdAt: { gte: oneHourAgo } },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('TestResults recentes (última hora):', recentTestResults.length);
    recentTestResults.forEach(r => {
      console.log('  -', r.id, '|', r.createdAt.toISOString(), '|', r.userId);
    });
    
    console.log('TestSessions recentes (última hora):', recentTestSessions.length);
    recentTestSessions.forEach(s => {
      console.log('  -', s.id, '|', s.createdAt.toISOString(), '|', s.userId);
    });
    
    console.log('Answers recentes (última hora):', recentAnswers.length);
    recentAnswers.forEach(a => {
      console.log('  -', a.id, '|', a.createdAt.toISOString(), '|', a.testSessionId);
    });
    
    console.log('AIAnalysis recentes (última hora):', recentAIAnalysis.length);
    recentAIAnalysis.forEach(ai => {
      console.log('  -', ai.id, '|', ai.createdAt.toISOString(), '|', ai.testResultId);
    });
    
    const totalRecent = recentTestResults.length + recentTestSessions.length + recentAnswers.length + recentAIAnalysis.length;
    console.log('\nTOTAL DE REGISTROS RECENTES (última hora):', totalRecent);
    
    // Se não houver registros na última hora, verificar últimas 24 horas
    if (totalRecent === 0) {
      console.log('\nVerificando últimas 24 horas...');
      
      const dayTestResults = await prisma.testResult.findMany({
        where: { createdAt: { gte: oneDayAgo } },
        orderBy: { createdAt: 'desc' }
      });
      
      const dayTestSessions = await prisma.testSession.findMany({
        where: { createdAt: { gte: oneDayAgo } },
        orderBy: { createdAt: 'desc' }
      });
      
      const dayAnswers = await prisma.answer.findMany({
        where: { createdAt: { gte: oneDayAgo } },
        orderBy: { createdAt: 'desc' }
      });
      
      const dayAIAnalysis = await prisma.aIAnalysis.findMany({
        where: { createdAt: { gte: oneDayAgo } },
        orderBy: { createdAt: 'desc' }
      });
      
      const totalDay = dayTestResults.length + dayTestSessions.length + dayAnswers.length + dayAIAnalysis.length;
      console.log('TOTAL DE REGISTROS (últimas 24h):', totalDay);
      
      if (totalDay > 0) {
        console.log('\nRegistros encontrados nas últimas 24h:');
        dayTestResults.forEach(r => {
          console.log('  TestResult:', r.id, '|', r.createdAt.toISOString(), '|', r.userId);
        });
        dayTestSessions.forEach(s => {
          console.log('  TestSession:', s.id, '|', s.createdAt.toISOString(), '|', s.userId);
        });
        dayAnswers.forEach(a => {
          console.log('  Answer:', a.id, '|', a.createdAt.toISOString(), '|', a.testSessionId);
        });
        dayAIAnalysis.forEach(ai => {
          console.log('  AIAnalysis:', ai.id, '|', ai.createdAt.toISOString(), '|', ai.testResultId);
        });
      }
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.log('Erro ao verificar banco:', error.message);
  }
  
  console.log('\n--- ARQUIVOS JSON RECENTES ---');
  const archivesDir = './archives/results';
  
  if (fs.existsSync(archivesDir)) {
    function checkRecentFiles(dir, basePath = '') {
      const files = fs.readdirSync(dir);
      let recentFiles = [];
      
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const relativePath = path.join(basePath, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          recentFiles = recentFiles.concat(checkRecentFiles(fullPath, relativePath));
        } else if (file.endsWith('.json')) {
          const ageHours = (now - stat.mtime) / (1000 * 60 * 60);
          if (ageHours <= 24) {
            recentFiles.push({
              path: relativePath,
              created: stat.birthtime,
              modified: stat.mtime,
              ageHours: ageHours.toFixed(2)
            });
          }
        }
      });
      
      return recentFiles;
    }
    
    const recentJsonFiles = checkRecentFiles(archivesDir);
    console.log('Arquivos JSON recentes (últimas 24h):', recentJsonFiles.length);
    
    recentJsonFiles.sort((a, b) => b.modified - a.modified);
    recentJsonFiles.forEach(f => {
      console.log('  -', f.path);
      console.log('    Criado:', f.created.toISOString());
      console.log('    Modificado:', f.modified.toISOString());
      console.log('    Idade:', f.ageHours, 'horas');
    });
  } else {
    console.log('Diretório archives/results não existe');
  }
  
  console.log('\n--- LOGS RECENTES ---');
  const logDirs = ['./logs', './temp', './.next'];
  
  logDirs.forEach(logDir => {
    if (fs.existsSync(logDir)) {
      console.log('Verificando:', logDir);
      try {
        const files = fs.readdirSync(logDir);
        files.forEach(file => {
          const fullPath = path.join(logDir, file);
          const stat = fs.statSync(fullPath);
          const ageMinutes = (now - stat.mtime) / (1000 * 60);
          
          if (ageMinutes <= 60 && (file.includes('log') || file.includes('test') || file.includes('result'))) {
            console.log('  - Log recente:', file, '(' + ageMinutes.toFixed(1) + ' min atrás)');
          }
        });
      } catch (e) {
        console.log('  Erro ao ler:', e.message);
      }
    }
  });
  
  console.log('\n=== FIM DA VERIFICAÇÃO ===');
}

checkRecentResults().catch(console.error);