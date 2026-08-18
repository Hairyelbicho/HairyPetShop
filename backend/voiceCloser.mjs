import { STORE_KNOWLEDGE } from './storeKnowledge.mjs';
import { normalizeEsPhone, sendSms, startVoiceCall, mundosmsConfigured } from './mundosms.mjs';

const sessions = new Map();

function sessionId(brand, phone) {
  return `${brand || 'hairy'}:${normalizeEsPhone(phone) || 'anon'}`;
}

function getHistory(id) {
  return sessions.get(id) || [];
}

function pushTurn(id, role, content) {
  const prev = getHistory(id);
  prev.push({ role, content });
  sessions.set(id, prev.slice(-12));
}

export function pickSpeech(params) {
  const keys = [
    'texto', 'speech', 'mensaje', 'respuesta', 'asr', 'voice', 'voice_text',
    'reconocido', 'utterance', 'input', 'dtmf', 'variable', 'texto_voz',
  ];
  for (const k of keys) {
    const v = params[k];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  for (const [k, v] of Object.entries(params)) {
    if (/texto|speech|asr|voice|mensaje/i.test(k) && v) return String(v).trim();
  }
  return '';
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const CLOSER_HAIRY = `${STORE_KNOWLEDGE}

Ahora hablas POR TELÉFONO. Eres el asistente de voz de HairyPetShop (no finges ser humano: si preguntan, eres el asistente). Tono distendido, rápido, convincente sin agresividad.
Reglas de voz:
- 1 o 2 frases por turno. Nada de listas ni markdown.
- Una pregunta cada vez. Escucha más de lo que hablas.
- Recomienda UN producto con precio. No insistas si dicen que no.
- Cierre suave: ofrece enviar el enlace de pago por SMS. Eso es cerrar. No pases a un comercial.
- Si dicen "lo pienso", resume, ofrece el SMS y despídete.
Responde SOLO un JSON: {"say":"...","closed":false,"sms":null,"hangup":false}
sms: texto corto del SMS de pago o null. hangup: true solo al despedir.`;

const CLOSER_TAXI = `Eres el asistente de voz de Arkadium88 TaxiDriver (Arkadium88 Holdings SL). Hablas por teléfono, tono distendido y breve. No finges ser humano.
Producto: Elite Fleet 250 €/mes, sin permanencia. Registro en taxidriver.arkadium88holdingssl.com. Wallet Solana/USDC, liquidación diaria, Verifactu, soporte Telegram.
Reglas: 1-2 frases, una pregunta, convincente sin agresividad. Cierre = SMS con enlace de alta/pago. No pases a comercial.
Responde SOLO un JSON: {"say":"...","closed":false,"sms":null,"hangup":false}`;

function systemFor(brand) {
  return brand === 'taxi' ? CLOSER_TAXI : CLOSER_HAIRY;
}

function parseCloser(text) {
  const raw = String(text || '').trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try {
      const json = JSON.parse(raw.slice(start, end + 1));
      return {
        say: String(json.say || '').slice(0, 400),
        closed: Boolean(json.closed),
        sms: json.sms ? String(json.sms).slice(0, 300) : null,
        hangup: Boolean(json.hangup),
      };
    } catch {
      /* fall through */
    }
  }
  return { say: raw.replace(/\s+/g, ' ').slice(0, 400), closed: false, sms: null, hangup: false };
}

export async function runVoiceTurn({ brand = 'hairy', history = [], userText, leadName = '' }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { say: 'Ahora mismo no puedo atender la llamada. Te escribo por SMS.', closed: false, sms: null, hangup: true };
  }
  const messages = [
    { role: 'system', content: systemFor(brand) },
    ...history.slice(-10),
  ];
  const spoken = String(userText || '').trim();
  if (spoken) {
    messages.push({ role: 'user', content: spoken });
  } else {
    const who = leadName ? ` Se llama ${leadName}.` : '';
    messages.push({
      role: 'user',
      content: `[INICIO DE LLAMADA]${who} Acaba de dejar el teléfono en la web. Saluda en una frase y pregunta en qué le ayudas.`,
    });
  }

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 220,
      messages,
    }),
  });
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    return { say: 'Perdona, no te he pillado. ¿Me lo dices otra vez?', closed: false, sms: null, hangup: false };
  }
  return parseCloser(text);
}

export async function handleCloserWebhook(params, brand = 'hairy') {
  const phone = normalizeEsPhone(params.phone || params.telefono || params.caller_id || params.callerid || '');
  const name = String(params.name || params.nombre || '').slice(0, 80);
  const sid = sessionId(brand, phone || params.session_id || params.callid);
  const spoken = pickSpeech(params);
  if (spoken) pushTurn(sid, 'user', spoken);
  const turn = await runVoiceTurn({
    brand,
    history: getHistory(sid),
    userText: spoken,
    leadName: name,
  });
  if (turn.say) pushTurn(sid, 'assistant', turn.say);
  let smsResult = null;
  if (turn.sms && phone) {
    smsResult = await sendSms({ to: phone, message: turn.sms });
  }
  return {
    texto_voz: turn.say,
    cotizacion: turn.say,
    closed: turn.closed,
    hangup: turn.hangup,
    sms: Boolean(turn.sms),
    sms_ok: smsResult?.ok || false,
  };
}

export async function requestCallback({ phone, name, brand = 'hairy', interest = '' }) {
  const destino = normalizeEsPhone(phone);
  if (!destino) return { ok: false, error: 'Teléfono no válido' };
  const sid = sessionId(brand, destino);
  sessions.delete(sid);
  const opening = await runVoiceTurn({ brand, history: [], userText: '', leadName: name });
  if (opening.say) pushTurn(sid, 'assistant', opening.say);
  const call = await startVoiceCall({
    to: destino,
    openingText: opening.say,
    brand,
  });
  return {
    ok: Boolean(call.ok || call.skipped),
    queued: Boolean(call.ok),
    skipped: Boolean(call.skipped),
    mundosms: mundosmsConfigured(),
    from: call.from,
    say: opening.say,
    error: call.error || null,
    interest,
  };
}
