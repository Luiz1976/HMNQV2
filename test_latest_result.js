// Script para verificar o resultado mais recente do teste HumaniQ BOLIE
const { PrismaClient } = require('@prisma/client');

async function testLatestResult() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Buscando o resultado mais recente do teste HumaniQ BOLIE...');
    
    // Buscar o resultado mais recente do teste HumaniQ BOLIE
    const latestResult = await prisma.testResult.findFirst({
      where: {
        test: {
          name: 'HumaniQ BOLIE – Inteligência Emocional'
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        },
        test: {
          select: {
            name: true,
            id: true
          }
        }
      }
    });
    
    if (!latestResult) {
      console.log('❌ Nenhum resultado encontrado para o teste HumaniQ BOLIE');
      return;
    }
    
    console.log('✅ Resultado mais recente encontrado:');
    console.log('📧 Usuário:', latestResult.user?.email || 'N/A');
    console.log('👤 Nome:', `${latestResult.user?.firstName || ''} ${latestResult.user?.lastName || ''}`.trim() || 'N/A');
    console.log('📅 Data:', latestResult.createdAt);
    console.log('🎯 Teste:', latestResult.test?.name || 'N/A');
    console.log('🆔 ID do teste:', latestResult.test?.id || 'N/A');
    console.log('📊 Pontuação geral:', latestResult.overallScore);
    console.log('⏱️ Duração:', latestResult.duration, 'segundos');
    
    // Verificar se há dados de dimensões
    if (latestResult.dimensionScores) {
      console.log('\n📋 Pontuações por dimensão:');
      try {
        let dimensions;
        if (typeof latestResult.dimensionScores === 'string') {
          dimensions = JSON.parse(latestResult.dimensionScores);
        } else {
          dimensions = latestResult.dimensionScores;
        }
        Object.entries(dimensions).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      } catch (error) {
        console.log('❌ Erro ao processar dimensionScores:', error.message);
        console.log('📄 Dados brutos:', latestResult.dimensionScores);
      }
    } else {
      console.log('⚠️ Nenhuma pontuação de dimensão encontrada');
    }
    
    // Verificar se há dados de metadata
    if (latestResult.metadata) {
      try {
        let metadata;
        if (typeof latestResult.metadata === 'string') {
          metadata = JSON.parse(latestResult.metadata);
        } else {
          metadata = latestResult.metadata;
        }
        console.log('\n📄 Metadata:', JSON.stringify(metadata, null, 2));
      } catch (error) {
        console.log('❌ Erro ao processar metadata:', error.message);
      }
    }
    
    // Verificar se o resultado está sendo exibido corretamente
    if (latestResult.overallScore > 0 && latestResult.dimensionScores) {
      console.log('\n✅ O resultado parece estar processado corretamente!');
    } else {
      console.log('\n❌ Há problemas com o processamento do resultado:');
      if (latestResult.overallScore <= 0) {
        console.log('  - Pontuação geral é 0 ou negativa');
      }
      if (!latestResult.dimensionScores) {
        console.log('  - Pontuações de dimensão estão ausentes');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao buscar resultado:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLatestResult();