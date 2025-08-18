# Instalação e Configuração do Sistema de Arquivamento

## Visão Geral

O Sistema de Arquivamento de Resultados de Testes foi implementado com sucesso no projeto HumaniQ. Este sistema permite:

- ✅ Arquivamento automático de resultados de testes
- ✅ Indexação inteligente por data, usuário e tipo de teste
- ✅ Busca avançada com múltiplos filtros
- ✅ Exportação em CSV e JSON
- ✅ Interface administrativa completa
- ✅ APIs RESTful para integração

## Localização dos Arquivos

### 📁 Caminho Principal de Armazenamento
```
c:\Users\ALICEBELLA\Desktop\HMNQV2\app\archives\results\
```

### 📂 Estrutura de Diretórios
```
archives/
├── README.md                    # Documentação principal
├── INSTALLATION.md             # Este arquivo
├── config/
│   └── archive-config.json     # Configurações do sistema
├── index/
│   ├── by-date.json           # Índice por data
│   ├── by-user.json           # Índice por usuário
│   └── by-test-type.json      # Índice por tipo de teste
├── results/                    # 🎯 RESULTADOS ARQUIVADOS AQUI
│   └── 2025/
│       └── 01/
│           ├── personalidade/ # Testes de personalidade
│           ├── psicossociais/ # Testes psicossociais
│           └── outros/        # Outros tipos de teste
├── utils/
│   ├── archiver.ts           # Funções de arquivamento
│   ├── retriever.ts          # Funções de recuperação
│   └── indexer.ts            # Funções de indexação
└── examples/
    └── usage-example.ts       # Exemplos de uso
```

## Como Usar o Sistema

### 1. Arquivar um Resultado de Teste

#### Via Código TypeScript:
```typescript
import TestResultArchiver from '@/archives/utils/archiver'

const archiver = new TestResultArchiver()

const resultado = {
  id: 'test_12345',
  userId: 'user_67890',
  testType: 'personalidade', // 'personalidade' | 'psicossociais' | 'outros'
  testId: 'big-five',
  completedAt: new Date().toISOString(),
  score: 85,
  status: 'completed' // 'completed' | 'incomplete'
}

const caminhoArquivo = await archiver.archiveTestResult(resultado)
console.log(`Arquivado em: ${caminhoArquivo}`)
```

#### Via API REST:
```bash
curl -X POST http://localhost:3000/api/archives/archive \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_12345",
    "userId": "user_67890",
    "testType": "personalidade",
    "testId": "big-five",
    "completedAt": "2025-01-13T10:30:00.000Z",
    "score": 85,
    "status": "completed"
  }'
```

### 2. Buscar Resultados Arquivados

#### Via Código TypeScript:
```typescript
import TestResultRetriever from '@/archives/utils/retriever'

const retriever = new TestResultRetriever()

// Buscar por usuário
const resultadosUsuario = await retriever.searchResults({
  userId: 'user_67890'
})

// Buscar por tipo e data
const testesRecentes = await retriever.searchResults({
  testType: 'personalidade',
  dateFrom: '2025-01-01',
  dateTo: '2025-01-31'
})
```

#### Via API REST:
```bash
# Buscar por usuário
curl "http://localhost:3000/api/archives/search?userId=user_67890"

# Buscar por tipo e data
curl "http://localhost:3000/api/archives/search?testType=personalidade&dateFrom=2025-01-01"
```

### 3. Acessar Interface Administrativa

Acesse a interface web em:
```
http://localhost:3000/admin/archives
```

A interface permite:
- 📊 Visualizar estatísticas do sistema
- 🔍 Buscar resultados com filtros avançados
- 📥 Exportar dados em CSV/JSON
- 🔧 Reconstruir índices do sistema

## APIs Disponíveis

### Endpoints Implementados:

| Método | Endpoint | Descrição |
|--------|----------|----------|
| `GET` | `/api/archives/stats` | Estatísticas do arquivo |
| `GET` | `/api/archives/results-stats` | Estatísticas dos resultados |
| `GET` | `/api/archives/search` | Buscar resultados |
| `GET` | `/api/archives/export` | Exportar dados |
| `POST` | `/api/archives/archive` | Arquivar resultado |
| `PUT` | `/api/archives/archive` | Arquivar múltiplos resultados |
| `POST` | `/api/archives/rebuild-indexes` | Reconstruir índices |

