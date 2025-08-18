// HumaniQ AI - Página de Administração de Backup
// Interface administrativa para gerenciar backups do sistema

import { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import BackupManager from '@/components/BackupManager'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Database, Clock, Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gerenciamento de Backup',
  description: 'Administração de backups automáticos e manuais do sistema HumaniQ AI',
}

export default async function BackupAdminPage() {
  const session = await getServerSession(authOptions)

  // Verificar autenticação
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Verificar se é administrador
  if (session.user.userType !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-500" />
              <span>Acesso Negado</span>
            </CardTitle>
            <CardDescription>
              Apenas administradores podem acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Você não tem permissão para gerenciar backups do sistema.
                Entre em contato com um administrador se precisar de acesso.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header com informações importantes */}
      <div className="mb-8">
        <Alert className="mb-6">
          <Database className="h-4 w-4" />
          <AlertDescription>
            <strong>Sistema de Backup Ativo:</strong> Os backups automáticos estão configurados para executar 
            incrementalmente a cada 6 horas e backup completo diariamente às 2:00 AM. 
            Todos os dados são armazenados de forma segura e podem ser restaurados quando necessário.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Backup Automático</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Ativo</div>
              <p className="text-xs text-muted-foreground">
                Incremental a cada 6h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Localização</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">/backups</div>
              <p className="text-xs text-muted-foreground">
                Diretório de backups
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Retenção</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30</div>
              <p className="text-xs text-muted-foreground">
                Backups mantidos
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Componente principal de gerenciamento */}
      <BackupManager />

      {/* Informações adicionais */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações Importantes</CardTitle>
            <CardDescription>
              Diretrizes para uso seguro do sistema de backup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Tipos de Backup</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li><strong>Completo:</strong> Copia todo o banco de dados SQLite</li>
                  <li><strong>Incremental:</strong> Apenas dados modificados recentemente</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Segurança</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>Verificação de integridade com checksum SHA-256</li>
                  <li>Backup automático antes de restaurações</li>
                  <li>Logs detalhados de todas as operações</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Recomendações</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>Sempre verifique a integridade antes de restaurar</li>
                  <li>Mantenha backups em local seguro</li>
                  <li>Teste restaurações periodicamente</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Monitoramento</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>Logs disponíveis em /backups/backup.log</li>
                  <li>Notificações automáticas em caso de falha</li>
                  <li>Estatísticas detalhadas de uso</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}