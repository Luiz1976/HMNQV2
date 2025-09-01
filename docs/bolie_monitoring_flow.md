# Fluxo Completo do Teste HumaniQ BOLIE (Visão de Monitoramento)

> Este documento descreve todas as etapas percorridas pelo teste HumaniQ BOLIE — da abertura até a exibição dos resultados — destacando **pontos-chave de instrumentação** para o sistema de monitoramento.

---

## 1. Abertura do teste (Frontend)
- Página: `app/colaborador/personalidade/bolie/introducao/page.tsx`
- Ação do usuário: clicar em **“Iniciar Teste”**.
- **Ponto de monitoramento**
  - Evento `bolie:start` com `{ userId, testId, timestamp }`.
  - Origem sugerida: Hook no botão ou Middleware de rota.

## 2. Criação da sessão do teste
- API (suposta): `POST /api/colaborador/tests/start`
- Banco: tabela `TestSession` (ou equivalente).
- **Ponto de monitoramento**
  - Evento `bolie:session_created` com `{ sessionId, userId, testId }`.
  - Em caso de falha → `bolie:error` + stack trace.

## 3. Progresso e respostas
- Frontend envia respostas parciais (ex.: `PATCH /api/colaborador/tests/{sessionId}`).
- **Pontos de monitoramento**
  - Evento `bolie:answer_recorded` a cada questão.
  - Campo adicional `questionId, answerValue`.

## 4. Conclusão do teste
- API: `POST /api/colaborador/tests/{sessionId}/complete`.
- Processamento dos resultados → cálculo de `overallScore` e `dimensionScores`.
- Persistência: tabela `TestResult` (Prisma).
- **Pontos de monitoramento**
  - Evento `bolie:completed` com `{ resultId, duration }`.
  - Erros durante o cálculo → `bolie:error_processing`.

## 5. Armazenamento dos resultados
- Local: SQLite `prisma/dev.db` → tabela `TestResult`.
- **Ponto de monitoramento**
  - Evento `bolie:stored` confirmando `resultId` gravado.

## 6. Consulta via API
- Endpoint principal: `GET /api/colaborador/resultados`
- Filtros: `page`, `limit`, `includeAI` etc.
- **Ponto de monitoramento**
  - Evento `bolie:results_fetched` com `{ userId, totalCount }`.

## 7. Renderização na página de resultados
- Página: `app/colaborador/resultados` (não exibida nos trechos, mas existente).
- **Ponto de monitoramento**
  - Evento `bolie:render` com `{ userId, visibleResults }`.

---

## Erros & Exceções
Todos os eventos de erro seguem o formato:
```json
{
  "event":"bolie:error",
  "stage":"<etapa>",
  "message":"<mensagem>",
  "stack":"<stacktrace>"
}
```

---

## Resumo dos Pontos de Instrumentação
| Etapa | Evento | Local de Implementação |
|-------|--------|------------------------|
| Abertura do teste | `bolie:start` | Componente React (botão “Iniciar”) |
| Criação de sessão | `bolie:session_created` | API `tests/start` |
| Registro de resposta | `bolie:answer_recorded` | API parcial de respostas |
| Conclusão | `bolie:completed` | API `tests/complete` |
| Persistência | `bolie:stored` | Após `prisma.testResult.create()` |
| Fetch de resultados | `bolie:results_fetched` | API `colaborador/resultados` |
| Renderização | `bolie:render` | Página de resultados |
| Qualquer falha | `bolie:error*` | Try/catch global |

---

## Próximos Passos
1. **Instrumentar** código conforme tabela acima (task 2 do TODO).
2. **Capturar erros** com contexto rico (task 3).
3. **Registrar local de armazenamento** no evento `bolie:stored` (task 4).
4. **Expor dashboard/endpoint** para consulta (task 5).

---

*Gerado automaticamente para a Sprint Bolie-Monitor.*