## Configuração

### Arquivo de Configuração
Localizado em: `archives/config/archive-config.json`

```json
{
  "version": "1.0.0",
  "archiveSettings": {
    "autoArchive": true,
    "retentionPeriod": "unlimited",
    "compressionEnabled": false,
    "indexingEnabled": true
  },
  "testTypes": {
    "personalidade": {
      "name": "Testes de Personalidade",
      "folder": "personalidade"
    },
    "psicossociais": {
      "name": "Testes Psicossociais",
      "folder": "psicossociais"
    },
    "outros": {
      "name": "Outros Testes",
      "folder": "outros"
    }
  }
}
```

## Manutenção

### Reconstruir Índices
Se os índices ficarem desatualizados:

```typescript
import TestResultIndexer from '@/archives/utils/indexer'

const indexer = new TestResultIndexer()
await indexer.rebuildAllIndexes()
```

Ou via API:
```bash
curl -X POST http://localhost:3000/api/archives/rebuild-indexes
```

### Limpeza de Arquivos Antigos
```typescript
import TestResultArchiver from '@/archives/utils/archiver'

const archiver = new TestResultArchiver()

// Simular limpeza (não remove arquivos)
const arquivosAntigos = await archiver.cleanupOldFiles({
  olderThanDays: 365,
  dryRun: true
})

console.log(`${arquivosAntigos.length} arquivos seriam removidos`)
```

## Integração com Testes Existentes

Para integrar o sistema com os testes existentes do HumaniQ:

1. **Após conclusão de um teste**, chame:
```typescript
import TestResultArchiver from '@/archives/utils/archiver'

// No final do processamento do teste
const archiver = new TestResultArchiver()
await archiver.archiveTestResult({
  id: testResult.id,
  userId: user.id,
  testType: 'personalidade', // ou 'psicossociais'
  testId: 'nome-do-teste',
  completedAt: new Date().toISOString(),
  score: testResult.score,
  status: 'completed'
})
```

2. **Para consultar histórico de um usuário**:
```typescript
import TestResultRetriever from '@/archives/utils/retriever'

const retriever = new TestResultRetriever()
const historico = await retriever.searchResults({
  userId: user.id,
  limit: 10
})
```

## Monitoramento

### Verificar Status do Sistema
```bash
# Verificar estatísticas
curl http://localhost:3000/api/archives/stats

# Verificar se há resultados
curl "http://localhost:3000/api/archives/search?limit=1"
```

### Logs
O sistema registra logs importantes no console. Monitore:
- Erros de arquivamento
- Problemas de indexação
- Falhas na busca

## Backup

Para fazer backup do sistema:

1. **Copiar diretório completo**:
```bash
cp -r archives/ backup/archives_$(date +%Y%m%d)/
```

2. **Backup apenas dos resultados**:
```bash
cp -r archives/results/ backup/results_$(date +%Y%m%d)/
```

3. **Backup dos índices**:
```bash
cp -r archives/index/ backup/index_$(date +%Y%m%d)/
```

## Solução de Problemas

### Problema: Índices desatualizados
**Solução**: Reconstruir índices via API ou código

### Problema: Arquivos não encontrados
**Solução**: Verificar permissões de diretório e reconstruir índices

### Problema: Erro na busca
**Solução**: Verificar formato dos critérios de busca e logs do servidor

### Problema: Interface não carrega
**Solução**: Verificar se as APIs estão funcionando e se o servidor está rodando

## Suporte

Para suporte técnico:
1. Verificar logs do sistema
2. Testar APIs individualmente
3. Verificar estrutura de diretórios
4. Reconstruir índices se necessário

---

**Sistema implementado com sucesso!** 🎉

**Caminho de armazenamento**: `c:\Users\ALICEBELLA\Desktop\HMNQV2\app\archives\results\`