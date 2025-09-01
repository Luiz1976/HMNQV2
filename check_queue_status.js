const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function checkProcessingStatus() {
  try {
    console.log('🔍 Verificando status de processamento em segundo plano...');
    
    // 1. Verificar se há resultados sendo processados (sem dimensionScores ainda)
    const incompleteResults = await prisma.testResult.findMany({
      where: {
        test: {
          name: {
            contains: 'BOLIE'
          }
        },
        OR: [
          { dimensionScores: null },
          { dimensionScores: {} },
          { overallScore: null }
        ]
      },
      include: {
        test: true,
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    });
    
    console.log(`\n📊 Resultados BOLIE incompletos/processando: ${incompleteResults.length}`);
    
    if (incompleteResults.length > 0) {
      console.log('\n🔄 RESULTADOS EM PROCESSAMENTO:');
      incompleteResults.forEach((result, index) => {
        console.log(`${index + 1}. ID: ${result.id}`);
        console.log(`   Usuário: ${result.user.email}`);
        console.log(`   Data: ${result.completedAt}`);
        console.log(`   Score Geral: ${result.overallScore}`);
        console.log(`   Dimensões: ${result.dimensionScores ? 'Parciais' : 'Pendentes'}`);
        console.log('');
      });
    }
    
    // 2. Verificar resultados recentes (últimas 24h)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentResults = await prisma.testResult.findMany({
      where: {
        test: {
          name: {
            contains: 'BOLIE'
          }
        },
        completedAt: {
          gte: yesterday
        }
      },
      include: {
        test: true,
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    });
    
    console.log(`\n📅 Resultados BOLIE das últimas 24h: ${recentResults.length}`);
    
    if (recentResults.length > 0) {
      console.log('\n🕐 RESULTADOS RECENTES:');
      recentResults.forEach((result, index) => {
        console.log(`${index + 1}. ID: ${result.id}`);
        console.log(`   Usuário: ${result.user.email}`);
        console.log(`   Data: ${result.completedAt}`);
        console.log(`   Score: ${result.overallScore}`);
        console.log(`   Status: ${result.dimensionScores && Object.keys(result.dimensionScores).length > 0 ? 'Completo' : 'Processando'}`);
        console.log('');
      });
    }
    
    // 3. Verificar logs de processamento
    const logPath = path.join(__dirname, 'monitoring-log.txt');
    if (fs.existsSync(logPath)) {
      const logContent = fs.readFileSync(logPath, 'utf8');
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = logContent.split('\n').filter(line => line.includes(today));
      
      console.log(`\n📝 Entradas de log de hoje: ${todayLogs.length}`);
      
      const processingLogs = todayLogs.filter(line => 
        line.includes('PROCESSING') || 
        line.includes('CALCULATING') || 
        line.includes('SAVING')
      );
      
      if (processingLogs.length > 0) {
        console.log('\n🔄 LOGS DE PROCESSAMENTO RECENTES:');
        processingLogs.slice(-5).forEach(log => {
          console.log(`   ${log}`);
        });
      }
    }
    
    // 4. Verificar se há arquivos temporários de processamento
    const tempDir = path.join(__dirname, 'temp');
    if (fs.existsSync(tempDir)) {
      const tempFiles = fs.readdirSync(tempDir).filter(file => file.includes('bolie') || file.includes('processing'));
      console.log(`\n📁 Arquivos temporários de processamento: ${tempFiles.length}`);
      if (tempFiles.length > 0) {
        tempFiles.forEach(file => {
          console.log(`   ${file}`);
        });
      }
    }
    
    console.log('\n✅ Verificação de processamento concluída.');
    
  } catch (error) {
    console.error('❌ Erro ao verificar status de processamento:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProcessingStatus();