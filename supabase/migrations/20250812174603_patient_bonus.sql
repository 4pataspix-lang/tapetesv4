/*
  # Esquema completo da loja

  1. Novas Tabelas
    - `categories` - Categorias de produtos
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, optional)
      - `created_at` (timestamp)
    
    - `products` - Produtos da loja
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `stock_quantity` (integer)
      - `category_id` (uuid, foreign key)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `orders` - Pedidos dos clientes
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_address` (text)
      - `total_amount` (decimal)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
    
    - `order_items` - Itens dos pedidos
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price` (decimal)
    
    - `reviews` - Avaliações dos produtos
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `customer_name` (text)
      - `rating` (integer, 1-5)
      - `comment` (text)
      - `created_at` (timestamp)
    
    - `admin_users` - Usuários administradores
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)

  2. Segurança
    - Enable RLS em todas as tabelas
    - Políticas para acesso de administradores autenticados
*/

-- Criar tabelas
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  stock_quantity integer DEFAULT 0,
  category_id uuid REFERENCES categories(id),
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_address text NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública (frontend da loja)
CREATE POLICY "Qualquer um pode ver categorias"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Qualquer um pode ver produtos"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Qualquer um pode ver avaliações"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (true);

-- Políticas para administradores
CREATE POLICY "Admins podem gerenciar categorias"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins podem gerenciar produtos"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins podem ver todos os pedidos"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins podem ver itens dos pedidos"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins podem gerenciar avaliações"
  ON reviews FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins podem ver usuários admin"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Políticas para criação de pedidos (qualquer um pode criar)
CREATE POLICY "Qualquer um pode criar pedidos"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Qualquer um pode criar itens de pedido"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Inserir dados de teste
INSERT INTO categories (name, description) VALUES 
('Tecnologia', 'Produtos eletrônicos e gadgets'),
('Roupas', 'Vestuário e acessórios de moda'),
('Acessórios', 'Acessórios diversos e utilidades');

INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES 
(
  'Smartphone Premium', 
  'Smartphone de última geração com câmera de alta resolução e processador avançado.', 
  1299.90, 
  50, 
  (SELECT id FROM categories WHERE name = 'Tecnologia' LIMIT 1),
  'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Notebook Gamer', 
  'Notebook para jogos com placa de vídeo dedicada e alta performance.', 
  2899.90, 
  25, 
  (SELECT id FROM categories WHERE name = 'Tecnologia' LIMIT 1),
  'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Camiseta Premium', 
  'Camiseta de algodão premium com design exclusivo e alta qualidade.', 
  89.90, 
  100, 
  (SELECT id FROM categories WHERE name = 'Roupas' LIMIT 1),
  'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Tênis Esportivo', 
  'Tênis confortável para corrida e atividades físicas com tecnologia de amortecimento.', 
  299.90, 
  75, 
  (SELECT id FROM categories WHERE name = 'Roupas' LIMIT 1),
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'Relógio Inteligente', 
  'Smartwatch com monitoramento de saúde e conectividade avançada.', 
  599.90, 
  40, 
  (SELECT id FROM categories WHERE name = 'Acessórios' LIMIT 1),
  'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800'
);

-- Inserir avaliações de teste
INSERT INTO reviews (product_id, customer_name, rating, comment) VALUES 
(
  (SELECT id FROM products WHERE name = 'Smartphone Premium' LIMIT 1),
  'João Silva',
  5,
  'Excelente produto! Superou minhas expectativas, bateria dura o dia todo.'
),
(
  (SELECT id FROM products WHERE name = 'Smartphone Premium' LIMIT 1),
  'Maria Santos',
  4,
  'Muito bom, câmera incrível. Apenas o preço um pouco alto.'
),
(
  (SELECT id FROM products WHERE name = 'Notebook Gamer' LIMIT 1),
  'Carlos Oliveira',
  5,
  'Perfeito para jogos! Roda tudo no máximo sem travamentos.'
),
(
  (SELECT id FROM products WHERE name = 'Camiseta Premium' LIMIT 1),
  'Ana Costa',
  4,
  'Tecido de ótima qualidade, muito confortável.'
);