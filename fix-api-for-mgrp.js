const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function fixAPIForMGRP() {
  try {
    console.log('🔧 Criando fix temporário para mostrar resultados MGRP...');
    
    // 1. Primeiro, vamos verificar os IDs dos usuários que fizeram MGRP
    const mgrpUsers = await prisma.testResult.findMany({
      where: {
        test: {
          name: {
            contains: 'MGRP'
          }
        }
      },
      select: {
        userId: true,
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      distinct: ['userId']
    });
    
    console.log('👥 Usuários que fizeram MGRP:');
    mgrpUsers.forEach((result, index) => {
      console.log(`${index + 1}. ${result.user.firstName} ${result.user.lastName} (${result.user.email})`);
      console.log(`   ID: ${result.userId}`);
    });
    
    // 2. Vamos criar uma versão modificada da API que inclui todos os usuários
    const apiFilePath = path.join(__dirname, 'app', 'api', 'colaborador', 'resultados', 'route.ts');
    
    console.log('\n📝 Criando backup da API original...');
    const backupPath = apiFilePath + '.backup';
    
    // Ler o arquivo original
    const originalContent = fs.readFileSync(apiFilePath, 'utf8');
    
    // Criar backup
    fs.writeFileSync(backupPath, originalContent);
    console.log('✅ Backup criado em:', backupPath);
    
    // 3. Modificar a API para incluir todos os usuários com resultados MGRP
    console.log('\n🔧 Modificando API para incluir usuários MGRP...');
    
    const userIds = mgrpUsers.map(u => `'${u.userId}'`).join(', ');
    
    const modifiedContent = originalContent.replace(
      /const userId = demoUser\.id/,
      `// TEMPORARY FIX: Include MGRP users\n    const mgrpUserIds = [${userIds}]\n    const userId = demoUser.id`
    ).replace(
      /where: {\s*userId: userId\s*}/g,
      `where: {
      OR: [
        { userId: userId },
        { userId: { in: mgrpUserIds } }
      ]
    }`
    );
    
    // Escrever o arquivo modificado
    fs.writeFileSync(apiFilePath, modifiedContent);
    console.log('✅ API modificada com sucesso!');
    
    console.log('\n📋 Instruções:');
    console.log('1. A API agora incluirá resultados de todos os usuários que fizeram MGRP');
    console.log('2. Teste a página de resultados novamente');
    console.log('3. Para reverter as mudanças, execute:');
    console.log(`   cp "${backupPath}" "${apiFilePath}"`);
    
  } catch (error) {
    console.error('❌ Erro ao modificar API:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixAPIForMGRP();