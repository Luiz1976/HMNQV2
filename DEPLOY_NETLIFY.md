# Deploy no Netlify - Guia Completo

## Pré-requisitos

- Conta no [Netlify](https://netlify.com)
- Repositório Git (GitHub, GitLab ou Bitbucket)
- Node.js 18+ instalado localmente

## Configurações Realizadas

### 1. Arquivos de Configuração Otimizados

✅ **netlify.toml** - Configurado com:
- Plugin oficial do Next.js
- Redirecionamentos para API routes
- Headers de segurança e performance
- Cache otimizado para assets estáticos
- Configurações de build para Node.js 18

✅ **next.config.js** - Otimizado com:
- Output standalone para melhor performance
- Configurações de webpack para Netlify
- Headers de segurança
- Suporte a imagens remotas

✅ **public/_redirects** - Criado para:
- Roteamento correto de API routes
- Redirecionamentos específicos da aplicação
- Fallback para SPA

## Passos para Deploy

### 1. Preparar o Repositório

```bash
# Fazer commit das configurações
git add .
git commit -m "feat: configurações para deploy no Netlify"
git push origin main
```

### 2. Conectar ao Netlify

1. Acesse [netlify.com](https://netlify.com) e faça login
2. Clique em "New site from Git"
3. Escolha seu provedor Git (GitHub/GitLab/Bitbucket)
4. Selecione o repositório da aplicação
5. Configure as opções de build:
   - **Branch to deploy:** `main` (ou sua branch principal)
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`

### 3. Configurar Variáveis de Ambiente

No painel do Netlify, vá em **Site settings > Environment variables** e adicione:

#### Variáveis Obrigatórias:

```env
# API Google Gemini
GEMINI_API_KEY=sua_chave_google_gemini_aqui

# Banco de Dados
DATABASE_URL=sua_string_conexao_banco

# Autenticação NextAuth
NEXTAUTH_SECRET=seu_secret_nextauth_seguro
NEXTAUTH_URL=https://seu-site.netlify.app

# URL da Aplicação
NEXT_PUBLIC_APP_URL=https://seu-site.netlify.app
```

#### Variáveis Opcionais:

```env
# AbacusAI (fallback)
ABACUSAI_API_KEY=sua_chave_abacusai_aqui

# Desabilitar telemetria do Next.js
NEXT_TELEMETRY_DISABLED=1
```

### 4. Configurações Avançadas

#### Build Settings no Netlify:
- **Node version:** 18 (já configurado no netlify.toml)
- **Package manager:** npm
- **Build timeout:** 15 minutos (padrão)

#### Functions (se necessário):
- As API routes do Next.js são automaticamente convertidas em Netlify Functions
- Configuração já incluída no netlify.toml

### 5. Deploy

1. Clique em "Deploy site"
2. Aguarde o build completar (5-10 minutos)
3. Acesse a URL fornecida pelo Netlify

## Verificações Pós-Deploy

### ✅ Checklist de Verificação:

- [ ] Site carrega corretamente
- [ ] Rotas da aplicação funcionam
- [ ] API routes respondem (/api/health)
- [ ] Autenticação funciona
- [ ] Banco de dados conecta
- [ ] Imagens carregam
- [ ] Redirecionamentos funcionam

### 🔧 Troubleshooting Comum:

#### Build Falha:
```bash
# Verificar logs no Netlify
# Comum: dependências faltando
npm install --production=false
```

#### API Routes não funcionam:
- Verificar se o plugin @netlify/plugin-nextjs está ativo
- Confirmar redirecionamentos no netlify.toml

#### Erro de Banco de Dados:
- Verificar DATABASE_URL nas variáveis de ambiente
- Confirmar se o banco permite conexões externas

#### Problemas de Autenticação:
- Verificar NEXTAUTH_URL aponta para domínio correto
- Confirmar NEXTAUTH_SECRET está definido

## Domínio Personalizado (Opcional)

1. No Netlify, vá em **Domain settings**
2. Clique em "Add custom domain"
3. Configure DNS do seu domínio:
   ```
   CNAME www seu-site.netlify.app
   A @ 75.2.60.5
   ```
4. Ative SSL automático

## Monitoramento

### Logs e Analytics:
- **Build logs:** Disponíveis no painel do Netlify
- **Function logs:** Seção Functions > View logs
- **Analytics:** Netlify Analytics (pago)

### Performance:
- **Lighthouse:** Executar regularmente
- **Core Web Vitals:** Monitorar no Google Search Console

## Atualizações Futuras

### Deploy Automático:
- Pushes para branch principal fazem deploy automático
- Preview deploys para pull requests

### Rollback:
```bash
# No painel Netlify > Deploys
# Clique em deploy anterior > "Publish deploy"
```

## Suporte

- **Documentação Netlify:** [docs.netlify.com](https://docs.netlify.com)
- **Next.js no Netlify:** [nextjs.org/docs/deployment/netlify](https://nextjs.org/docs/deployment/netlify)
- **Status Netlify:** [netlifystatus.com](https://netlifystatus.com)

---

**Configuração concluída!** 🚀

Seu projeto está otimizado para deploy no Netlify com todas as melhores práticas implementadas.