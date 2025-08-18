const { PrismaClient } = require('@prisma/client');

async function checkMetadata() {
  const prisma = new PrismaClient();
  
  try {
    const result = await prisma.aIAnalysis.findUnique({
      where: { id: '57d6524c-5c86-4e03-86ba-ccbb01e4a832' },
      select: { 
        metadata: true,
        id: true,
        createdAt: true
      }
    });
    
    if (result) {
      console.log('✅ Análise encontrada:');
      console.log('ID:', result.id);
      console.log('Data de criação:', result.createdAt);
      console.log('\n📋 Metadados completos:');
      console.log(JSON.stringify(result.metadata, null, 2));
      
      // Verificar especificamente a imageUrl
      if (result.metadata && result.metadata.imageUrl) {
        console.log('\n🖼️ URL da imagem encontrada:', result.metadata.imageUrl);
      } else {
        console.log('\n❌ imageUrl NÃO encontrada nos metadados');
      }
    } else {
      console.log('❌ Análise não encontrada com o ID fornecido');
    }
  } catch (error) {
    console.error('❌ Erro ao buscar metadados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMetadata();