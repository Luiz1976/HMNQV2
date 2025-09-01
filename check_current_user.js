// Script para verificar o usuário atual e seus resultados
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkCurrentUser() {
  try {
    console.log('🔍 Verificando usuários no sistema...')
    
    // Buscar todos os usuários ativos
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        lastLoginAt: true
      },
      orderBy: { lastLoginAt: 'desc' }
    })
    
    console.log('👥 Usuários ativos encontrados:', users.length)
    
    for (const user of users) {
      console.log(`\n📧 ${user.email}`)
      console.log(`   Nome: ${user.firstName} ${user.lastName}`)
      console.log(`   Último login: ${user.lastLoginAt || 'Nunca'}`)
      
      // Verificar resultados de teste para este usuário
      const results = await prisma.testResult.findMany({
        where: { userId: user.id },
        select: {
      id: true,
      createdAt: true
    },
        orderBy: { createdAt: 'desc' }
      })
      
      console.log(`   📊 Resultados de teste: ${results.length}`)
      
      if (results.length > 0) {
        const bolieResults = results.filter(r => r.testType === 'BOLIE')
        console.log(`   🧠 Resultados BOLIE: ${bolieResults.length}`)
        
        if (bolieResults.length > 0) {
          const latestBolie = bolieResults[0]
          console.log(`   📅 Último BOLIE: ${latestBolie.createdAt}`)
          console.log(`   📁 Arquivado: ${latestBolie.isArchived ? 'Sim' : 'Não'}`)
        }
      }
    }
    
    // Verificar sessões ativas
    console.log('\n🔐 Verificando sessões ativas...')
    const sessions = await prisma.session.findMany({
      where: {
        expires: {
          gt: new Date()
        }
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })
    
    console.log(`🔑 Sessões ativas: ${sessions.length}`)
    
    for (const session of sessions) {
      console.log(`   👤 ${session.user.email} - Expira em: ${session.expires}`)
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCurrentUser()