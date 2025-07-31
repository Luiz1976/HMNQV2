
'use client'

// HumaniQ AI - Dashboard Administrativo
// Interface principal para administração da plataforma com sidebar lateral

import { useState, useEffect } from 'react'
import { Sidebar } from './sidebar'
import { DashboardContent } from './dashboard-content'
import { AuthUser } from '@/lib/types'

interface AdminDashboardProps {
  user: AuthUser
  stats: {
    totalUsers: number
    totalCompanies: number
    totalTests: number
    totalResults: number
    activeUsers: number
    completedTests: number
    pendingInvitations: number
    recentActivity: number
  }
}

export function AdminDashboard({ user, stats }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar mobile e ajustar sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
      `}>
        {/* Top Header (Mobile) */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleToggleCollapse}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">HumaniQ AI</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>

        {/* Dashboard Content */}
        <DashboardContent
          activeTab={activeTab}
          stats={stats}
        />
      </div>
    </div>
  )
}
