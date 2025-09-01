import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function summarizeAllRecords() {
  try {
    console.log('📊 RESUMO COMPLETO DOS 237 REGISTROS DO BANCO DE DADOS')
    console.log('=' .repeat(60))

    // 1. TestResult (33 registros)
    const testResults = await prisma.testResult.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        test: {
          select: {
            name: true,
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`\n🎯 TESTRESULT (${testResults.length} registros):`)
    testResults.forEach((result, index) => {
      const userName = result.user ? `${result.user.firstName} ${result.user.lastName}` : 'N/A'
      const testName = result.test?.name || 'N/A'
      const createdAt = result.createdAt.toLocaleString('pt-BR')
      console.log(`${index + 1}. ${userName} - ${testName} - ${createdAt}`)
    })

    // 2. TestSession (96 registros)
    const testSessions = await prisma.testSession.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        test: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`\n🔄 TESTSESSION (${testSessions.length} registros):`)
    // Mostrar apenas os primeiros 10 para economizar espaço
    testSessions.slice(0, 10).forEach((session, index) => {
      const userName = session.user ? `${session.user.firstName} ${session.user.lastName}` : 'N/A'
      const testName = session.test?.name || 'N/A'
      const createdAt = session.createdAt.toLocaleString('pt-BR')
      console.log(`${index + 1}. ${userName} - ${testName} - ${createdAt}`)
    })
    if (testSessions.length > 10) {
      console.log(`... e mais ${testSessions.length - 10} sessões`)
    }

    // 3. Answer (45 registros)
    const answers = await prisma.answer.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        session: {
          select: {
            test: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`\n💬 ANSWER (${answers.length} registros):`)
    // Mostrar apenas os primeiros 10 para economizar espaço
    answers.slice(0, 10).forEach((answer, index) => {
      const userName = answer.user ? `${answer.user.firstName} ${answer.user.lastName}` : 'N/A'
      const testName = answer.session?.test?.name || 'N/A'
      const createdAt = answer.createdAt.toLocaleString('pt-BR')
      console.log(`${index + 1}. ${userName} - ${testName} - ${createdAt}`)
    })
    if (answers.length > 10) {
      console.log(`... e mais ${answers.length - 10} respostas`)
    }

    // 4. AIAnalysis (63 registros)
    const aiAnalyses = await prisma.aIAnalysis.findMany({
      include: {
        testResult: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            test: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`\n🤖 AIANALYSIS (${aiAnalyses.length} registros):`)
    // Mostrar apenas os primeiros 10 para economizar espaço
    aiAnalyses.slice(0, 10).forEach((analysis, index) => {
      const userName = analysis.testResult?.user ? 
        `${analysis.testResult.user.firstName} ${analysis.testResult.user.lastName}` : 'N/A'
      const testName = analysis.testResult?.test?.name || 'N/A'
      const createdAt = analysis.createdAt.toLocaleString('pt-BR')
      const analysisType = analysis.analysisType || 'N/A'
      console.log(`${index + 1}. ${userName} - ${testName} - ${analysisType} - ${createdAt}`)
    })
    if (aiAnalyses.length > 10) {
      console.log(`... e mais ${aiAnalyses.length - 10} análises`)
    }

    // Estatísticas por usuário
    console.log('\n👥 ESTATÍSTICAS POR USUÁRIO:')
    const userStats = new Map()
    
    testResults.forEach(result => {
      if (result.user) {
        const userName = `${result.user.firstName} ${result.user.lastName}`
        userStats.set(userName, (userStats.get(userName) || 0) + 1)
      }
    })

    Array.from(userStats.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([user, count]) => {
        console.log(`${user}: ${count} testes concluídos`)
      })

    // Resumo final
    console.log('\n📈 RESUMO FINAL:')
    console.log('=' .repeat(50))
    console.log(`TestResult: ${testResults.length} registros`)
    console.log(`TestSession: ${testSessions.length} registros`)
    console.log(`Answer: ${answers.length} registros`)
    console.log(`AIAnalysis: ${aiAnalyses.length} registros`)
    console.log(`TOTAL: ${testResults.length + testSessions.length + answers.length + aiAnalyses.length} registros`)

    // Período dos dados
    const allDates = [
      ...testResults.map(r => r.createdAt),
      ...testSessions.map(s => s.createdAt),
      ...answers.map(a => a.createdAt),
      ...aiAnalyses.map(a => a.createdAt)
    ]
    
    const mostRecent = new Date(Math.max(...allDates.map(d => d.getTime())))
    const oldest = new Date(Math.min(...allDates.map(d => d.getTime())))
    
    console.log(`\nPeríodo: ${oldest.toLocaleString('pt-BR')} até ${mostRecent.toLocaleString('pt-BR')}`)
    console.log('\n=== FIM DO RESUMO ===')

  } catch (error) {
    console.error('❌ Erro ao buscar registros:', error)
  } finally {
    await prisma.$disconnect()
  }
}

summarizeAllRecords()