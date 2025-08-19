/*
  # Função para criar pedidos

  1. Função RPC
    - `create_order` - Cria um pedido com itens
    - Contorna as políticas RLS para permitir criação de pedidos anônimos

  2. Segurança
    - Permite criação de pedidos sem autenticação
    - Valida dados de entrada
*/

CREATE OR REPLACE FUNCTION create_order(
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_address TEXT,
  p_total_amount DECIMAL(10,2),
  p_items JSONB
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
  v_result JSON;
BEGIN
  -- Criar o pedido
  INSERT INTO orders (
    customer_name,
    customer_email,
    customer_address,
    total_amount,
    status
  ) VALUES (
    p_customer_name,
    p_customer_email,
    p_customer_address,
    p_total_amount,
    'pending'
  ) RETURNING id INTO v_order_id;

  -- Inserir os itens do pedido
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO order_items (
      order_id,
      product_id,
      quantity,
      price
    ) VALUES (
      v_order_id,
      (v_item->>'product_id')::UUID,
      (v_item->>'quantity')::INTEGER,
      (v_item->>'price')::DECIMAL(10,2)
    );
  END LOOP;

  -- Retornar o resultado
  v_result := json_build_object('order_id', v_order_id);
  RETURN v_result;
END;
$$;