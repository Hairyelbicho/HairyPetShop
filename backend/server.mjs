import { createServer } from 'node:http';
import { join } from 'node:path';
import { handlePrintify } from './printify.mjs';
import { DATA_DIR, getPool, send, readBody, appendJson, ensureJson } from './db.mjs';
import { handleAuth } from './auth.mjs';
import { handleAutomation } from './automation.mjs';
import { handlePayments } from './payments.mjs';
import { handleYoutube } from './youtube.mjs';
import { handleChat } from './chat.mjs';
import { requestCallback, handleCloserWebhook } from './voiceCloser.mjs';
import { mundosmsConfigured, callerId } from './mundosms.mjs';

const PORT = Number(process.env.PORT || 8787);
const LEADS_FILE = join(DATA_DIR, 'leads.json');
const EVENTS_FILE = join(DATA_DIR, 'events.json');

ensureJson(LEADS_FILE);
ensureJson(EVENTS_FILE);

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    send(res, 204, {});
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const path = url.pathname.replace(/\/$/, '') || '/';
  const method = req.method || 'GET';

  try {
    if (method === 'GET' && (path === '/health' || path === '/api/health')) {
      const db = await getPool();
      send(res, 200, {
        ok: true,
        app: 'HairyPetShop API',
        company: 'Arkadium88 Holdings SL',
        postgres: Boolean(db),
        printify: Boolean(process.env.PRINTIFY_API_TOKEN),
        stripe: Boolean(process.env.STRIPE_SECRET_KEY),
        paypal: Boolean(process.env.PAYPAL_CLIENT_ID),
        groq: Boolean(process.env.GROQ_API_KEY),
        mundosms: mundosmsConfigured(),
        voice_from: callerId(),
      });
      return;
    }

    const body = method === 'GET' || method === 'DELETE' ? {} : await readBody(req);

    if (method === 'POST' && (path === '/api/printify' || path === '/printify')) {
      const result = await handlePrintify(body.action, body.data);
      send(res, 200, result);
      return;
    }

    if (method === 'POST' && (path === '/api/leads' || path === '/leads')) {
      const consentCall = Boolean(body.consent_call || body.consentCall);
      const lead = {
        name: body.name || '',
        email: body.email || '',
        phone: body.phone || '',
        source: body.source || 'hairy_home',
        interest: body.interest || '',
        message: body.message || '',
        consent_call: consentCall,
        created_at: new Date().toISOString(),
      };
      const db = await getPool();
      if (db) {
        await db.query(
          'INSERT INTO leads (name, email, phone, source, interest, message) VALUES ($1,$2,$3,$4,$5,$6)',
          [lead.name, lead.email, lead.phone, lead.source, lead.interest, lead.message],
        );
      } else {
        appendJson(LEADS_FILE, lead);
      }
      let call = null;
      if (consentCall && lead.phone) {
        const brand = lead.source === 'taxi' ? 'taxi' : 'hairy';
        call = await requestCallback({
          phone: lead.phone,
          name: lead.name,
          brand,
          interest: lead.interest,
        });
      }
      send(res, 200, { success: true, storage: db ? 'postgres' : 'json', call });
      return;
    }

    if ((method === 'GET' || method === 'POST') && (path === '/api/voice/mundosms' || path === '/api/voice/turn')) {
      const params = { ...Object.fromEntries(url.searchParams), ...body };
      const brand = params.brand === 'taxi' ? 'taxi' : 'hairy';
      const result = await handleCloserWebhook(params, brand);
      const fmt = String(params.format || '').toLowerCase();
      if (fmt === 'text' || fmt === 'txt' || fmt === 'voz') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(result.texto_voz || '');
        return;
      }
      send(res, 200, result);
      return;
    }

    if (method === 'POST' && (path === '/api/events' || path === '/events')) {
      const event = {
        event_type: body.action || body.event || 'event',
        payload: body.data || body,
        created_at: new Date().toISOString(),
      };
      const db = await getPool();
      if (db) {
        await db.query('INSERT INTO events (event_type, payload) VALUES ($1,$2)', [
          event.event_type,
          JSON.stringify(event.payload),
        ]);
      } else {
        appendJson(EVENTS_FILE, event);
      }
      send(res, 200, { success: true, storage: db ? 'postgres' : 'json' });
      return;
    }

    if (method === 'POST' && path === '/api/chat') {
      const result = await handleChat(body);
      send(res, result.status, result.body);
      return;
    }

    if (path === '/api/youtube-api' && method === 'GET') {
      const result = await handleYoutube(url);
      send(res, result.status, result.body);
      return;
    }

    const automation = await handleAutomation(path, method, body);
    if (automation) {
      send(res, automation.status, automation.body);
      return;
    }

    const payments = await handlePayments(path, method, body);
    if (payments) {
      send(res, payments.status, payments.body);
      return;
    }

    const auth = await handleAuth(path, method, req, body);
    if (auth) {
      send(res, auth.status, auth.body);
      return;
    }

    send(res, 404, { error: 'Not found' });
  } catch (error) {
    send(res, 200, { success: false, error: error instanceof Error ? error.message : 'Error API' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`HairyPetShop API propia en http://0.0.0.0:${PORT}`);
});
