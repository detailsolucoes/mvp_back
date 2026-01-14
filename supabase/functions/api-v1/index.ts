import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

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

    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    // 1. API PARA RECEBER PEDIDOS DO N8N
    if (path === 'webhook-n8n') {
      const body = await req.json()
      const { company_id, customer_phone, customer_name, items, total_amount, payment_method } = body

      // Busca ou cria cliente
      let { data: customer } = await supabaseClient
        .from('customers')
        .select('id')
        .eq('company_id', company_id)
        .eq('phone', customer_phone)
        .single()

      if (!customer) {
        const { data: newCustomer } = await supabaseClient
          .from('customers')
          .insert({ company_id, name: customer_name, phone: customer_phone })
          .select()
          .single()
        customer = newCustomer
      }

      // Cria o pedido
      const { data: order, error: orderError } = await supabaseClient
        .from('orders')
        .insert({
          company_id,
          customer_id: customer.id,
          total_amount,
          payment_method,
          source: 'n8n',
          status: 'pending'
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Insere itens
      if (items && items.length > 0) {
        const orderItems = items.map((item: any) => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.quantity * item.unit_price
        }))
        await supabaseClient.from('order_items').insert(orderItems)
      }

      return new Response(JSON.stringify({ success: true, order_id: order.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // 2. API PARA SINCRONIZAR CHAT (WHATSAPP/N8N)
    if (path === 'sync-chat') {
      const body = await req.json()
      const { company_id, customer_phone, text, sender } = body

      // Busca cliente
      const { data: customer } = await supabaseClient
        .from('customers')
        .select('id, name')
        .eq('company_id', company_id)
        .eq('phone', customer_phone)
        .single()

      if (!customer) throw new Error('Cliente não encontrado')

      // Busca ou cria conversa
      let { data: conversation } = await supabaseClient
        .from('conversations')
        .select('id')
        .eq('company_id', company_id)
        .eq('customer_id', customer.id)
        .single()

      if (!conversation) {
        const { data: newConv } = await supabaseClient
          .from('conversations')
          .insert({ company_id, customer_id: customer.id, last_message: text })
          .select()
          .single()
        conversation = newConv
      }

      // Insere mensagem
      const { error: msgError } = await supabaseClient
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender: sender, // 'customer' ou 'business'
          text: text,
          status: 'delivered'
        })

      if (msgError) throw msgError

      // Atualiza última mensagem na conversa
      await supabaseClient
        .from('conversations')
        .update({ 
          last_message: text, 
          last_message_time: new Date().toISOString(),
          unread_count: sender === 'customer' ? undefined : 0 // Lógica de unread pode ser expandida
        })
        .eq('id', conversation.id)

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
