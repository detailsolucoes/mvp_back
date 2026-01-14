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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    const url = new URL(req.url)
    const path = url.pathname.replace('/crm-api', '')

    // 1. GET /me
    if (path === '/me' && req.method === 'GET') {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('*, companies(*)')
        .eq('id', user?.id)
        .single()
      return new Response(JSON.stringify(profile), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 2. GET /orders
    if (path === '/orders' && req.method === 'GET') {
      const { data: orders } = await supabaseClient
        .from('orders')
        .select('*, order_items(*), customers(*)')
        .order('created_at', { ascending: false })
      return new Response(JSON.stringify(orders), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 3. PATCH /orders/:id/status
    const statusMatch = path.match(/\/orders\/(.+)\/status/)
    if (statusMatch && req.method === 'PATCH') {
      const id = statusMatch[1]
      const { status } = await req.json()
      const { data, error } = await supabaseClient
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
      if (error) throw error
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 4. GET /products (Public Menu)
    if (path === '/products' && req.method === 'GET') {
      const companyId = url.searchParams.get('company_id')
      const { data: products } = await supabaseClient
        .from('products')
        .select('*, categories(*)')
        .eq('company_id', companyId)
        .eq('active', true)
      return new Response(JSON.stringify(products), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 5. POST /orders/from-whatsapp (n8n)
    if (path === '/orders/from-whatsapp' && req.method === 'POST') {
      const body = await req.json()
      // Logic to find/create customer and create order
      // This would be called by n8n
      const { customer_whatsapp, customer_name, items, company_id, total } = body
      
      // 1. Upsert Customer
      const { data: customer } = await supabaseClient
        .from('customers')
        .upsert({ 
          whatsapp: customer_whatsapp, 
          name: customer_name, 
          company_id 
        }, { onConflict: 'whatsapp,company_id' })
        .select()
        .single()

      // 2. Create Order
      const { data: order } = await supabaseClient
        .from('orders')
        .insert({
          company_id,
          customer_id: customer.id,
          total,
          status: 'recebido'
        })
        .select()
        .single()

      // 3. Create Items
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }))

      await supabaseClient.from('order_items').insert(orderItems)

      return new Response(JSON.stringify({ success: true, order_id: order.id }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
