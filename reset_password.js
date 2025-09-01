const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    console.log('🔐 Redefinindo senha do usuário colaborador@demo.com...');
    
    // Hash da nova senha
    const newPassword = '123456';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Atualizar a senha do usuário
    const updatedUser = await prisma.user.update({
      where: { 
        email: 'colaborador@demo.com'
      },
      data: {
        password: hashedPassword
      }
    });
    
    console.log('✅ Senha redefinida com sucesso!');
    console.log('📧 Email:', updatedUser.email);
    console.log('🔑 Nova senha: 123456');
    
    // Verificar se a nova senha funciona
    const isValidPassword = await bcrypt.compare(newPassword, hashedPassword);
    console.log('🔍 Verificação da nova senha:', isValidPassword ? '✅ Válida' : '❌ Inválida');
    
  } catch (error) {
    console.error('❌ Erro ao redefinir senha:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();