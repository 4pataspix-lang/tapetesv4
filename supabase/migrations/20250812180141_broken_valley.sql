/*
  # Fix infinite recursion in admin_users policies

  1. Problem
    - Current RLS policies on admin_users table are causing infinite recursion
    - This affects all queries, even unrelated ones like categories
    
  2. Solution
    - Drop all existing policies on admin_users table
    - Create simple, non-recursive policies
    - Use direct user ID checks instead of subqueries that reference admin_users
    
  3. Security
    - Users can only see their own admin status
    - No complex recursive checks that cause infinite loops
*/

-- Drop all existing policies on admin_users table
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;
DROP POLICY IF EXISTS "Users can check own admin status" ON admin_users;
DROP POLICY IF EXISTS "Admins podem gerenciar usuários admin" ON admin_users;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view own admin record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage admin users"
  ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);