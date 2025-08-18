
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { 
  Brain, 
  User, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  UserCheck,
  Heart,
  Users,
  Building2,
  FileText,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function ColaboradorSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const menuItems = [
    {
      name: 'Personalidade',
      href: '/colaborador/personalidade',
      icon: User,
      description: 'Testes de personalidade'
    },
    {
      name: 'Testes Psicossociais',
      href: '/colaborador/psicossociais',
      icon: Heart,
      description: 'Avaliações de saúde mental e bem-estar no trabalho'
    },
    {
      name: 'Testes Corporativos',
      href: '/colaborador/corporativo',
      icon: Building2,
      description: 'Avaliações de liderança e competências'
    },
    {
      name: 'Grafologia',
      href: '/colaborador/grafologia',
      icon: FileText,
      description: 'Análise de personalidade através da escrita'
    },
    {
      name: 'Resultados',
      href: '/colaborador/resultados',
      icon: TrendingUp,
      description: 'Resultados recentes dos testes realizados'
    },
  ]

  const isActive = (href: string) => pathname === href

  const getUserType = () => {
    return session?.user?.userType === 'EMPLOYEE' ? 'Colaborador' : 'Candidato'
  }

  const getUserTypeColor = () => {
    return session?.user?.userType === 'EMPLOYEE' ? 'text-purple-600' : 'text-blue-600'
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-purple-600" />
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
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">HumaniQ AI</h1>
                  <p className="text-xs text-gray-500">Módulo {getUserType()}</p>
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
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {session?.user?.firstName?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {`${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`.trim() || getUserType()}
                </p>
                <div className="flex items-center space-x-1">
                  <UserCheck className="h-3 w-3 text-purple-600" />
                  <span className={`text-xs font-medium ${getUserTypeColor()}`}>
                    {getUserType()}
                  </span>
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
                    ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon className={`h-5 w-5 ${isActive(item.href) ? 'text-purple-600' : ''}`} />
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
