import { db } from '../lib/db'

async function checkResult() {
  try {
    const resultId = 'cmeq1ollb00038wfk135lx6r1'
    
    const result = await db.testResult.findUnique({
      where: { id: resultId },
      include: {
        user: true,
        test: true
      }
    })
    
    console.log('🔍 Checking result ID:', resultId)
    console.log('📊 Result found:', !!result)
    
    if (result) {
      console.log('✅ Result details:')
      console.log('  - ID:', result.id)
      console.log('  - Test:', result.test.name)
      console.log('  - User:', result.user.firstName, result.user.lastName)
      console.log('  - Created:', result.createdAt)
    } else {
      console.log('❌ Result not found. Available results:')
      const results = await db.testResult.findMany({
        take: 5,
        include: {
          test: true,
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      results.forEach(r => {
        console.log(`  - ${r.id} (${r.test.name}) - ${r.user.firstName} ${r.user.lastName}`)
      })
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkResult()