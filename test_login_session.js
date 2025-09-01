// Script para testar login e obter sessão válida
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const http = require('http')
const https = require('https')
const { URL } = require('url')

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
          data: data
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

async function testLoginAndSession() {
  try {
    console.log('🔍 Testando login e sessão...')
    
    // 1. Verificar se o usuário existe no banco
    const user = await prisma.user.findUnique({
      where: { 
        email: 'colaborador@demo.com',
        isActive: true
      },
      include: {
        company: true,
        permissions: true
      }
    })
    
    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado ou inativo')
      return
    }
    
    console.log('✅ Usuário encontrado:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      isActive: user.isActive,
      company: user.company?.name || 'Nenhuma',
      permissions: user.permissions.length
    })
    
    // 2. Verificar se a senha está correta
    const isValidPassword = await bcrypt.compare('colaborador123', user.password)
    console.log('🔑 Senha válida:', isValidPassword)
    
    if (!isValidPassword) {
      console.log('❌ Senha incorreta')
      return
    }
    
    // 3. Testar se o servidor está rodando
    console.log('\n🌐 Testando se o servidor está rodando...')
    
    try {
      const healthCheck = await makeRequest('http://localhost:3000/api/debug/nextauth')
      console.log('📊 Status do servidor:', healthCheck.status)
      console.log('📊 Resposta do debug NextAuth:', healthCheck.data)
    } catch (error) {
      console.log('❌ Servidor não está rodando ou não responde:', error.message)
      console.log('\n💡 Para testar o login, você precisa:')
      console.log('1. Executar: npm run dev')
      console.log('2. Aguardar o servidor iniciar em http://localhost:3000')
      console.log('3. Acessar http://localhost:3000/auth/login')
      console.log('4. Fazer login com: colaborador@demo.com / colaborador123')
      console.log('5. Verificar se é redirecionado para /colaborador/resultados')
      return
    }
    
    // 4. Testar API de sessão sem autenticação
    console.log('\n🔐 Testando API de sessão...')
    
    try {
      const sessionCheck = await makeRequest('http://localhost:3000/api/auth/session')
      console.log('📊 Status da sessão:', sessionCheck.status)
      console.log('📊 Dados da sessão:', sessionCheck.data)
    } catch (error) {
      console.log('❌ Erro ao verificar sessão:', error.message)
    }
    
    // 5. Testar API de resultados sem autenticação (deve dar 401)
    console.log('\n📋 Testando API de resultados sem autenticação...')
    
    try {
      const resultadosCheck = await makeRequest('http://localhost:3000/api/colaborador/resultados?page=1&limit=10')
      console.log('📊 Status da API de resultados:', resultadosCheck.status)
      console.log('📊 Resposta:', resultadosCheck.data)
      
      if (resultadosCheck.status === 401) {
        console.log('✅ API está funcionando corretamente (retorna 401 sem autenticação)')
      }
    } catch (error) {
      console.log('❌ Erro ao testar API de resultados:', error.message)
    }
    
    console.log('\n🎯 RESUMO DO TESTE:')
    console.log('✅ Usuário colaborador@demo.com existe e está ativo')
    console.log('✅ Senha colaborador123 está correta')
    console.log('✅ Banco de dados está funcionando')
    console.log('\n📝 PRÓXIMOS PASSOS:')
    console.log('1. Certifique-se de que o servidor está rodando (npm run dev)')
    console.log('2. Acesse http://localhost:3000/auth/login')
    console.log('3. Faça login com colaborador@demo.com / colaborador123')
    console.log('4. Verifique se os resultados aparecem em /colaborador/resultados')
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLoginAndSession()