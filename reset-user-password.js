const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetUserPassword() {
  try {
    console.log('🔄 Redefinindo senha do usuário colaborador@demo.com...');
    
    // Gerar hash da nova senha
    const newPassword = 'demo123';
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    console.log('🔐 Nova senha:', newPassword);
    console.log('🔐 Hash gerado:', hashedPassword);
    
    // Atualizar usuário no banco
    const updatedUser = await prisma.user.update({
      where: {
        email: 'colaborador@demo.com'
      },
      data: {
        password: hashedPassword,
        firstName: 'Colaborador',
        lastName: 'Demo'
      }
    });
    
    console.log('✅ Senha atualizada com sucesso!');
    console.log('   - ID:', updatedUser.id);
    console.log('   - Email:', updatedUser.email);
    console.log('   - Nome:', `${updatedUser.firstName} ${updatedUser.lastName}`);
    console.log('   - Tipo:', updatedUser.userType);
    
    // Verificar se a nova senha funciona
    const isValidPassword = await bcrypt.compare(newPassword, updatedUser.password);
    console.log('   - Verificação da nova senha:', isValidPassword ? '✅ Válida' : '❌ Inválida');
    
  } catch (error) {
    console.error('❌ Erro ao redefinir senha:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetUserPassword();