const fs = require('fs');
const path = require('path');

// Lista de arquivos de debug criados durante o processo
const debugFiles = [
  'debug-api-perfil.js',
  'debug-db-perfil.js', 
  'debug-api-auth.js',
  'fix-official-tests.js',
  'test-api-fixed.js',
  'cleanup-debug-files.js' // Este próprio arquivo
];

console.log('🧹 Limpando arquivos de debug...');
console.log('=' .repeat(50));

debugFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Removido: ${file}`);
    } catch (error) {
      console.log(`❌ Erro ao remover ${file}: ${error.message}`);
    }
  } else {
    console.log(`⚠️  Arquivo não encontrado: ${file}`);
  }
});

console.log('\n🏁 Limpeza concluída!');
console.log('\n📋 RESUMO DA CORREÇÃO:');
console.log('✅ Problema identificado: Teste "HumaniQ DISC" não estava na lista oficial');
console.log('✅ Lista OFFICIAL_TESTS atualizada em lib/test-validation.ts');
console.log('✅ Todos os 10 testes de perfil agora passam pelo filtro');
console.log('✅ API /api/colaborador/resultados deve retornar todos os testes');
console.log('\n🌐 Acesse: http://localhost:3000/colaborador/perfil');
console.log('   Para verificar se os testes estão aparecendo corretamente.');