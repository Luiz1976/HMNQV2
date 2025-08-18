const { PrismaClient } = require('@prisma/client');

async function updateMetadata() {
  const prisma = new PrismaClient();
  
  try {
    // Usar uma URL de imagem de teste válida
    const validImageUrl = 'https://via.placeholder.com/800x600/f0f0f0/333333?text=Manuscrito+de+Teste';
    
    const result = await prisma.aIAnalysis.update({
      where: { id: '57d6524c-5c86-4e03-86ba-ccbb01e4a832' },
      data: {
        metadata: {
          imageUrl: validImageUrl,
          uploadedAt: '2024-01-15T10:30:00Z',
          testImage: true,
          description: 'Imagem de teste para debug do manuscrito grafológico'
        }
      }
    });
    
    console.log('✅ Metadados atualizados com sucesso!');
    console.log('🖼️ Nova URL da imagem:', validImageUrl);
    console.log('📋 Metadados atualizados:', JSON.stringify(result.metadata, null, 2));
    
  } catch (error) {
    console.error('❌ Erro ao atualizar metadados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateMetadata();