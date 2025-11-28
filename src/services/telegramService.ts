// Configuración de APIs desde variables de entorno (Vite)
// Las variables VITE_PUBLIC_* están disponibles en el cliente
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_PUBLIC_TELEGRAM_BOT_TOKEN || '7611611121:AAHkEDU1_QK68PKLH2ac-2Ikldi5JukOx4A';
const TELEGRAM_BOT_USERNAME = import.meta.env.VITE_PUBLIC_TELEGRAM_BOT_USERNAME || '@HairyPet_bot';
const N8N_API_KEY = import.meta.env.VITE_PUBLIC_N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDMxMDgxOS1lNjY2LTQ1OTUtYjQ0Zi0zYzBjNGUyYTYxZTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYwNzQwMzMxfQ.FMifXNxFbN-7WK-KCXP2NpPcu9UHvg7sBNs9wokCepY';
const DISCORD_WEBHOOK_URL = import.meta.env.VITE_PUBLIC_DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1430691532603916400/ZxqUPOlM6NYyuRkIo_O3yQGAGVuq1Bij3ZF4ZvvP51PMUe5xTmzr9Z_oX1IieGeWjrpt';

// Configuración de n8n
// Para n8n Cloud: https://tu-instancia.app.n8n.cloud/webhook/telegram-lead
// Para n8n Self-hosted: https://tu-dominio.com/webhook/telegram-lead
// Para n8n local con ngrok: https://tu-id.ngrok.io/webhook/telegram-lead
// IMPORTANTE: Configura VITE_PUBLIC_N8N_WEBHOOK_URL en tu archivo .env
const N8N_WEBHOOK_URL = import.meta.env.VITE_PUBLIC_N8N_WEBHOOK_URL || 'https://tu-instancia-n8n.com/webhook/telegram-lead';

export interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

export interface DiscordNotification {
  title: string;
  description: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
}

export interface N8NEvent {
  event: string;
  data: any;
  timestamp?: string;
}

/**
 * Envía un mensaje a través del bot de Telegram
 */
export const sendTelegramMessage = async (message: TelegramMessage): Promise<boolean> => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: message.chatId,
        text: message.text,
        parse_mode: message.parseMode || 'HTML'
      })
    });

    const data = await response.json();
    
    if (data.ok) {
      console.log('✅ Mensaje enviado a Telegram:', message.chatId);
      return true;
    } else {
      console.error('❌ Error enviando mensaje a Telegram:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Error de conexión con Telegram:', error);
    return false;
  }
};

/**
 * Obtiene información del bot de Telegram
 */
export const getBotInfo = async () => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
    const data = await response.json();
    
    if (data.ok) {
      return data.result;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo información del bot:', error);
    return null;
  }
};

/**
 * Obtiene las actualizaciones del bot (mensajes recibidos)
 */
export const getUpdates = async (offset?: number) => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${offset || 0}`);
    const data = await response.json();
    
    if (data.ok) {
      return data.result;
    }
    return [];
  } catch (error) {
    console.error('Error obteniendo actualizaciones:', error);
    return [];
  }
};

/**
 * Envía una notificación a Discord a través del webhook
 */
export const sendDiscordNotification = async (notification: DiscordNotification): Promise<boolean> => {
  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [{
          title: notification.title,
          description: notification.description,
          color: notification.color || 0x0088ff,
          fields: notification.fields,
          timestamp: new Date().toISOString(),
        }]
      })
    });

    if (response.ok) {
      console.log('✅ Notificación enviada a Discord');
      return true;
    } else {
      console.error('❌ Error enviando notificación a Discord:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error de conexión con Discord:', error);
    return false;
  }
};

/**
 * Envía datos a n8n para procesamiento y automatización
 */
export const sendToN8N = async (event: N8NEvent): Promise<boolean> => {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${N8N_API_KEY}`,
      },
      body: JSON.stringify({
        event: event.event,
        data: event.data,
        timestamp: event.timestamp || new Date().toISOString(),
      })
    });

    if (response.ok) {
      console.log('✅ Datos enviados a n8n:', event.event);
      return true;
    } else {
      console.error('❌ Error enviando datos a n8n:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error de conexión con n8n:', error);
    return false;
  }
};

/**
 * Notifica un nuevo lead a Discord y n8n
 */
export const notifyNewLead = async (lead: {
  id: string;
  name: string;
  chatId: string;
  product?: string;
  source: string;
}) => {
  // Notificar a Discord
  await sendDiscordNotification({
    title: '🔔 Nuevo Lead Detectado',
    description: `**${lead.name}** está interesado en **${lead.product || 'productos'}**\nFuente: ${lead.source}`,
    color: 0x0088ff,
    fields: [
      { name: 'ID Lead', value: lead.id, inline: true },
      { name: 'Chat ID', value: lead.chatId, inline: true },
    ]
  });

  // Enviar a n8n
  await sendToN8N({
    event: 'new_lead',
    data: {
      leadId: lead.id,
      name: lead.name,
      chatId: lead.chatId,
      product: lead.product,
      source: lead.source,
    }
  });
};

/**
 * Notifica un mensaje enviado
 */
export const notifyMessageSent = async (lead: {
  id: string;
  name: string;
  chatId: string;
  product?: string;
  message: string;
}) => {
  await sendDiscordNotification({
    title: '📱 Mensaje Enviado',
    description: `Mensaje enviado a **${lead.name}** sobre **${lead.product || 'productos'}**`,
    color: 0x00ff00,
  });

  await sendToN8N({
    event: 'message_sent',
    data: {
      leadId: lead.id,
      chatId: lead.chatId,
      message: lead.message.substring(0, 100),
    }
  });
};

/**
 * Notifica una conversión (venta)
 */
export const notifyConversion = async (lead: {
  id: string;
  name: string;
  chatId: string;
  product?: string;
  revenue: number;
}) => {
  await sendDiscordNotification({
    title: '💰 Venta Convertida',
    description: `**${lead.name}** ha realizado una compra de **${lead.product || 'productos'}**\nIngreso: €${lead.revenue.toFixed(2)}`,
    color: 0xffaa00,
    fields: [
      { name: 'Producto', value: lead.product || 'N/A', inline: true },
      { name: 'Ingreso', value: `€${lead.revenue.toFixed(2)}`, inline: true },
    ]
  });

  await sendToN8N({
    event: 'conversion',
    data: {
      leadId: lead.id,
      chatId: lead.chatId,
      product: lead.product,
      revenue: lead.revenue,
    }
  });
};

export { TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_USERNAME };

