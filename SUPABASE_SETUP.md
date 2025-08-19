# Guia de Configuração do Supabase

Este guia irá te ajudar a configurar o Supabase para o projeto TechStore.

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Preencha os dados:
   - **Name**: TechStore
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima
6. Clique em "Create new project"

## 2. Obter Credenciais

1. Aguarde o projeto ser criado (pode levar alguns minutos)
2. No painel do projeto, vá para **Settings** > **API**
3. Copie as seguintes informações:
   - **Project URL** (algo como: `https://abc123.supabase.co`)
   - **anon public** key (chave pública)

## 3. Configurar Variáveis de Ambiente

1. No seu projeto, edite o arquivo `.env`
2. Substitua os valores pelas suas credenciais:

```env
VITE_SUPABASE_URL=https://seu-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

## 4. Executar Migrações do Banco

Execute os arquivos SQL na pasta `supabase/migrations/` **em ordem cronológica**:

### Passo 1: Esquema Base
1. No painel do Supabase, vá para **SQL Editor**
2. Clique em "New query"
3. Cole o conteúdo do arquivo `20250812174603_patient_bonus.sql`
4. Clique em "Run" para executar

### Passo 2: Usuário Admin
1. Nova query com o conteúdo de `20250812175900_precious_feather.sql`
2. Execute

### Passo 3: Correções de Segurança
Execute em ordem:
- `20250812180058_crystal_truth.sql`
- `20250812180141_broken_valley.sql`

### Passo 4: Configurações da Loja
Execute em ordem:
- `20250812180926_green_garden.sql`
- `20250812181740_blue_breeze.sql`
- `20250812183655_rapid_shrine.sql`

### Passo 5: Sistema de Avaliações Automáticas
- `20250812182212_dry_cell.sql`

## 5. Configurar Edge Function (Opcional)

Para avaliações automáticas nos produtos:

1. No painel do Supabase, vá para **Edge Functions**
2. Clique em "Create a new function"
3. Nome: `auto-review`
4. Cole o código do arquivo `supabase/functions/auto-review/index.ts`
5. Clique em "Deploy function"

## 6. Criar Usuário Administrador

### Método 1: Automático (Recomendado)
Se você executou todas as migrações, o usuário admin já foi criado automaticamente.

### Método 2: Manual
1. Vá para **Authentication** > **Users**
2. Clique em "Add user"
3. Preencha:
   - **Email**: `admin@loja.com`
   - **Password**: `123456`
   - **Email Confirm**: ✅ (marcado)
4. Clique em "Create user"

## 7. Verificar Configuração

1. Inicie o projeto: `npm run dev`
2. Acesse: `http://localhost:5173`
3. Teste o login admin: `/admin/login`
   - Email: `admin@loja.com`
   - Senha: `123456`

## 8. Configurações de Segurança (Produção)

Para produção, configure:

### Row Level Security (RLS)
- Já está configurado nas migrações
- Verifica permissões automaticamente

### Políticas de Acesso
- Usuários anônimos: podem ver produtos e fazer pedidos
- Usuários admin: acesso total ao painel administrativo

### Variáveis de Ambiente
- Nunca commite o arquivo `.env` com credenciais reais
- Use variáveis de ambiente do seu provedor de hosting

## 9. Troubleshooting

### Erro: "Invalid API key"
- Verifique se copiou a chave correta
- Certifique-se de usar a chave "anon public"

### Erro: "Failed to fetch"
- Verifique a URL do projeto
- Confirme se o projeto está ativo no Supabase

### Erro: "Permission denied"
- Execute todas as migrações em ordem
- Verifique se o usuário admin foi criado

### Produtos não aparecem
- Execute a migração `20250812174603_patient_bonus.sql`
- Verifique se os dados de exemplo foram inseridos

## 10. Próximos Passos

Após a configuração:

1. **Personalize a loja**: Acesse `/admin/settings`
2. **Adicione produtos**: Vá para `/admin/products`
3. **Configure categorias**: Em `/admin/categories`
4. **Teste pedidos**: Faça um pedido teste na loja

## Suporte

Se encontrar problemas:
1. Verifique os logs no console do navegador
2. Confira os logs no painel do Supabase
3. Revise se todas as migrações foram executadas
4. Confirme se as variáveis de ambiente estão corretas