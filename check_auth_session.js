const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAuthAndSession() {
  try {
    console.log('🔍 Verificando autenticação e sessão...')
    
    // Verificar se existe o usuário colaborador@demo.com
    const user = await prisma.user.findUnique({
      where: {
        email: 'colaborador@demo.com'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
        createdAt: true
      }
    })
    
    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado!')
      return
    }
    
    console.log('\n✅ USUÁRIO ENCONTRADO:')
    console.log('='.repeat(30))
    console.log('ID:', user.id)
    console.log('Email:', user.email)
    console.log('Nome:', `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Não informado')
    console.log('Tipo de usuário:', user.userType)
    console.log('Criado em:', user.createdAt)
    
    // Verificar sessões ativas
    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        expires: 'desc'
      }
    })
    
    console.log('\n📋 SESSÕES DO USUÁRIO:')
    console.log('='.repeat(30))
    console.log('Total de sessões:', sessions.length)
    
    if (sessions.length > 0) {
      sessions.forEach((session, index) => {
        const isExpired = new Date(session.expires) < new Date()
        console.log(`\n${index + 1}. Sessão ${session.id}`)
        console.log(`   Token: ${session.sessionToken.substring(0, 20)}...`)
        console.log(`   Expira em: ${session.expires}`)
        console.log(`   Status: ${isExpired ? '❌ EXPIRADA' : '✅ ATIVA'}`)
      })
      
      const activeSessions = sessions.filter(s => new Date(s.expires) > new Date())
      console.log(`\n📊 Resumo: ${activeSessions.length} sessões ativas de ${sessions.length} total`)
      
      if (activeSessions.length === 0) {
        console.log('\n⚠️  PROBLEMA: Não há sessões ativas!')
        console.log('💡 SOLUÇÃO: O usuário precisa fazer login novamente.')
        console.log('\n🔧 Para testar, acesse: http://localhost:3000/auth/signin')
      } else {
        console.log('\n✅ Há sessões ativas. O problema pode ser:')
        console.log('   1. Cookie de sessão não está sendo enviado')
        console.log('   2. Middleware de autenticação com problema')
        console.log('   3. Configuração do NextAuth')
      }
    } else {
      console.log('❌ Nenhuma sessão encontrada para este usuário')
      console.log('💡 O usuário nunca fez login ou todas as sessões expiraram')
      console.log('\n🔧 Para resolver:')
      console.log('   1. Acesse: http://localhost:3000/auth/signin')
      console.log('   2. Faça login com: colaborador@demo.com')
    }
    
    // Verificar contas (providers)
    const accounts = await prisma.account.findMany({
      where: {
        userId: user.id
      }
    })
    
    console.log('\n🔑 CONTAS/PROVIDERS:')
    console.log('='.repeat(30))
    console.log('Total de contas:', accounts.length)
    
    if (accounts.length > 0) {
      accounts.forEach((account, index) => {
        console.log(`\n${index + 1}. Provider: ${account.provider}`)
        console.log(`   Tipo: ${account.type}`)
        console.log(`   ID da conta: ${account.providerAccountId}`)
      })
    } else {
      console.log('❌ Nenhuma conta/provider configurada')
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('📋 DIAGNÓSTICO FINAL:')
    console.log('='.repeat(50))
    
    if (sessions.length === 0) {
      console.log('🚨 PROBLEMA: Usuário nunca fez login')
      console.log('✅ SOLUÇÃO: Fazer login em http://localhost:3000/auth/signin')
    } else if (sessions.filter(s => new Date(s.expires) > new Date()).length === 0) {
      console.log('🚨 PROBLEMA: Todas as sessões expiraram')
      console.log('✅ SOLUÇÃO: Fazer login novamente')
    } else {
      console.log('🚨 PROBLEMA: Sessão ativa existe, mas API retorna 401')
      console.log('✅ POSSÍVEIS CAUSAS:')
      console.log('   - Cookie não está sendo enviado')
      console.log('   - Middleware de auth com problema')
      console.log('   - Configuração do NextAuth incorreta')
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar autenticação:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAuthAndSession()