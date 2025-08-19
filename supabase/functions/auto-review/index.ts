import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { record } = await req.json()
    
    // Nomes aleatórios para as avaliações
    const customerNames = [
      'Ana Silva', 'João Santos', 'Maria Oliveira', 'Pedro Costa', 'Carla Souza',
      'Lucas Ferreira', 'Juliana Lima', 'Rafael Alves', 'Fernanda Rocha', 'Bruno Martins',
      'Camila Pereira', 'Diego Ribeiro', 'Larissa Cardoso', 'Thiago Nascimento', 'Gabriela Dias'
    ]

    // Comentários positivos aleatórios
    const positiveComments = [
      'Produto excelente! Superou minhas expectativas.',
      'Muito bom, recomendo!',
      'Qualidade incrível, chegou rapidinho.',
      'Adorei a compra, produto de ótima qualidade.',
      'Perfeito! Exatamente como esperava.',
      'Produto maravilhoso, vale muito a pena.',
      'Estou muito satisfeito com a compra.',
      'Qualidade excepcional, recomendo a todos.',
      'Produto incrível, chegou bem embalado.',
      'Muito bom custo-benefício!',
      'Produto de alta qualidade, adorei!',
      'Superou todas as expectativas.',
      'Excelente produto, comprarei novamente.',
      'Muito satisfeito com a qualidade.',
      'Produto fantástico, recomendo!'
    ]

    // Gerar entre 2 a 5 avaliações aleatórias
    const numReviews = Math.floor(Math.random() * 4) + 2 // 2 a 5 avaliações
    
    const reviews = []
    for (let i = 0; i < numReviews; i++) {
      const rating = Math.random() < 0.7 ? 5 : 4 // 70% chance de 5 estrelas, 30% de 4 estrelas
      const customerName = customerNames[Math.floor(Math.random() * customerNames.length)]
      const comment = Math.random() < 0.8 ? positiveComments[Math.floor(Math.random() * positiveComments.length)] : null
      
      reviews.push({
        product_id: record.id,
        customer_name: customerName,
        rating: rating,
        comment: comment,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Últimos 30 dias
      })
    }

    // Inserir as avaliações
    const { error } = await supabaseClient
      .from('reviews')
      .insert(reviews)

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, reviews_created: numReviews }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})