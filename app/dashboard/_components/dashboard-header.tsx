
'use client'

// HumaniQ AI - Header do Dashboard
// Navegação principal e perfil do usuário

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  User, 
  Settings, 
  LogOut, 
  Brain,
  Users,
  Building2,
  FileText,
  BarChart3
} from 'lucide-react'
import { AuthUser } from '@/lib/types'

interface DashboardHeaderProps {
  user: AuthUser
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/login' })
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e navegação */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                HumaniQ AI
              </span>
            </div>

            <nav className="hidden md:flex space-x-6">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                <Users className="h-4 w-4 mr-2" />
                Usuários
              </Button>
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                <Building2 className="h-4 w-4 mr-2" />
                Empresas
              </Button>
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                <FileText className="h-4 w-4 mr-2" />
                Testes
              </Button>
            </nav>
          </div>

          {/* Perfil do usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl || ''} alt={user?.firstName || 'User'} />
                  <AvatarFallback>
                    {getInitials(user?.firstName, user?.lastName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <p className="text-xs leading-none text-blue-600 font-medium">
                    {user?.userType === 'ADMIN' ? 'Administrador' : user?.userType}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
