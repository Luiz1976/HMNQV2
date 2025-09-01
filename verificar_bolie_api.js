const http = require('http')

async function verificarBolieAPI() {
  console.log('🔍 Verificando resultados do teste BOLIE na API...')
  console.log('=' .repeat(60))
  
  const url = 'http://localhost:3000/api/colaborador/resultados?page=1&limit=50&includeAI=true'
  
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = ''
      
      res.on('data', chunk => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          
          console.log('📊 Status da resposta:', res.statusCode)
          console.log('📊 Total de resultados na API:', json.results?.length || 0)
          console.log('📊 Total de resultados arquivados:', json.archiveInfo?.totalArchivedResults || 0)
          
          if (json.results && json.results.length > 0) {
            // Buscar especificamente por BOLIE
            const bolieResults = json.results.filter(r => 
              r.testName && r.testName.toLowerCase().includes('bolie')
            )
            
            console.log('\n🎯 Resultados BOLIE encontrados:', bolieResults.length)
            
            if (bolieResults.length > 0) {
              console.log('\n📋 DETALHES DOS RESULTADOS BOLIE:')
              bolieResults.forEach((result, index) => {
                console.log(`\n${index + 1}. ${result.testName}`)
                console.log(`   ID: ${result.id}`)
                console.log(`   Status: ${result.status}`)
                console.log(`   Data de Conclusão: ${result.completedAt}`)
                console.log(`   Categoria: ${result.category}`)
                if (result.score) {
                  console.log(`   Pontuação: ${result.score}`)
                }
                if (result.isArchived) {
                  console.log(`   ✅ Resultado arquivado`)
                  console.log(`   Arquivo: ${result.filePath || 'N/A'}`)
                }
              })
            } else {
              console.log('\n❌ Nenhum resultado BOLIE encontrado na API')
              console.log('\n📋 TODOS OS TESTES DISPONÍVEIS:')
              json.results.forEach((result, index) => {
                console.log(`${index + 1}. ${result.testName} - ${result.completedAt} - ${result.status}`)
              })
            }
          } else {
            console.log('\n❌ Nenhum resultado encontrado na API')
          }
          
          // Verificar informações do sistema
          if (json.systemInfo) {
            console.log('\n🔧 INFORMAÇÕES DO SISTEMA:')
            console.log('   Total de testes oficiais:', json.systemInfo.totalOfficialTests)
            console.log('   Contagem de testes oficiais:', json.systemInfo.officialTestsCount)
            if (json.systemInfo.issues && json.systemInfo.issues.length > 0) {
              console.log('   ⚠️  Problemas detectados:', json.systemInfo.issues.join(', '))
            }
          }
          
          resolve(json)
        } catch (error) {
          console.error('❌ Erro ao parsear JSON:', error.message)
          console.log('📄 Resposta raw (primeiros 500 caracteres):')
          console.log(data.substring(0, 500))
          reject(error)
        }
      })
    }).on('error', (error) => {
      console.error('❌ Erro na requisição HTTP:', error.message)
      reject(error)
    })
  })
}

// Executar verificação
verificarBolieAPI()
  .then(() => {
    console.log('\n✅ Verificação concluída')
  })
  .catch((error) => {
    console.error('\n❌ Erro durante a verificação:', error.message)
  })