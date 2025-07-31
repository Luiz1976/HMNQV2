
import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { ERPIntegrationsContent } from './_components/erp-integrations-content'

export const dynamic = 'force-dynamic'

async function getERPConfigs(companyId: string) {
  return await prisma.eRPConfig.findMany({
    where: { companyId },
    include: {
      syncLogs: {
        take: 5,
        orderBy: { startedAt: 'desc' }
      },
      employees: {
        take: 10,
        orderBy: { lastSyncAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export default async function IntegracaoERPPage() {
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

  const erpConfigs = await getERPConfigs(user.company.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Integrações ERP
          </h1>
          <p className="text-gray-600">
            Configure e gerencie as integrações com seus sistemas ERP para sincronização automática de colaboradores
          </p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <ERPIntegrationsContent 
            initialConfigs={erpConfigs as any} 
            companyId={user.company.id}
          />
        </Suspense>
      </div>
    </div>
  )
}
