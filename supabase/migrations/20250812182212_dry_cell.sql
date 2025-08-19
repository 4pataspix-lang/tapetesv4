/*
  # Trigger para criar avaliações automáticas

  1. Função
    - Cria função que chama a edge function quando um produto é inserido
  
  2. Trigger
    - Executa após inserção de produto
    - Chama a edge function para criar avaliações
*/

-- Função para chamar a edge function
CREATE OR REPLACE FUNCTION handle_new_product()
RETURNS TRIGGER AS $$
BEGIN
  -- Fazer uma requisição HTTP para a edge function
  PERFORM
    net.http_post(
      url := 'https://mpufdnyzifwaslfcylxo.supabase.co/functions/v1/auto-review',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
      body := json_build_object('record', row_to_json(NEW))::jsonb
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar o trigger
DROP TRIGGER IF EXISTS on_product_created ON products;
CREATE TRIGGER on_product_created
  AFTER INSERT ON products
  FOR EACH ROW EXECUTE FUNCTION handle_new_product();