'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  HardDrive
} from 'lucide-react'

interface BackupInfo {
  id: string
  filename: string
  size: number
  createdAt: string
  type: 'full' | 'incremental'
  status: 'completed' | 'in_progress' | 'failed'
}

interface BackupManagerProps {
  onBackupComplete?: () => void
}

export default function BackupManager({ onBackupComplete }: BackupManagerProps) {
  const [backups, setBackups] = useState<BackupInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [isBackingUp, setIsBackingUp] = useState(false)

  const loadBackups = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/backup')
      if (response.ok) {
        const data = await response.json()
        setBackups(data.backups || [])
      } else {
        toast.error('Erro ao carregar lista de backups')
      }
    } catch (error) {
      console.error('Erro ao carregar backups:', error)
      toast.error('Erro ao carregar backups')
    } finally {
      setLoading(false)
    }
  }

  const createBackup = async (type: 'full' | 'incremental') => {
    setIsBackingUp(true)
    setBackupProgress(0)
    
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type })
      })

      if (response.ok) {
        // Simular progresso do backup
        const progressInterval = setInterval(() => {
          setBackupProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval)
              return 100
            }
            return prev + 10
          })
        }, 200)

        const data = await response.json()
        
        setTimeout(() => {
          setIsBackingUp(false)
          setBackupProgress(0)
          toast.success(`Backup ${type} criado com sucesso!`)
          loadBackups()
          onBackupComplete?.()
        }, 2000)
      } else {
        throw new Error('Falha ao criar backup')
      }
    } catch (error) {
      console.error('Erro ao criar backup:', error)
      toast.error('Erro ao criar backup')
      setIsBackingUp(false)
      setBackupProgress(0)
    }
  }

  const downloadBackup = async (backupId: string, filename: string) => {
    try {
      const response = await fetch(`/api/backup/${backupId}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        toast.success('Backup baixado com sucesso!')
      } else {
        toast.error('Erro ao baixar backup')
      }
    } catch (error) {
      console.error('Erro ao baixar backup:', error)
      toast.error('Erro ao baixar backup')
    }
  }

  const restoreBackup = async (backupId: string) => {
    if (!confirm('Tem certeza que deseja restaurar este backup? Esta ação não pode ser desfeita.')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/backup/${backupId}/restore`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('Backup restaurado com sucesso!')
        onBackupComplete?.()
      } else {
        toast.error('Erro ao restaurar backup')
      }
    } catch (error) {
      console.error('Erro ao restaurar backup:', error)
      toast.error('Erro ao restaurar backup')
    } finally {
      setLoading(false)
    }
  }

  const deleteBackup = async (backupId: string) => {
    if (!confirm('Tem certeza que deseja deletar este backup?')) {
      return
    }

    try {
      const response = await fetch(`/api/backup/${backupId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Backup deletado com sucesso!')
        loadBackups()
      } else {
        toast.error('Erro ao deletar backup')
      }
    } catch (error) {
      console.error('Erro ao deletar backup:', error)
      toast.error('Erro ao deletar backup')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Controles de Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Gerenciamento de Backup
          </CardTitle>
          <CardDescription>
            Crie, restaure e gerencie backups do banco de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => createBackup('full')} 
              disabled={isBackingUp}
              className="flex items-center gap-2"
            >
              <HardDrive className="h-4 w-4" />
              Backup Completo
            </Button>
            <Button 
              onClick={() => createBackup('incremental')} 
              disabled={isBackingUp}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Backup Incremental
            </Button>
            <Button 
              onClick={loadBackups} 
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar Lista
            </Button>
          </div>

          {isBackingUp && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Criando backup...</span>
                <span>{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Backups */}
      <Card>
        <CardHeader>
          <CardTitle>Backups Disponíveis</CardTitle>
          <CardDescription>
            {backups.length} backup(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {backups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum backup encontrado</p>
              <p className="text-sm">Crie seu primeiro backup usando os botões acima</p>
            </div>
          ) : (
            <div className="space-y-4">
              {backups.map((backup) => (
                <div 
                  key={backup.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(backup.status)}
                    <div>
                      <div className="font-medium">{backup.filename}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(backup.size)} • 
                        {new Date(backup.createdAt).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <Badge variant={backup.type === 'full' ? 'default' : 'secondary'}>
                      {backup.type === 'full' ? 'Completo' : 'Incremental'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadBackup(backup.id, backup.filename)}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Baixar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => restoreBackup(backup.id)}
                      disabled={backup.status !== 'completed'}
                      className="flex items-center gap-1"
                    >
                      <Upload className="h-3 w-3" />
                      Restaurar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteBackup(backup.id)}
                      className="flex items-center gap-1"
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}