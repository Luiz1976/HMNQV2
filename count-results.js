// Script para contar resultados de testes reais
const fs = require('fs');
const path = require('path');

// Função para contar arquivos nos índices
function countFromIndexes() {
  const indexPath = path.join(__dirname, 'archives', 'index');
  
  try {
    // Ler índice por usuário
    const byUserPath = path.join(indexPath, 'by-user.json');
    const byUserData = JSON.parse(fs.readFileSync(byUserPath, 'utf8'));
    
    let totalFiles = 0;
    // Contar entradas no índice por usuário
    if (byUserData.index && byUserData.index.entries) {
      Object.keys(byUserData.index.entries).forEach(userId => {
        const userEntry = byUserData.index.entries[userId];
        if (userEntry.tests && Array.isArray(userEntry.tests)) {
          totalFiles += userEntry.tests.length;
        }
      });
    } else {
      Object.keys(byUserData).forEach(userId => {
        totalFiles += byUserData[userId].length;
      });
    }
    
    console.log('=== CONTAGEM DE ARQUIVOS DE RESULTADOS ===');
    console.log(`Total de arquivos nos índices: ${totalFiles}`);
    console.log(`Total informado no índice: ${byUserData.totalEntries || 0}`);
    
    // Verificar se os arquivos realmente existem
    let existingFiles = 0;
    let missingFiles = 0;
    
    if (byUserData.index && byUserData.index.entries) {
      Object.keys(byUserData.index.entries).forEach(userId => {
        const userEntry = byUserData.index.entries[userId];
        if (userEntry.tests && Array.isArray(userEntry.tests)) {
          userEntry.tests.forEach(result => {
            if (fs.existsSync(result.filePath)) {
              existingFiles++;
            } else {
              missingFiles++;
              console.log(`Arquivo ausente: ${result.filePath}`);
            }
          });
        }
      });
    } else {
      Object.keys(byUserData).forEach(userId => {
        byUserData[userId].forEach(result => {
          if (fs.existsSync(result.filePath)) {
            existingFiles++;
          } else {
            missingFiles++;
            console.log(`Arquivo ausente: ${result.filePath}`);
          }
        });
      });
    }
    
    console.log(`Arquivos existentes: ${existingFiles}`);
    console.log(`Arquivos ausentes: ${missingFiles}`);
    
    return { totalFiles, existingFiles, missingFiles };
    
  } catch (error) {
    console.error('Erro ao ler índices:', error.message);
    return { totalFiles: 0, existingFiles: 0, missingFiles: 0 };
  }
}

// Função para contar arquivos físicos
function countPhysicalFiles() {
  const resultsPath = path.join(__dirname, 'archives', 'results', '2025');
  
  if (!fs.existsSync(resultsPath)) {
    console.log('Diretório de resultados não existe');
    return 0;
  }
  
  let physicalFiles = 0;
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.json')) {
        physicalFiles++;
        console.log(`Arquivo físico encontrado: ${fullPath}`);
      }
    });
  }
  
  scanDirectory(resultsPath);
  
  console.log(`\nTotal de arquivos físicos .json: ${physicalFiles}`);
  return physicalFiles;
}

// Executar contagens
console.log('Iniciando contagem de resultados...');
const indexCount = countFromIndexes();
const physicalCount = countPhysicalFiles();

console.log('\n=== RESUMO FINAL ===');
console.log(`Arquivos nos índices: ${indexCount.totalFiles}`);
console.log(`Arquivos existentes: ${indexCount.existingFiles}`);
console.log(`Arquivos ausentes: ${indexCount.missingFiles}`);
console.log(`Arquivos físicos: ${physicalCount}`);

if (indexCount.existingFiles !== physicalCount) {
  console.log('\n⚠️  DISCREPÂNCIA DETECTADA!');
  console.log(`Diferença: ${Math.abs(indexCount.existingFiles - physicalCount)} arquivos`);
}

console.log('\n=== ANÁLISE DA CONTAGEM INICIAL ===');
console.log('Contagem inicial informada: 85 itens');
console.log('- 69 registros do banco de dados (10 TestResult + 19 TestSession + 40 Answer)');
console.log(`- ${indexCount.totalFiles} arquivos JSON (conforme índices)`);
console.log('- 6 endpoints de APIs');
console.log(`Total teórico: 69 + ${indexCount.totalFiles} + 6 = ${69 + indexCount.totalFiles + 6}`);

const removedItems = 54;
console.log(`\nItens removidos: ${removedItems}`);
console.log(`Diferença não explicada: ${85 - removedItems} itens`);