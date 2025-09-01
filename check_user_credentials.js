const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkUserCredentials() {
  console.log('🔍 Verificando credenciais do usuário...');
  
  try {
    // 1. Buscar usuário por email
    console.log('\n1. 🔍 Buscando usuário colaborador@demo.com...');
    const user = await prisma.user.findUnique({
      where: {
        email: 'colaborador@demo.com'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        userType: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true
      }
    });
    
    if (!user) {
      console.log('   ❌ Usuário não encontrado');
      return;
    }
    
    console.log('   ✅ Usuário encontrado:');
    console.log('   - ID:', user.id);
    console.log('   - Email:', user.email);
    console.log('   - Nome:', user.firstName + ' ' + user.lastName);
    console.log('   - Tipo:', user.userType);
    console.log('   - Ativo:', user.isActive);
    console.log('   - Criado em:', user.createdAt);
    console.log('   - Último login:', user.lastLoginAt);
    console.log('   - Hash da senha:', user.password ? 'Presente' : 'Ausente');
    
    if (!user.password) {
      console.log('   ❌ Usuário não tem senha definida');
      return;
    }
    
    // 2. Testar senhas comuns
    const senhasParaTestar = ['demo123', '123456', 'password', 'colaborador', 'demo', ''];
    
    console.log('\n2. 🔐 Testando senhas comuns...');
    
    for (const senha of senhasParaTestar) {
      console.log(`   Testando senha: "${senha}"`);
      const isValid = await bcrypt.compare(senha, user.password);
      
      if (isValid) {
        console.log(`   ✅ Senha correta encontrada: "${senha}"`);
        
        // 3. Testar login com a senha correta
        console.log('\n3. 🔐 Testando autenticação completa...');
        
        // Simular o processo de autenticação do NextAuth
        const authResult = {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userType: user.userType
          },
          passwordValid: true
        };
        
        console.log('   ✅ Autenticação simulada bem-sucedida:', JSON.stringify(authResult, null, 2));
        return;
      }
    }
    
    console.log('   ❌ Nenhuma das senhas testadas funcionou');
    console.log('   Hash da senha no banco:', user.password.substring(0, 20) + '...');
    
    // 4. Criar nova senha para o usuário
    console.log('\n4. 🔧 Criando nova senha "demo123" para o usuário...');
    const newPasswordHash = await bcrypt.hash('demo123', 12);
    
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        password: newPasswordHash
      }
    });
    
    console.log('   ✅ Nova senha "demo123" definida para o usuário');
    
  } catch (error) {
    console.error('❌ Erro durante a verificação:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserCredentials();