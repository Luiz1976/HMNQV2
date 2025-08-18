
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { 
  Brain, 
  Building2, 
  Mail, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  UserCog
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const menuItems = [
    {
      name: 'Convites',
      href: '/admin/convites',
      icon: Mail,
      description: 'Gerar links de convite para empresas'
    },
    {
      name: 'Gestão das Empresas',
      href: '/admin/empresas',
      icon: Building2,
      description: 'Visualizar e gerenciar empresas cadastradas'
    },
    {
      name: 'Configurações',
      href: '/admin/configuracoes',
      icon: Settings,
      description: 'Configurações da plataforma'
    }
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">HumaniQ AI</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 
        ${isCollapsed ? 'w-16' : 'w-64'} 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-white shadow-lg transition-all duration-300 ease-in-out
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">HumaniQ AI</h1>
                  <p className="text-xs text-gray-500">Módulo Administrador</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session?.user?.avatarUrl || ''} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {session?.user?.firstName?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {`${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`.trim() || 'Administrador'}
                </p>
                <div className="flex items-center space-x-1">
                  <UserCog className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-blue-600 font-medium">Admin</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200
                  ${isActive(item.href) 
                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon className={`h-5 w-5 ${isActive(item.href) ? 'text-blue-600' : ''}`} />
                {!isCollapsed && (
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Sair do Sistema</span>}
          </Button>
        </div>
      </div>
    </>
  )
}
