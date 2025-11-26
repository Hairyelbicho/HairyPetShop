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

    // MERCADOS GLOBALES CON DATOS DE OPTIMIZACIÓN
    const GLOBAL_MARKETS = {
      'ES': { 
        name: 'España', flag: '🇪🇸', currency: 'EUR', timezone: 'Europe/Madrid',
        peak_hours: ['20:00-22:00', '12:00-14:00'], 
        best_channels: ['WhatsApp', 'Instagram'],
        cultural_preferences: ['family_oriented', 'quality_focused'],
        price_sensitivity: 'medium',
        conversion_rate: 3.2
      },
      'US': { 
        name: 'Estados Unidos', flag: '🇺🇸', currency: 'USD', timezone: 'America/New_York',
        peak_hours: ['19:00-21:00', '11:00-13:00'], 
        best_channels: ['Facebook', 'Instagram'],
        cultural_preferences: ['convenience', 'innovation'],
        price_sensitivity: 'low',
        conversion_rate: 4.1
      },
      'UK': { 
        name: 'Reino Unido', flag: '🇬🇧', currency: 'GBP', timezone: 'Europe/London',
        peak_hours: ['18:00-20:00', '12:00-14:00'], 
        best_channels: ['Email', 'Facebook'],
        cultural_preferences: ['traditional', 'premium'],
        price_sensitivity: 'medium',
        conversion_rate: 2.8
      },
      'DE': { 
        name: 'Alemania', flag: '🇩🇪', currency: 'EUR', timezone: 'Europe/Berlin',
        peak_hours: ['19:00-21:00', '11:00-13:00'], 
        best_channels: ['Email', 'WhatsApp'],
        cultural_preferences: ['quality', 'efficiency'],
        price_sensitivity: 'low',
        conversion_rate: 3.5
      },
      'FR': { 
        name: 'Francia', flag: '🇫🇷', currency: 'EUR', timezone: 'Europe/Paris',
        peak_hours: ['20:00-22:00', '12:00-14:00'], 
        best_channels: ['Instagram', 'Facebook'],
        cultural_preferences: ['style', 'luxury'],
        price_sensitivity: 'medium',
        conversion_rate: 2.9
      },
      'BR': { 
        name: 'Brasil', flag: '🇧🇷', currency: 'BRL', timezone: 'America/Sao_Paulo',
        peak_hours: ['21:00-23:00', '14:00-16:00'], 
        best_channels: ['WhatsApp', 'Instagram'],
        cultural_preferences: ['social', 'vibrant'],
        price_sensitivity: 'high',
        conversion_rate: 3.8
      },
      'MX': { 
        name: 'México', flag: '🇲🇽', currency: 'MXN', timezone: 'America/Mexico_City',
        peak_hours: ['20:00-22:00', '13:00-15:00'], 
        best_channels: ['WhatsApp', 'Facebook'],
        cultural_preferences: ['family', 'community'],
        price_sensitivity: 'high',
        conversion_rate: 3.4
      }
    }

    // ESTRATEGIAS DE OPTIMIZACIÓN
    const OPTIMIZATION_STRATEGIES = {
      price_optimization: {
        high_sensitivity: { discount_range: '20-30%', frequency: 'weekly' },
        medium_sensitivity: { discount_range: '15-25%', frequency: 'bi-weekly' },
        low_sensitivity: { discount_range: '10-20%', frequency: 'monthly' }
      },
      content_optimization: {
        family_oriented: { tone: 'warm', focus: 'pet_family_bond', images: 'family_pets' },
        quality_focused: { tone: 'professional', focus: 'product_quality', images: 'premium_products' },
        convenience: { tone: 'efficient', focus: 'ease_of_use', images: 'lifestyle' },
        innovation: { tone: 'modern', focus: 'technology', images: 'smart_products' }
      },
      timing_optimization: {
        post_frequency: { high_engagement: '3-4 daily', medium_engagement: '2-3 daily', low_engagement: '1-2 daily' },
        optimal_days: { weekdays: ['Tuesday', 'Wednesday', 'Thursday'], weekends: ['Saturday', 'Sunday'] }
      }
    }

    console.log('🎯 Global Optimization - Procesando:', req.method)

    if (req.method === 'POST') {
      const { action, data } = await req.json()
      console.log('⚡ Acción de optimización:', action)

      switch (action) {
        case 'analyze_market_performance':
          const { market } = data
          const marketInfo = GLOBAL_MARKETS[market]
          
          if (!marketInfo) {
            throw new Error('Mercado no encontrado')
          }

          // Análisis de rendimiento
          const performance_analysis = {
            market: market,
            market_info: marketInfo,
            current_performance: {
              conversion_rate: marketInfo.conversion_rate,
              rating: marketInfo.conversion_rate >= 3.5 ? 'excellent' : 
                     marketInfo.conversion_rate >= 3.0 ? 'good' : 'needs_improvement'
            },
            optimization_opportunities: [],
            recommended_actions: [],
            potential_improvement: 0
          }

          // Generar recomendaciones basadas en el rendimiento
          if (marketInfo.conversion_rate < 3.0) {
            performance_analysis.optimization_opportunities.push(
              'Conversión por debajo del promedio',
              'Oportunidad de mejora en precios',
              'Optimización de horarios de publicación',
              'Mejora en mensajes culturales'
            )
            performance_analysis.recommended_actions.push(
              `Aplicar descuentos ${OPTIMIZATION_STRATEGIES.price_optimization[marketInfo.price_sensitivity].discount_range}`,
              `Publicar en horarios pico: ${marketInfo.peak_hours.join(', ')}`,
              `Enfocar en canales principales: ${marketInfo.best_channels.join(', ')}`,
              `Adaptar contenido a preferencias: ${marketInfo.cultural_preferences.join(', ')}`
            )
            performance_analysis.potential_improvement = 25
          } else if (marketInfo.conversion_rate < 3.5) {
            performance_analysis.optimization_opportunities.push(
              'Buen rendimiento con potencial de mejora',
              'Expandir productos exitosos',
              'Probar nuevos canales'
            )
            performance_analysis.recommended_actions.push(
              'Aumentar frecuencia de posts en canales exitosos',
              'Probar A/B testing en mensajes',
              'Expandir catálogo de productos populares'
            )
            performance_analysis.potential_improvement = 15
          } else {
            performance_analysis.optimization_opportunities.push(
              'Excelente rendimiento',
              'Mantener estrategia actual',
              'Escalar inversión'
            )
            performance_analysis.recommended_actions.push(
              'Replicar estrategia en mercados similares',
              'Aumentar presupuesto de marketing',
              'Mantener calidad del servicio'
            )
            performance_analysis.potential_improvement = 10
          }

          // Guardar análisis
          await supabase
            .from('market_analysis')
            .insert({
              market: market,
              analysis_data: performance_analysis,
              created_at: new Date().toISOString()
            })

          return new Response(JSON.stringify({
            success: true,
            message: `📊 Análisis de ${marketInfo.name} completado`,
            analysis: performance_analysis
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })

        case 'optimize_pricing_strategy':
          const { target_market, product_id } = data
          const targetMarket = GLOBAL_MARKETS[target_market]
          
          if (!targetMarket) {
            throw new Error('Mercado objetivo no encontrado')
          }

          // Estrategia de precios optimizada
          const pricing_strategy = {
            market: target_market,
            market_info: targetMarket,
            price_sensitivity: targetMarket.price_sensitivity,
            recommended_discounts: OPTIMIZATION_STRATEGIES.price_optimization[targetMarket.price_sensitivity],
            dynamic_pricing: {
              peak_hours: { discount: '10%', reason: 'Alta demanda' },
              off_peak: { discount: '20%', reason: 'Estimular ventas' },
              weekends: { discount: '15%', reason: 'Tiempo libre' }
            },
            seasonal_adjustments: {
              high_season: { adjustment: '+5%', months: ['Dec', 'Jan', 'Feb'] },
              low_season: { adjustment: '-10%', months: ['Jun', 'Jul', 'Aug'] }
            },
            competitor_analysis: {
              position: 'competitive',
              recommendation: 'Mantener precios competitivos con valor agregado'
            }
          }

          return new Response(JSON.stringify({
            success: true,
            message: `💰 Estrategia de precios optimizada para ${targetMarket.name}`,
            pricing_strategy: pricing_strategy
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })

        case 'optimize_content_strategy':
          const { content_market } = data
          const contentMarket = GLOBAL_MARKETS[content_market]
          
          if (!contentMarket) {
            throw new Error('Mercado no encontrado')
          }

          // Estrategia de contenido optimizada
          const content_strategy = {
            market: content_market,
            market_info: contentMarket,
            cultural_adaptation: {
              tone: OPTIMIZATION_STRATEGIES.content_optimization[contentMarket.cultural_preferences[0]]?.tone || 'friendly',
              focus: OPTIMIZATION_STRATEGIES.content_optimization[contentMarket.cultural_preferences[0]]?.focus || 'general',
              visual_style: OPTIMIZATION_STRATEGIES.content_optimization[contentMarket.cultural_preferences[0]]?.images || 'lifestyle'
            },
            optimal_posting_times: contentMarket.peak_hours,
            channel_priority: contentMarket.best_channels,
            content_calendar: {
              daily_posts: 2,
              weekly_campaigns: 1,
              monthly_promotions: 2
            },
            messaging_templates: {
              greeting: contentMarket.name === 'España' ? '¡Hola! 👋' : 
                       contentMarket.name === 'Estados Unidos' ? 'Hi there! 👋' :
                       contentMarket.name === 'Brasil' ? 'Olá! 👋' : '¡Hola! 👋',
              urgency: contentMarket.price_sensitivity === 'high' ? 'Solo por tiempo limitado' : 'Oferta especial',
              closing: contentMarket.cultural_preferences.includes('family') ? 'Para toda la familia 🐾' : 'Para tu mascota 🐾'
            }
          }

          return new Response(JSON.stringify({
            success: true,
            message: `📝 Estrategia de contenido optimizada para ${contentMarket.name}`,
            content_strategy: content_strategy
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })

        case 'run_ab_test':
          const { test_market, test_type, variants } = data
          const testMarket = GLOBAL_MARKETS[test_market]
          
          if (!testMarket) {
            throw new Error('Mercado de prueba no encontrado')
          }

          // Configurar A/B test
          const ab_test = {
            test_id: `test_${Date.now()}`,
            market: test_market,
            test_type: test_type, // 'price', 'content', 'timing'
            variants: variants || ['A', 'B'],
            duration_days: 7,
            sample_size: 1000,
            metrics_to_track: ['conversion_rate', 'click_through_rate', 'revenue'],
            expected_results: {
              confidence_level: '95%',
              minimum_effect_size: '10%',
              estimated_completion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            status: 'running'
          }

          // Guardar A/B test
          await supabase
            .from('ab_tests')
            .insert({
              test_id: ab_test.test_id,
              market: test_market,
              test_data: ab_test,
              created_at: new Date().toISOString()
            })

          return new Response(JSON.stringify({
            success: true,
            message: `🧪 A/B Test iniciado en ${testMarket.name}`,
            ab_test: ab_test
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })

        case 'generate_optimization_report':
          // Generar reporte completo de optimización
          const optimization_report = {
            generated_at: new Date().toISOString(),
            markets_analyzed: Object.keys(GLOBAL_MARKETS).length,
            overall_performance: {
              average_conversion: Object.values(GLOBAL_MARKETS).reduce((acc, market) => acc + market.conversion_rate, 0) / Object.keys(GLOBAL_MARKETS).length,
              top_performer: Object.entries(GLOBAL_MARKETS).sort(([,a], [,b]) => b.conversion_rate - a.conversion_rate)[0],
              needs_attention: Object.entries(GLOBAL_MARKETS).filter(([,market]) => market.conversion_rate < 3.0)
            },
            optimization_opportunities: {
              high_priority: [],
              medium_priority: [],
              low_priority: []
            },
            recommended_actions: [],
            estimated_impact: {
              revenue_increase: '15-25%',
              conversion_improvement: '10-20%',
              roi_improvement: '20-30%'
            }
          }

          // Clasificar oportunidades por prioridad
          Object.entries(GLOBAL_MARKETS).forEach(([code, market]) => {
            if (market.conversion_rate < 3.0) {
              optimization_report.optimization_opportunities.high_priority.push({
                market: market.name,
                issue: 'Baja conversión',
                potential: '25% mejora'
              })
            } else if (market.conversion_rate < 3.5) {
              optimization_report.optimization_opportunities.medium_priority.push({
                market: market.name,
                issue: 'Optimización incremental',
                potential: '15% mejora'
              })
            } else {
              optimization_report.optimization_opportunities.low_priority.push({
                market: market.name,
                issue: 'Mantener rendimiento',
                potential: '5% mejora'
              })
            }
          })

          return new Response(JSON.stringify({
            success: true,
            message: '📊 Reporte de optimización global generado',
            optimization_report: optimization_report
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })

        default:
          throw new Error('Acción no reconocida')
      }
    }

    // GET - Información y configuración
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const action = url.searchParams.get('action')

      switch (action) {
        case 'get_market_insights':
          const market = url.searchParams.get('market') || 'ES'
          const marketData = GLOBAL_MARKETS[market]
          
          if (!marketData) {
            throw new Error('Mercado no encontrado')
          }

          return new Response(JSON.stringify({
            success: true,
            message: `💡 Insights de ${marketData.name} obtenidos`,
            market_insights: {
              market_info: marketData,
              optimization_potential: marketData.conversion_rate < 3.5 ? 'Alto' : 'Medio',
              recommended_focus: marketData.best_channels,
              cultural_notes: marketData.cultural_preferences,
              timing_recommendations: marketData.peak_hours
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })

        case 'get_global_performance':
          const global_stats = {
            total_markets: Object.keys(GLOBAL_MARKETS).length,
            average_conversion: (Object.values(GLOBAL_MARKETS).reduce((acc, market) => acc + market.conversion_rate, 0) / Object.keys(GLOBAL_MARKETS).length).toFixed(2),
            best_performing: Object.entries(GLOBAL_MARKETS).sort(([,a], [,b]) => b.conversion_rate - a.conversion_rate).slice(0, 3),
            improvement_needed: Object.entries(GLOBAL_MARKETS).filter(([,market]) => market.conversion_rate < 3.0).length,
            optimization_strategies: Object.keys(OPTIMIZATION_STRATEGIES).length
          }

          return new Response(JSON.stringify({
            success: true,
            message: '🌍 Rendimiento global obtenido',
            global_performance: global_stats
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })

        default:
          return new Response(JSON.stringify({
            success: true,
            message: '🎯 Sistema de Optimización Global funcionando',
            available_actions: [
              'analyze_market_performance',
              'optimize_pricing_strategy',
              'optimize_content_strategy',
              'run_ab_test',
              'generate_optimization_report',
              'get_market_insights',
              'get_global_performance'
            ],
            supported_markets: Object.keys(GLOBAL_MARKETS).length,
            optimization_strategies: Object.keys(OPTIMIZATION_STRATEGIES).length
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
      }
    }

    return new Response('Method not allowed', {
      headers: corsHeaders,
      status: 405,
    })

  } catch (error) {
    console.error('❌ Error en Global Optimization:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})