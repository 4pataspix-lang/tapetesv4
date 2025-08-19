/*
  # Fix foreign key constraints for product deletion

  1. Changes
    - Update foreign key constraints to allow CASCADE DELETE
    - Products can be deleted even if they have order items or reviews
    - Categories can be deleted even if they have products

  2. Security
    - Maintains data integrity while allowing proper deletion
*/

-- Drop existing foreign key constraints
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_product_id_fkey;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_id_fkey;

-- Recreate with CASCADE DELETE
ALTER TABLE order_items 
ADD CONSTRAINT order_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE reviews 
ADD CONSTRAINT reviews_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE products 
ADD CONSTRAINT products_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;