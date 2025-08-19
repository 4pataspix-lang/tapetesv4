/*
  # Adicionar campos de status de pagamento na tabela orders

  1. Alterações na tabela orders
    - Adicionar coluna payment_status
    - Adicionar colunas para informações do cliente (CPF, telefone)

  2. Índices
    - Criar índice para payment_status para consultas rápidas
*/

-- Adicionar colunas de pagamento e cliente
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_cpf text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cost numeric(10,2) DEFAULT 0;

-- Criar índice para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);

-- Atualizar pedidos existentes
UPDATE orders SET payment_status = 'pending' WHERE payment_status IS NULL;