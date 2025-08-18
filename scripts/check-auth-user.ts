import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAuthUser() {
  console.log('🔍 Verificando usuários no sistema...')
  
  try {
    // Buscar todos os usuários
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
        isActive: true,
        createdAt: true
      }
    })
    
    console.log(`👥 Usuários encontrados: ${users.length}`)
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Tipo: ${user.userType}`);
      console.log(`   Ativo: ${user.isActive}`);
      console.log(`   Criado em: ${user.createdAt}`);
      console.log('');
    })
    
    // Verificar qual usuário possui os resultados grafológicos
    const resultWithUser = await prisma.testResult.findFirst({
      where: {
        id: 'cme0506n700038wncxdwzw8aq'
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })
    
    if (resultWithUser) {
      console.log('📊 Resultado específico encontrado:')
      console.log(`   Pertence ao usuário: ${resultWithUser.user.firstName} ${resultWithUser.user.lastName} (${resultWithUser.user.email})`)
      console.log(`   ID do usuário: ${resultWithUser.user.id}`)
    } else {
      console.log('❌ Resultado não encontrado')
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAuthUser()
  .catch(console.error)