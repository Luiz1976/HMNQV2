// Bridge module para manter compatibilidade com imports antigos
// Este arquivo re-exporta o cliente db de @/lib/db como prisma
// para resolver erros de importação onde '@/lib/prisma' é esperado

export { db as prisma, db as default } from '@/lib/db'