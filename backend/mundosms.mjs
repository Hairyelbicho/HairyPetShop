const SMS_URL = () => process.env.MUNDOSMS_SMS_URL || 'https://www.mundosms.es/APIv2/sendsms.php';
const VOZ_URL = () => process.env.MUNDOSMS_VOZPUSH_URL || 'https://www.mundosms.es/APIv2/sendvoz.php';

export function mundosmsConfigured() {
  return Boolean(process.env.MUNDOSMS_USER && process.env.MUNDOSMS_PASSWORD);
}

export function callerId() {
  return (process.env.MUNDOSMS_NUMBER || '34848681101').replace(/\D/g, '');
}

export function normalizeEsPhone(raw) {
  let s = String(raw || '').replace(/[^\d+]/g, '');
  if (s.startsWith('00')) s = s.slice(2);
  if (s.startsWith('+')) s = s.slice(1);
  if (s.startsWith('34') && s.length >= 11) return s;
  if (s.length === 9) return `34${s}`;
  return s;
}

export async function sendSms({ to, message, from }) {
  if (!mundosmsConfigured()) {
    return { ok: false, skipped: true, error: 'Falta MUNDOSMS_USER / MUNDOSMS_PASSWORD' };
  }
  const destino = normalizeEsPhone(to);
  const remitente = (from || callerId()).slice(0, 16);
  const url = new URL(SMS_URL());
  url.searchParams.set('username', process.env.MUNDOSMS_USER);
  url.searchParams.set('password', process.env.MUNDOSMS_PASSWORD);
  url.searchParams.set('destino', destino);
  url.searchParams.set('mensaje', String(message || '').slice(0, 918));
  url.searchParams.set('remitente', remitente);
  const res = await fetch(url, { method: 'GET' });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text.slice(0, 500) };
}

export async function startVoiceCall({ to, openingText, webhookUrl, brand = 'hairy' }) {
  if (!mundosmsConfigured()) {
    return { ok: false, skipped: true, error: 'Falta MUNDOSMS_USER / MUNDOSMS_PASSWORD' };
  }
  const destino = normalizeEsPhone(to);
  const from = callerId();
  const callback = webhookUrl || process.env.MUNDOSMS_VOICE_WEBHOOK || '';
  const texto = String(openingText || '').slice(0, 900);
  const xml = `<call><tts lang="es">${escapeXml(texto)}</tts>${
    callback ? `<http method="POST" url="${escapeXml(callback)}"/>` : ''
  }</call>`;

  const params = new URLSearchParams({
    username: process.env.MUNDOSMS_USER,
    password: process.env.MUNDOSMS_PASSWORD,
    destino,
    remitente: from,
    callerid: from,
    texto,
    xml,
    brand,
  });
  if (callback) params.set('callback', callback);

  const res = await fetch(VOZ_URL(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text.slice(0, 800), destino, from };
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
