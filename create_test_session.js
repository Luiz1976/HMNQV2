// Script para criar uma sessão de teste válida
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

async function createTestSession() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔐 Creating test session...')
    
    // Buscar o usuário colaborador demo
    const user = await prisma.user.findUnique({
      where: {
        email: 'colaborador@demo.com'
      }
    })
    
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    console.log('👤 Found user:', user.firstName, user.lastName)
    
    // Criar uma sessão válida
    const sessionToken = crypto.randomUUID()
    const expires = new Date()
    expires.setDate(expires.getDate() + 30) // 30 dias
    
    const session = await prisma.session.create({
      data: {
        sessionToken: sessionToken,
        userId: user.id,
        expires: expires
      }
    })
    
    console.log('✅ Session created:', {
      sessionToken: sessionToken,
      userId: user.id,
      expires: expires.toISOString()
    })
    
    // Criar um account se não existir
    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: user.id
      }
    })
    
    if (!existingAccount) {
      const account = await prisma.account.create({
        data: {
          userId: user.id,
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: user.id
        }
      })
      
      console.log('✅ Account created for user')
    } else {
      console.log('✅ Account already exists for user')
    }
    
    console.log('\n🍪 To use this session, set the following cookie in your browser:')
    console.log(`next-auth.session-token=${sessionToken}`)
    console.log('\n🌐 Or visit: http://localhost:3000/api/auth/signin')
    
  } catch (error) {
    console.error('❌ Error creating session:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestSession()