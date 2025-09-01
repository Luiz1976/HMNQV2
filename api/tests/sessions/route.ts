import type { NextRequest } from 'next/server'

// Reexporta a implementação existente localizada em app/app/api/tests/sessions/route.ts
import { POST as originalPOST } from '@/app/api/tests/sessions/route'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // Delega a lógica para o handler original
  return originalPOST(request)
}