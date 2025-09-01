// Script para testar a sessão de autenticação
const { PrismaClient } = require('@prisma/client')

async function testAuthSession() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔐 Testing authentication session...')
    
    // Verificar se há usuários no sistema
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true
      },
      take: 5
    })
    
    console.log('👥 Users in system:', users.length)
    users.forEach(user => {
      console.log(`  - ${user.firstName} ${user.lastName} (${user.email}) - Type: ${user.userType}`)
    })
    
    // Verificar sessões ativas
    const sessions = await prisma.session.findMany({
      select: {
        id: true,
        userId: true,
        expires: true,
        user: {
          select: {
            email: true,
            firstName: true
          }
        }
      },
      where: {
        expires: {
          gt: new Date()
        }
      }
    })
    
    console.log('🔑 Active sessions:', sessions.length)
    sessions.forEach(session => {
      console.log(`  - User: ${session.user.firstName} (${session.user.email})`)
      console.log(`    Expires: ${session.expires}`)
    })
    
    // Verificar accounts
    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        userId: true,
        provider: true,
        user: {
          select: {
            email: true
          }
        }
      }
    })
    
    console.log('🔗 Accounts:', accounts.length)
    accounts.forEach(account => {
      console.log(`  - Provider: ${account.provider} - User: ${account.user.email}`)
    })
    
  } catch (error) {
    console.error('❌ Error testing auth session:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAuthSession()