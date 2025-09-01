// Configuração dos números reais de questões por teste
// Baseado nos dados do banco de dados e estimativas padrão da indústria

export const TEST_QUESTIONS_COUNT = {
  // Testes Psicossociais
  'burnout-scale': 22, // HumaniQ BSC - Burnout Scale Corporate (padrão MBI)
  'estresse-ocupacional': 85, // HumaniQ EO - Estresse Ocupacional (baseado no mock atual)
  'clima-organizacional': 45, // HumaniQ Insight - Clima Organizacional
  'karasek-siegrist': 48, // HumaniQ Karasek-Siegrist - Teste Psicossocial Avançado
  'riscos-psicossociais': 65, // HumaniQ RPO - Riscos Psicossociais Ocupacionais
  'qualidade-vida': 42, // HumaniQ QVT - Qualidade de Vida no Trabalho
  'assedio-moral': 35, // HumaniQ PAS - Percepção de Assédio Moral e Sexual
  'saude-mental': 38, // HumaniQ SESM - Saúde Mental e Bem-estar
  'seguranca-ocupacional': 28, // HumaniQ RAO - Risco de Acidente e Segurança
  'gestao-riscos': 32, // HumaniQ MGRP - Maturidade em Gestão de Riscos
  'valores-pessoais': 50, // HumaniQ Valores - Mapa de Valores (confirmado no BD)

  // Testes de Perfil Comportamental
  'big-five': 120, // HumaniQ Big Five - Cinco Grandes Fatores (IPIP-120)
  'disc': 28, // HumaniQ DISC - Comportamento e Comunicação
  'inteligencia-emocional': 33, // HumaniQ EIQ - Inteligência Emocional
  'eneagrama': 100, // HumaniQ Eneagrama - Tipos de Personalidade
  'mbti': 30, // HumaniQ TIPOS - Perfil Cognitivo (MBTI)
  'motivacao-profissional': 55, // HumaniQ MOTIVA - Perfil de Motivação (baseado no mock atual)
  // Removido: 'adaptabilidade': 25, // HumaniQ FLEX - Avaliação de Adaptabilidade
  'quociente-inteligencia': 60, // HumaniQ QI - Quociente de Inteligência
  'atencao-raciocinio': 40, // HumaniQ TAR - Teste de Atenção e Raciocínio
  '16-personalidades': 60, // HumaniQ 16P - 16 Tipos de Personalidade
  'big-five-inventory': 120, // HumaniQ BFI - Big Five Inventory (IPIP-120)
  'inteligencia-emocional-bolie': 70, // HumaniQ BOLIE - Inteligência Emocional

  // Testes Corporativos
  'lideranca-gestao': 50, // HumaniQ LID - Liderança e Gestão (baseado no mock atual)
  'trabalho-equipe': 35, // HumaniQ TEQ - Trabalho em Equipe
  'comunicacao-eficaz': 30, // HumaniQ COM - Comunicação Eficaz
  'resolucao-problemas': 45, // HumaniQ PRE - Resolução de Problemas
  'criatividade-inovacao': 25, // HumaniQ CRI - Criatividade e Inovação
  'gestao-estresse': 28, // HumaniQ EST - Gestão de Estresse
  'adaptabilidade-mudanca': 22, // HumaniQ ADT - Adaptabilidade e Mudança
  'motivacao-engajamento': 24, // HumaniQ MOT - Motivação e Engajamento
  'etica-integridade': 20, // HumaniQ ETI - Ética e Integridade
  'lideranca-autentica': 40, // HumaniQ TELA - Teste de Liderança Autêntica
  'estilos-lideranca': 38, // HumaniQ LIDERA - Estilos e Competências de Liderança
  'clima-bem-estar': 48, // HumaniQ Pesquisa de Clima - Clima Organizacional e Bem-Estar

  // Teste Grafológico
  'analise-grafologica': 15, // HumaniQ GRA - Análise Grafológica (baseado em amostras)

  // Chaves adicionais para compatibilidade
  'humaniq-lidera': 38, // HumaniQ LIDERA - Estilos e Competências de Liderança
  'humaniq-tela': 40, // HumaniQ TELA - Teste de Liderança Autêntica
  'humaniq-cobe': 48, // HumaniQ Pesquisa de Clima - Clima Organizacional e Bem-Estar
  'humaniq-qi': 60, // HumaniQ QI - Quociente de Inteligência
  'humaniq-tipos': 30, // HumaniQ TIPOS - Perfil Cognitivo (MBTI)
  'humaniq-bigfive': 120, // HumaniQ Big Five - Cinco Grandes Fatores (IPIP-120)
  'humaniq-eneagrama': 100, // HumaniQ Eneagrama - Tipos de Personalidade
  'humaniq-valores': 50, // HumaniQ Valores - Mapa de Valores
  'humaniq-motiva': 55, // HumaniQ MOTIVA - Perfil de Motivação
  'humaniq-bolie': 70, // HumaniQ BOLIE - Inteligência Emocional
  // Removido: 'humaniq-flex': 25, // HumaniQ FLEX - Avaliação de Adaptabilidade
} as const

