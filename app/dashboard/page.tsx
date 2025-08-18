

// HumaniQ AI - Dashboard Principal
// Interface administrativa para proprietários da plataforma SaaS

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminDashboard } from './_components/admin-dashboard'

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/login')
  }

  // Buscar estatísticas completas do sistema para o dashboard administrativo
  const [
    totalUsers,
    totalCompanies,
    totalTests,
    totalResults,
    activeUsers,
    completedTests,
    pendingInvitations,
    recentActivity
  ] = await Promise.all([
    db.user.count(),
    db.company.count(),
    db.test.count(),
    db.testResult.count(),
    db.user.count({ where: { isActive: true } }),
    db.testResult.count(),
    db.invitation.count({ where: { status: 'PENDING' } }),
    db.testSession.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // últimas 24h
        }
      }
    })
  ])

  const stats = {
    totalUsers,
    totalCompanies,
    totalTests,
    totalResults,
    activeUsers,
    completedTests,
    pendingInvitations,
    recentActivity
  }

  return (
    <AdminDashboard 
      user={session.user as any}
      stats={stats}
    />
  )
}
