/*
  # Fix RLS Policy for Orders Table

  1. Problem
    - Current RLS policy is blocking INSERT operations on orders table
    - Error: "new row violates row-level security policy for table 'orders'"

  2. Solution
    - Drop existing restrictive policies
    - Create new policies that allow both anonymous and authenticated users to create orders
    - Ensure order_items table also has proper INSERT permissions

  3. Security
    - Allow anonymous users to create orders (common for e-commerce)
    - Allow authenticated users to create orders
    - Maintain read restrictions for admin users only
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Allow anonymous and authenticated users to create orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Qualquer um pode criar itens de pedido" ON order_items;
DROP POLICY IF EXISTS "Admins podem ver itens dos pedidos" ON order_items;

-- Create new policy for orders INSERT - allow both anonymous and authenticated users
CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy for orders SELECT - only admins can view orders
CREATE POLICY "Admins can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.is_active = true
    )
  );

-- Create policy for order_items INSERT - allow both anonymous and authenticated users
CREATE POLICY "Anyone can create order items"
  ON order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy for order_items SELECT - only admins can view order items
CREATE POLICY "Admins can view order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.is_active = true
    )
  );

-- Ensure RLS is enabled on both tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;