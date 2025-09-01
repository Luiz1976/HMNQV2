const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getBolieId() {
  try {
    const bolieTest = await prisma.test.findFirst({
      where: {
        name: {
          contains: 'BOLIE'
        }
      },
      select: {
        id: true,
        name: true,
        category: {
          select: {
            name: true
          }
        }
      }
    });
    
    if (bolieTest) {
      console.log('BOLIE Test ID:', bolieTest.id);
      console.log('Name:', bolieTest.name);
      console.log('Category:', bolieTest.category?.name);
    } else {
      console.log('BOLIE test not found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getBolieId();