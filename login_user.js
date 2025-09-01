// Script para fazer login do usuário colaborador@demo.com
const { PrismaClient } = require('@prisma/client')
const { exec } = require('child_process')
const util = require('util')

const execAsync = util.promisify(exec)
const prisma = new PrismaClient()

async function loginUser() {
  try {
    console.log('🔐 Iniciando processo de login...')
    
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado')
      return
    }
    
    console.log('✅ Usuário encontrado:', user.email)
    
    // Fazer login via PowerShell usando Invoke-WebRequest
    const loginCommand = `
      $body = @{
        email = 'colaborador@demo.com'
        password = 'demo123'
        redirect = $false
      } | ConvertTo-Json
      
      $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/signin' -Method POST -Body $body -ContentType 'application/json' -SessionVariable session
      Write-Host "Status: $($response.StatusCode)"
      Write-Host "Content: $($response.Content)"
      
      # Verificar sessão
      $sessionCheck = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/session' -WebSession $session
      Write-Host "Session: $($sessionCheck.Content)"
    `
    
    console.log('📡 Fazendo login via PowerShell...')
    const { stdout, stderr } = await execAsync(`powershell -Command "${loginCommand}"`)
    
    if (stderr) {
      console.log('⚠️ Stderr:', stderr)
    }
    
    console.log('📄 Resultado:', stdout)
    
  } catch (error) {
    console.error('❌ Erro no login:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

loginUser()