import { join } from 'node:path';
import { DATA_DIR, getPool, appendJson, ensureJson } from './db.mjs';

const PAYMENTS_FILE = join(DATA_DIR, 'payments.json');
ensureJson(PAYMENTS_FILE);

async function storePayment(row) {
  const db = await getPool();
  if (db) {
    await db.query(
      `INSERT INTO payments (provider, external_id, customer_email, customer_name, amount, currency, status, product_name, payload)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        row.provider,
        row.external_id,
        row.customer_email,
        row.customer_name,
        row.amount,
        row.currency,
        row.status,
        row.product_name,
        JSON.stringify(row.payload || {}),
      ],
    );
  } else {
    appendJson(PAYMENTS_FILE, { ...row, created_at: new Date().toISOString() });
  }
}

export async function handlePayments(path, method, body) {
  if (path === '/api/stripe-create-payment' && method === 'POST') {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return {
        status: 400,
        body: { success: false, error: 'Falta STRIPE_SECRET_KEY en backend/.env' },
      };
    }
    const amount = Number(body.amount || 0);
    const productName = body.productName || 'Pedido HairyPetShop';
    const customerEmail = body.customerEmail || '';
    const customerName = body.customerName || '';

    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: String(amount),
        currency: 'eur',
        'metadata[product_name]': productName,
        'metadata[customer_email]': customerEmail,
        'metadata[customer_name]': customerName,
      }),
    });
    if (!stripeResponse.ok) {
      const error = await stripeResponse.text();
      return { status: 400, body: { success: false, error: `Stripe: ${error}` } };
    }
    const paymentIntent = await stripeResponse.json();
    const commissionAmount = Math.round(amount * 0.1);
    await storePayment({
      provider: 'stripe',
      external_id: paymentIntent.id,
      customer_email: customerEmail,
      customer_name: customerName,
      amount,
      currency: 'eur',
      status: paymentIntent.status,
      product_name: productName,
      payload: { commissionAmount, supplierAmount: amount - commissionAmount },
    });
    return {
      status: 200,
      body: {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        commission: commissionAmount / 100,
        supplierAmount: (amount - commissionAmount) / 100,
      },
    };
  }

  if (path === '/api/paypal-create-payment' && method === 'POST') {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return {
        status: 400,
        body: { success: false, error: 'Faltan PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET en backend/.env' },
      };
    }
    const amount = Number(body.amount || 0);
    const productName = body.productName || 'Pedido HairyPetShop';
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const base = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';
    const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!tokenRes.ok) {
      return { status: 400, body: { success: false, error: 'Error obteniendo token de PayPal' } };
    }
    const { access_token } = await tokenRes.json();
    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { currency_code: 'EUR', value: amount.toFixed(2) },
            description: `HairyPetShop - ${productName}`,
          },
        ],
      }),
    });
    if (!orderRes.ok) {
      const errorText = await orderRes.text();
      return { status: 400, body: { success: false, error: `PayPal: ${errorText}` } };
    }
    const order = await orderRes.json();
    await storePayment({
      provider: 'paypal',
      external_id: order.id,
      customer_email: body.customerEmail || '',
      customer_name: body.customerName || '',
      amount,
      currency: 'EUR',
      status: 'created',
      product_name: productName,
      payload: order,
    });
    const approvalLink = (order.links || []).find((link) => link.rel === 'approve');
    return {
      status: 200,
      body: {
        success: true,
        orderId: order.id,
        approvalUrl: approvalLink?.href,
        commission: Math.round(amount * 0.1 * 100) / 100,
        supplierAmount: Math.round(amount * 0.9 * 100) / 100,
      },
    };
  }

  return null;
}
