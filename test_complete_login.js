const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testCompleteLogin() {
  try {
    console.log('🔐 Testando login completo para colaborador@demo.com...');
    
    // 1. Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { 
        email: 'colaborador@demo.com',
        isActive: true
      },
      include: {
        company: true,
        permissions: true
      }
    });
    
    if (!user) {
      console.log('❌ Usuário não encontrado ou inativo');
      return;
    }
    
    console.log('✅ Usuário encontrado:');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Nome:', user.firstName, user.lastName);
    console.log('  Tipo:', user.userType);
    console.log('  Ativo:', user.isActive);
    console.log('  Permissões:', user.permissions.length);
    
    // 2. Testar senhas possíveis
    const senhasParaTestar = ['123456', 'colaborador123', 'demo123', 'password'];
    let senhaCorreta = null;
    
    console.log('\n🔑 Testando senhas...');
    for (const senha of senhasParaTestar) {
      const isValid = await bcrypt.compare(senha, user.password);
      console.log(`  ${senha}: ${isValid ? '✅ VÁLIDA' : '❌ inválida'}`);
      if (isValid) {
        senhaCorreta = senha;
        break;
      }
    }
    
    if (!senhaCorreta) {
      console.log('❌ Nenhuma senha testada é válida');
      return;
    }
    
    console.log(`\n✅ Senha correta encontrada: ${senhaCorreta}`);
    
    // 3. Simular o processo de autenticação
    console.log('\n🔐 Simulando processo de autenticação...');
    
    const authUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      avatarUrl: user.avatarUrl,
      company: user.company ? {
        id: user.company.id,
        name: user.company.name,
        role: 'member'
      } : null,
      permissions: user.permissions.map(p => p.permission),
      lastLoginAt: user.lastLoginAt?.toISOString(),
      createdAt: user.createdAt.toISOString()
    };
    
    console.log('✅ Dados do usuário para autenticação:');
    console.log(JSON.stringify(authUser, null, 2));
    
    // 4. Determinar redirecionamento
    let redirectPath = '/';
    switch (user.userType) {
      case 'ADMIN':
        redirectPath = '/admin';
        break;
      case 'COMPANY':
        redirectPath = '/empresa';
        break;
      case 'EMPLOYEE':
        redirectPath = '/colaborador';
        break;
      case 'CANDIDATE':
        redirectPath = '/candidato';
        break;
    }
    
    console.log(`\n🔄 Usuário ${user.userType} deve ser redirecionado para: ${redirectPath}`);
    
    console.log('\n🎯 RESUMO:');
    console.log('✅ Usuário colaborador@demo.com existe e está ativo');
    console.log(`✅ Senha ${senhaCorreta} é válida`);
    console.log(`✅ Tipo de usuário: ${user.userType}`);
    console.log(`✅ Deve redirecionar para: ${redirectPath}`);
    console.log('\n📝 INSTRUÇÕES PARA O USUÁRIO:');
    console.log('1. Acesse http://localhost:3000/auth/login');
    console.log(`2. Digite: colaborador@demo.com`);
    console.log(`3. Digite a senha: ${senhaCorreta}`);
    console.log('4. Clique em "Entrar"');
    console.log(`5. Você deve ser redirecionado para: ${redirectPath}`);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCompleteLogin();