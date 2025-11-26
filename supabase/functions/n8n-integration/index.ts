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
    const { action, data } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // ACTUALIZADO: Nueva URL de n8n workflows
    const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDMxMDgxOS1lNjY2LTQ1OTUtYjQ0Zi0zYzBjNGUyYTYxZTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU5NzUxMjg1LCJleHAiOjE3NjIzMTg4MDB9.XAoSIn51eEZ8z1_kicPjZFZmBXbQveIqQhR_r4-7QIs"
    const N8N_BASE_URL = "http://localhost:5678"
    const N8N_WORKFLOW_ID = "vCJbQTB5vj88tIxe"

    console.log('N8N Integration - Action:', action)

    switch (action) {
      case 'send_sale_to_n8n':
        const saleData = data
        
        // Enviar venta al workflow específico de n8n
        const webhookUrl = `${N8N_BASE_URL}/webhook/petstore-sale`
        
        const salePayload = {
          event: 'sale_completed',
          timestamp: new Date().toISOString(),
          product: {
            name: saleData.productName,
            price: saleData.amount,
            category: saleData.category || 'general'
          },
          customer: {
            name: saleData.customerName,
            email: saleData.customerEmail,
            phone: saleData.customerPhone || '+34000000000'
          },
          payment: {
            method: saleData.paymentMethod,
            amount: saleData.amount,
            commission: saleData.commission || saleData.amount * 0.20,
            supplier_amount: saleData.supplierAmount || saleData.amount * 0.80
          },
          automation: {
            source: 'hairypetshop',
            agent: 'Luna IA',
            workflow_id: N8N_WORKFLOW_ID
          }
        }

        const n8nResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${N8N_API_KEY}`
          },
          body: JSON.stringify(salePayload)
        })

        // Registrar en Supabase
        await supabase
          .from('n8n_integrations')
          .insert({
            event_type: 'sale',
            data: salePayload,
            n8n_response: n8nResponse.ok ? 'success' : 'error',
            workflow_id: N8N_WORKFLOW_ID,
            created_at: new Date().toISOString()
          })

        console.log('✅ Venta enviada a n8n workflow:', N8N_WORKFLOW_ID)

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Venta enviada a n8n automáticamente',
            workflow_url: `${N8N_BASE_URL}/workflow/${N8N_WORKFLOW_ID}`,
            webhook_url: webhookUrl
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )

      case 'send_lead_to_n8n':
        const leadData = data
        
        const leadWebhookUrl = `${N8N_BASE_URL}/webhook/petstore-lead`
        
        const leadPayload = {
          event: 'lead_captured',
          timestamp: new Date().toISOString(),
          lead: {
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone || '',
            source: leadData.source || 'website',
            interest: leadData.interest || 'general',
            behavior: leadData.behavior || 'unknown',
            telegram_id: leadData.telegram_id || null,
            message: leadData.message || '',
            luna_response: leadData.luna_response || ''
          },
          automation: {
            source: 'hairypetshop',
            agent: 'Luna IA',
            workflow_id: N8N_WORKFLOW_ID
          }
        }

        const leadN8nResponse = await fetch(leadWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${N8N_API_KEY}`
          },
          body: JSON.stringify(leadPayload)
        })

        // Registrar en Supabase
        await supabase
          .from('n8n_integrations')
          .insert({
            event_type: 'lead',
            data: leadPayload,
            n8n_response: leadN8nResponse.ok ? 'success' : 'error',
            workflow_id: N8N_WORKFLOW_ID,
            created_at: new Date().toISOString()
          })

        console.log('✅ Lead enviado a n8n workflow:', N8N_WORKFLOW_ID)

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Lead enviado a n8n automáticamente',
            workflow_url: `${N8N_BASE_URL}/workflow/${N8N_WORKFLOW_ID}`
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )

      case 'sync_customer_to_n8n':
        const customerData = data
        
        const customerWebhookUrl = `${N8N_BASE_URL}/webhook/petstore-customer-sync`
        
        const customerPayload = {
          event: 'customer_sync',
          timestamp: new Date().toISOString(),
          customer: customerData,
          automation: {
            source: 'hairypetshop',
            workflow_id: N8N_WORKFLOW_ID
          }
        }

        const customerN8nResponse = await fetch(customerWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${N8N_API_KEY}`
          },
          body: JSON.stringify(customerPayload)
        })

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Cliente sincronizado con n8n',
            workflow_url: `${N8N_BASE_URL}/workflow/${N8N_WORKFLOW_ID}`
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )

      case 'get_n8n_status':
        // Verificar estado del workflow
        const statusUrl = `${N8N_BASE_URL}/api/v1/workflows/${N8N_WORKFLOW_ID}`
        
        const statusResponse = await fetch(statusUrl, {
          headers: {
            'Authorization': `Bearer ${N8N_API_KEY}`
          }
        })

        const workflowStatus = statusResponse.ok ? await statusResponse.json() : null

        return new Response(
          JSON.stringify({
            success: true,
            n8n_connected: statusResponse.ok,
            workflow_id: N8N_WORKFLOW_ID,
            workflow_url: `${N8N_BASE_URL}/workflow/${N8N_WORKFLOW_ID}`,
            workflow_status: workflowStatus?.active ? 'active' : 'inactive',
            api_status: 'connected'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )

      default:
        throw new Error(`Acción no reconocida: ${action}`)
    }

  } catch (error) {
    console.error('Error en N8N Integration:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        workflow_url: `http://localhost:5678/workflow/vCJbQTB5vj88tIxe`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})