// Script para fazer logout e login com o usuário correto
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Verificando usuários disponíveis...')
    
    // Listar todos os usuários
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
        _count: {
          select: {
            testResults: true
          }
        }
      }
    })
    
    console.log('\n📋 Usuários encontrados:')
    users.forEach(user => {
      console.log(`- ${user.email} (${user.firstName} ${user.lastName}) - ${user.userType} - ${user._count.testResults} resultados`)
    })
    
    // Verificar se colaborador@demo.com existe
    const targetUser = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })
    
    if (!targetUser) {
      console.log('\n❌ Usuário colaborador@demo.com não encontrado!')
      console.log('\n💡 Criando usuário colaborador@demo.com...')
      
      const hashedPassword = await bcrypt.hash('123456', 12)
      
      const newUser = await prisma.user.create({
        data: {
          email: 'colaborador@demo.com',
          password: hashedPassword,
          firstName: 'Colaborador',
          lastName: 'Demo',
          userType: 'EMPLOYEE',
          isActive: true
        }
      })
      
      console.log('✅ Usuário criado:', newUser.email)
    } else {
      console.log('\n✅ Usuário colaborador@demo.com encontrado!')
      console.log(`   - Nome: ${targetUser.firstName} ${targetUser.lastName}`)
      console.log(`   - Tipo: ${targetUser.userType}`)
    }
    
    console.log('\n🔑 Para fazer login:')
    console.log('   Email: colaborador@demo.com')
    console.log('   Senha: 123456')
    console.log('\n📝 Acesse: http://localhost:3000/auth/login')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()