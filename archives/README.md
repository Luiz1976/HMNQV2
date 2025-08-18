# Sistema de Arquivamento de Resultados de Testes

Este diretório contém o sistema de arquivamento de resultados de testes do HumaniQ.

## Estrutura de Diretórios

```
archives/
├── README.md                    # Este arquivo
├── index/                       # Índices de busca e organização
│   ├── by-date.json            # Índice por data
│   ├── by-user.json            # Índice por usuário
│   └── by-test-type.json       # Índice por tipo de teste
├── results/                     # Resultados arquivados
│   ├── 2025/                   # Organizado por ano
│   │   ├── 01/                 # Organizado por mês
│   │   │   ├── personalidade/  # Testes de personalidade
│   │   │   ├── psicossociais/  # Testes psicossociais
│   │   │   └── outros/         # Outros tipos de teste
│   │   └── ...
│   └── ...
├── config/                      # Configurações do sistema
│   └── archive-config.json     # Configurações de arquivamento
└── utils/                       # Utilitários e scripts
    ├── archiver.ts             # Funções de arquivamento
    ├── retriever.ts           # Funções de recuperação
    └── indexer.ts             # Funções de indexação
```

## Localização dos Arquivos

Os resultados dos testes são armazenados em:
**`c:\Users\ALICEBELLA\Desktop\HMNQV2\app\archives\results\`**

Organizados por:
- **Ano** (YYYY)
- **Mês** (MM)
- **Tipo de teste** (personalidade, psicossociais, outros)
- **Arquivo individual** por resultado

## Como Funciona

1. **Arquivamento**: Resultados são automaticamente arquivados após conclusão
2. **Indexação**: Sistema mantém índices para busca rápida
3. **Recuperação**: Interface permite consulta e recuperação de resultados
4. **Organização**: Estrutura hierárquica facilita navegação e manutenção