
'use client'

// HumaniQ AI - Sidebar Component
// Navegação lateral para dashboard administrativo

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Building2, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  Mail,
  Brain
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { AuthUser } from '@/lib/types'

interface SidebarProps {
  user: AuthUser
  activeTab: string
  onTabChange: (tab: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ user, activeTab, onTabChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/login' })
  }

  const navigationItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: Home,
      description: 'Visão geral do sistema'
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: Users,
      description: 'Gerenciar usuários'
    },
    {
      id: 'companies',
      label: 'Empresas',
      icon: Building2,
      description: 'Gerenciar empresas'
    },
    {
      id: 'tests',
      label: 'Testes',
      icon: FileText,
      description: 'Gerenciar testes'
    },
    {
      id: 'invitations',
      label: 'Convites',
      icon: Mail,
      description: 'Gerenciar convites'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Relatórios avançados'
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      description: 'Configurações do sistema'
    }
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-64'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">HumaniQ AI</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="lg:hidden"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    {user?.userType}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`
                  w-full justify-start gap-3 h-10
                  ${activeTab === item.id ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
                  ${isCollapsed ? 'px-3' : 'px-3'}
                `}
                onClick={() => onTabChange(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className={`h-4 w-4 ${isCollapsed ? 'mx-auto' : ''}`} />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Button>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-2 border-t border-gray-200">
          <Button
            variant="ghost"
            className={`
              w-full justify-start gap-3 h-10 text-gray-600 hover:text-red-600 hover:bg-red-50
              ${isCollapsed ? 'px-3' : 'px-3'}
            `}
            onClick={handleSignOut}
            title={isCollapsed ? 'Sair' : undefined}
          >
            <LogOut className={`h-4 w-4 ${isCollapsed ? 'mx-auto' : ''}`} />
            {!isCollapsed && <span className="font-medium">Sair</span>}
          </Button>
        </div>

        {/* Collapse Toggle Desktop */}
        <div className="hidden lg:block p-2 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-full"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </>
  )
}
