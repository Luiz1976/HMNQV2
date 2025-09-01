const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('🔍 Testando autenticação...');
    
    // Verificar se o usuário colaborador@demo.com existe
    const user = await prisma.user.findUnique({
      where: { 
        email: 'colaborador@demo.com'
      },
      include: {
        company: true,
        permissions: true
      }
    });
    
    if (!user) {
      console.log('❌ Usuário colaborador@demo.com não encontrado');
      return;
    }
    
    console.log('✅ Usuário encontrado:');
    console.log('📧 Email:', user.email);
    console.log('👤 Nome:', user.firstName, user.lastName);
    console.log('🏢 Empresa:', user.company?.name || 'Nenhuma');
    console.log('🔑 Ativo:', user.isActive);
    console.log('🔐 Tem senha:', !!user.password);
    
    // Testar senha padrão
    const testPassword = '123456';
    const isValidPassword = await bcrypt.compare(testPassword, user.password);
    console.log('🔑 Senha "123456" válida:', isValidPassword);
    
    if (!isValidPassword) {
      // Testar outras senhas comuns
      const commonPasswords = ['password', 'demo', 'colaborador', 'admin'];
      for (const pwd of commonPasswords) {
        const isValid = await bcrypt.compare(pwd, user.password);
        if (isValid) {
          console.log(`🔑 Senha "${pwd}" válida:`, isValid);
          break;
        }
      }
    }
    
    console.log('\n📊 Permissões:', user.permissions.map(p => p.permission));
    
  } catch (error) {
    console.error('❌ Erro ao testar autenticação:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();