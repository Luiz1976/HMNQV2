const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function removeDemoUser() {
  console.log('🗑️ Removendo usuário colaborador@demo.com...')
  
  try {
    // Buscar o usuário colaborador@demo.com
    const demoUser = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' },
      include: {
        testSessions: true,
        testResults: true,
        aiAnalyses: true,
        permissions: true
      }
    })
    
    if (!demoUser) {
      console.log('✅ Usuário colaborador@demo.com não encontrado no sistema')
      return
    }
    
    console.log(`📊 Dados encontrados para ${demoUser.email}:`)
    console.log(`   - Sessões de teste: ${demoUser.testSessions.length}`)
    console.log(`   - Resultados de teste: ${demoUser.testResults.length}`)
    console.log(`   - Análises de IA: ${demoUser.aiAnalyses.length}`)
    console.log(`   - Permissões: ${demoUser.permissions.length}`)
    
    // Remover análises de IA
    if (demoUser.aiAnalyses.length > 0) {
      console.log('🧠 Removendo análises de IA...')
      await prisma.aIAnalysis.deleteMany({
        where: { userId: demoUser.id }
      })
      console.log(`✅ ${demoUser.aiAnalyses.length} análises de IA removidas`)
    }
    
    // Remover resultados de teste
    if (demoUser.testResults.length > 0) {
      console.log('📋 Removendo resultados de teste...')
      await prisma.testResult.deleteMany({
        where: { userId: demoUser.id }
      })
      console.log(`✅ ${demoUser.testResults.length} resultados de teste removidos`)
    }
    
    // Remover sessões de teste
    if (demoUser.testSessions.length > 0) {
      console.log('🎯 Removendo sessões de teste...')
      await prisma.testSession.deleteMany({
        where: { userId: demoUser.id }
      })
      console.log(`✅ ${demoUser.testSessions.length} sessões de teste removidas`)
    }
    
    // Remover permissões
    if (demoUser.permissions.length > 0) {
      console.log('🔐 Removendo permissões...')
      await prisma.userPermission.deleteMany({
        where: { userId: demoUser.id }
      })
      console.log(`✅ ${demoUser.permissions.length} permissões removidas`)
    }
    
    // Remover contas de autenticação (NextAuth)
    const accounts = await prisma.account.findMany({
      where: { userId: demoUser.id }
    })
    
    if (accounts.length > 0) {
      console.log('🔑 Removendo contas de autenticação...')
      await prisma.account.deleteMany({
        where: { userId: demoUser.id }
      })
      console.log(`✅ ${accounts.length} contas de autenticação removidas`)
    }
    
    // Remover sessões de autenticação (NextAuth)
    const sessions = await prisma.session.findMany({
      where: { userId: demoUser.id }
    })
    
    if (sessions.length > 0) {
      console.log('🔐 Removendo sessões de autenticação...')
      await prisma.session.deleteMany({
        where: { userId: demoUser.id }
      })
      console.log(`✅ ${sessions.length} sessões de autenticação removidas`)
    }
    
    // Finalmente, remover o usuário
    console.log('👤 Removendo usuário...')
    await prisma.user.delete({
      where: { id: demoUser.id }
    })
    
    console.log('✅ Usuário colaborador@demo.com removido com sucesso!')
    
    // Verificar usuários restantes
    console.log('\n📋 Verificando usuários restantes...')
    const remainingUsers = await prisma.user.findMany({
      where: { userType: 'EMPLOYEE' },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        isActive: true
      }
    })
    
    console.log(`\n👥 Colaboradores ativos no sistema: ${remainingUsers.length}`)
    remainingUsers.forEach((user, index) => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Sem nome'
      console.log(`${index + 1}. ${user.email} (${fullName}) - Ativo: ${user.isActive}`)
    })
    
    if (remainingUsers.length === 1 && remainingUsers[0].email === 'luiz.carlo@gmail.com') {
      console.log('\n✅ SUCESSO: Apenas luiz.carlo@gmail.com permanece como colaborador no sistema!')
    } else {
      console.log('\n⚠️ ATENÇÃO: Verifique se apenas luiz.carlo@gmail.com deve estar no sistema')
    }
    
  } catch (error) {
    console.error('❌ Erro ao remover usuário:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

removeDemoUser().catch(console.error)