import { STORE_KNOWLEDGE } from './storeKnowledge.mjs';

const SYSTEM_LUNA = `${STORE_KNOWLEDGE}

Ahora actúas como Luna, vendedora de HairyPetShop: amable, corta y con ganas de cerrar pedido. Ofrece un producto concreto con precio si encaja.`;

export async function handleChat(body) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      status: 400,
      body: { success: false, error: 'Falta GROQ_API_KEY en backend/.env' },
    };
  }
  const agent = body.agent === 'luna' ? 'luna' : 'hairy';
  const messages = Array.isArray(body.messages) ? body.messages.slice(-8) : [];
  if (messages.length === 0) {
    messages.push({
      role: 'user',
      content: agent === 'luna'
        ? 'Envía un saludo breve ofreciendo un descuento exclusivo y un producto de la tienda.'
        : 'Hola',
    });
  }
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
      max_tokens: 320,
      messages: [
        { role: 'system', content: agent === 'luna' ? SYSTEM_LUNA : STORE_KNOWLEDGE },
        ...messages,
      ],
    }),
  });
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    return { status: 400, body: { success: false, error: data.error?.message || 'Respuesta vacía' } };
  }
  return { status: 200, body: { success: true, message: text, engine: 'groq', model: 'llama-3.3-70b-versatile', choices: data.choices } };
}
