const fs = require('fs')
const path = require('path')

// Função para buscar resultados arquivados do BOLIE
function buscarBolieArquivado(userId = 'colaborador@demo.com') {
  console.log('🔍 Buscando resultados arquivados do teste BOLIE para:', userId)
  console.log('=' .repeat(60))
  
  const archivesPath = path.join(process.cwd(), 'archives', 'results')
  const resultados = []
  
  if (!fs.existsSync(archivesPath)) {
    console.log('❌ Diretório de arquivos não encontrado:', archivesPath)
    return resultados
  }
  
  console.log('📁 Diretório de arquivos encontrado:', archivesPath)
  
  // Função recursiva para buscar arquivos
  function buscarArquivos(dirPath, nivel = 0) {
    const indent = '  '.repeat(nivel)
    
    try {
      const items = fs.readdirSync(dirPath)
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item)
        const stat = fs.statSync(itemPath)
        
        if (stat.isDirectory()) {
          console.log(`${indent}📂 ${item}/`)
          buscarArquivos(itemPath, nivel + 1)
        } else if (item.endsWith('.json') && !item.startsWith('.')) {
          console.log(`${indent}📄 ${item}`)
          
          try {
            const conteudo = fs.readFileSync(itemPath, 'utf-8')
            const dados = JSON.parse(conteudo)
            
            // Verificar se é resultado do BOLIE e do usuário específico
            const isBolieTest = dados.testName && dados.testName.toLowerCase().includes('bolie')
            const isCorrectUser = dados.userId === userId
            
            if (isBolieTest || isCorrectUser) {
              console.log(`${indent}  ✅ ENCONTRADO:`, {
                arquivo: itemPath,
                testName: dados.testName,
                userId: dados.userId,
                completedAt: dados.completedAt,
                isBolieTest,
                isCorrectUser
              })
              
              resultados.push({
                arquivo: itemPath,
                dados: dados
              })
            }
          } catch (error) {
            console.log(`${indent}  ❌ Erro ao ler arquivo ${item}:`, error.message)
          }
        }
      }
    } catch (error) {
      console.log(`${indent}❌ Erro ao ler diretório ${dirPath}:`, error.message)
    }
  }
  
  buscarArquivos(archivesPath)
  
  console.log('\n' + '=' .repeat(60))
  console.log('📊 RESUMO DA BUSCA:')
  console.log(`Total de arquivos BOLIE encontrados: ${resultados.length}`)
  
  if (resultados.length > 0) {
    console.log('\n📋 DETALHES DOS RESULTADOS ENCONTRADOS:')
    resultados.forEach((resultado, index) => {
      console.log(`\n${index + 1}. Arquivo: ${resultado.arquivo}`)
      console.log(`   Nome do Teste: ${resultado.dados.testName}`)
      console.log(`   Usuário: ${resultado.dados.userId}`)
      console.log(`   Data de Conclusão: ${resultado.dados.completedAt}`)
      console.log(`   Status: ${resultado.dados.status}`)
      if (resultado.dados.overallScore) {
        console.log(`   Pontuação: ${resultado.dados.overallScore}`)
      }
      if (resultado.dados.archivedAt) {
        console.log(`   Arquivado em: ${resultado.dados.archivedAt}`)
      }
    })
  } else {
    console.log('\n❌ Nenhum resultado do teste BOLIE foi encontrado para o usuário especificado.')
    console.log('\n🔍 VERIFICAÇÕES ADICIONAIS:')
    
    // Verificar se há arquivos para qualquer usuário
    console.log('\n1. Buscando qualquer arquivo BOLIE (independente do usuário):')
    buscarQualquerBolie()
    
    // Verificar se há arquivos para o usuário específico
    console.log('\n2. Buscando qualquer arquivo do usuário colaborador@demo.com:')
    buscarQualquerUsuario(userId)
  }
  
  return resultados
}

// Função auxiliar para buscar qualquer arquivo BOLIE
function buscarQualquerBolie() {
  const archivesPath = path.join(process.cwd(), 'archives', 'results')
  
  function buscarRecursivo(dirPath) {
    try {
      const items = fs.readdirSync(dirPath)
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item)
        const stat = fs.statSync(itemPath)
        
        if (stat.isDirectory()) {
          buscarRecursivo(itemPath)
        } else if (item.endsWith('.json') && !item.startsWith('.')) {
          try {
            const conteudo = fs.readFileSync(itemPath, 'utf-8')
            const dados = JSON.parse(conteudo)
            
            if (dados.testName && dados.testName.toLowerCase().includes('bolie')) {
              console.log(`   ✅ Arquivo BOLIE encontrado: ${itemPath}`)
              console.log(`      Usuário: ${dados.userId}`)
              console.log(`      Teste: ${dados.testName}`)
            }
          } catch (error) {
            // Ignorar erros de parsing
          }
        }
      }
    } catch (error) {
      // Ignorar erros de diretório
    }
  }
  
  buscarRecursivo(archivesPath)
}

// Função auxiliar para buscar qualquer arquivo do usuário
function buscarQualquerUsuario(userId) {
  const archivesPath = path.join(process.cwd(), 'archives', 'results')
  
  function buscarRecursivo(dirPath) {
    try {
      const items = fs.readdirSync(dirPath)
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item)
        const stat = fs.statSync(itemPath)
        
        if (stat.isDirectory()) {
          buscarRecursivo(itemPath)
        } else if (item.endsWith('.json') && !item.startsWith('.')) {
          try {
            const conteudo = fs.readFileSync(itemPath, 'utf-8')
            const dados = JSON.parse(conteudo)
            
            if (dados.userId === userId) {
              console.log(`   ✅ Arquivo do usuário encontrado: ${itemPath}`)
              console.log(`      Teste: ${dados.testName}`)
              console.log(`      Data: ${dados.completedAt}`)
            }
          } catch (error) {
            // Ignorar erros de parsing
          }
        }
      }
    } catch (error) {
      // Ignorar erros de diretório
    }
  }
  
  buscarRecursivo(archivesPath)
}

// Executar a busca
buscarBolieArquivado()