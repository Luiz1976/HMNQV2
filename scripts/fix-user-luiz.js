const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixUser() {
  try {
    // Atualizar o usuário para tipo COMPANY e definir como owner da empresa
    const updatedUser = await prisma.user.update({
      where: { email: 'luiz.rocha@rocha.com' },
      data: {
        userType: 'COMPANY'
      }
    })
    
    // Atualizar a empresa para definir o owner
    const updatedCompany = await prisma.company.update({
      where: { id: updatedUser.companyId },
      data: {
        ownerId: updatedUser.id
      }
    })
    
    console.log('✅ Usuário atualizado com sucesso:')
    console.log('- Tipo de usuário:', updatedUser.userType)
    console.log('- Empresa:', updatedCompany.name)
    console.log('- Owner ID:', updatedCompany.ownerId)
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixUser()