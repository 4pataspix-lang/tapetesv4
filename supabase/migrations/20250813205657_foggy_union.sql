/*
  # Fix RLS policy for orders table to allow unauthenticated order creation

  1. Problem
    - Current RLS policy is blocking INSERT operations for unauthenticated users
    - E-commerce checkout requires ability to create orders without login

  2. Solution
    - Drop existing restrictive INSERT policy
    - Create new policy that allows anyone to insert orders
    - Maintain security for SELECT operations (admin only)

  3. Security
    - Anyone can create orders (standard e-commerce behavior)
    - Only admins can view orders
    - RLS remains enabled for data protection
*/

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;

-- Create new policy that allows anyone to insert orders
CREATE POLICY "Allow order creation for everyone"
ON orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Ensure the SELECT policy for admins is correct
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;

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

-- Also fix order_items table to allow insertion
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;

CREATE POLICY "Allow order items creation for everyone"
ON order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Ensure the SELECT policy for order_items is correct
DROP POLICY IF EXISTS "Admins can view order items" ON order_items;

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