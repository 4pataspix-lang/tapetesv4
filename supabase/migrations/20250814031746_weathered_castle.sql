/*
  # Fix RLS policy for orders table

  1. Security Changes
    - Allow anonymous users to create orders
    - Allow anonymous users to create order items
    - Create RPC function to bypass RLS if needed

  2. Functions
    - create_order_with_items: Function to create order and items in one transaction
*/

-- Allow anonymous users to insert orders
DROP POLICY IF EXISTS "Permitir criar pedidos sem login" ON orders;
CREATE POLICY "Permitir criar pedidos sem login"
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anonymous users to insert order items
DROP POLICY IF EXISTS "Permitir criar itens sem login" ON order_items;
CREATE POLICY "Permitir criar itens sem login"
  ON order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create RPC function to create order with items
CREATE OR REPLACE FUNCTION create_order_with_items(
  p_customer_name text,
  p_customer_email text,
  p_customer_address text,
  p_total_amount numeric,
  p_items jsonb
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id uuid;
  v_item jsonb;
  v_result json;
BEGIN
  -- Insert order
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
  )
  RETURNING id INTO v_order_id;

  -- Insert order items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO order_items (
      order_id,
      product_id,
      quantity,
      price
    ) VALUES (
      v_order_id,
      (v_item->>'product_id')::uuid,
      (v_item->>'quantity')::integer,
      (v_item->>'price')::numeric
    );
  END LOOP;

  -- Return order data
  SELECT json_build_object(
    'id', id,
    'customer_name', customer_name,
    'customer_email', customer_email,
    'customer_address', customer_address,
    'total_amount', total_amount,
    'status', status,
    'created_at', created_at
  ) INTO v_result
  FROM orders
  WHERE id = v_order_id;

  RETURN v_result;
END;
$$;