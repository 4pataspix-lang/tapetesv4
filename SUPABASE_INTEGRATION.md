# 🚀 Guia de Integração do Supabase - TechStore

## ✅ Status da Integração
O projeto **TechStore** está totalmente preparado para integração com Supabase. Todas as funcionalidades estão implementadas e funcionando:

### 🎯 Funcionalidades Implementadas
- ✅ **Sistema de Autenticação** - Login de administradores
- ✅ **Banco de Dados Completo** - Produtos, categorias, pedidos, avaliações
- ✅ **Painel Administrativo** - Dashboard, CRUD completo
- ✅ **Sistema de Pagamentos** - Integração com Nivus Pay
- ✅ **Configurações Personalizáveis** - Cores, textos, layout
- ✅ **Sistema de Avaliações** - Reviews automáticas via Edge Functions
- ✅ **Carrinho de Compras** - Persistente no localStorage
- ✅ **Checkout Completo** - Com PIX, cartão, boleto

## 🔧 Como Configurar o Supabase

### Passo 1: Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"New Project"**
3. Escolha sua organização
4. Defina:
   - **Nome**: TechStore
   - **Senha do Banco**: Crie uma senha forte
   - **Região**: Escolha a mais próxima
5. Aguarde a criação (2-3 minutos)

### Passo 2: Obter Credenciais
1. No painel do projeto, vá para **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://abc123.supabase.co`)
   - **anon public key** (chave pública)

### Passo 3: Configurar Variáveis de Ambiente
1. Edite o arquivo `.env` na raiz do projeto
2. Substitua pelos seus valores:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui

# Nivus Pay Configuration (para pagamentos)
VITE_NIVUS_PAY_PUBLIC_KEY=143c6730-2b82-41bb-9866-bc627f955b83
NIVUS_PAY_SECRET_KEY=ba4559db-f9e1-49c3-824b-55c0f2f49791
VITE_NIVUS_PAY_API_URL=https://pay.nivuspay.com.br/api/v1
```

### Passo 4: Executar Migrações do Banco
Execute os arquivos SQL na pasta `supabase/migrations/` **EM ORDEM CRONOLÓGICA**:

#### 4.1 - Esquema Base
No **SQL Editor** do Supabase, execute:
1. `20250812174603_patient_bonus.sql` - Cria tabelas principais
2. `20250812175900_precious_feather.sql` - Cria usuário admin
3. `20250812180058_crystal_truth.sql` - Corrige RLS
4. `20250812180141_broken_valley.sql` - Fix políticas

#### 4.2 - Configurações da Loja
5. `20250812180926_green_garden.sql` - Configurações básicas
6. `20250812181740_blue_breeze.sql` - Configurações expandidas
7. `20250812183655_rapid_shrine.sql` - Sistema completo

#### 4.3 - Sistema de Avaliações
8. `20250812182212_dry_cell.sql` - Trigger para avaliações automáticas

#### 4.4 - Correções e Melhorias
9. `20250813205537_tiny_scene.sql` - Fix RLS para pedidos
10. `20250813205657_foggy_union.sql` - Fix políticas de pedidos
11. `20250813210034_light_band.sql` - Função criar pedidos
12. `20250814002333_gentle_rice.sql` - Função criar admin
13. `20250814002342_purple_sea.sql` - Fix exclusão produtos
14. `20250814003402_peaceful_pond.sql` - Corrige função admin
15. `20250814005426_raspy_fountain.sql` - Fix constraints
16. `20250814015716_scarlet_sun.sql` - Configurações completas
17. `20250814030659_azure_leaf.sql` - Função pedidos final
18. `20250814031746_weathered_castle.sql` - RLS final

### Passo 5: Configurar Edge Function (Opcional)
Para avaliações automáticas:

1. No Supabase, vá para **Edge Functions**
2. Clique em **"Create a new function"**
3. Nome: `auto-review`
4. Cole o código do arquivo `supabase/functions/auto-review/index.ts`
5. Clique em **"Deploy function"**

### Passo 6: Verificar Configuração
1. Execute: `npm run dev`
2. Acesse: `http://localhost:5173`
3. Teste o login admin: `/admin/login`
   - **Email**: `admin@loja.com`
   - **Senha**: `123456`

## 🎨 Personalização da Loja

### Configurações Disponíveis
Acesse `/admin/settings` para personalizar:

#### Básico
- Nome da loja
- Descrição e slogan
- Logo e banner
- Cores principais
- Contato e redes sociais

#### Botões
- Cores de fundo e texto
- Estados de hover
- Bordas e espaçamentos

#### Cores Específicas
- Títulos e descrições de produtos
- Preços e ícones
- Fundos e bordas

#### Tipografia
- Tamanhos de fonte
- Pesos de fonte
- Espaçamentos