// Função helper para obter o número de questões de um teste
export function getTestQuestionsCount(testKey: string): number {
  return TEST_QUESTIONS_COUNT[testKey as keyof typeof TEST_QUESTIONS_COUNT] || 30 // fallback padrão
}

// Mapeamento de IDs de teste para chaves de configuração
export const TEST_ID_TO_KEY_MAP = {
  // Psicossociais
  'burnout-scale-corporate': 'burnout-scale',
  'estresse-ocupacional-burnout': 'estresse-ocupacional',
  'clima-organizacional-bem-estar': 'clima-organizacional',
  'karasek-siegrist-avancado': 'karasek-siegrist',
  'riscos-psicossociais-ocupacionais': 'riscos-psicossociais',
  'qualidade-vida-trabalho': 'qualidade-vida',
  'assedio-moral-sexual': 'assedio-moral',
  'saude-mental-bem-estar': 'saude-mental',
  'risco-acidente-seguranca': 'seguranca-ocupacional',
  'maturidade-gestao-riscos': 'gestao-riscos',
  'valores-pessoais-profissionais': 'valores-pessoais',

  // Perfil Comportamental
  'big-five-fatores': 'big-five',
  'disc-comportamento': 'disc',
  'inteligencia-emocional': 'inteligencia-emocional',
  'eneagrama-personalidade': 'eneagrama',
  'humaniq_eneagrama': 'eneagrama', // HumaniQ Eneagrama - ID específico usado no frontend
  'mbti-cognitivo': 'mbti',
  'motivacao-profissional': 'motivacao-profissional',
  'adaptabilidade-flex': 'adaptabilidade',
  'quociente-inteligencia': 'quociente-inteligencia',
  'atencao-raciocinio': 'atencao-raciocinio',
  '16-tipos-personalidade': '16-personalidades',
  'big-five-inventory': 'big-five-inventory',
  'inteligencia-emocional-bolie': 'inteligencia-emocional-bolie',

  // Corporativos
  'lideranca-gestao': 'lideranca-gestao',
  'trabalho-equipe': 'trabalho-equipe',
  'comunicacao-eficaz': 'comunicacao-eficaz',
  'resolucao-problemas': 'resolucao-problemas',
  'criatividade-inovacao': 'criatividade-inovacao',
  'gestao-estresse': 'gestao-estresse',
  'adaptabilidade-mudanca': 'adaptabilidade-mudanca',
  'motivacao-engajamento': 'motivacao-engajamento',
  'etica-integridade': 'etica-integridade',
  'lideranca-autentica': 'lideranca-autentica',
  'estilos-lideranca': 'estilos-lideranca',
  'clima-bem-estar-corporativo': 'clima-bem-estar',

  // Grafológico
  'analise-grafologica': 'analise-grafologica',
} as const