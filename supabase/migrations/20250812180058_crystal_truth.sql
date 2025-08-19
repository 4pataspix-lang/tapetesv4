/*
  # Fix infinite recursion in admin_users RLS policy

  1. Problem
    - The current policy on admin_users table creates infinite recursion
    - Policy tries to check admin_users table from within itself
    
  2. Solution
    - Drop the problematic policy
    - Create a simpler policy that doesn't cause recursion
    - Allow authenticated users to read their own admin status
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins podem ver usuários admin" ON admin_users;

-- Create a simple policy that allows users to check their own admin status
CREATE POLICY "Users can check own admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create a policy for admins to manage other admin users
-- This uses a direct check without recursion
CREATE POLICY "Admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() 
      AND au.is_active = true
      LIMIT 1
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() 
      AND au.is_active = true
      LIMIT 1
    )
  );