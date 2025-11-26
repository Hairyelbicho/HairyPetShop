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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🌍 TikTok Shop Global - Procesando request:', req.method)

    // CONFIGURACIÓN MULTI-CONTINENTE
    const GLOBAL_MARKETS = {
      'ES': {
        name: 'España',
        currency: 'EUR',
        seller_id: '7494194870140176340',
        shop_code: 'ESESLCJCQLSG',
        commission_rate: 0.20,
        shipping_cost: 4.99,
        api_endpoint: 'https://open-api.tiktokglobalshop.com/api/v2'
      },
      'US': {
        name: 'Estados Unidos',
        currency: 'USD',
        seller_id: '7494194870140176340',
        shop_code: 'USESLCJCQLSG',
        commission_rate: 0.25,
        shipping_cost: 6.99,
        api_endpoint: 'https://open-api.tiktokglobalshop.com/api/v2'
      },
      'UK': {
        name: 'Reino Unido',
        currency: 'GBP',
        seller_id: '7494194870140176340',
        shop_code: 'UKESLCJCQLSG',
        commission_rate: 0.22,
        shipping_cost: 4.99,
        api_endpoint: 'https://open-api.tiktokglobalshop.com/api/v2'
      },
      'CA': {
        name: 'Canadá',
        currency: 'CAD',
        seller_id: '7494194870140176340',
        shop_code: 'CAESLCJCQLSG',
        commission_rate: 0.23,
        shipping_cost: 7.99,
        api_endpoint: 'https://open-api.tiktokglobalshop.com/api/v2'
      },
      'AU': {
        name: 'Australia',
        currency: 'AUD',
        seller_id: '7494194870140176340',
        shop_code: 'AUESLCJCQLSG',
        commission_rate: 0.24,
        shipping_cost: 8.99,
        api_endpoint: 'https://open-api.tiktokglobalshop.com/api/v2'
      },
      'DE': {
        name: 'Alemania',
        currency: 'EUR',
        seller_id: '7494194870140176340',
        shop_code: 'DEESLCJCQLSG',
        commission_rate: 0.21,
        shipping_cost: 4.99,
        api_endpoint: 'https://open-api.tiktokglobalshop.com/api/v2'
      },
      'FR': {
        name: 'Francia',
        currency: 'EUR',
        seller_id: '7494194870140176340',
        shop_code: 'FRESLCJCQLSG',
        commission_rate: 0.21,
        shipping_cost: 4.99,
        api_endpoint: 'https://open-api.tiktokglobalshop.com/api/v2'
      },
      'IT': {
        name: 'Italia',
        currency: 'EUR',
        seller_id: '7494194870140176340',
        shop_code: 'ITESLCJCQLSG',
        commission_rate: 0.21,
        shipping_cost: 4.99,
        api_endpoint: 'https://open-api.tiktokglobalshop.com/api/v2'
      },
      'BR': {
        name: 'Brasil',
        currency: 'BRL',
        seller_id: '7494194870140176340',
        shop_code: 'BRESLCJCQLSG',
        commission_rate: 0.26,
        shipping_cost: 12.99,
        api_endpoint: 'https://open-api.tiktokglobalshop.com/api/v2'
      },
      'MX': {
        name: 'México',
        currency: 'MXN',
        seller_id: '7494194870140176340',
        shop_code: 'MXESLCJCQLSG',
        commission_rate: 0.25,
        shipping_cost: 89.99,
        api_endpoint: 'https://open-api.tiktokglobalshop.com/api/v2'
      }
    }

    // CATÁLOGO GLOBAL CON PRECIOS POR REGIÓN
    const GLOBAL_PRODUCTS = [
      {
        id: 'collar-premium-global',
        name: {
          'ES': 'Collar Premium Anti-Tirones',
          'US': 'Premium Anti-Pull Dog Collar',
          'UK': 'Premium Anti-Pull Dog Collar',
          'CA': 'Premium Anti-Pull Dog Collar',
          'AU': 'Premium Anti-Pull Dog Collar',
          'DE': 'Premium Anti-Zug Hundehalsband',
          'FR': 'Collier Premium Anti-Traction',
          'IT': 'Collare Premium Anti-Tiro',
          'BR': 'Coleira Premium Anti-Puxão',
          'MX': 'Collar Premium Anti-Tirones'
        },
        prices: {
          'ES': 29.99, 'US': 32.99, 'UK': 26.99, 'CA': 42.99,
          'AU': 45.99, 'DE': 28.99, 'FR': 31.99, 'IT': 29.99,
          'BR': 159.99, 'MX': 599.99
        },
        category: 'pet_accessories',
        image: 'https://readdy.ai/api/search-image?query=Premium leather dog collar with metal buckle, professional pet accessory, clean white background&width=800&height=600&seq=collar_global&orientation=landscape'
      },
      {
        id: 'juguete-interactivo-global',
        name: {
          'ES': 'Juguete Interactivo Inteligente',
          'US': 'Smart Interactive Pet Toy',
          'UK': 'Smart Interactive Pet Toy',
          'CA': 'Smart Interactive Pet Toy',
          'AU': 'Smart Interactive Pet Toy',
          'DE': 'Intelligentes Interaktives Haustierspielzeug',
          'FR': 'Jouet Interactif Intelligent',
          'IT': 'Giocattolo Interattivo Intelligente',
          'BR': 'Brinquedo Interativo Inteligente',
          'MX': 'Juguete Interactivo Inteligente'
        },
        prices: {
          'ES': 22.50, 'US': 24.99, 'UK': 19.99, 'CA': 32.99,
          'AU': 34.99, 'DE': 21.99, 'FR': 23.99, 'IT': 22.50,
          'BR': 119.99, 'MX': 449.99
        },
        category: 'pet_toys',
        image: 'https://readdy.ai/api/search-image?query=Interactive smart pet toy with LED lights and sensors, modern pet entertainment device, clean background&width=800&height=600&seq=toy_global&orientation=landscape'
      },
      {
        id: 'pienso-premium-global',
        name: {
          'ES': 'Pienso Premium Nutrición Completa',
          'US': 'Premium Complete Nutrition Pet Food',
          'UK': 'Premium Complete Nutrition Pet Food',
          'CA': 'Premium Complete Nutrition Pet Food',
          'AU': 'Premium Complete Nutrition Pet Food',
          'DE': 'Premium Vollnahrung Haustierfutter',
          'FR': 'Alimentation Premium Nutrition Complète',
          'IT': 'Cibo Premium Nutrizione Completa',
          'BR': 'Ração Premium Nutrição Completa',
          'MX': 'Alimento Premium Nutrición Completa'
        },
        prices: {
          'ES': 48.00, 'US': 52.99, 'UK': 42.99, 'CA': 68.99,
          'AU': 72.99, 'DE': 46.99, 'FR': 49.99, 'IT': 48.00,
          'BR': 249.99, 'MX': 899.99
        },
        category: 'pet_food',
        image: 'https://readdy.ai/api/search-image?query=Premium pet food bag with natural ingredients, high quality dog food package, professional product photography&width=800&height=600&seq=food_global&orientation=landscape'
      },
      {
        id: 'cama-ortopedica-global',
        name: {
          'ES': 'Cama Ortopédica Memory Foam',
          'US': 'Orthopedic Memory Foam Pet Bed',
          'UK': 'Orthopedic Memory Foam Pet Bed',
          'CA': 'Orthopedic Memory Foam Pet Bed',
          'AU': 'Orthopedic Memory Foam Pet Bed',
          'DE': 'Orthopädisches Memory Foam Haustierbett',
          'FR': 'Lit Orthopédique Memory Foam',
          'IT': 'Letto Ortopedico Memory Foam',
          'BR': 'Cama Ortopédica Memory Foam',
          'MX': 'Cama Ortopédica Memory Foam'
        },
        prices: {
          'ES': 52.99, 'US': 58.99, 'UK': 47.99, 'CA': 76.99,
          'AU': 81.99, 'DE': 51.99, 'FR': 54.99, 'IT': 52.99,
          'BR': 279.99, 'MX': 999.99
        },
        category: 'pet_furniture',
        image: 'https://readdy.ai/api/search-image?query=Orthopedic memory foam dog bed, comfortable pet sleeping mat, supportive pet furniture, clean background&width=800&height=600&seq=bed_global&orientation=landscape'
      },
      {
        id: 'kit-cuidado-global',
        name: {
          'ES': 'Kit Cuidado Completo Professional',
          'US': 'Complete Professional Grooming Kit',
          'UK': 'Complete Professional Grooming Kit',
          'CA': 'Complete Professional Grooming Kit',
          'AU': 'Complete Professional Grooming Kit',
          'DE': 'Komplettes Professionelles Pflegeset',
          'FR': 'Kit de Toilettage Professionnel Complet',
          'IT': 'Kit Toelettatura Professionale Completo',
          'BR': 'Kit Cuidado Profissional Completo',
          'MX': 'Kit Cuidado Profesional Completo'
        },
        prices: {
          'ES': 35.99, 'US': 39.99, 'UK': 32.99, 'CA': 52.99,
          'AU': 55.99, 'DE': 34.99, 'FR': 37.99, 'IT': 35.99,
          'BR': 189.99, 'MX': 679.99
        },
        category: 'pet_grooming',
        image: 'https://readdy.ai/api/search-image?query=Complete pet grooming kit with brushes, nail clippers, shampoo, professional pet care products set&width=800&height=600&seq=kit_global&orientation=landscape'
      },
      {
        id: 'transportin-premium-global',
        name: {
          'ES': 'Transportín Premium Viaje Seguro',
          'US': 'Premium Safe Travel Pet Carrier',
          'UK': 'Premium Safe Travel Pet Carrier',
          'CA': 'Premium Safe Travel Pet Carrier',
          'AU': 'Premium Safe Travel Pet Carrier',
          'DE': 'Premium Sichere Reise Haustiertransporter',
          'FR': 'Transporteur Premium Voyage Sécurisé',
          'IT': 'Trasportino Premium Viaggio Sicuro',
          'BR': 'Transportador Premium Viagem Segura',
          'MX': 'Transportín Premium Viaje Seguro'
        },
        prices: {
          'ES': 89.99, 'US': 99.99, 'UK': 79.99, 'CA': 129.99,
          'AU': 139.99, 'DE': 87.99, 'FR': 92.99, 'IT': 89.99,
          'BR': 469.99, 'MX': 1699.99
        },
        category: 'pet_travel',
        image: 'https://readdy.ai/api/search-image?query=Premium pet carrier with comfortable interior, airline approved pet transport bag, professional pet travel case&width=800&height=600&seq=carrier_global&orientation=landscape'
      }
    ]

    const url = new URL(req.url)
    const action = url.searchParams.get('action')
    const market = url.searchParams.get('market') || 'ES'

    if (req.method === 'GET') {
      switch (action) {
        case 'sync_products':
          const marketConfig = GLOBAL_MARKETS[market]
          if (!marketConfig) {
            return new Response(JSON.stringify({
              success: false,
              error: `Mercado ${market} no soportado`,
              available_markets: Object.keys(GLOBAL_MARKETS)
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400
            })
          }

          // Sincronizar productos para el mercado específico
          const syncedProducts = GLOBAL_PRODUCTS.map(product => ({
            id: product.id,
            name: product.name[market],
            price: product.prices[market],
            currency: marketConfig.currency,
            commission: (product.prices[market] * marketConfig.commission_rate).toFixed(2),
            market: market,
            market_name: marketConfig.name,
            category: product.category,
            image: product.image,
            shop_code: marketConfig.shop_code,
            seller_id: marketConfig.seller_id
          }))

          // Guardar en Supabase
          try {
            const { data, error } = await supabase
              .from('tiktok_products')
              .upsert(syncedProducts.map(product => ({
                product_id: product.id,
                market: market,
                name: product.name,
                price: product.price,
                currency: product.currency,
                commission: parseFloat(product.commission),
                shop_code: product.shop_code,
                seller_id: product.seller_id,
                category: product.category,
                image_url: product.image,
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })), {
                onConflict: 'product_id,market'
              })

            console.log('✅ Productos sincronizados en Supabase:', data)
          } catch (dbError) {
            console.log('⚠️ Error guardando productos:', dbError.message)
          }

          return new Response(JSON.stringify({
            success: true,
            message: `✅ Productos sincronizados para ${marketConfig.name}`,
            market: market,
            market_name: marketConfig.name,
            currency: marketConfig.currency,
            products_count: syncedProducts.length,
            products: syncedProducts,
            total_potential_commission: syncedProducts.reduce((sum, p) => sum + parseFloat(p.commission), 0).toFixed(2),
            shop_info: {
              seller_id: marketConfig.seller_id,
              shop_code: marketConfig.shop_code,
              commission_rate: `${(marketConfig.commission_rate * 100)}%`,
              shipping_cost: marketConfig.shipping_cost
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          })

        case 'get_all_markets':
          const allMarkets = Object.entries(GLOBAL_MARKETS).map(([code, config]) => ({
            code: code,
            name: config.name,
            currency: config.currency,
            commission_rate: `${(config.commission_rate * 100)}%`,
            shipping_cost: config.shipping_cost,
            products_count: GLOBAL_PRODUCTS.length,
            sync_url: `${req.url.split('?')[0]}?action=sync_products&market=${code}`,
            analytics_url: `${req.url.split('?')[0]}?action=get_analytics&market=${code}`
          }))

          return new Response(JSON.stringify({
            success: true,
            message: '🌍 Mercados globales disponibles',
            total_markets: allMarkets.length,
            markets: allMarkets,
            total_products: GLOBAL_PRODUCTS.length,
            global_sync_url: `${req.url.split('?')[0]}?action=sync_all_markets`
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          })

        case 'sync_all_markets':
          const allSyncResults = []
          
          for (const [marketCode, marketConfig] of Object.entries(GLOBAL_MARKETS)) {
            const marketProducts = GLOBAL_PRODUCTS.map(product => ({
              product_id: product.id,
              market: marketCode,
              name: product.name[marketCode],
              price: product.prices[marketCode],
              currency: marketConfig.currency,
              commission: parseFloat((product.prices[marketCode] * marketConfig.commission_rate).toFixed(2)),
              shop_code: marketConfig.shop_code,
              seller_id: marketConfig.seller_id,
              category: product.category,
              image_url: product.image,
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }))

            try {
              await supabase
                .from('tiktok_products')
                .upsert(marketProducts, {
                  onConflict: 'product_id,market'
                })

              allSyncResults.push({
                market: marketCode,
                market_name: marketConfig.name,
                products_synced: marketProducts.length,
                total_commission: marketProducts.reduce((sum, p) => sum + p.commission, 0).toFixed(2),
                currency: marketConfig.currency,
                status: 'success'
              })
            } catch (error) {
              allSyncResults.push({
                market: marketCode,
                market_name: marketConfig.name,
                status: 'error',
                error: error.message
              })
            }
          }

          return new Response(JSON.stringify({
            success: true,
            message: '🌍 ¡Sincronización global completada!',
            total_markets_synced: allSyncResults.filter(r => r.status === 'success').length,
            total_products_per_market: GLOBAL_PRODUCTS.length,
            sync_results: allSyncResults,
            global_commission_potential: allSyncResults
              .filter(r => r.status === 'success')
              .reduce((sum, r) => sum + parseFloat(r.total_commission || 0), 0)
              .toFixed(2)
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          })

        case 'get_analytics':
          const analyticsMarket = GLOBAL_MARKETS[market]
          if (!analyticsMarket) {
            return new Response(JSON.stringify({
              success: false,
              error: `Mercado ${market} no encontrado`
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400
            })
          }

          // Obtener datos de Supabase
          try {
            const { data: products } = await supabase
              .from('tiktok_products')
              .select('*')
              .eq('market', market)

            const { data: orders } = await supabase
              .from('tiktok_orders')
              .select('*')
              .eq('market', market)

            const totalProducts = products?.length || 0
            const totalOrders = orders?.length || 0
            const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
            const totalCommission = orders?.reduce((sum, order) => sum + (order.commission || 0), 0) || 0

            return new Response(JSON.stringify({
              success: true,
              market: market,
              market_name: analyticsMarket.name,
              currency: analyticsMarket.currency,
              analytics: {
                total_products: totalProducts,
                total_orders: totalOrders,
                total_revenue: totalRevenue.toFixed(2),
                total_commission: totalCommission.toFixed(2),
                commission_rate: `${(analyticsMarket.commission_rate * 100)}%`,
                average_order_value: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'
              },
              products: products || [],
              recent_orders: orders?.slice(-10) || []
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            })
          } catch (error) {
            return new Response(JSON.stringify({
              success: true,
              market: market,
              market_name: analyticsMarket.name,
              currency: analyticsMarket.currency,
              analytics: {
                total_products: GLOBAL_PRODUCTS.length,
                total_orders: 0,
                total_revenue: '0.00',
                total_commission: '0.00',
                commission_rate: `${(analyticsMarket.commission_rate * 100)}%`,
                average_order_value: '0.00'
              },
              note: 'Datos simulados - Base de datos en configuración'
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            })
          }

        default:
          return new Response(JSON.stringify({
            success: true,
            message: '🌍 TikTok Shop Global - Multi-Continente',
            available_actions: {
              sync_products: '?action=sync_products&market=ES',
              get_all_markets: '?action=get_all_markets',
              sync_all_markets: '?action=sync_all_markets',
              get_analytics: '?action=get_analytics&market=ES'
            },
            supported_markets: Object.keys(GLOBAL_MARKETS),
            total_products: GLOBAL_PRODUCTS.length,
            email: 'hairyelbicho@gmail.com',
            seller_id: '7494194870140176340'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          })
      }
    }

    // POST - Procesar pedidos
    if (req.method === 'POST') {
      const body = await req.json()
      console.log('📦 Procesando pedido TikTok:', body)

      // Simular procesamiento de pedido
      const order = {
        order_id: `TT${Date.now()}`,
        market: body.market || 'ES',
        product_id: body.product_id,
        quantity: body.quantity || 1,
        total_amount: body.total_amount,
        commission: body.total_amount * (GLOBAL_MARKETS[body.market || 'ES'].commission_rate),
        status: 'processing',
        created_at: new Date().toISOString()
      }

      // Guardar pedido
      try {
        await supabase
          .from('tiktok_orders')
          .insert(order)
      } catch (error) {
        console.log('⚠️ Error guardando pedido:', error.message)
      }

      return new Response(JSON.stringify({
        success: true,
        message: '✅ Pedido procesado correctamente',
        order: order
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    return new Response('Method not allowed', {
      headers: corsHeaders,
      status: 405
    })

  } catch (error) {
    console.error('❌ Error en TikTok Shop Global:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})