#### Efeitos Visuais
- Sombras e bordas
- Animações e transições
- Escalas de hover

#### Textos Personalizados
- Botões e mensagens
- Textos do sistema
- Footer e boas-vindas

## 🛒 Funcionalidades da Loja

### Para Clientes
- **Catálogo**: Navegação por categorias com filtros
- **Busca**: Sistema de busca avançada
- **Carrinho**: Persistente no navegador
- **Checkout**: Processo simplificado
- **Pagamento**: PIX, cartão, boleto via Nivus Pay
- **Avaliações**: Sistema de reviews com estrelas

### Para Administradores
- **Dashboard**: Métricas em tempo real
- **Produtos**: CRUD completo com imagens
- **Categorias**: Organização dos produtos
- **Pedidos**: Gerenciamento de status
- **Avaliações**: Controle de reviews
- **Usuários**: Gerenciamento de admins
- **Configurações**: Personalização total

## 🔐 Segurança Implementada

### Row Level Security (RLS)
- ✅ Habilitado em todas as tabelas
- ✅ Políticas específicas por funcionalidade
- ✅ Acesso controlado por perfil

### Políticas de Acesso
- **Anônimos**: Podem ver produtos e fazer pedidos
- **Autenticados**: Acesso básico
- **Admins**: Acesso total ao painel

### Validações
- ✅ Dados de entrada validados
- ✅ Transações seguras
- ✅ Prevenção de SQL injection

## 🚀 Deploy em Produção

### Netlify (Recomendado)
1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel
1. Importe o projeto do GitHub
2. Configure as variáveis de ambiente
3. Deploy automático

### Variáveis de Ambiente para Produção
```env
VITE_SUPABASE_URL=sua_url_de_producao
VITE_SUPABASE_ANON_KEY=sua_chave_de_producao
VITE_NIVUS_PAY_PUBLIC_KEY=sua_chave_nivus_pay
NIVUS_PAY_SECRET_KEY=sua_chave_secreta_nivus_pay
VITE_NIVUS_PAY_API_URL=https://pay.nivuspay.com.br/api/v1
```

## 🆘 Troubleshooting

### Problemas Comuns

#### "Supabase não configurado"
- ✅ Verifique as variáveis de ambiente
- ✅ Confirme se o projeto Supabase está ativo
- ✅ Teste a conexão no console do navegador

#### "Erro ao criar pedido"
- ✅ Execute todas as migrações em ordem
- ✅ Verifique RLS policies no Supabase
- ✅ Confirme se as tabelas existem

#### "Admin não consegue logar"
- ✅ Execute a migração que cria o usuário admin
- ✅ Verifique a tabela `admin_users`
- ✅ Confirme email e senha corretos

#### "Produtos não aparecem"
- ✅ Execute a migração base
- ✅ Verifique se os dados de exemplo foram inseridos
- ✅ Confirme políticas RLS

#### "Pagamento não funciona"
- ✅ Confirme credenciais do Nivus Pay
- ✅ Verifique se a API está respondendo
- ✅ Teste em ambiente de desenvolvimento primeiro

### Logs Importantes
- **Console do navegador** (F12)
- **Logs do Supabase** (Dashboard → Logs)
- **Network tab** para requisições HTTP

## 📊 Dados de Teste

### Usuário Admin
- **Email**: `admin@loja.com`
- **Senha**: `123456`
- **URL**: `/admin/login`

### Produtos de Exemplo
O sistema já vem com produtos de demonstração:
- Smartphone Premium
- Notebook Gamer
- Camiseta Premium
- Tênis Esportivo
- Relógio Inteligente

### Avaliações Automáticas
- Criadas automaticamente quando novos produtos são adicionados
- Entre 2-5 avaliações por produto
- Ratings entre 4-5 estrelas
- Comentários positivos variados

## 🎯 Próximos Passos

Após a integração:

1. **Personalize a loja** em `/admin/settings`
2. **Adicione seus produtos** em `/admin/products`
3. **Configure categorias** em `/admin/categories`
4. **Teste o fluxo completo** de compra
5. **Configure backup** do banco de dados
6. **Monitore métricas** no dashboard

## 📞 Suporte

Para suporte técnico:
1. Verifique os logs de erro no console
2. Consulte a documentação do Supabase
3. Teste em ambiente local primeiro
4. Verifique se todas as migrações foram executadas

---

## ✅ Checklist de Integração

- [ ] Projeto Supabase criado
- [ ] Credenciais copiadas
- [ ] Arquivo `.env` configurado
- [ ] Todas as migrações executadas
- [ ] Edge function configurada (opcional)
- [ ] Usuário admin testado
- [ ] Produtos aparecendo na loja
- [ ] Checkout funcionando
- [ ] Painel admin acessível
- [ ] Configurações personalizadas

**🎉 Parabéns! Sua loja está pronta para receber clientes!**