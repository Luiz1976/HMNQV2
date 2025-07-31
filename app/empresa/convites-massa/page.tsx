
import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { BulkInviteContent } from './_components/bulk-invite-content'

export const dynamic = 'force-dynamic'

async function getERPConfigsAndTests(companyId: string) {
  const [erpConfigs, tests] = await Promise.all([
    prisma.eRPConfig.findMany({
      where: { 
        companyId,
        isActive: true,
        syncStatus: 'SUCCESS'
      },
      include: {
        employees: {
          where: { status: 'Active' },
          take: 100,
          orderBy: { firstName: 'asc' }
        }
      }
    }),
    prisma.test.findMany({
      where: {
        OR: [
          { isPublic: true },
          { companyId }
        ],
        isActive: true
      },
      include: {
        category: true
      },
      orderBy: { name: 'asc' }
    })
  ])

  return { 
    erpConfigs: erpConfigs as any, 
    tests: tests as any 
  }
}

export default async function ConvitesMassaPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { company: true }
  })

  if (!user?.company) {
    redirect('/empresa')
  }

  const { erpConfigs, tests } = await getERPConfigsAndTests(user.company.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Convites em Massa
          </h1>
          <p className="text-gray-600">
            Envie convites para testes psicossociais diretamente para colaboradores sincronizados do ERP
          </p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <BulkInviteContent 
            erpConfigs={erpConfigs}
            tests={tests}
            companyId={user.company.id}
          />
        </Suspense>
      </div>
    </div>
  )
}
