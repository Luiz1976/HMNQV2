
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Users, 
  TestTube, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Heart,
  Briefcase,
  Mail,
  Database,
  Link as LinkIcon
} from 'lucide-react'

const navigation = [
  {
    name: 'Visão Geral',
    href: '/empresa',
    icon: Building2,
    description: 'Dashboard principal da empresa'
  },
  {
    name: 'Saúde Psicossocial',
    href: '/empresa/saude',
    icon: Heart,
    description: 'Avaliações de saúde mental'
  },

  {
    name: 'Colaboradores',
    href: '/empresa/colaboradores',
    icon: Users,
    description: 'Gestão de colaboradores'
  },
  {
    name: 'Convites em Massa',
    href: '/empresa/convites-massa',
    icon: Mail,
    description: 'Envio de convites via ERP'
  },
  {
    name: 'Integrações ERP',
    href: '/empresa/integracoes',
    icon: Database,
    description: 'Configurar integrações ERP'
  },
  {
    name: 'Relatórios',
    href: '/empresa/relatorios',
    icon: BarChart3,
    description: 'Análises e relatórios'
  }
]

export default function EmpresaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/login' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="font-bold text-gray-900">HumaniQ AI</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 border-r border-gray-200">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <div>
                <div className="font-bold text-gray-900">HumaniQ AI</div>
                <div className="text-sm text-gray-500">Painel Empresa</div>
              </div>
            </div>
          </div>
          
          <nav className="flex flex-1 flex-col space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Card className={`transition-all hover:shadow-md ${isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                    <CardContent className="flex items-center p-4">
                      <item.icon
                        className={`mr-4 h-6 w-6 flex-shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-gray-400'
                        }`}
                      />
                      <div className="flex-1">
                        <div className={`font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <Badge variant="default" className="ml-2">
                          Ativo
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="border-t pt-4 pb-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {session?.user?.name?.[0] || 'U'}
                    </span>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {session?.user?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {session?.user?.email}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="ml-2"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            HumaniQ AI - Empresa
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
