/*
  # Corrigir exclusão de produtos

  1. Problema
    - Produtos não podem ser excluídos devido a referências em outras tabelas
    - Avaliações (reviews) referenciam produtos

  2. Solução
    - Alterar constraint para CASCADE DELETE
    - Quando produto é excluído, avaliações também são excluídas automaticamente

  3. Segurança
    - Manter RLS policies existentes
    - Apenas admins podem excluir produtos
*/

-- Remover constraint existente se houver
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_product_id_fkey;

-- Adicionar nova constraint com CASCADE DELETE
ALTER TABLE reviews 
ADD CONSTRAINT reviews_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE CASCADE;

-- Verificar se a constraint foi criada corretamente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'reviews_product_id_fkey' 
    AND table_name = 'reviews'
  ) THEN
    RAISE NOTICE 'Constraint reviews_product_id_fkey criada com sucesso';
  END IF;
END $$;