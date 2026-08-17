import { join } from 'node:path';
import { DATA_DIR, getPool, appendJson, ensureJson } from './db.mjs';

const EVENTS_FILE = join(DATA_DIR, 'events.json');
ensureJson(EVENTS_FILE);

const OWN_WORKFLOWS = [
  {
    id: 'sales',
    name: 'Ventas HairyPetShop',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'leads',
    name: 'Captura de leads',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'printify',
    name: 'Pedidos Printify',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
];

async function storeEvent(event_type, payload) {
  const db = await getPool();
  if (db) {
    await db.query('INSERT INTO events (event_type, payload) VALUES ($1,$2)', [
      event_type,
      JSON.stringify(payload),
    ]);
  } else {
    appendJson(EVENTS_FILE, {
      event_type,
      payload,
      created_at: new Date().toISOString(),
    });
  }
}

function lunaMessage(behavior, timeOnSite = 0) {
  if (behavior === 'interested') {
    return '¡Excelente elección! 🌟 Soy Luna y ese producto es uno de mis favoritos. Te ofrezco envío GRATIS + una sorpresa para tu mascota si lo compras ahora.';
  }
  if (behavior === 'leaving') {
    return '¡Espera un momento! 🐾 Soy Luna. Oferta exclusiva: 20% de descuento + envío gratis si compras en los próximos 10 minutos.';
  }
  if (behavior === 'cart_abandonment' || behavior === 'purchasing') {
    return '¡Genial! 🎉 Soy Luna. Tu selección está lista: descuento aplicado y envío gratis activado. ¿Tarjeta o PayPal?';
  }
  const urgency =
    timeOnSite > 60
      ? '\n\n🔥 Oferta especial: 15% de descuento en tu primera compra.'
      : '';
  return `¡Hola! 👋 Soy Luna, especialista en mascotas de HairyPetShop. ¿Tienes perro, gato o ambos? 🐕🐱${urgency}`;
}

function lunaReply(customerMessage = '') {
  const lower = String(customerMessage).toLowerCase();
  if (lower.includes('precio') || lower.includes('cuesta') || lower.includes('coste')) {
    return 'Nuestros precios son competitivos y con garantía. Si compras hoy: 15% de descuento + envío gratis.';
  }
  if (lower.includes('calidad') || lower.includes('bueno') || lower.includes('recomendación')) {
    return 'Solo recomendamos productos con garantía, certificaciones y reseñas reales. ¿Qué mascota tienes? Te personalizo la recomendación.';
  }
  if (lower.includes('envío') || lower.includes('entrega')) {
    return 'Envío 24-48h en península, gratis en pedidos +30€, con seguimiento. ¿Necesitas una fecha concreta?';
  }
  if (lower.includes('descuento') || lower.includes('oferta')) {
    return 'Oferta ahora: 20% + envío gratis + regalo. ¿La aplicamos a tu pedido?';
  }
  if (['sí', 'si', 'vale', 'ok'].some((w) => lower.includes(w))) {
    return 'Perfecto. Te preparo el pedido con descuento y envío gratis. ¿Tarjeta o PayPal?';
  }
  return 'Dime si te preocupa precio, calidad o envío y te ayudo a decidir en un momento.';
}

export async function handleAutomation(path, method, body) {
  if (path === '/api/n8n-integration' && method === 'POST') {
    const action = body.action || 'event';
    const data = body.data || body;
    await storeEvent(action, data);

    if (action === 'get_n8n_workflows') {
      return {
        status: 200,
        body: { success: true, workflows: OWN_WORKFLOWS, storage: 'own-api' },
      };
    }
    if (action === 'get_n8n_status') {
      return {
        status: 200,
        body: {
          success: true,
          n8n_connected: false,
          own_api: true,
          workflow_status: 'active',
          api_status: 'connected',
        },
      };
    }
    return {
      status: 200,
      body: { success: true, message: 'Evento guardado en API propia', action },
    };
  }

  if (path === '/api/ai-sales-agent' && method === 'POST') {
    const action = body.action || '';
    const data = body.data || {};
    await storeEvent(action || 'ai-sales', data);

    if (action === 'generate_sales_message') {
      return {
        status: 200,
        body: {
          success: true,
          message: lunaMessage(data.customerBehavior, data.timeOnSite),
          agent: 'Luna',
          personality: 'Atenta, amable y apasionada por las mascotas',
        },
      };
    }
    if (action === 'handle_customer_response') {
      return {
        status: 200,
        body: { success: true, message: lunaReply(data.customerMessage), agent: 'Luna' },
      };
    }
    return { status: 200, body: { success: true, message: 'Notificación registrada', agent: 'Luna' } };
  }

  return null;
}
