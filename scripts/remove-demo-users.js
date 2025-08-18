const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function removeDemoUsers() {
  console.log('🗑️ Iniciando remoção dos usuários demo...')
  
  const userIds = [
    'cme1yknrg00088wwgpzmfa7v4', // candidato@demo.com
    'cme1ykn3g00048wwg66n5amwj'  // empresa@demo.com
  ]
  
  const userEmails = [
    'candidato@demo.com',
    'empresa@demo.com'
  ]
  
  try {
    // Verificar se os usuários existem
    console.log('🔍 Verificando usuários...')
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { id: { in: userIds } },
          { email: { in: userEmails } }
        ]
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true
      }
    })
    
    if (users.length === 0) {
      console.log('ℹ️ Nenhum usuário demo encontrado para remover.')
      return
    }
    
    console.log(`📋 Encontrados ${users.length} usuários para remover:`)
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.firstName} ${user.lastName}) - ${user.userType}`)
    })
    
    const foundUserIds = users.map(u => u.id)
    
    // Remover dados relacionados em ordem de dependência
    console.log('\n🧹 Removendo dados relacionados...')
    
    // 1. Remover análises de IA
    console.log('  📊 Removendo análises de IA...')
    const aiAnalysesCount = await prisma.aIAnalysis.deleteMany({
      where: { userId: { in: foundUserIds } }
    })
    console.log(`    ✅ ${aiAnalysesCount.count} análises de IA removidas`)
    
    // 2. Remover resultados de testes
    console.log('  📋 Removendo resultados de testes...')
    const testResultsCount = await prisma.testResult.deleteMany({
      where: { userId: { in: foundUserIds } }
    })
    console.log(`    ✅ ${testResultsCount.count} resultados de testes removidos`)
    
    // 3. Remover respostas
    console.log('  📝 Removendo respostas...')
    const answersCount = await prisma.answer.deleteMany({
      where: { userId: { in: foundUserIds } }
    })
    console.log(`    ✅ ${answersCount.count} respostas removidas`)
    
    // 4. Remover sessões de teste
    console.log('  🎯 Removendo sessões de teste...')
    const testSessionsCount = await prisma.testSession.deleteMany({
      where: { userId: { in: foundUserIds } }
    })
    console.log(`    ✅ ${testSessionsCount.count} sessões de teste removidas`)
    
    // 5. Remover notificações do usuário
    console.log('  🔔 Removendo notificações do usuário...')
    const userNotificationsCount = await prisma.userNotification.deleteMany({
      where: { userId: { in: foundUserIds } }
    })
    console.log(`    ✅ ${userNotificationsCount.count} notificações do usuário removidas`)
    
    // 6. Remover permissões do usuário
    console.log('  🔐 Removendo permissões do usuário...')
    const userPermissionsCount = await prisma.userPermission.deleteMany({
      where: { userId: { in: foundUserIds } }
    })
    console.log(`    ✅ ${userPermissionsCount.count} permissões do usuário removidas`)
    
    // 7. Remover convites enviados pelo usuário
    console.log('  📧 Removendo convites enviados...')
    const invitationsCount = await prisma.invitation.deleteMany({
      where: { invitedBy: { in: foundUserIds } }
    })
    console.log(`    ✅ ${invitationsCount.count} convites removidos`)
    
    // 8. Remover dados ERP do funcionário
    console.log('  🏢 Removendo dados ERP do funcionário...')
    const erpEmployeeCount = await prisma.eRPEmployee.deleteMany({
      where: { userId: { in: foundUserIds } }
    })
    console.log(`    ✅ ${erpEmployeeCount.count} registros ERP de funcionário removidos`)
    
    // 9. Remover contas NextAuth
    console.log('  🔑 Removendo contas NextAuth...')
    const accountsCount = await prisma.account.deleteMany({
      where: { userId: { in: foundUserIds } }
    })
    console.log(`    ✅ ${accountsCount.count} contas NextAuth removidas`)
    
    // 10. Remover sessões NextAuth
    console.log('  🎫 Removendo sessões NextAuth...')
    const sessionsCount = await prisma.session.deleteMany({
      where: { userId: { in: foundUserIds } }
    })
    console.log(`    ✅ ${sessionsCount.count} sessões NextAuth removidas`)
    
    // 11. Verificar e remover empresas pertencentes aos usuários
    console.log('  🏢 Verificando empresas pertencentes aos usuários...')
    const ownedCompanies = await prisma.company.findMany({
      where: { ownerId: { in: foundUserIds } },
      select: { id: true, name: true }
    })
    
    if (ownedCompanies.length > 0) {
      console.log(`    📋 Encontradas ${ownedCompanies.length} empresas para remover:`)
      ownedCompanies.forEach(company => {
        console.log(`      - ${company.name} (${company.id})`)
      })
      
      const companyIds = ownedCompanies.map(c => c.id)
      
      // Remover dados relacionados às empresas
      console.log('    🧹 Removendo dados relacionados às empresas...')
      
      // Remover notificações da empresa
      const companyNotificationsCount = await prisma.companyNotification.deleteMany({
        where: { companyId: { in: companyIds } }
      })
      console.log(`      ✅ ${companyNotificationsCount.count} notificações da empresa removidas`)
      
      // Remover configurações ERP
      const erpConfigsCount = await prisma.eRPConfig.deleteMany({
        where: { companyId: { in: companyIds } }
      })
      console.log(`      ✅ ${erpConfigsCount.count} configurações ERP removidas`)
      
      // Remover testes da empresa
      const companyTestsCount = await prisma.test.deleteMany({
        where: { companyId: { in: companyIds } }
      })
      console.log(`      ✅ ${companyTestsCount.count} testes da empresa removidos`)
      
      // Remover sessões de teste da empresa
      const companyTestSessionsCount = await prisma.testSession.deleteMany({
        where: { companyId: { in: companyIds } }
      })
      console.log(`      ✅ ${companyTestSessionsCount.count} sessões de teste da empresa removidas`)
      
      // Remover convites da empresa
      const companyInvitationsCount = await prisma.invitation.deleteMany({
        where: { companyId: { in: companyIds } }
      })
      console.log(`      ✅ ${companyInvitationsCount.count} convites da empresa removidos`)
      
      // Remover as empresas
      const companiesCount = await prisma.company.deleteMany({
        where: { id: { in: companyIds } }
      })
      console.log(`      ✅ ${companiesCount.count} empresas removidas`)
    }
    
    // 12. Finalmente, remover os usuários
    console.log('\n👤 Removendo usuários...')
    const usersCount = await prisma.user.deleteMany({
      where: { id: { in: foundUserIds } }
    })
    console.log(`  ✅ ${usersCount.count} usuários removidos`)
    
    console.log('\n✅ Remoção dos usuários demo concluída com sucesso!')
    
    // Verificar usuários restantes
    console.log('\n📋 Usuários restantes no sistema:')
    const remainingUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
        isActive: true
      }
    })
    
    if (remainingUsers.length === 0) {
      console.log('  ℹ️ Nenhum usuário restante no sistema.')
    } else {
      remainingUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} (${user.firstName} ${user.lastName}) - ${user.userType} - ${user.isActive ? 'Ativo' : 'Inativo'}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Erro durante a remoção dos usuários demo:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar o script
if (require.main === module) {
  removeDemoUsers()
    .then(() => {
      console.log('\n🎉 Script executado com sucesso!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Erro na execução do script:', error)
      process.exit(1)
    })
}

module.exports = { removeDemoUsers }