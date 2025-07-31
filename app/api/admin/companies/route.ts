
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const companies = await prisma.company.findMany({
      include: {
        owner: {
          select: { firstName: true, lastName: true, email: true }
        },
        employees: {
          select: { id: true }
        },
        testSessions: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data to match the expected format
    const transformedCompanies = companies.map((company: any) => ({
      id: company.id,
      name: company.name,
      cnpj: company.cnpj,
      industry: company.industry,
      size: company.size,
      subscriptionStatus: company.subscriptionStatus,
      subscriptionPlan: company.subscriptionPlan,
      employeeCount: company.employees.length,
      testCount: company.testSessions.length,
      riskLevel: 'LOW' as const, // This would be calculated based on actual test results
      createdAt: company.createdAt.toISOString(),
      owner: company.owner ? {
        name: `${company.owner.firstName} ${company.owner.lastName}`,
        email: company.owner.email
      } : null
    }))

    return NextResponse.json(transformedCompanies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
