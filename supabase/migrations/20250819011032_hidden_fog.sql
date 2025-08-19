/*
  # Adicionar suporte para galeria de imagens nos produtos

  1. Alterações na tabela products
    - Adicionar coluna gallery_images (array de text)
    - Permitir múltiplas imagens por produto

  2. Atualizar produtos existentes
    - Inicializar gallery_images como array vazio
*/

-- Adicionar coluna para galeria de imagens
ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_images text[] DEFAULT '{}';

-- Atualizar produtos existentes para ter array vazio se for null
UPDATE products SET gallery_images = '{}' WHERE gallery_images IS NULL;