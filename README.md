# TechStore - Loja Online Completa

Uma loja online moderna e completa construída com React, TypeScript, Tailwind CSS e Supabase.

## 🚀 Funcionalidades

### Frontend da Loja
- ✅ Catálogo de produtos com filtros avançados
- ✅ Sistema de carrinho de compras
- ✅ Processo de checkout completo
- ✅ Sistema de avaliações de produtos
- ✅ Design responsivo e moderno
- ✅ Configurações personalizáveis da loja

### Painel Administrativo
- ✅ Dashboard com métricas e gráficos
- ✅ Gerenciamento de produtos e categorias
- ✅ Controle de pedidos e status
- ✅ Sistema de avaliações
- ✅ Gerenciamento de usuários admin
- ✅ Configurações completas da loja

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Roteamento**: React Router DOM
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Build**: Vite

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd techstore
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o Supabase:
   - Crie um projeto no [Supabase](https://supabase.com)
   - Copie o arquivo `.env.example` para `.env`
   - Adicione suas credenciais do Supabase no arquivo `.env`

4. Execute as migrações do banco de dados:
   - No painel do Supabase, vá para SQL Editor
   - Execute os arquivos de migração na pasta `supabase/migrations/` em ordem cronológica

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🗄️ Configuração do Supabase

### ⚡ Integração Rápida
O projeto está **100% pronto** para Supabase! Siga os passos:

1. **Crie um projeto** no [Supabase](https://supabase.com)
2. **Configure o `.env`** com suas credenciais
3. **Execute as migrações** SQL em ordem
4. **Acesse `/admin/login`** com `admin@loja.com` / `123456`

📖 **Guia completo**: Veja `SUPABASE_INTEGRATION.md`

### 1. Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Escolha sua organização
4. Defina nome e senha do banco
5. Selecione a região mais próxima

### 2. Obter Credenciais
1. No painel do projeto, vá para Settings > API
2. Copie a "Project URL" e "anon public" key
3. Adicione no arquivo `.env`:
```env
VITE_SUPABASE_URL=sua_project_url
VITE_SUPABASE_ANON_KEY=sua_anon_key
```

### 3. Executar Migrações
Execute os arquivos SQL na pasta `supabase/migrations/` em ordem:

1. `20250812174603_patient_bonus.sql` - Esquema base
2. `20250812175900_precious_feather.sql` - Usuário admin
3. `20250812180058_crystal_truth.sql` - Fix RLS
4. `20250812180141_broken_valley.sql` - Fix políticas
5. `20250812180926_green_garden.sql` - Configurações básicas
6. `20250812181740_blue_breeze.sql` - Configurações expandidas
7. `20250812182212_dry_cell.sql` - Trigger avaliações
8. `20250812183655_rapid_shrine.sql` - Sistema completo

### 4. Configurar Edge Function
1. No painel do Supabase, vá para Edge Functions
2. Crie uma nova função chamada `auto-review`
3. Cole o código do arquivo `supabase/functions/auto-review/index.ts`
4. Deploy a função

### 5. Criar Usuário Admin
1. Vá para Authentication > Users
2. Crie um usuário com email: `admin@loja.com`
3. Defina a senha: `123456`
4. O usuário será automaticamente adicionado como admin

## 🔐 Acesso Administrativo

- **URL**: `/admin/login`
- **Email**: `admin@loja.com`
- **Senha**: `123456`

## 📱 Funcionalidades Principais

### Para Clientes
- Navegação por categorias
- Busca avançada de produtos
- Carrinho de compras persistente
- Processo de checkout simplificado
- Sistema de avaliações

### Para Administradores
- Dashboard com métricas em tempo real
- CRUD completo de produtos e categorias
- Gerenciamento de pedidos
- Controle de avaliações
- Configurações personalizáveis da loja
- Gerenciamento de usuários admin

## 🎨 Personalização

O sistema permite personalização completa através do painel administrativo:

- **Visual**: Cores, fontes, logos, banners
- **Conteúdo**: Textos, descrições, slogans
- **Funcionalidades**: Ativar/desativar recursos
- **Pagamento**: Configurar métodos aceitos
- **Entrega**: Definir custos e prazos
- **SEO**: Meta tags e analytics

## 🚀 Deploy

### Netlify (Recomendado)
1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. Deploy automático

### Vercel
1. Importe o projeto
2. Configure as variáveis de ambiente
3. Deploy

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## 📞 Suporte

Para suporte, entre em contato através do email: suporte@techstore.com