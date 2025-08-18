// HumaniQ AI - API de Gerenciamento de Backup
// Rotas para criar, listar, restaurar e gerenciar backups do sistema

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  createFullBackup,
  createIncrementalBackup,
  listBackups,
  restoreBackup,
  verifyBackupIntegrity,
  exportTableToCSV,
  exportTableToJSON,
  getBackupStatistics,
  startAutomaticBackup,
  stopAutomaticBackup
} from '../../../lib/backup'

// GET /api/backup - Listar backups e estatísticas
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se o usuário é admin
    if (session.user.userType !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem gerenciar backups.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const backupId = searchParams.get('backupId')
    const table = searchParams.get('table')
    const format = searchParams.get('format')

    switch (action) {
      case 'list':
        const backups = await listBackups()
        return NextResponse.json({
          success: true,
          data: backups
        })

      case 'statistics':
        const stats = await getBackupStatistics()
        return NextResponse.json({
          success: true,
          data: stats
        })

      case 'verify':
        if (!backupId) {
          return NextResponse.json(
            { error: 'ID do backup é obrigatório para verificação' },
            { status: 400 }
          )
        }
        
        const isValid = await verifyBackupIntegrity(backupId)
        return NextResponse.json({
          success: true,
          data: {
            backupId,
            isValid,
            message: isValid ? 'Backup íntegro' : 'Backup corrompido ou inválido'
          }
        })

      case 'export':
        if (!table) {
          return NextResponse.json(
            { error: 'Nome da tabela é obrigatório para exportação' },
            { status: 400 }
          )
        }

        if (format === 'csv') {
          const csvData = await exportTableToCSV(table)
          return new NextResponse(csvData, {
            status: 200,
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': `attachment; filename="${table}_${new Date().toISOString().split('T')[0]}.csv"`
            }
          })
        } else {
          const jsonData = await exportTableToJSON(table)
          return NextResponse.json({
            success: true,
            data: jsonData
          })
        }

      default:
        // Listar backups por padrão
        const defaultBackups = await listBackups()
        const defaultStats = await getBackupStatistics()
        
        return NextResponse.json({
          success: true,
          data: {
            backups: defaultBackups,
            statistics: defaultStats
          }
        })
    }

  } catch (error) {
    console.error('Erro na API de backup (GET):', error)
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// POST /api/backup - Criar backup ou restaurar
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se o usuário é admin
    if (session.user.userType !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem gerenciar backups.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, backupId, type } = body

    switch (action) {
      case 'create':
        let backupResult
        
        if (type === 'full') {
          backupResult = await createFullBackup()
        } else {
          backupResult = await createIncrementalBackup()
        }
        
        if (backupResult.status === 'success') {
          return NextResponse.json({
            success: true,
            message: `Backup ${type === 'full' ? 'completo' : 'incremental'} criado com sucesso`,
            data: backupResult
          })
        } else {
          return NextResponse.json(
            {
              error: 'Falha ao criar backup',
              details: backupResult.error
            },
            { status: 500 }
          )
        }

      case 'restore':
        if (!backupId) {
          return NextResponse.json(
            { error: 'ID do backup é obrigatório para restauração' },
            { status: 400 }
          )
        }
        
        // Verificar integridade antes de restaurar
        const isValid = await verifyBackupIntegrity(backupId)
        if (!isValid) {
          return NextResponse.json(
            { error: 'Backup corrompido ou inválido. Restauração cancelada.' },
            { status: 400 }
          )
        }
        
        const restoreSuccess = await restoreBackup(backupId)
        
        if (restoreSuccess) {
          return NextResponse.json({
            success: true,
            message: `Backup ${backupId} restaurado com sucesso`,
            data: { backupId, restored: true }
          })
        } else {
          return NextResponse.json(
            { error: 'Falha ao restaurar backup' },
            { status: 500 }
          )
        }

      case 'start-auto':
        startAutomaticBackup()
        return NextResponse.json({
          success: true,
          message: 'Backup automático iniciado'
        })

      case 'stop-auto':
        stopAutomaticBackup()
        return NextResponse.json({
          success: true,
          message: 'Backup automático interrompido'
        })

      default:
        return NextResponse.json(
          { error: 'Ação não reconhecida' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Erro na API de backup (POST):', error)
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/backup - Deletar backup específico
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se o usuário é admin
    if (session.user.userType !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem gerenciar backups.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const backupId = searchParams.get('backupId')

    if (!backupId) {
      return NextResponse.json(
        { error: 'ID do backup é obrigatório' },
        { status: 400 }
      )
    }

    try {
      const fs = require('fs')
      const path = require('path')
      
      const backupDir = path.join(process.cwd(), 'backups')
      const backupFile = path.join(backupDir, `${backupId}.db`)
      const metadataFile = path.join(backupDir, `${backupId}.json`)
      const incrementalFile = path.join(backupDir, `${backupId}.json`)
      const incrementalMetaFile = path.join(backupDir, `${backupId}.json.meta`)
      
      let filesDeleted = 0
      
      // Deletar arquivo de backup
      if (fs.existsSync(backupFile)) {
        fs.unlinkSync(backupFile)
        filesDeleted++
      }
      
      // Deletar metadata
      if (fs.existsSync(metadataFile)) {
        fs.unlinkSync(metadataFile)
        filesDeleted++
      }
      
      // Deletar arquivos de backup incremental
      if (fs.existsSync(incrementalFile) && !fs.existsSync(backupFile)) {
        fs.unlinkSync(incrementalFile)
        filesDeleted++
      }
      
      if (fs.existsSync(incrementalMetaFile)) {
        fs.unlinkSync(incrementalMetaFile)
        filesDeleted++
      }
      
      if (filesDeleted === 0) {
        return NextResponse.json(
          { error: 'Backup não encontrado' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        message: `Backup ${backupId} deletado com sucesso`,
        data: {
          backupId,
          filesDeleted
        }
      })
      
    } catch (deleteError) {
      console.error('Erro ao deletar backup:', deleteError)
      return NextResponse.json(
        {
          error: 'Erro ao deletar backup',
          details: deleteError instanceof Error ? deleteError.message : 'Erro desconhecido'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Erro na API de backup (DELETE):', error)
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// PUT /api/backup - Atualizar configurações de backup
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se o usuário é admin
    if (session.user.userType !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem gerenciar backups.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'cleanup':
        // Implementar limpeza manual de backups antigos
        const { backupManager } = await import('../../../lib/backup')
        await backupManager.cleanupOldBackups()
        
        return NextResponse.json({
          success: true,
          message: 'Limpeza de backups antigos executada com sucesso'
        })

      default:
        return NextResponse.json(
          { error: 'Ação não reconhecida' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Erro na API de backup (PUT):', error)
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}