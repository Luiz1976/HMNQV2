const http = require('http')

async function testColaboradorHTTP() {
  try {
    console.log('🔍 Testando HTTP /api/colaborador/resultados')
    
    // Simular uma requisição HTTP para a API
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/colaborador/resultados?page=1&limit=10',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Simular cookie de sessão (seria necessário ter uma sessão válida)
        'Cookie': 'next-auth.session-token=test'
      }
    }
    
    const req = http.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`)
      console.log(`Headers:`, res.headers)
      
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const response = JSON.parse(data)
            console.log('\n✅ Resposta da API:')
            console.log(`Total de resultados: ${response.data?.results?.length || 0}`)
            console.log(`Total count: ${response.data?.pagination?.totalCount || 0}`)
            console.log(`Testes completados: ${response.data?.statistics?.completedTests || 0}`)
            
            // Verificar resultados BOLIE
            const bolieResults = response.data?.results?.filter(r => 
              r.test?.name?.includes('BOLIE')
            ) || []
            
            console.log(`\n🧠 Resultados BOLIE na resposta: ${bolieResults.length}`)
            
            bolieResults.forEach((result, index) => {
              console.log(`\n  BOLIE ${index + 1}:`)
              console.log(`    ID: ${result.id}`)
              console.log(`    Nome: ${result.test?.name}`)
              console.log(`    Score: ${result.overallScore}`)
              console.log(`    Status: ${result.status}`)
              console.log(`    Data: ${result.completedAt}`)
              console.log(`    Dimensões: ${Object.keys(result.dimensionScores || {}).length}`)
            })
            
          } else {
            console.log('❌ Erro na API:')
            console.log(data)
          }
        } catch (parseError) {
          console.log('❌ Erro ao parsear resposta:')
          console.log(data)
        }
      })
    })
    
    req.on('error', (error) => {
      console.error('❌ Erro na requisição:', error.message)
    })
    
    req.end()
    
  } catch (error) {
    console.error('❌ Erro no teste HTTP:', error)
  }
}

// Aguardar um pouco para o servidor estar pronto
setTimeout(testColaboradorHTTP, 2000)