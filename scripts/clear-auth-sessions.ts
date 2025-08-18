// Script para limpar sessões de autenticação
// Execute com: npx tsx scripts/clear-auth-sessions.ts

import { db } from '../lib/db'

async function clearAuthSessions() {
  try {
    console.log('🧹 Limpando sessões de autenticação...')
    
    // Limpar todas as sessões
    const deletedSessions = await db.session.deleteMany({})
    console.log(`✅ ${deletedSessions.count} sessões removidas`)
    
    // Limpar todas as contas (accounts)
    const deletedAccounts = await db.account.deleteMany({})
    console.log(`✅ ${deletedAccounts.count} contas removidas`)
    
    // Limpar tokens de verificação
    const deletedTokens = await db.verificationToken.deleteMany({})
    console.log(`✅ ${deletedTokens.count} tokens de verificação removidos`)
    
    console.log('\n🎉 Limpeza concluída! Agora tente fazer login novamente.')
    console.log('💡 Dica: Também limpe os cookies do navegador (F12 > Application > Cookies)')
    
  } catch (error) {
    console.error('❌ Erro ao limpar sessões:', error)
  } finally {
    await db.$disconnect()
  }
}

clearAuthSessions()