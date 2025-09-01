/**
 * Utilitários para exibir mensagens de confirmação e notificações
 * Integrado com o sistema de armazenamento LGPD
 */

import { toast } from '@/hooks/use-toast'

/**
 * Exibe mensagem de confirmação após armazenamento bem-sucedido de resultados
 */
export function showResultStorageSuccess(testName?: string) {
  toast({
    title: "✅ Resultado armazenado com sucesso!",
    description: testName 
      ? `Seus resultados do teste "${testName}" foram salvos de forma segura e criptografada.`
      : "Seus resultados foram salvos de forma segura e criptografada.",
    duration: 5000,
    className: "bg-green-50 border-green-200 text-green-800"
  })
}

/**
 * Exibe mensagem de erro ao armazenar resultados
 */
export function showResultStorageError(error?: string) {
  toast({
    title: "❌ Erro ao salvar resultados",
    description: error || "Ocorreu um erro ao salvar seus resultados. Tente novamente.",
    variant: "destructive",
    duration: 7000
  })
}

/**
 * Exibe mensagem de confirmação para exportação de dados
 */
export function showExportSuccess(format: 'CSV' | 'XLSX', count: number) {
  toast({
    title: "📊 Exportação concluída!",
    description: `${count} resultado(s) exportado(s) em formato ${format} com sucesso.`,
    duration: 4000,
    className: "bg-blue-50 border-blue-200 text-blue-800"
  })
}

/**
 * Exibe mensagem de confirmação para exclusão de resultados
 */
export function showDeleteSuccess(count: number = 1) {
  toast({
    title: "🗑️ Resultado(s) excluído(s)",
    description: `${count} resultado(s) removido(s) permanentemente do sistema.`,
    duration: 4000,
    className: "bg-orange-50 border-orange-200 text-orange-800"
  })
}

/**
 * Exibe mensagem informativa sobre conformidade LGPD
 */
export function showLGPDCompliance() {
  toast({
    title: "🔒 Conformidade LGPD",
    description: "Todos os dados são criptografados e armazenados conforme a Lei Geral de Proteção de Dados.",
    duration: 6000,
    className: "bg-purple-50 border-purple-200 text-purple-800"
  })
}

/**
 * Exibe mensagem de progresso durante salvamento
 */
export function showSavingProgress(testName?: string) {
  toast({
    title: "💾 Salvando resultados...",
    description: testName 
      ? `Processando e criptografando os resultados do teste "${testName}".`
      : "Processando e criptografando seus resultados.",
    duration: 3000,
    className: "bg-blue-50 border-blue-200 text-blue-800"
  })
}

/**
 * Exibe mensagem de auditoria (para administradores)
 */
export function showAuditLog(action: string, details?: string) {
  toast({
    title: "📋 Ação registrada",
    description: `${action}${details ? ` - ${details}` : ''} foi registrada no log de auditoria.`,
    duration: 3000,
    className: "bg-gray-50 border-gray-200 text-gray-800"
  })
}

/**
 * Exibe mensagem de sessão expirada
 */
export function showSessionExpired() {
  toast({
    title: "⏰ Sessão expirada",
    description: "Sua sessão expirou. Faça login novamente para continuar.",
    variant: "destructive",
    duration: 8000
  })
}

/**
 * Exibe mensagem de validação de dados
 */
export function showValidationError(field?: string) {
  toast({
    title: "⚠️ Dados inválidos",
    description: field 
      ? `Por favor, verifique o campo: ${field}`
      : "Por favor, verifique os dados informados e tente novamente.",
    variant: "destructive",
    duration: 5000
  })
}