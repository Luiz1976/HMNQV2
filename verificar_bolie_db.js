const { PrismaClient } = require('@prisma/client')

async function verificarBolieDB() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Verificando resultados do teste BOLIE no banco de dados...')
    console.log('=' .repeat(60))
    
    // Primeiro, verificar se o usuário existe
    const usuario = await prisma.user.findUnique({
      where: { email: 'colaborador@demo.com' }
    })
    
    if (!usuario) {
      console.log('❌ Usuário colaborador@demo.com não encontrado no banco de dados')
      return
    }
    
    console.log('✅ Usuário encontrado:')
    console.log(`   ID: ${usuario.id}`)
    console.log(`   Nome: ${usuario.name}`)
    console.log(`   Email: ${usuario.email}`)
    console.log(`   Criado em: ${usuario.createdAt}`)
    
    // Buscar todos os resultados de teste do usuário
    const todosResultados = await prisma.testResult.findMany({
      where: { userId: usuario.id },
      include: {
        test: true
      },
      orderBy: { completedAt: 'desc' }
    })
    
    console.log(`\n📊 Total de resultados de teste para o usuário: ${todosResultados.length}`)
    
    if (todosResultados.length > 0) {
      console.log('\n📋 TODOS OS RESULTADOS DO USUÁRIO:')
      todosResultados.forEach((resultado, index) => {
        console.log(`\n${index + 1}. ${resultado.test?.name || 'Nome não disponível'}`)
        console.log(`   ID do Resultado: ${resultado.id}`)
        console.log(`   ID do Teste: ${resultado.testId}`)
        console.log(`   Status: ${resultado.status}`)
        console.log(`   Data de Conclusão: ${resultado.completedAt}`)
        console.log(`   Pontuação: ${resultado.score || 'N/A'}`)
        if (resultado.test) {
          console.log(`   Categoria: ${resultado.test.category}`)
          console.log(`   Tipo: ${resultado.test.type}`)
        }
      })
      
      // Buscar especificamente por BOLIE
      const resultadosBolie = todosResultados.filter(r => 
        r.test?.name && r.test.name.toLowerCase().includes('bolie')
      )
      
      console.log(`\n🎯 Resultados BOLIE encontrados: ${resultadosBolie.length}`)
      
      if (resultadosBolie.length > 0) {
        console.log('\n📋 DETALHES DOS RESULTADOS BOLIE:')
        resultadosBolie.forEach((resultado, index) => {
          console.log(`\n${index + 1}. ${resultado.test.name}`)
          console.log(`   ID do Resultado: ${resultado.id}`)
          console.log(`   Status: ${resultado.status}`)
          console.log(`   Data de Conclusão: ${resultado.completedAt}`)
          console.log(`   Pontuação: ${resultado.score || 'N/A'}`)
          console.log(`   Duração: ${resultado.duration || 'N/A'} segundos`)
          console.log(`   Dados: ${resultado.data ? 'Disponível' : 'N/A'}`)
        })
      }
    }
    
    // Verificar todos os testes disponíveis que contêm "BOLIE"
    console.log('\n🔍 Verificando testes BOLIE disponíveis no sistema:')
    const testesBolie = await prisma.test.findMany({
      where: {
        name: {
          contains: 'BOLIE'
        }
      }
    })
    
    console.log(`📊 Testes BOLIE encontrados no sistema: ${testesBolie.length}`)
    
    if (testesBolie.length > 0) {
      testesBolie.forEach((teste, index) => {
        console.log(`\n${index + 1}. ${teste.name}`)
        console.log(`   ID: ${teste.id}`)
        console.log(`   Categoria: ${teste.category}`)
        console.log(`   Tipo: ${teste.type}`)
        console.log(`   Ativo: ${teste.isActive ? 'Sim' : 'Não'}`)
      })
    }
    
    // Verificar sessões de teste do usuário
    console.log('\n🔍 Verificando sessões de teste do usuário:')
    const sessoes = await prisma.testSession.findMany({
      where: { userId: usuario.id },
      include: {
        test: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`📊 Total de sessões de teste: ${sessoes.length}`)
    
    if (sessoes.length > 0) {
      const sessoesBolieAtivas = sessoes.filter(s => 
        s.test?.name && s.test.name.toLowerCase().includes('bolie')
      )
      
      console.log(`🎯 Sessões BOLIE encontradas: ${sessoesBolieAtivas.length}`)
      
      if (sessoesBolieAtivas.length > 0) {
        console.log('\n📋 DETALHES DAS SESSÕES BOLIE:')
        sessoesBolieAtivas.forEach((sessao, index) => {
          console.log(`\n${index + 1}. ${sessao.test.name}`)
          console.log(`   ID da Sessão: ${sessao.id}`)
          console.log(`   Status: ${sessao.status}`)
          console.log(`   Criada em: ${sessao.createdAt}`)
          console.log(`   Atualizada em: ${sessao.updatedAt}`)
          console.log(`   Progresso: ${sessao.progress || 0}%`)
        })
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao consultar banco de dados:', error.message)
    console.error('Stack trace:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar verificação
verificarBolieDB()
  .then(() => {
    console.log('\n✅ Verificação do banco de dados concluída')
  })
  .catch((error) => {
    console.error('\n❌ Erro durante a verificação:', error.message)
  })