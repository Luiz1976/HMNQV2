// Sistema de cores e configurações por categoria de teste

export interface CategoryConfig {
  name: string
  color: string
  bgColor: string
  textColor: string
  borderColor: string
  icon: string
}

// Paleta de cores por categoria conforme especificado
export const CATEGORY_COLORS: Record<string, CategoryConfig> = {
  // Testes Psicossociais
  'Testes Psicossociais': {
    name: 'Testes Psicossociais',
    color: '#3B82F6', // Azul
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    icon: 'fa-brain'
  },
  
  // Testes de Perfil
  'Testes de Perfil': {
    name: 'Testes de Perfil',
    color: '#4A90E2', // Azul específico para Testes de Perfil
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    icon: 'fa-user'
  },
  
  // Testes Corporativos
  'Testes Corporativos': {
    name: 'Testes Corporativos',
    color: '#0099FF', // Azul
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    icon: 'fa-building'
  },
  
  // Teste Grafológico
  'Teste Grafológico': {
    name: 'Teste Grafológico',
    color: '#F59E0B', // Amarelo/Dourado
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
    icon: 'fa-pen'
  },
  
  // Fallback para categorias não mapeadas
  'default': {
    name: 'Outros',
    color: '#6B7280', // Cinza
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200',
    icon: 'fa-clipboard'
  }
}

// Função para obter configuração da categoria
export function getCategoryConfig(categoryName: string): CategoryConfig {
  return CATEGORY_COLORS[categoryName] || CATEGORY_COLORS['default']
}

// Função para obter cor do botão baseada no status e categoria
export function getButtonColor(status: string, categoryName: string): string {
  const config = getCategoryConfig(categoryName)
  
  switch (status) {
    case 'available':
      return `bg-[${config.color}] hover:bg-[${config.color}]/90`
    case 'in_progress':
      return `bg-yellow-600 hover:bg-yellow-700`
    case 'completed':
      return `bg-green-600 hover:bg-green-700`
    case 'locked':
      return `bg-gray-400`
    default:
      return `bg-[${config.color}] hover:bg-[${config.color}]/90`
  }
}

// Função para obter ícone da categoria
export function getCategoryIcon(categoryName: string): string {
  const config = getCategoryConfig(categoryName)
  return config.icon
}