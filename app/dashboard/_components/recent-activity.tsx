
'use client'

// HumaniQ AI - Atividade Recente
// Lista dos usuários mais recentes cadastrados

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  userType: string
  avatarUrl?: string | null
  createdAt: Date
  company?: {
    id: string
    name: string
  } | null
}

interface RecentActivityProps {
  users: User[]
}

export function RecentActivity({ users }: RecentActivityProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'ADMIN':
        return 'Administrador'
      case 'COMPANY':
        return 'Empresa'
      case 'EMPLOYEE':
        return 'Funcionário'
      case 'CANDIDATE':
        return 'Candidato'
      default:
        return userType
    }
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'COMPANY':
        return 'bg-blue-100 text-blue-800'
      case 'EMPLOYEE':
        return 'bg-green-100 text-green-800'
      case 'CANDIDATE':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>
          Usuários recentemente cadastrados na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma atividade recente
            </p>
          ) : (
            users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl || ''} alt={user.firstName} />
                  <AvatarFallback>
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getUserTypeColor(user.userType)}`}
                    >
                      {getUserTypeLabel(user.userType)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {user.email}
                  </p>
                  {user.company && (
                    <p className="text-xs text-gray-400 truncate">
                      {user.company.name}
                    </p>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
