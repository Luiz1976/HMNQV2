import { NextRequest, NextResponse } from 'next/server'
import TestResultArchiver from '@/archives/utils/archiver'

export async function GET(request: NextRequest) {
  try {
    const archiver = new TestResultArchiver()
    const stats = await archiver.getArchiveStats()
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erro ao obter estatísticas do arquivo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}