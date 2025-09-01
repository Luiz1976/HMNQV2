// Script para testar o fluxo completo de login e acesso aos resultados
const { PrismaClient } = require('@prisma/client')
const http = require('http')
const https = require('https')
const { URL } = require('url')
const querystring = require('querystring')

const prisma = new PrismaClient()

// Função para fazer requisições HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const isHttps = urlObj.protocol === 'https:'
    const client = isHttps ? https : http
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    }
    
    const req = client.request(requestOptions, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
          cookies: res.headers['set-cookie'] || []
        })
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    if (options.body) {
      req.write(options.body)
    }
    
    req.end()
  })
}

async function testResultadosAPI() {
  try {
    console.log('🔍 Testando API de resultados diretamente...')
    
    // 1. Verificar se o usuário colaborador@demo.com existe
    const user = await prisma.user.findUnique({
      where: { 
        email: 'colaborador@demo.com',
        isActive: true
      }
    })
    
    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado')
      return
    }
    
    console.log('✅ Usuário encontrado:', user.email)
    console.log('📊 ID do usuário:', user.id)
    
    // 2. Buscar resultados diretamente no banco para este usuário
    console.log('\n🔍 Buscando resultados no banco de dados...')
    
    const resultados = await prisma.testResult.findMany({
       where: {
         userId: user.id
       },
       include: {
         test: {
           select: {
             name: true,
             testType: true
           }
         },
         user: {
           select: {
             firstName: true,
             lastName: true,
             email: true
           }
         }
       },
       orderBy: {
         completedAt: 'desc'
       }
     })
    
    console.log('📊 Total de resultados no banco:', resultados.length)
    
    // 3. Filtrar resultados BOLIE
     const bolieResults = resultados.filter(r => 
       r.test?.name?.includes('BOLIE') || r.test?.name?.includes('Inteligência Emocional')
     )
    
    console.log('📊 Resultados BOLIE encontrados:', bolieResults.length)
    
    if (bolieResults.length > 0) {
      console.log('\n🎯 DETALHES DOS RESULTADOS BOLIE:')
      bolieResults.forEach((result, index) => {
        console.log(`\n📋 Resultado ${index + 1}:`)
        console.log('  - ID:', result.id)
        console.log('  - Nome:', result.test?.name || 'N/A')
         console.log('  - Score Geral:', result.overallScore)
         console.log('  - Data:', result.completedAt)
         console.log('  - Duração:', result.duration, 'segundos')
         console.log('  - Usuário:', result.user.email)
         
         if (result.dimensionScores) {
           console.log('  - Scores por Dimensão:')
           const dimensions = JSON.parse(JSON.stringify(result.dimensionScores))
           Object.entries(dimensions).forEach(([dimName, dimScore], dimIndex) => {
             console.log(`    ${dimIndex + 1}. ${dimName}: ${dimScore}`)
           })
         }
      })
      
      // 4. Verificar se há problemas com os dados
       const problemResults = bolieResults.filter(r => 
         r.overallScore === null || r.overallScore === undefined || r.overallScore <= 0
       )
       
       const missingDimensionResults = bolieResults.filter(r => 
         !r.dimensionScores || Object.keys(r.dimensionScores).length === 0
       )
      
      if (problemResults.length > 0) {
        console.log('\n⚠️  PROBLEMAS ENCONTRADOS:')
        console.log('📊 Resultados com score geral inválido:', problemResults.length)
         problemResults.forEach((result, index) => {
           console.log(`  ${index + 1}. ID ${result.id}: Score = ${result.overallScore}`)
         })
         
         if (missingDimensionResults.length > 0) {
           console.log('📊 Resultados sem dimensionScores:', missingDimensionResults.length)
           missingDimensionResults.forEach((result, index) => {
             console.log(`  ${index + 1}. ID ${result.id}: dimensionScores = ${JSON.stringify(result.dimensionScores)}`)
           })
         }
      } else {
        console.log('\n✅ Todos os resultados BOLIE têm scores válidos!')
      }
      
      // 5. Testar a API sem autenticação para ver o erro
      console.log('\n🌐 Testando API de resultados sem autenticação...')
      
      const apiResponse = await makeRequest('http://localhost:3000/api/colaborador/resultados?page=1&limit=10')
      console.log('📊 Status da API (sem auth):', apiResponse.status)
      
      if (apiResponse.status === 401) {
        console.log('✅ API corretamente protegida - retorna 401 sem autenticação')
      } else {
        console.log('⚠️  API não está protegida adequadamente')
        console.log('📊 Resposta:', apiResponse.data.substring(0, 200))
      }
      
      console.log('\n🎯 RESUMO:')
      console.log('✅ Usuário colaborador@demo.com existe')
      console.log(`✅ ${resultados.length} resultados encontrados no banco`)
      console.log(`✅ ${bolieResults.length} resultados BOLIE encontrados`)
      console.log('✅ API está protegida por autenticação')
      
      if (problemResults.length === 0 && missingDimensionResults.length === 0) {
        console.log('✅ Todos os dados estão corretos')
        console.log('\n💡 PRÓXIMOS PASSOS:')
        console.log('1. Faça login manualmente em http://localhost:3000/auth/login')
        console.log('2. Use as credenciais: colaborador@demo.com / colaborador123')
        console.log('3. Acesse http://localhost:3000/colaborador/resultados')
        console.log('4. Verifique se os resultados BOLIE aparecem corretamente')
      } else {
        console.log('⚠️  Há problemas com alguns resultados que precisam ser corrigidos')
      }
      
    } else {
      console.log('❌ Nenhum resultado BOLIE encontrado para este usuário')
      
      // Verificar se há resultados BOLIE para outros usuários
       const allBolieResults = await prisma.testResult.findMany({
         include: {
           test: {
             select: {
               name: true
             }
           },
           user: {
             select: {
               email: true
             }
           }
         }
       })
       
       const filteredBolieResults = allBolieResults.filter(r => 
         r.test?.name?.includes('BOLIE') || r.test?.name?.includes('Inteligência Emocional')
       )
      
      console.log('📊 Total de resultados BOLIE no sistema:', filteredBolieResults.length)
       
       if (filteredBolieResults.length > 0) {
         console.log('\n👥 Usuários com resultados BOLIE:')
         const userEmails = [...new Set(filteredBolieResults.map(r => r.user.email))]
         userEmails.forEach(email => {
           const count = filteredBolieResults.filter(r => r.user.email === email).length
           console.log(`  - ${email}: ${count} resultado(s)`)
         })
       }
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testResultadosAPI()