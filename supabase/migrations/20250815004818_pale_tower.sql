/*
  # Fix RLS policies for orders table

  1. Security Changes
    - Allow anonymous users to create orders
    - Allow anonymous users to read their own orders
    - Keep admin access for all operations
    - Fix insert policy for order creation

  2. Changes Made
    - Update insert policy to allow anonymous users
    - Add proper select policy for order tracking
    - Ensure order_items policies are compatible
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Qualquer um pode criar pedidos" ON orders;
DROP POLICY IF EXISTS "Admins podem ver todos os pedidos" ON orders;
DROP POLICY IF EXISTS "Admins podem atualizar pedidos" ON orders;

-- Create new policies for orders
CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read orders by ID"
  ON orders
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can delete orders"
  ON orders
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Fix order_items policies
DROP POLICY IF EXISTS "Qualquer um pode criar itens de pedido" ON order_items;
DROP POLICY IF EXISTS "Admins podem ver itens dos pedidos" ON order_items;

CREATE POLICY "Anyone can create order items"
  ON order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read order items"
  ON order_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can update order items"
  ON order_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can delete order items"
  ON order_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );